import { describe, it, expect } from "vitest";
import {
  generateMonthlySchedule,
  validateInstallments,
  deriveStatusFromInstallments,
} from "../installments";

describe("generateMonthlySchedule", () => {
  it("3 rate da €1000 totale €3000", () => {
    const out = generateMonthlySchedule({
      total_cents: 300000,
      n: 3,
      first_due_date: "2026-06-01",
    });
    expect(out).toEqual([
      { position: 1, due_date: "2026-06-01", amount_cents: 100000 },
      { position: 2, due_date: "2026-07-01", amount_cents: 100000 },
      { position: 3, due_date: "2026-08-01", amount_cents: 100000 },
    ]);
  });
  it("ultima rata aggiusta il resto (totale 100, n=3 → 33+33+34)", () => {
    const out = generateMonthlySchedule({
      total_cents: 100, n: 3, first_due_date: "2026-06-01",
    });
    expect(out.map(r => r.amount_cents)).toEqual([33, 33, 34]);
    expect(out.reduce((s, r) => s + r.amount_cents, 0)).toBe(100);
  });
  it("date mensili: gestisce fine mese (31 gen → 28 feb)", () => {
    const out = generateMonthlySchedule({
      total_cents: 200, n: 2, first_due_date: "2026-01-31",
    });
    expect(out[1]!.due_date).toBe("2026-02-28");
  });
  it("rifiuta n < 1", () => {
    expect(() => generateMonthlySchedule({ total_cents: 100, n: 0, first_due_date: "2026-06-01" })).toThrow();
  });
});

describe("validateInstallments", () => {
  const settings = { min_installment_cents: 50000 };
  it("ok: somma = totale, ogni rata ≥ minimo, date crescenti", () => {
    const result = validateInstallments(
      [
        { position: 1, due_date: "2026-06-01", amount_cents: 100000 },
        { position: 2, due_date: "2026-07-01", amount_cents: 100000 },
      ],
      300000,  // totale doc
      settings,
    );
    // somma 200000 ≠ 300000 → invalid
    expect(result.ok).toBe(false);
  });
  it("rifiuta rata sotto minimo", () => {
    const result = validateInstallments(
      [{ position: 1, due_date: "2026-06-01", amount_cents: 40000 }],
      40000,
      settings,
    );
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("min_amount");
  });
  it("rifiuta date non crescenti", () => {
    const result = validateInstallments(
      [
        { position: 1, due_date: "2026-07-01", amount_cents: 100000 },
        { position: 2, due_date: "2026-06-01", amount_cents: 100000 },
      ],
      200000, settings,
    );
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("date_order");
  });
  it("0 rate = soluzione unica = ok (a prescindere da totale)", () => {
    const result = validateInstallments([], 999999, settings);
    expect(result.ok).toBe(true);
  });
});

describe("deriveStatusFromInstallments", () => {
  it("nessuna pagata → null (status invariato)", () => {
    expect(deriveStatusFromInstallments([
      { paid_at: null }, { paid_at: null },
    ])).toBeNull();
  });
  it("alcune pagate → partially_paid", () => {
    expect(deriveStatusFromInstallments([
      { paid_at: "2026-06-01" }, { paid_at: null },
    ])).toBe("partially_paid");
  });
  it("tutte pagate → paid", () => {
    expect(deriveStatusFromInstallments([
      { paid_at: "2026-06-01" }, { paid_at: "2026-07-01" },
    ])).toBe("paid");
  });
  it("array vuoto → null (no rate, status non auto-deducibile)", () => {
    expect(deriveStatusFromInstallments([])).toBeNull();
  });
});
