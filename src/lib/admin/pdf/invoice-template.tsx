import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { AdminSettings } from "@/lib/admin/settings";
import type { Document as Doc, DocumentItem, Installment } from "@/lib/admin/documents";

const s = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: "Helvetica", color: "#09090b" },
  h1: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  meta: { fontSize: 9, color: "#71717a" },
  section: { marginTop: 16 },
  cols: { flexDirection: "row", justifyContent: "space-between" },
  col: { width: "48%" },
  itemsHead: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#e4e4e7", paddingBottom: 4, marginBottom: 4 },
  itemsRow: { flexDirection: "row", paddingVertical: 3, borderBottomWidth: 0.5, borderColor: "#e4e4e7" },
  cDesc: { width: "55%" },
  cQty: { width: "15%", textAlign: "right" },
  cPrice: { width: "15%", textAlign: "right" },
  cTotal: { width: "15%", textAlign: "right" },
  totalsBox: { marginTop: 12, alignSelf: "flex-end", width: 220 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  totalsRowFinal: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderColor: "#09090b", paddingTop: 4, marginTop: 4, fontWeight: "bold" },
  installmentsHead: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#e4e4e7", paddingBottom: 3, marginBottom: 3 },
  installmentsRow: { flexDirection: "row", paddingVertical: 2 },
  iCol1: { width: "50%" }, iCol2: { width: "30%", textAlign: "right" }, iCol3: { width: "20%", textAlign: "right" },
  footer: { position: "absolute", bottom: 36, left: 36, right: 36, fontSize: 8, color: "#71717a", borderTopWidth: 0.5, borderColor: "#e4e4e7", paddingTop: 6 },
});

function fmt(c: number) { return (c/100).toFixed(2).replace(".", ",") + " €"; }

export function InvoicePdf({ doc, items, installments, settings, clientSnapshot }: {
  doc: Doc; items: DocumentItem[]; installments: Installment[];
  settings: AdminSettings; clientSnapshot: Record<string, string | null>;
}) {
  const isQuote = doc.kind === "quote";
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.cols}>
          <View style={s.col}>
            <Text style={s.h1}>{settings.business_name}</Text>
            <Text style={s.meta}>{settings.address}</Text>
            <Text style={s.meta}>{settings.zip} {settings.city} ({settings.province})</Text>
            <Text style={s.meta}>P.IVA {settings.vat_number} · CF {settings.tax_code}</Text>
            {settings.pec_email ? <Text style={s.meta}>PEC: {settings.pec_email}</Text> : null}
          </View>
          <View style={s.col}>
            <Text style={[s.h1, { textAlign: "right" }]}>
              {isQuote ? "Preventivo" : "Fattura"} {doc.number ?? "(bozza)"}
            </Text>
            <Text style={[s.meta, { textAlign: "right" }]}>Data emissione: {doc.issue_date}</Text>
            {doc.due_date ? <Text style={[s.meta, { textAlign: "right" }]}>Scadenza: {doc.due_date}</Text> : null}
          </View>
        </View>

        <View style={s.section}>
          <Text style={[s.meta, { fontWeight: "bold" }]}>Cliente</Text>
          <Text>{String(clientSnapshot.legal_name ?? clientSnapshot.display_name ?? "")}</Text>
          <Text style={s.meta}>{String(clientSnapshot.address)}, {String(clientSnapshot.zip)} {String(clientSnapshot.city)} ({String(clientSnapshot.province)})</Text>
          {clientSnapshot.vat_number ? <Text style={s.meta}>P.IVA {clientSnapshot.vat_number}</Text> : null}
          {clientSnapshot.tax_code ? <Text style={s.meta}>CF {clientSnapshot.tax_code}</Text> : null}
        </View>

        <View style={s.section}>
          <View style={s.itemsHead}>
            <Text style={s.cDesc}>Descrizione</Text>
            <Text style={s.cQty}>Q.tà</Text>
            <Text style={s.cPrice}>Prezzo</Text>
            <Text style={s.cTotal}>Totale</Text>
          </View>
          {items.map(it => (
            <View key={it.id} style={s.itemsRow}>
              <Text style={s.cDesc}>{it.description}</Text>
              <Text style={s.cQty}>{it.quantity}</Text>
              <Text style={s.cPrice}>{fmt(it.unit_price_cents)}</Text>
              <Text style={s.cTotal}>{fmt(it.line_total_cents)}</Text>
            </View>
          ))}
        </View>

        <View style={s.totalsBox}>
          <View style={s.totalsRow}><Text>Subtotale</Text><Text>{fmt(doc.subtotal_cents)}</Text></View>
          {doc.bollo_cents > 0 ? <View style={s.totalsRow}><Text>Bollo</Text><Text>{fmt(doc.bollo_cents)}</Text></View> : null}
          <View style={s.totalsRowFinal}><Text>Totale</Text><Text>{fmt(doc.total_cents)}</Text></View>
        </View>

        {installments.length > 0 ? (
          <View style={s.section}>
            <Text style={[s.meta, { fontWeight: "bold" }]}>Piano rate ({installments.length})</Text>
            <View style={s.installmentsHead}>
              <Text style={s.iCol1}>Scadenza</Text>
              <Text style={s.iCol2}>Importo</Text>
              <Text style={s.iCol3}>Stato</Text>
            </View>
            {installments.map(r => (
              <View key={r.id} style={s.installmentsRow}>
                <Text style={s.iCol1}>{r.due_date}</Text>
                <Text style={s.iCol2}>{fmt(r.amount_cents)}</Text>
                <Text style={s.iCol3}>{r.paid_at ? "Pagata" : "—"}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={s.section}>
          <Text style={[s.meta, { fontWeight: "bold" }]}>Modalità di pagamento</Text>
          <Text style={s.meta}>Bonifico bancario su IBAN: {settings.iban}</Text>
          {settings.bank_name ? <Text style={s.meta}>Banca: {settings.bank_name}</Text> : null}
          {doc.payment_terms ? <Text style={s.meta}>{doc.payment_terms}</Text> : null}
        </View>

        {doc.notes_to_client ? (
          <View style={s.section}>
            <Text style={[s.meta, { fontWeight: "bold" }]}>Note</Text>
            <Text style={s.meta}>{doc.notes_to_client}</Text>
          </View>
        ) : null}

        <Text style={s.footer}>
          {!isQuote ? "Operazione effettuata ai sensi dell'art. 1, commi da 54 a 89, della Legge 190/2014 e successive modifiche/integrazioni (regime forfettario)." : ""}
        </Text>
      </Page>
    </Document>
  );
}
