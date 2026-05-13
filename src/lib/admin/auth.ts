import "server-only";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

export function isAdminEmail(email: string | null | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    throw new Error("[admin/auth] ADMIN_EMAIL env var non configurata");
  }
  if (!email) return false;
  return email.toLowerCase() === adminEmail.toLowerCase();
}

/**
 * Garantisce che chi chiama sia l'admin. Se no, 404 (non redirect:
 * non vogliamo rivelare l'esistenza di /admin a chi non c'entra).
 */
export async function requireAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) {
    notFound();
  }
  return { user: user!, supabase };
}
