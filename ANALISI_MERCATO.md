# Analisi mercato + strategia di conversione
*Luca Perullo — piattaforma personale, maggio 2026*

> Documento di lavoro. Sintetizza l'audit del sito attuale, l'analisi del mercato
> italiano (PMI), la concorrenza, e la roadmap per trasformare il portfolio in
> un canale che genera vendite ricorrenti di servizi pacchettizzati.

---

## 1. Snapshot del sito attuale

### Cosa funziona
- **Brand e craft visivo**: il sito *è* il prodotto. Geist Sans/Mono, hairline 1px, stripe rule, palette zinc neutra. Comunica seriosità e cura — perfetto per un target che ha già visto troppi siti gradient-pink.
- **Blog SEO denso**: ~30 articoli ottimizzati per long-tail PMI italiane (`sito web ristorante`, `studio dentistico`, `commercialista`, `quanto costa sito web 2026`, `agenzie web spariscono`, ecc). Buon traffico organico potenziale, voce credibile.
- **Calcolatore preventivi** (`/tools/preventivo`): tool gratuito, ottimo lead-magnet.
- **Manifesto visivo**: ticker, marquee stack, showcase, three.js blob — segnali di alto livello tecnico.
- **Posizionamento**: "Software Architect & AI Engineer" è specifico; AURA Academy aggiunge autorità.

### Cosa NON converte oggi (5 falle critiche)

1. **Niente pagina servizi a prezzo fisso.** Il sito non ha *nessun* punto in cui un visitatore può vedere un'offerta concreta con un prezzo concreto e cliccare "Acquista". Tutto richiede una conversazione.
2. **Il calcolatore preventivi mostra range troppo larghi** (es. webapp €8.000–25.000). Il blog dello stesso sito dice `preventivi-ecommerce-costi-nascosti.md` — ma il calcolatore *fa esattamente quello che il blog critica*. Coerenza rotta = fiducia rotta.
3. **CTA passive**: la home ha solo `Connect` (social/email). Manca un CTA primario tipo "Vedi i pacchetti" o "Prenota la prima call".
4. **Niente social proof in primo piano**: nessuna testimonianza, nessun logo cliente, nessun numero (X siti consegnati, X clienti soddisfatti). I `Projects` sono solo 2.
5. **Funnel a un solo gradino**: un visitatore freddo dal blog non ha un percorso a basso attrito (newsletter, lead magnet PDF, consulenza gratuita 15 min). O scrive su WhatsApp o se ne va.

---

## 2. Mercato italiano: dove pescare

### Segmento primario (target scelto): PMI italiane di servizi
Ristoranti, B&B, studi (legale/dentistico/commercialista), parrucchieri, palestre, artigiani, bed & breakfast.

| Variabile | Valore tipico |
|---|---|
| Budget annuo digitale | €2.000–8.000 |
| Decision maker | Titolare (1 persona) |
| Ticket medio sito web | €1.500–4.500 |
| Tempo decisionale | 2–6 settimane |
| Canale di scoperta | Google ricerca locale, passaparola, blog SEO |
| Dolore principale | "Mi hanno preso i soldi e poi sparito" |
| Cosa li convince | Trasparenza, prezzo fisso, timeline definita, voce italiana |

### Segmento secondario opportunistico: PMI che cercano AI
Domanda esplosa nel 2025–2026. Le PMI hanno sentito parlare di "ChatGPT che risponde ai clienti", "automatizziamo le email", ma:
- Non sanno cosa chiedere.
- Non sanno quanto costa.
- Hanno paura di sprecare soldi.

**Opportunità**: Luca è uno dei pochi freelance italiani con autorità *tecnica* sull'AI (RAG, vector DBs nello stack) ma che parla in italiano semplice. Il tag `AI engineer` + il blog `ai-chat-sito-web` + `ai-sito-web-aziendale` è già una rampa.

### Concorrenza sul mercato italiano

| Tipo | Esempi | Punto debole sfruttabile |
|---|---|---|
| **Agenzie web locali** | studi locali, agenzie regionali | Lente, cara, opaca. Il blog di Luca ne parla esplicitamente. |
| **Piattaforme self-service** | Wix, Squarespace, Webflow, Shopify | "Lo fai tu" — il cliente PMI non ha tempo, non sa SEO, non sa AI. |
| **Marketplace freelance** | Fiverr, Upwork, Codeable | Race to the bottom su prezzo, qualità imprevedibile. |
| **Consulenti AI generalisti** | molti su LinkedIn | Parlano di AI senza saper sviluppare. Luca consegna codice. |
| **Sviluppatori freelance "puri"** | molti | Parlano in tech. Luca parla in italiano umano (vedi blog). |

**Posizionamento difendibile**:
> *"L'unico freelance italiano che ti dice il prezzo prima di parlarti, ti consegna in tempo, e parla sia il linguaggio dei tuoi clienti che quello dell'AI."*

---

## 3. Strategia di conversione: dal blog al wallet

### Funnel a 4 gradini

```
[Blog SEO] → [Lead magnet / Tool gratuito] → [Pacchetto ready-to-buy] → [Retainer / upsell]
   freddo            tiepido                       caldo (pagante)         cliente ricorrente
```

### Gradino 1 — Traffico (già attivo)
Blog SEO ottimizzato. **Da fare**: aggiungere CTA contestuali in fondo a ogni articolo che puntano al pacchetto pertinente. Es. articolo "sito web ristorante" → CTA "Pacchetto Sito Vetrina Ristorante a €1.490, online in 14 giorni".

### Gradino 2 — Lead magnet
- Calcolatore preventivi attuale (già live).
- **Da aggiungere**: PDF gratuito *"Checklist 30 punti: cosa controllare prima di firmare un preventivo web"* in cambio email. Lista email = canale gratuito di follow-up.

### Gradino 3 — Pacchetti ready-to-buy (NUCLEO DI QUESTO PROGETTO)
Pagina `/servizi` con 4 famiglie di prodotti (vedi sezione 4). Ogni pacchetto:
- Prezzo fisso e visibile.
- Bottone "Acquista ora" che apre Stripe Checkout.
- Cosa è incluso / escluso, in 5 bullet.
- Timeline di consegna garantita.
- Pulsante secondario "Prenota una call gratuita di 15 min" per chi non è ancora pronto a comprare.

### Gradino 4 — Retainer
Dopo la consegna, ogni pacchetto ha l'upsell naturale verso un retainer mensile (manutenzione, content update, monitoring AI bot). Stripe ricorrente, €79–€349/mese.

---

## 4. Catalogo servizi proposto

### Famiglia A — Siti web a pacchetto fisso
*Risolve: "non so quanto costerà alla fine"*

| Slug | Nome | Prezzo | Timeline | Ideale per |
|---|---|---|---|---|
| `landing-essenziale` | Landing Page Essenziale | **€790** | 7 giorni | Lancio prodotto, evento, lead-gen |
| `sito-vetrina` | Sito Vetrina | **€1.490** | 14 giorni | Ristoranti, studi, artigiani |
| `sito-vetrina-pro` | Sito Vetrina PRO | **€2.490** | 21 giorni | Brand, multi-pagina, blog SEO |
| `ecommerce-starter` | E-commerce Starter | **€3.490** | 30 giorni | Shop fino a 100 prodotti |

Ogni pacchetto include: design, sviluppo Next.js, hosting Vercel primo anno, 3 round di revisione, dashboard di avanzamento, garanzia "consegna o rimborso".

### Famiglia B — Setup AI / Claude bot
*Risolve: "voglio un assistente AI sul mio sito ma non so come"*

| Slug | Nome | Prezzo | Timeline | Cosa fa |
|---|---|---|---|---|
| `ai-chat-base` | AI Chat sul tuo sito | **€890** | 5 giorni | Bot risponde a FAQ, basato su Claude + tuoi documenti |
| `ai-chat-rag` | AI Chat con base di conoscenza | **€1.890** | 10 giorni | Bot legge i tuoi PDF/sito, risponde con fonti |
| `ai-whatsapp-bot` | Assistente AI su WhatsApp | **€1.490** | 7 giorni | Bot risponde su WhatsApp Business 24/7 |
| `ai-email-triage` | Triage email AI | **€990** | 5 giorni | AI smista e bozza-risponde alle email in arrivo |

Tutti includono: setup Anthropic API, prompt engineering, 50.000 messaggi/mese, monitoring, training su contenuti del cliente.

### Famiglia C — Automazioni n8n / Make
*Risolve: "passo ore in compiti ripetitivi"*

| Slug | Nome | Prezzo | Timeline |
|---|---|---|---|
| `auto-lead-capture` | Lead → CRM → Email | **€490** | 3 giorni |
| `auto-fattura-ai` | OCR fatture → contabilità | **€690** | 5 giorni |
| `auto-recensioni` | Auto-richiesta recensioni Google | **€390** | 2 giorni |
| `auto-bundle` | Bundle 3 automazioni | **€1.290** | 7 giorni |

### Famiglia D — Consulenze a ore (slot prenotabili)

| Slug | Nome | Prezzo | Durata |
|---|---|---|---|
| `call-strategia-15` | Call gratuita di scoping | **€0** | 15 min |
| `call-audit-1h` | Audit conversione del tuo sito | **€149** | 60 min + report |
| `call-strategia-3h` | Strategia AI per la tua azienda | **€390** | 180 min + roadmap |
| `code-review` | Code review tecnica | **€290** | 90 min + write-up |

---

## 5. Implementazione tecnica (cosa costruisco oggi)

### A. Nuovi file (creati in questa sessione)
```
src/data/services.ts                  # catalogo prodotti + Stripe priceId placeholder
src/app/servizi/page.tsx              # landing /servizi con tabs A/B/C/D
src/app/servizi/[slug]/page.tsx       # dettaglio singolo pacchetto
src/app/servizi/success/page.tsx      # post-checkout
src/app/servizi/cancel/page.tsx       # post-checkout-annullato
src/app/api/checkout/route.ts         # POST → Stripe session
src/lib/stripe.ts                     # client Stripe lato server
src/components/service-card.tsx       # card riusabile per la pagina servizi
src/components/buy-button.tsx         # bottone client che chiama /api/checkout
ANALISI_MERCATO.md                    # questo documento
```

### B. File modificati
```
src/app/page.tsx                      # +Section "Servizi" con CTA primario
package.json                          # +stripe ^17
.env.local.example                    # template variabili Stripe
```

### C. Variabili d'ambiente da configurare
```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=https://lucaperullo.it
```

### D. Cosa NON faccio in questa pass (next steps espliciti)
1. **Creare i prodotti su Stripe Dashboard** — Luca deve creare manualmente i Price ID e incollarli in `services.ts` (campo `stripePriceId`). Lo lascio come placeholder commentato.
2. **Webhook di conferma ordine** — strutturo `/api/checkout` ma non aggiungo `/api/webhooks/stripe`. Da fare quando si vuole automazione post-pagamento (email kickoff, Notion task creato, ecc).
3. **Newsletter / lead magnet PDF** — fuori scope di questa pass.
4. **A/B test pricing** — da fare dopo i primi 10 acquisti.
5. **Fatturazione elettronica italiana** — Stripe Tax + integrazione Fatture in Cloud o simile. Pacchetto separato.

---

## 6. KPI da misurare

Una volta live, monitorare settimanalmente:

| Metrica | Strumento | Target a 90 giorni |
|---|---|---|
| Visitatori unici | Plausible / Umami | 5.000 / mese |
| Tasso click su CTA "Vedi pacchetti" da home | analytics | > 8% |
| Tasso click su "Acquista" da `/servizi` | analytics | > 4% |
| Tasso completamento Checkout Stripe | Stripe dashboard | > 35% |
| Vendite pacchetti / mese | Stripe | 4–8 |
| Lead da call gratuita 15 min | Calendly / Cal.com | 10 / mese |
| Conversione lead → pacchetto pagato | manuale | 25% |

Ricavo target conservativo a 90 giorni: **€8.000–€16.000/mese ricorrenti** dalla combinazione di pacchetti + retainer.

---

## 7. Rischi & mitigazioni

| Rischio | Mitigazione |
|---|---|
| "I prezzi fissi mi limitano sui progetti grandi" | I pacchetti sono il tuo top of funnel, non il tuo unico canale. I progetti custom restano via call gratuita di scoping. |
| "Stripe Checkout sembra troppo SaaS, rompe il brand" | Custom-style la pagina servizi con il design system attuale; la pagina di checkout Stripe accetta logo + colore brand. |
| "Le PMI italiane vogliono fattura prima di pagare" | Stripe genera ricevuta automatica; integrazione Fatture in Cloud al primo cliente che lo chiede. Per il resto: pagamento online accettato dalle nuove generazioni di titolari (sotto i 50). |
| "Sparisco se mi arrivano 10 ordini insieme" | I pacchetti hanno timeline pubbliche. Sul sito metti "max 3 progetti attivi al mese" per scarsità credibile. |
| "Il bot AI dà risposte sbagliate al cliente" | Tutti i pacchetti AI includono setup di guardrails, escalation a umano, e SLA dichiarato. Test prima del go-live. |

---

## 8. Prossimi 7 giorni — to-do operativo

1. **Oggi (sessione corrente)**: tutta l'implementazione tecnica della sezione 5A/5B.
2. **Giorno +1**: creare account Stripe se non esiste, creare i 16 prodotti su Stripe Dashboard, copiare i `priceId` in `services.ts`.
3. **Giorno +2**: scrivere copy definitivo per ogni pagina servizio (deliverable, esclusi, FAQ).
4. **Giorno +3**: aggiungere CTA in fondo agli articoli del blog più trafficati (top 5).
5. **Giorno +5**: setup Calendly/Cal.com per la call gratuita 15 min, link nella pagina servizi.
6. **Giorno +7**: lanciare con un post LinkedIn + thread X. Monitorare i primi 100 click.

---

*Fine documento. Domande / decisioni aperte → in commento sopra le righe pertinenti.*
