import "server-only";
import { createServerClient } from "@/lib/supabase/server";

export type AdminSettings = {
  id: string;
  business_name: string;
  legal_name: string | null;
  vat_number: string;
  tax_code: string;
  address: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  iban: string;
  swift: string | null;
  bank_name: string | null;
  pec_email: string | null;
  sdi_code: string | null;
  regime_fiscale: string;
  bollo_threshold_cents: number;
  bollo_amount_cents: number;
  min_installment_cents: number;
  fic_company_id: string | null;
  fic_access_token: string | null;
  fic_refresh_token: string | null;
  fic_token_expires_at: string | null;
};

export async function loadSettings(): Promise<AdminSettings> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("admin_settings")
    .select("*")
    .maybeSingle();
  if (error || !data) {
    throw new Error(`[admin/settings] load failed: ${String(error)}`);
  }
  return data as unknown as AdminSettings;
}
