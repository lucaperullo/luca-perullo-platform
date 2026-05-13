import { describe, it, expect } from "vitest";
import { buildFicInvoicePayload } from "../fic/client";

describe("buildFicInvoicePayload", () => {
  it("maps installments to payments_list with EUR amounts", () => {
    const out = buildFicInvoicePayload({
      kind: "invoice",
      doc: {
        number: "2026/0001",
        issue_date: "2026-05-13",
        subtotal_cents: 100000,
        bollo_cents: 200,
        total_cents: 100200,
        payment_terms: null,
        notes_to_client: null,
      },
      cessionario: {
        legal_name: "ACME",
        vat_number: "00743110157",
        tax_code: null,
        address: "Via X 1",
        zip: "20100",
        city: "Milano",
        province: "MI",
        country: "IT",
        sdi_code: "ABCDEF1",
        pec_email: null,
      },
      items: [
        {
          description: "Consulenza",
          quantity: 1,
          unit_price_cents: 100000,
        },
      ],
      installments: [
        { due_date: "2026-06-13", amount_cents: 50100 },
        { due_date: "2026-07-13", amount_cents: 50100 },
      ],
    });
    expect(out.data.payments_list).toHaveLength(2);
    expect(out.data.payments_list[0]!.amount).toBe(501);
    expect(out.data.payments_list[0]!.due_date).toBe("2026-06-13");
    expect(out.data.stamp_duty).toBe(2);
    expect(out.data.entity.ei_code).toBe("ABCDEF1");
    expect(out.data.items_list[0]!.vat.ei_type).toBe("N2.2");
  });

  it("falls back to ei_code 0000000 when missing", () => {
    const out = buildFicInvoicePayload({
      kind: "invoice",
      doc: {
        number: "2026/0002",
        issue_date: "2026-05-13",
        subtotal_cents: 5000,
        bollo_cents: 0,
        total_cents: 5000,
        payment_terms: null,
        notes_to_client: null,
      },
      cessionario: {
        legal_name: "Mario Rossi",
        vat_number: null,
        tax_code: "RSSMRA80A01H501U",
        address: "Via Y 2",
        zip: "00100",
        city: "Roma",
        province: "RM",
        country: "IT",
        sdi_code: null,
        pec_email: null,
      },
      items: [
        { description: "Servizio", quantity: 1, unit_price_cents: 5000 },
      ],
      installments: [],
    });
    expect(out.data.entity.ei_code).toBe("0000000");
    expect(out.data.payments_list).toHaveLength(1);
    expect(out.data.payments_list[0]!.amount).toBe(50);
  });
});
