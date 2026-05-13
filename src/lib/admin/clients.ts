import "server-only";
import { createServerClient } from "@/lib/supabase/server";

export type ClientKind = "individual" | "business" | "pa";

export type Client = {
  id: string;
  kind: ClientKind;
  display_name: string;
  legal_name: string | null;
  vat_number: string | null;
  tax_code: string | null;
  address: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  pec_email: string | null;
  sdi_code: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
  archived_at: string | null;
};

export async function listClients(opts: { includeArchived?: boolean } = {}): Promise<Client[]> {
  const supabase = await createServerClient();
  let q = supabase.from("clients").select("*").order("display_name", { ascending: true });
  if (!opts.includeArchived) {
    q = q.eq("archived_at", null as unknown as string);
  }
  const { data } = await q;
  return (data as unknown as Client[] | null) ?? [];
}

export async function getClient(id: string): Promise<Client | null> {
  const supabase = await createServerClient();
  const { data } = await supabase.from("clients").select("*").eq("id", id).maybeSingle();
  return (data as unknown as Client) ?? null;
}
