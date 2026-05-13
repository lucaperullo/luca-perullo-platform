import { describe, it, expect } from "vitest";
import { buildFatturaPAXml } from "../fattura-pa-xml";

const sample = {
  doc: {
    number: "2026/0001", issue_date: "2026-05-13", total_cents: 100200,
    bollo_cents: 200, currency: "EUR", payment_terms: null,
  },
  cedente: {
    business_name: "Luca Perullo", vat_number: "12345678903", tax_code: "PRLLCU90A01F839U",
    address: "Via Roma 1", zip: "80100", city: "Napoli", province: "NA", country: "IT",
    regime_fiscale: "RF19",
  },
  cessionario: {
    legal_name: "ACME SRL", vat_number: "00743110157", tax_code: null,
    address: "Via Verdi 5", zip: "20100", city: "Milano", province: "MI", country: "IT",
    sdi_code: "ABCDEF1", pec_email: null,
  },
  items: [
    { position: 1, description: "Consulenza", quantity: 1, unit_price_cents: 100000, line_total_cents: 100000, vat_code: "N2.2" },
  ],
  installments: [
    { position: 1, due_date: "2026-06-13", amount_cents: 50100 },
    { position: 2, due_date: "2026-07-13", amount_cents: 50100 },
  ],
  iban: "IT60X0542811101000000123456",
};

describe("buildFatturaPAXml", () => {
  it("outputs valid header structure", () => {
    const xml = buildFatturaPAXml(sample);
    expect(xml).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    expect(xml).toContain("<FatturaElettronica");
    expect(xml).toContain("versione=\"FPR12\"");
    expect(xml).toContain("<Numero>2026/0001</Numero>");
    expect(xml).toContain("<Natura>N2.2</Natura>");
    expect(xml).toContain("<RegimeFiscale>RF19</RegimeFiscale>");
  });
  it("emits TP02 + multiple DettaglioPagamento for installments", () => {
    const xml = buildFatturaPAXml(sample);
    expect(xml).toContain("<CondizioniPagamento>TP02</CondizioniPagamento>");
    const matches = xml.match(/<DettaglioPagamento>/g);
    expect(matches?.length).toBe(2);
    expect(xml).toContain("<DataScadenzaPagamento>2026-06-13</DataScadenzaPagamento>");
    expect(xml).toContain("<ImportoPagamento>501.00</ImportoPagamento>");
  });
  it("emits TP01 + single DettaglioPagamento when no installments", () => {
    const xml = buildFatturaPAXml({ ...sample, installments: [], doc: { ...sample.doc } });
    expect(xml).toContain("<CondizioniPagamento>TP01</CondizioniPagamento>");
    expect((xml.match(/<DettaglioPagamento>/g) ?? []).length).toBe(1);
    expect(xml).toContain("<ImportoPagamento>1002.00</ImportoPagamento>");
  });
  it("emits DatiBollo when bollo > 0", () => {
    const xml = buildFatturaPAXml(sample);
    expect(xml).toContain("<DatiBollo>");
    expect(xml).toContain("<ImportoBollo>2.00</ImportoBollo>");
  });
  it("escapes XML special chars in description", () => {
    const xml = buildFatturaPAXml({
      ...sample,
      items: [{ position: 1, description: "A & B <test>", quantity: 1, unit_price_cents: 100000, line_total_cents: 100000, vat_code: "N2.2" }],
    });
    expect(xml).toContain("A &amp; B &lt;test&gt;");
    expect(xml).not.toContain("A & B <test>");
  });
});
