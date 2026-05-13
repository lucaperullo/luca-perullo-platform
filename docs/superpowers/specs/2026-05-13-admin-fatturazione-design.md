# Admin fatturazione elettronica — Design v1

**Data:** 2026-05-13
**Owner:** Luca Perullo (`luca.perullo@icloud.com`)
**Status:** approved (in attesa di review finale prima del piano implementativo)

---

## 1. Obiettivo

Aggiungere una sezione `/admin` accessibile **solo** all'admin (Luca) che permetta di gestire end-to-end **preventivi e fatture elettroniche** per la sua P.IVA in regime forfettario, con trasmissione SDI conforme alla normativa italiana via [Fatture in Cloud](https://developers.fattureincloud.it/) come provider intermediario.

L'admin è una "scrivania interna" brandizzata sopra le API di Fatture in Cloud (FiC), che resta il canale ufficiale di trasmissione e conservazione sostitutiva. Tutti i dati dei documenti vivono in Supabase (canonical), FiC è solo trasmettitore.

---

## 2. Decisioni architetturali (già concordate)

| Decisione | Scelta | Motivo |
|---|---|---|
| Compliance | Trasmissione SDI integrata | Esigenza esplicita: smettere di usare gestionale esterno |
| Provider SDI | Fatture in Cloud | API REST moderne, OAuth2, free tier per volumi bassi |
| Regime fiscale | Forfettario RF19 | Stato fiscale dell'utente; configurabile in DB per il futuro |
| Tipi cliente | B2B + B2C italiani | Coerente con clientela mista del freelancer; clienti esteri rinviati a v2 |
| Source of truth | Supabase canonical, FiC trasmettitore | Portabilità, analytics custom, no API call su read |
| UI scope | Essenziale ma completo | CRUD clienti + documenti + dashboard + emissione SDI; mobile-friendly |
| Pagamenti | Fuori scope (mai) | IBAN + bonifico istantaneo, niente Stripe |
| Auth | Supabase magic-link esistente + email gate | Riuso `/accedi`, niente seconda auth |
| Auth-fail behaviour | `notFound()` (404) | L'esistenza di `/admin` non è scopribile da fuori |
| Rateizzazione | Una fattura, multiple rate mensili (≥ €500/mese), tracciate riga per riga | Standard `DatiPagamento`/`DettaglioPagamento` di FatturaPA; minimo configurabile in `admin_settings.min_installment_cents` |

---

## 3. Auth

### 3.1 Email gate

```ts
// src/lib/admin/auth.ts
import "server-only";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) throw new Error("ADMIN_EMAIL non configurata");

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
    notFound();
  }
  return { user, supabase };
}
```

Chiamata in **due punti**:
1. `src/app/admin/layout.tsx` — protegge tutte le pagine `/admin/*`
2. **Ogni** route handler `/api/admin/*` — non fidarsi mai solo del layout

### 3.2 Env var

```bash
# .env.local
ADMIN_EMAIL=luca.perullo@icloud.com
```

Aggiunta in `.env.example` con commento.

---

## 4. Schema dati Supabase

Quattro tabelle nuove + una di servizio. **Tutte con RLS attiva** che blocca l'accesso a chiunque non sia l'admin (RLS è la difesa di fondo, oltre a `requireAdmin()` lato app).

### 4.1 `admin_settings` (singleton)

Una sola riga. Contiene anagrafica fiscale tua + token OAuth FiC + parametri configurabili.

```sql
create table admin_settings (
  id uuid primary key default gen_random_uuid(),
  -- Anagrafica
  business_name text not null,
  legal_name text,
  vat_number text not null,            -- P.IVA
  tax_code text not null,              -- codice fiscale
  address text not null,
  city text not null,
  zip text not null,
  province text not null,
  country text not null default 'IT',
  -- Pagamento
  iban text not null,
  swift text,
  bank_name text,
  -- Contatti SDI
  pec_email text,
  sdi_code text,                       -- codice destinatario tuo (di solito null per privati)
  -- Regime
  regime_fiscale text not null default 'RF19',
  bollo_threshold_cents int not null default 7747,   -- €77,47
  bollo_amount_cents int not null default 200,       -- €2,00
  min_installment_cents int not null default 50000,  -- €500,00 minimo per rata mensile
  -- OAuth FiC
  fic_company_id text,
  fic_access_token text,
  fic_refresh_token text,
  fic_token_expires_at timestamptz,
  -- Audit
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Constraint: massimo una riga
create unique index admin_settings_singleton on admin_settings ((true));
```

### 4.2 `clients`

```sql
create table clients (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('individual','business','pa')),
  display_name text not null,          -- come lo cerchi tu
  legal_name text,
  vat_number text,                     -- obbligatorio per business/pa
  tax_code text,                       -- obbligatorio per individual
  address text not null,
  city text not null,
  zip text not null,
  province text not null,
  country text not null default 'IT',
  pec_email text,
  sdi_code text default '0000000',     -- '0000000' = nessuno (B2C senza PEC)
  contact_email text,
  contact_phone text,
  notes text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clients_kind_archived_idx on clients (kind) where archived_at is null;
create index clients_search_idx on clients using gin (to_tsvector('italian', coalesce(display_name,'') || ' ' || coalesce(legal_name,'') || ' ' || coalesce(vat_number,'') || ' ' || coalesce(tax_code,'')));
```

### 4.3 `documents`

```sql
create table documents (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('quote','invoice')),
  number text,                         -- '2026/0001' o 'P-2026-0001'; null finché draft
  fiscal_year int,                     -- assegnato in issue
  sequence int,                        -- progressivo annuale per kind; assegnato in issue
  issue_date date not null default current_date,
  due_date date,
  client_id uuid not null references clients(id) on delete restrict,
  client_snapshot jsonb not null,      -- copia anagrafica congelata in issue
  status text not null default 'draft' check (status in (
    'draft','issued','sent_sdi','delivered_sdi','rejected_sdi','partially_paid','paid','cancelled'
  )),
  -- Sync FiC
  sdi_id_fic text,                     -- id documento in FiC
  sdi_message text,                    -- ultimo messaggio SDI (es. motivo scarto)
  -- Importi (centesimi, no float)
  subtotal_cents int not null default 0,
  bollo_cents int not null default 0,
  total_cents int not null default 0,
  currency text not null default 'EUR',
  -- Contenuto
  payment_method text,
  payment_terms text,                  -- es. "Bonifico bancario a 30gg DF"
  notes_to_client text,
  internal_notes text,
  -- Output
  pdf_storage_path text,
  xml_storage_path text,
  -- Lineage
  converted_from_id uuid references documents(id),  -- preventivo→fattura
  -- Lifecycle
  issued_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Numerazione anti-duplicato
  unique (kind, fiscal_year, sequence)
);

create index documents_kind_status_idx on documents (kind, status);
create index documents_fiscal_year_idx on documents (fiscal_year, kind, sequence);
create index documents_client_idx on documents (client_id);
```

### 4.4 `document_items`

```sql
create table document_items (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  position int not null,
  description text not null,
  quantity numeric(10,3) not null default 1,
  unit_price_cents int not null,
  line_total_cents int not null,
  vat_code text not null default 'N2.2',     -- forfettario: operazione non soggetta
  unique (document_id, position)
);
```

### 4.4.1 `document_installments` (rate)

Una riga per ogni rata. Vuota = pagamento in soluzione unica (di fatto: una sola rata implicita pari al totale, alla `due_date` del documento). Compilata = piano rate esplicito.

```sql
create table document_installments (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  position int not null,                 -- 1, 2, 3...
  due_date date not null,
  amount_cents int not null,
  paid_at timestamptz,                   -- null = non incassata
  payment_reference text,                 -- es. CRO bonifico, nota
  unique (document_id, position)
);
create index document_installments_unpaid_idx on document_installments (due_date)
  where paid_at is null;
```

**Vincoli applicativi (validati nei route handler, non nel DB)**:
- `sum(amount_cents) = documents.total_cents` (al penny)
- `amount_cents >= admin_settings.min_installment_cents` per ogni rata
- `due_date` ascendenti per `position` crescenti
- almeno 1 rata se `installments` esiste; o 0 rate (pagamento in soluzione unica → si usa `documents.due_date`)

**Status derivato**:
- Se `installments` vuoto: `documents.status` invariato (paid manualmente)
- Se `installments` esiste: status auto-calcolato → `partially_paid` se almeno una rata è pagata ma non tutte; `paid` quando tutte hanno `paid_at`. Altrimenti resta in `delivered_sdi`/`issued`.

### 4.5 `document_sequences` (servizio per numerazione)

```sql
create table document_sequences (
  kind text not null,
  fiscal_year int not null,
  last_seq int not null default 0,
  primary key (kind, fiscal_year)
);

-- RPC che prenota il prossimo numero in modo atomico
create or replace function next_document_number(p_kind text, p_year int)
returns int
language plpgsql
as $$
declare
  v_seq int;
begin
  insert into document_sequences (kind, fiscal_year, last_seq)
    values (p_kind, p_year, 1)
  on conflict (kind, fiscal_year)
    do update set last_seq = document_sequences.last_seq + 1
  returning last_seq into v_seq;
  return v_seq;
end;
$$;
```

`UPSERT ... RETURNING` è atomico in Postgres — niente race condition. Il `unique (kind, fiscal_year, sequence)` su `documents` resta come safety net.

### 4.6 RLS

```sql
alter table admin_settings enable row level security;
alter table clients enable row level security;
alter table documents enable row level security;
alter table document_items enable row level security;
alter table document_sequences enable row level security;

-- Policy: solo l'admin (email = ADMIN_EMAIL) legge/scrive.
-- L'email è in auth.jwt() -> 'email'.
create policy admin_full_access on admin_settings
  for all using (auth.jwt()->>'email' = current_setting('app.admin_email', true))
         with check (auth.jwt()->>'email' = current_setting('app.admin_email', true));
-- (stessa policy ripetuta per clients, documents, document_items, document_sequences)
```

`current_setting('app.admin_email')` viene impostato a livello di istanza Supabase (settings → custom params) o nel pre-request hook. Alternativa più semplice: hardcode l'email nella policy via secret. **Decisione**: nella migrazione iniziale embeddiamo l'email come stringa per semplicità, poi spostiamo a `current_setting` se cambia.

### 4.7 Storage

Bucket Supabase Storage **`fiscal-documents`**, privato.

```
{fiscal_year}/{kind}/{number_slug}.pdf
{fiscal_year}/{kind}/{number_slug}.xml
```

`number_slug` = `number` con `/` sostituito da `-` per path safety. Esempio: documento `number='2026/0001'` → `2026/invoice/2026-0001.pdf`.

Accesso solo via signed URL generato lato server dopo `requireAdmin()`. TTL 5 minuti.

---

## 5. Routing

```
src/app/admin/
  layout.tsx                 # requireAdmin() + chrome admin (sidebar + topbar)
  page.tsx                   # dashboard
  clienti/
    page.tsx                 # lista
    nuovo/page.tsx
    [id]/page.tsx            # edit + storico documenti
  preventivi/
    page.tsx
    nuovo/page.tsx
    [id]/page.tsx            # editor; bottone "Duplica come fattura"
  fatture/
    page.tsx
    nuovo/page.tsx
    [id]/page.tsx            # editor; bottone "Emetti e invia a SDI" se draft
  impostazioni/
    page.tsx                 # anagrafica + IBAN + connect FiC

src/app/api/admin/
  clients/route.ts           # POST
  clients/[id]/route.ts      # PATCH, DELETE (soft via archived_at)
  documents/route.ts         # POST (crea draft)
  documents/[id]/route.ts    # PATCH, DELETE (solo se draft)
  documents/[id]/issue/route.ts      # POST: draft → issued
  documents/[id]/transmit/route.ts   # POST: invia a SDI via FiC
  documents/[id]/pdf/route.ts        # GET signed URL
  documents/[id]/xml/route.ts        # GET signed URL
  documents/[id]/duplicate/route.ts  # POST (preventivo → bozza fattura)
  fic/oauth/start/route.ts
  fic/oauth/callback/route.ts
  webhooks/fatture-in-cloud/route.ts
```

---

## 6. UI

### 6.1 Chrome admin

`src/app/admin/layout.tsx`: sidebar navigabile (Dashboard, Clienti, Preventivi, Fatture, Impostazioni) + topbar con avatar/logout. Tema coerente con il resto del sito (stessi token CSS in `globals.css`). Mobile: sidebar collassa in sheet.

### 6.2 Dashboard `/admin`

Sezioni:
- **KPI anno corrente**: incassato YTD, fatturato emesso YTD, n° fatture, n° preventivi accettati, % accettazione preventivi
- **Ultimi documenti** (10) con stato a colpo d'occhio
- **Da fare**: fatture in `draft` da emettere, fatture `issued` ma non trasmesse, preventivi vecchi >30gg senza esito

### 6.3 Lista clienti `/admin/clienti`

Tabella con search, filtro per `kind`, ordinamento per `display_name` / `created_at`. Card view su mobile.

### 6.4 Form cliente `/admin/clienti/nuovo` e `/admin/clienti/[id]`

Form a sezioni:
- Tipo (radio: privato / azienda / PA) — switcha i campi obbligatori
- Anagrafica (legal_name, address, ecc.)
- Identificativi fiscali (CF se privato, P.IVA + CF se azienda, P.IVA + codice ufficio se PA)
- Contatti SDI (PEC, codice destinatario)
- Contatti generali (email, telefono, note)

Validazione client + server: P.IVA (algoritmo modulo 11), CF (algoritmo formale), codice destinatario (7 char), CAP (5 cifre).

### 6.5 Editor documento (preventivo/fattura)

Layout single-column mobile-first, quattro sezioni in una colonna:

1. **Header**: data emissione, scadenza, cliente (combobox cerca/aggiungi), tipo (preventivo|fattura), numero ("verrà assegnato all'emissione" se draft)
2. **Righe**: lista descrizione + quantità + prezzo unitario, "+aggiungi riga", reorder ↑/↓, totale di riga in tempo reale
3. **Piano rate** (collassabile, default chiusa = "soluzione unica"): toggle "Rateizza", input "n° rate" + "data prima rata", bottone "Genera schedule" che crea N righe mensili con importo = `total_cents / N` (ultima rata aggiusta il resto). Ogni riga editabile (data + importo). Validazione live: somma rate vs totale, ogni rata ≥ €500 (configurabile).
4. **Footer**: subtotale, bollo €2 (auto se imponibile > €77,47, override possibile), totale, note al cliente, condizioni di pagamento

**Sticky bottom bar**:
- Sempre: `Salva bozza`, `Anteprima PDF`
- Se draft + invoice: `Emetti e invia a SDI`
- Se issued + invoice non trasmesso: `Trasmetti a SDI`
- Se quote: `Marca come accettato/rifiutato`, `Duplica come fattura`

L'anteprima PDF è una nuova tab con il signed URL (rigenerato on-demand per bozze, statico per emessi).

---

## 7. Integrazione Fatture in Cloud

### 7.1 OAuth setup (one-time)

1. Su `/admin/impostazioni`, click "Connetti Fatture in Cloud"
2. `/api/admin/fic/oauth/start` → redirect a `https://api-v2.fattureincloud.it/oauth/authorize` con `client_id`, `redirect_uri`, `scope=entity.clients:r entity.suppliers:r issued_documents.invoices:a issued_documents.quotes:a settings:r`, `state=<csrf>`
3. FiC → `/api/admin/fic/oauth/callback?code=…&state=…`
4. Server scambia code per token (POST a `/oauth/token`), salva in `admin_settings`
5. Server fa GET `/c/companies` → mostra dropdown per scegliere `fic_company_id`

### 7.2 Wrapper FiC client (`src/lib/admin/fatture-in-cloud.ts`)

```ts
class FatturaInCloudClient {
  async getValidAccessToken(): Promise<string>;
  async createIssuedDocument(payload: FicCreateDocPayload): Promise<FicDocument>;
  async transmitToSdi(docId: string): Promise<void>;
  async getDocumentStatus(docId: string): Promise<FicDocStatus>;
  async listCompanies(): Promise<FicCompany[]>;
}
```

`getValidAccessToken`: se `fic_token_expires_at < now() + 60s`, refresh via `/oauth/token` con `refresh_token`, salva nuovo token in `admin_settings`. Mutex in-memory per istanza serverless (best-effort: due istanze concorrenti potrebbero entrambe rinfrescare — accettabile, FiC accetta ed l'ultimo token vince. Nessun lock distribuito perché single-admin / volume basso).

### 7.3 Flusso emissione fattura

```
[bozza in Supabase, status='draft']
    │
    ▼ POST /api/admin/documents/[id]/issue
[transaction:
   - assegna fiscal_year = year(issue_date), sequence = next_document_number(kind, year)
   - genera number = "{year}/{sequence:04}"
   - congela client_snapshot da clients
   - genera PDF + XML, salva in storage
   - status='issued', issued_at=now()
 ]
    │
    ▼ POST /api/admin/documents/[id]/transmit
[chiamata FiC create_issued_document, poi e_invoice/send
 - status='sent_sdi', sdi_id_fic salvato]
    │
    ▼ webhook FiC
[status='delivered_sdi' o 'rejected_sdi'
 - sdi_message popolato]
```

### 7.4 Webhook FiC

Endpoint: `POST /api/admin/webhooks/fatture-in-cloud`

- Validazione firma HMAC: header `X-Signature` confrontato con `HMAC-SHA256(body, FIC_WEBHOOK_SECRET)`. Se non matcha → 401.
- Estrai `fic_id` dal payload, trova `documents` con quel `sdi_id_fic`, aggiorna `status` + `sdi_message`.
- Idempotente: se lo stato è già quello finale, no-op.

### 7.5 Env vars FiC

```bash
FIC_CLIENT_ID=
FIC_CLIENT_SECRET=
FIC_REDIRECT_URI=https://lucaperullo.it/api/admin/fic/oauth/callback
FIC_WEBHOOK_SECRET=
```

---

## 8. Generazione PDF + XML

### 8.1 PDF (`src/lib/admin/pdf/`)

Libreria: **`@react-pdf/renderer`** (React-based, no headless browser, gira su Vercel senza acrobazie).

- `invoice-template.tsx` e `quote-template.tsx`: pagina A4, font del sito, logo (da `public/brand/`), layout: header con tuoi dati + dati cliente affiancati, tabella righe, blocco totali a destra, footer con condizioni di pagamento + IBAN + nota forfettario.
- Renderizzato server-side in route handler, salvato come buffer in Storage.
- Per le bozze: rigenerato on-demand (no salvataggio).
- Per gli emessi: salvato una volta sola, mai rigenerato (immutabile).

### 8.2 XML FatturaPA (`src/lib/admin/fattura-pa-xml.ts`)

Builder TypeScript puro che assembla l'albero FatturaPA versione **1.2.2** (schema corrente al 2026-05) da un oggetto tipato. Niente librerie esterne, ~300 righe.

Struttura:
- `FatturaElettronicaHeader` (DatiTrasmissione, CedentePrestatore = noi, CessionarioCommittente = cliente)
- `FatturaElettronicaBody` (DatiGenerali, DatiBeniServizi righe + riepilogo IVA con N2.2, DatiPagamento con `Condizioni: TP01` se 1 rata o `TP02` se più rate, e un `DettaglioPagamento` per ogni rata con `DataScadenzaPagamento` + `ImportoPagamento` + `ModalitaPagamento: MP05` (bonifico) + IBAN)

Validazione: snapshot di un XML d'esempio in `__tests__/fattura-pa-xml.test.ts`. Niente XSD validation in runtime (lenta, dipende da libreria nativa) — basiamoci su test + il fatto che FiC valida lui stesso prima di inviare a SDI.

### 8.3 Riferimenti normativi inseriti automaticamente

In ogni fattura forfettario:
- `RegimeFiscale = RF19`
- Per ogni linea: `Natura = N2.2`
- Causale: "Operazione effettuata ai sensi dell'art. 1, commi da 54 a 89, della Legge 190/2014 e successive modifiche/integrazioni"
- Se imponibile > €77.47: aggiungi blocco `DatiBollo` con `ImportoBollo = 2.00`

---

## 9. Numerazione (dettaglio)

- **Preventivi**: formato `P-{YYYY}-{NNNN}` (es. `P-2026-0001`). Resetta ogni anno. Libera, niente vincoli legali.
- **Fatture**: formato `{YYYY}/{NNNN}` (es. `2026/0001`). Resetta ogni anno. Progressivo *senza buchi* per anno (vincolo legge).
- Generazione: solo al passaggio `draft → issued`. In draft il numero è `null`.
- L'anno fiscale deriva da `issue_date`, non da `now()`. Se emetti il 2 gennaio 2026 una fattura datata 31 dicembre 2025, finisce nella sequenza 2025.
- RPC `next_document_number(kind, year)` atomica via `INSERT ... ON CONFLICT ... RETURNING`.
- Safety net: `unique (kind, fiscal_year, sequence)` su `documents`.
- Se annulli una fattura emessa (caso raro): rimane nello storico con `status='cancelled'`, il numero **non si riusa** (richiede nota di credito separata, gestita in v2).

---

## 10. Calcolo totali (forfettario)

```ts
// src/lib/admin/totals.ts
export function computeTotals(items: DocumentItem[], settings: AdminSettings) {
  const subtotal = items.reduce((s, i) => s + i.line_total_cents, 0);
  const bollo = subtotal > settings.bollo_threshold_cents
    ? settings.bollo_amount_cents
    : 0;
  const total = subtotal + bollo;
  return { subtotal_cents: subtotal, bollo_cents: bollo, total_cents: total };
}
```

Tutto in centesimi (int), niente float. Conversione a stringa solo in display layer.

Bollo override: in editor, checkbox "Includi bollo" pre-checkata se sopra soglia. L'utente può forzare on/off (raro ma utile per casi edge tipo bollo già pagato in altro modo).

---

## 11. Validatori (`src/lib/admin/validators.ts`)

- `isValidPartitaIva(s: string): boolean` — algoritmo Luhn-modulo-11 standard
- `isValidCodiceFiscale(s: string): boolean` — controllo formale 16 char + carattere di controllo
- `isValidCodiceDestinatario(s: string): boolean` — esattamente 7 char alfanum, oppure `'0000000'`
- `isValidPec(s: string): boolean` — email format check (no DNS check)
- `isValidIban(s: string): boolean` — checksum mod-97

Usati sia nei form (validazione client) sia nei route handler (validazione server, autoritativa).

---

## 12. Ciclo di vita documento (state machine)

```
quote: draft → issued (manuale) → cancelled

invoice:
  draft
    └─ issue → issued
                 └─ transmit → sent_sdi
                                 └─ webhook → delivered_sdi | rejected_sdi
                                                    │
                                                    ├─ rata segnata pagata → partially_paid
                                                    └─ tutte le rate pagate → paid

  cancelled raggiungibile da qualunque stato non-paid.
```

**Transizioni di pagamento (auto)**:
- Quando segno una rata `paid_at = now()` (UI checkbox): trigger applicativo ricalcola lo status del documento:
  - tutte le rate hanno `paid_at` → `paid`
  - alcune sì alcune no → `partially_paid`
  - nessuna → status invariato (resta `delivered_sdi`/`issued`)
- Se il documento non ha rate (soluzione unica): bottone "Marca come pagata" su UI → `paid` diretto.

Edits permessi: documento intero solo in `draft`; `installments[].paid_at` e `payment_reference` editabili anche dopo `issued`.

---

## 13. Risk register

| Rischio | Mitigazione |
|---|---|
| Token FiC scaduto in mezzo al lavoro | `getValidAccessToken()` auto-refresh; se anche refresh fallisce → UI "Riconnetti FiC" |
| SDI scarta una fattura | `status='rejected_sdi'`, `sdi_message` mostrato; UI permette nuova emissione (in v2 nota di credito) |
| Race condition numerazione | RPC atomica + unique constraint DB |
| Anno fiscale cambia a mezzanotte | `fiscal_year = year(issue_date)`, mai `year(now())` |
| Cliente cambia anagrafica dopo fattura | `client_snapshot jsonb` congela i dati al momento dell'emissione |
| Webhook FiC arriva due volte | Handler idempotente: confronta stato corrente prima di update |
| Webhook FiC mai arriva | Job di poll opzionale (cron Vercel ogni 6h) per documenti in `sent_sdi` da >24h che chiama `getDocumentStatus` |
| Admin perde l'accesso (email cambia) | `ADMIN_EMAIL` env var aggiornabile + redeploy. Documentato in README admin |
| `/admin` scopribile | `notFound()` (404) anziché redirect; nessun link pubblico |

---

## 14. Cosa NON è in v1 (scope guardrail)

Esplicito per evitare scope creep:

- ❌ Pagamenti online (Stripe e simili) — **mai**, IBAN bonifico
- ❌ Email automatica al cliente con allegato — v2 (per ora download PDF e invio manuale)
- ❌ Conversione preventivo → fattura "1-click" — sostituita da "Duplica come fattura" (apre nuova bozza pre-compilata)
- ❌ Clienti esteri (TD17/18/19, autofattura intra-UE) — v2
- ❌ Note di credito — v2
- ❌ Fatture proforma — v2 (preventivi accettati coprono il caso)
- ❌ Conservazione sostitutiva nostra — **mai noi**, la fa FiC nei loro 10 anni
- ❌ Multi-azienda / multi-utente — solo Luca, una P.IVA
- ❌ Scadenzario con promemoria — v2
- ❌ Export CSV per commercialista — v2 (export FiC è già disponibile)

---

## 15. Migrazioni Supabase

Una migrazione singola `2026_05_13_admin_fatturazione.sql` con:
1. Create tables (`admin_settings`, `clients`, `documents`, `document_items`, `document_sequences`)
2. Indexes
3. RPC `next_document_number`
4. RLS policies
5. Storage bucket `fiscal-documents` + policies (via Supabase Studio o `storage.create_bucket` RPC)
6. Seed `admin_settings` con riga vuota (l'admin la compila in `/admin/impostazioni` al primo accesso)

---

## 16. Env vars finali

Da aggiungere a `.env.local` e `.env.example`:

```bash
# Admin
ADMIN_EMAIL=luca.perullo@icloud.com

# Fatture in Cloud
FIC_CLIENT_ID=
FIC_CLIENT_SECRET=
FIC_REDIRECT_URI=https://lucaperullo.it/api/admin/fic/oauth/callback
FIC_WEBHOOK_SECRET=
```

---

## 17. Testing strategy

- **Unit**: `validators.ts`, `totals.ts`, `numbering.ts`, `fattura-pa-xml.ts` (snapshot di XML d'esempio)
- **Integration**: route handler `/api/admin/documents/[id]/issue` con Supabase locale → verifica numerazione e snapshot
- **Manuale**: setup OAuth FiC in sandbox FiC (esiste env `api-v2-sandbox`), emissione fattura test, ricezione webhook
- **Smoke E2E**: visita `/admin` come admin → vede dashboard; visita `/admin` come altro user → 404

---

## 18. Deliverables del piano implementativo

Il piano (`writing-plans` skill, prossimo step) dovrà coprire, in fasi indipendenti dove possibile:

1. **Foundation**: env vars, `requireAdmin()`, layout admin con redirect/404, dashboard placeholder
2. **DB schema**: migrazione SQL, RLS, seed `admin_settings` (incluso `min_installment_cents` e tabella `document_installments`)
3. **Anagrafica clienti**: route + UI + validatori
4. **Editor documento (draft only)**: route + UI + calcolo totali + piano rate, no FiC, no PDF
5. **Logica rate**: schedule generator + validator (somma, minimo, ordine) + status auto
6. **PDF rendering**: template `@react-pdf/renderer` con tabella rate + signed URL
7. **XML FatturaPA**: builder + multiple `DettaglioPagamento` per rate + test snapshot
8. **OAuth FiC**: start/callback + storage token + UI connect in `/admin/impostazioni`
9. **Emissione + trasmissione SDI**: `issue` + `transmit` route, integrazione FiC client
10. **Webhook FiC**: handler + signature validation + status sync
11. **Dashboard reale**: KPI + ultimi documenti + "da fare" + "rate in scadenza/scadute"
12. **Polish**: anteprima PDF, duplica documento, archive cliente, mark-rata-paid, mobile QA

---

## 19. Note operative (per Luca)

Prima di poter usare l'admin in produzione:

1. Creare app OAuth su [FiC developers portal](https://developers.fattureincloud.it/), inserire `FIC_REDIRECT_URI` nelle redirect URLs ammesse
2. Salvare `FIC_CLIENT_ID`, `FIC_CLIENT_SECRET` nelle env Vercel (production) e `.env.local` (dev)
3. Creare un account FiC (free tier basta per <10 fatture/mese)
4. Andare su `/admin/impostazioni`, compilare anagrafica + IBAN, click "Connetti Fatture in Cloud"
5. Configurare il webhook FiC: dashboard FiC → Sviluppatori → Webhook → URL `https://lucaperullo.it/api/admin/webhooks/fatture-in-cloud`, eventi "Documento — cambio stato SDI"
6. Salvare `FIC_WEBHOOK_SECRET` nelle env

Documentato in `docs/admin/setup.md` (creato nel piano implementativo).
