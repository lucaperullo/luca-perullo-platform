type LineInput = { quantity: number; unit_price_cents: number };
type Line = { line_total_cents: number };
type BolloSettings = { bollo_threshold_cents: number; bollo_amount_cents: number };
type Override = { forceBollo?: boolean };

export function computeLineTotal(line: LineInput): number {
  return Math.round(line.quantity * line.unit_price_cents);
}

export function computeTotals(
  items: readonly Line[],
  settings: BolloSettings,
  override: Override = {},
): { subtotal_cents: number; bollo_cents: number; total_cents: number } {
  const subtotal = items.reduce((s, i) => s + i.line_total_cents, 0);
  const auto = subtotal > settings.bollo_threshold_cents;
  const apply = override.forceBollo ?? auto;
  const bollo = apply ? settings.bollo_amount_cents : 0;
  return {
    subtotal_cents: subtotal,
    bollo_cents: bollo,
    total_cents: subtotal + bollo,
  };
}
