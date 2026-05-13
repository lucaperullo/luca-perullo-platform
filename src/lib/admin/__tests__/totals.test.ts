import { describe, it, expect } from "vitest";
import { computeTotals, computeLineTotal } from "../totals";

const settings = { bollo_threshold_cents: 7747, bollo_amount_cents: 200 };

describe("computeLineTotal", () => {
  it("multiplies quantity * unit_price (centesimi)", () => {
    expect(computeLineTotal({ quantity: 2, unit_price_cents: 5000 })).toBe(10000);
  });
  it("rounds to nearest centesimo", () => {
    expect(computeLineTotal({ quantity: 1.5, unit_price_cents: 333 })).toBe(500);
    expect(computeLineTotal({ quantity: 0.1, unit_price_cents: 333 })).toBe(33);
  });
});

describe("computeTotals (forfettario)", () => {
  it("subtotale + bollo se > soglia", () => {
    const items = [{ line_total_cents: 100000 }];
    expect(computeTotals(items, settings)).toEqual({
      subtotal_cents: 100000, bollo_cents: 200, total_cents: 100200,
    });
  });
  it("nessun bollo sotto soglia", () => {
    const items = [{ line_total_cents: 5000 }];
    expect(computeTotals(items, settings)).toEqual({
      subtotal_cents: 5000, bollo_cents: 0, total_cents: 5000,
    });
  });
  it("sopra soglia esatta (€77.47 = 7747 centesimi)", () => {
    const items = [{ line_total_cents: 7747 }];
    expect(computeTotals(items, settings).bollo_cents).toBe(0);  // strict > soglia
    const items2 = [{ line_total_cents: 7748 }];
    expect(computeTotals(items2, settings).bollo_cents).toBe(200);
  });
  it("bollo override (force off)", () => {
    const items = [{ line_total_cents: 100000 }];
    expect(computeTotals(items, settings, { forceBollo: false })).toEqual({
      subtotal_cents: 100000, bollo_cents: 0, total_cents: 100000,
    });
  });
  it("bollo override (force on under threshold)", () => {
    const items = [{ line_total_cents: 5000 }];
    expect(computeTotals(items, settings, { forceBollo: true })).toEqual({
      subtotal_cents: 5000, bollo_cents: 200, total_cents: 5200,
    });
  });
});
