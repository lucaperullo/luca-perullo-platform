import "server-only";
import { createServerClient } from "@/lib/supabase/server";
import { refreshToken } from "./oauth";
import type { FicCreateInvoicePayload, FicDocumentResponse } from "./types";

const BASE = "https://api-v2.fattureincloud.it";

let refreshInFlight: Promise<string> | null = null;

export async function getValidAccessToken(): Promise<string> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("admin_settings")
    .select("id, fic_access_token, fic_refresh_token, fic_token_expires_at")
    .maybeSingle();
  const row = data as unknown as {
    id: string;
    fic_access_token: string | null;
    fic_refresh_token: string | null;
    fic_token_expires_at: string | null;
  } | null;
  if (!row?.fic_access_token || !row.fic_refresh_token) {
    throw new Error(
      "[fic] non connesso. Vai su /admin/impostazioni → Connetti Fatture in Cloud"
    );
  }
  const expires = row.fic_token_expires_at
    ? new Date(row.fic_token_expires_at).getTime()
    : 0;
  if (expires - Date.now() > 60_000) return row.fic_access_token;

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const tok = await refreshToken(row.fic_refresh_token!);
      const newExpires = new Date(
        Date.now() + tok.expires_in * 1000
      ).toISOString();
      await supabase
        .from("admin_settings")
        .update({
          fic_access_token: tok.access_token,
          fic_refresh_token: tok.refresh_token,
          fic_token_expires_at: newExpires,
        })
        .eq("id", row.id);
      return tok.access_token;
    })().finally(() => {
      refreshInFlight = null;
    });
  }
  return await refreshInFlight;
}

async function ficFetch<T>(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<T> {
  const token = await getValidAccessToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    body:
      init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  });
  if (!res.ok)
    throw new Error(
      `[fic] ${path} failed: ${res.status} ${await res.text()}`
    );
  return (await res.json()) as T;
}

export async function getCompanyId(): Promise<string> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("admin_settings")
    .select("fic_company_id")
    .maybeSingle();
  const cid = (
    data as { fic_company_id: string | null } | null
  )?.fic_company_id;
  if (!cid)
    throw new Error(
      "[fic] fic_company_id non impostato. Selezionalo in /admin/impostazioni dopo la connessione."
    );
  return cid;
}

export async function createIssuedDocument(
  payload: FicCreateInvoicePayload
): Promise<FicDocumentResponse> {
  const cid = await getCompanyId();
  return await ficFetch<FicDocumentResponse>(
    `/c/${cid}/issued_documents`,
    {
      method: "POST",
      json: payload,
    }
  );
}

export async function transmitToSdi(docId: number): Promise<void> {
  const cid = await getCompanyId();
  await ficFetch<{ data: { id: number } }>(
    `/c/${cid}/issued_documents/${docId}/e_invoice/send`,
    {
      method: "POST",
      json: { data: {} },
    }
  );
}

// ── Builder payload (puro, testabile) ───────────────────────────
export function buildFicInvoicePayload(input: {
  kind: "invoice" | "quote";
  doc: {
    number: string;
    issue_date: string;
    subtotal_cents: number;
    bollo_cents: number;
    total_cents: number;
    payment_terms: string | null;
    notes_to_client: string | null;
  };
  cessionario: {
    legal_name: string | null;
    vat_number: string | null;
    tax_code: string | null;
    address: string;
    zip: string;
    city: string;
    province: string;
    country: string;
    sdi_code: string | null;
    pec_email: string | null;
  };
  items: Array<{
    description: string;
    quantity: number;
    unit_price_cents: number;
  }>;
  installments: Array<{ due_date: string; amount_cents: number }>;
}): FicCreateInvoicePayload {
  const c = input.cessionario;
  const ei =
    c.sdi_code && c.sdi_code.length === 7 ? c.sdi_code : "0000000";
  const total = input.doc.total_cents;
  const payments =
    input.installments.length > 0
      ? input.installments.map((r) => ({
          due_date: r.due_date,
          amount: +(r.amount_cents / 100).toFixed(2),
          payment_terms: { days: 0 as const, type: "standard" as const },
          status: "not_paid" as const,
        }))
      : [
          {
            due_date: input.doc.issue_date,
            amount: +(total / 100).toFixed(2),
            payment_terms: { days: 0 as const, type: "standard" as const },
            status: "not_paid" as const,
          },
        ];
  return {
    data: {
      type: input.kind,
      numeration: "",
      subject: input.doc.notes_to_client ?? "",
      visible_subject: input.doc.notes_to_client ?? "",
      rc_center: "",
      notes: input.doc.notes_to_client ?? "",
      rivalsa: 0,
      rivalsa_taxable: 0,
      cassa: 0,
      cassa_taxable: 0,
      cassa2: 0,
      cassa2_taxable: 0,
      global_cassa_taxable: 0,
      withholding_tax: 0,
      withholding_tax_taxable: 0,
      other_withholding_tax: 0,
      stamp_duty: +(input.doc.bollo_cents / 100).toFixed(2),
      payment_method: { name: "Bonifico bancario" },
      use_split_payment: false,
      use_gross_prices: false,
      e_invoice: true,
      ei_data: { payment_method: "MP05" },
      entity: {
        name: c.legal_name ?? "Cliente privato",
        vat_number: c.vat_number ?? undefined,
        tax_code: c.tax_code ?? undefined,
        address_street: c.address,
        address_postal_code: c.zip,
        address_city: c.city,
        address_province: c.province,
        country: c.country,
        ei_code: ei,
        certified_email: c.pec_email ?? undefined,
      },
      items_list: input.items.map((i) => ({
        name: i.description.slice(0, 100),
        description: i.description,
        qty: i.quantity,
        net_price: +(i.unit_price_cents / 100).toFixed(2),
        vat: {
          value: 0,
          description: "Esente N2.2",
          ei_type: "N2.2",
          ei_description:
            "Operazione non soggetta — regime forfettario",
        },
      })),
      payments_list: payments,
    },
  };
}
