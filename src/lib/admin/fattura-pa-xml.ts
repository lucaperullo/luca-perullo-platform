type Cedente = {
  business_name: string; vat_number: string; tax_code: string;
  address: string; zip: string; city: string; province: string; country: string;
  regime_fiscale: string;
};
type Cessionario = {
  legal_name: string | null; vat_number: string | null; tax_code: string | null;
  address: string; zip: string; city: string; province: string; country: string;
  sdi_code: string | null; pec_email: string | null;
};
type Item = {
  position: number; description: string; quantity: number;
  unit_price_cents: number; line_total_cents: number; vat_code: string;
};
type Installment = { position: number; due_date: string; amount_cents: number };

export function buildFatturaPAXml(input: {
  doc: { number: string | null; issue_date: string; total_cents: number; bollo_cents: number; currency: string; payment_terms: string | null };
  cedente: Cedente;
  cessionario: Cessionario;
  items: Item[];
  installments: Installment[];
  iban: string;
}): string {
  const { doc, cedente, cessionario, items, installments, iban } = input;
  const sdi = (cessionario.sdi_code && cessionario.sdi_code.length === 7) ? cessionario.sdi_code : "0000000";
  const formatoTrasmissione = "FPR12";
  const progressivo = (doc.number ?? "00001").replace(/[^0-9]/g, "").slice(-5).padStart(5, "0");
  const eur = (cents: number) => (cents / 100).toFixed(2);

  const condizioni = installments.length > 1 ? "TP02" : "TP01";
  const pagamenti = installments.length > 0
    ? installments.map(r => `      <DettaglioPagamento>
        <ModalitaPagamento>MP05</ModalitaPagamento>
        <DataScadenzaPagamento>${r.due_date}</DataScadenzaPagamento>
        <ImportoPagamento>${eur(r.amount_cents)}</ImportoPagamento>
        <IBAN>${iban}</IBAN>
      </DettaglioPagamento>`).join("\n")
    : `      <DettaglioPagamento>
        <ModalitaPagamento>MP05</ModalitaPagamento>
        <ImportoPagamento>${eur(doc.total_cents)}</ImportoPagamento>
        <IBAN>${iban}</IBAN>
      </DettaglioPagamento>`;

  const datiBollo = doc.bollo_cents > 0
    ? `      <DatiBollo>
        <BolloVirtuale>SI</BolloVirtuale>
        <ImportoBollo>${eur(doc.bollo_cents)}</ImportoBollo>
      </DatiBollo>`
    : "";

  const cessionarioId = cessionario.vat_number
    ? `<IdFiscaleIVA><IdPaese>${cessionario.country}</IdPaese><IdCodice>${cessionario.vat_number}</IdCodice></IdFiscaleIVA>`
    : "";
  const cessionarioCF = cessionario.tax_code ? `<CodiceFiscale>${cessionario.tax_code}</CodiceFiscale>` : "";

  const righe = items.map(i => `      <DettaglioLinee>
        <NumeroLinea>${i.position}</NumeroLinea>
        <Descrizione>${esc(i.description)}</Descrizione>
        <Quantita>${i.quantity.toFixed(2)}</Quantita>
        <PrezzoUnitario>${eur(i.unit_price_cents)}</PrezzoUnitario>
        <PrezzoTotale>${eur(i.line_total_cents)}</PrezzoTotale>
        <AliquotaIVA>0.00</AliquotaIVA>
        <Natura>${i.vat_code}</Natura>
      </DettaglioLinee>`).join("\n");

  const subtotal = items.reduce((s, i) => s + i.line_total_cents, 0);

  return `<?xml version="1.0" encoding="UTF-8"?>
<FatturaElettronica versione="${formatoTrasmissione}" xmlns="http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2">
  <FatturaElettronicaHeader>
    <DatiTrasmissione>
      <IdTrasmittente><IdPaese>IT</IdPaese><IdCodice>${cedente.vat_number}</IdCodice></IdTrasmittente>
      <ProgressivoInvio>${progressivo}</ProgressivoInvio>
      <FormatoTrasmissione>${formatoTrasmissione}</FormatoTrasmissione>
      <CodiceDestinatario>${sdi}</CodiceDestinatario>
      ${cessionario.pec_email ? `<PECDestinatario>${esc(cessionario.pec_email)}</PECDestinatario>` : ""}
    </DatiTrasmissione>
    <CedentePrestatore>
      <DatiAnagrafici>
        <IdFiscaleIVA><IdPaese>IT</IdPaese><IdCodice>${cedente.vat_number}</IdCodice></IdFiscaleIVA>
        <CodiceFiscale>${cedente.tax_code}</CodiceFiscale>
        <Anagrafica><Denominazione>${esc(cedente.business_name)}</Denominazione></Anagrafica>
        <RegimeFiscale>${cedente.regime_fiscale}</RegimeFiscale>
      </DatiAnagrafici>
      <Sede>
        <Indirizzo>${esc(cedente.address)}</Indirizzo>
        <CAP>${cedente.zip}</CAP><Comune>${esc(cedente.city)}</Comune>
        <Provincia>${cedente.province}</Provincia><Nazione>${cedente.country}</Nazione>
      </Sede>
    </CedentePrestatore>
    <CessionarioCommittente>
      <DatiAnagrafici>
        ${cessionarioId}
        ${cessionarioCF}
        <Anagrafica><Denominazione>${esc(cessionario.legal_name ?? "Cliente privato")}</Denominazione></Anagrafica>
      </DatiAnagrafici>
      <Sede>
        <Indirizzo>${esc(cessionario.address)}</Indirizzo>
        <CAP>${cessionario.zip}</CAP><Comune>${esc(cessionario.city)}</Comune>
        <Provincia>${cessionario.province}</Provincia><Nazione>${cessionario.country}</Nazione>
      </Sede>
    </CessionarioCommittente>
  </FatturaElettronicaHeader>
  <FatturaElettronicaBody>
    <DatiGenerali>
      <DatiGeneraliDocumento>
        <TipoDocumento>TD01</TipoDocumento>
        <Divisa>${doc.currency}</Divisa>
        <Data>${doc.issue_date}</Data>
        <Numero>${doc.number ?? "BOZZA"}</Numero>
${datiBollo}
        <ImportoTotaleDocumento>${eur(doc.total_cents)}</ImportoTotaleDocumento>
        <Causale>Operazione effettuata ai sensi dell'art. 1, commi da 54 a 89, della Legge 190/2014 e successive modifiche/integrazioni</Causale>
      </DatiGeneraliDocumento>
    </DatiGenerali>
    <DatiBeniServizi>
${righe}
      <DatiRiepilogo>
        <AliquotaIVA>0.00</AliquotaIVA>
        <Natura>N2.2</Natura>
        <ImponibileImporto>${eur(subtotal)}</ImponibileImporto>
        <Imposta>0.00</Imposta>
        <RiferimentoNormativo>Operazione non soggetta — regime forfettario L.190/2014</RiferimentoNormativo>
      </DatiRiepilogo>
    </DatiBeniServizi>
    <DatiPagamento>
      <CondizioniPagamento>${condizioni}</CondizioniPagamento>
${pagamenti}
    </DatiPagamento>
  </FatturaElettronicaBody>
</FatturaElettronica>`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
