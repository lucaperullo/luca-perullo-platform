export type InstallmentRow = {
  position: number;
  due_date: string;       // ISO YYYY-MM-DD
  amount_cents: number;
};

export type InstallmentPaid = { paid_at: string | null };

/**
 * Genera N rate mensili. Importo = total/N centesimi, l'ultima
 * rata assorbe il resto della divisione intera.
 */
export function generateMonthlySchedule(p: {
  total_cents: number;
  n: number;
  first_due_date: string;  // YYYY-MM-DD
}): InstallmentRow[] {
  if (!Number.isInteger(p.n) || p.n < 1) {
    throw new Error("[installments] n deve essere intero >= 1");
  }
  if (!Number.isInteger(p.total_cents) || p.total_cents < 0) {
    throw new Error("[installments] total_cents deve essere intero >= 0");
  }
  const base = Math.floor(p.total_cents / p.n);
  const remainder = p.total_cents - base * p.n;
  const rows: InstallmentRow[] = [];
  const start = parseISODate(p.first_due_date);
  for (let i = 0; i < p.n; i++) {
    const d = addMonths(start, i);
    rows.push({
      position: i + 1,
      due_date: formatISODate(d),
      amount_cents: i === p.n - 1 ? base + remainder : base,
    });
  }
  return rows;
}

export type ValidateResult = { ok: boolean; errors: string[] };

export function validateInstallments(
  rows: readonly InstallmentRow[],
  totalCents: number,
  settings: { min_installment_cents: number },
): ValidateResult {
  if (rows.length === 0) return { ok: true, errors: [] };
  const errors: string[] = [];
  // somma
  const sum = rows.reduce((s, r) => s + r.amount_cents, 0);
  if (sum !== totalCents) errors.push("sum_mismatch");
  // minimo
  if (rows.some(r => r.amount_cents < settings.min_installment_cents)) {
    errors.push("min_amount");
  }
  // date crescenti
  for (let i = 1; i < rows.length; i++) {
    if (rows[i]!.due_date <= rows[i - 1]!.due_date) {
      errors.push("date_order");
      break;
    }
  }
  // position crescenti
  for (let i = 0; i < rows.length; i++) {
    if (rows[i]!.position !== i + 1) errors.push("position_order");
  }
  return { ok: errors.length === 0, errors };
}

export function deriveStatusFromInstallments(
  rows: readonly InstallmentPaid[],
): "paid" | "partially_paid" | null {
  if (rows.length === 0) return null;
  const paid = rows.filter(r => r.paid_at !== null).length;
  if (paid === 0) return null;
  if (paid === rows.length) return "paid";
  return "partially_paid";
}

// ── date helpers (UTC, no timezone surprises) ───────────────────
function parseISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d));
}
function formatISODate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function addMonths(d: Date, months: number): Date {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + months;
  const day = d.getUTCDate();
  // Last day of target month (gestisce 31 gen → 28/29 feb)
  const lastDayTargetMonth = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const finalDay = Math.min(day, lastDayTargetMonth);
  return new Date(Date.UTC(y, m, finalDay));
}
