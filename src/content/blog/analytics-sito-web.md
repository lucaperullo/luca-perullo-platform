---
title: "Analytics 2026: cosa misurare davvero (e cosa lasciare perdere)"
excerpt: "I dashboard pieni di numeri che nessuno guarda non aiutano nessuno. Ecco le 6 metriche che muovono il business e quelle che sono solo rumore."
publishedAt: 2026-05-29
tag: Marketing
seoTitle: "Analytics sito web 2026 — cosa misurare davvero"
seoDescription: "Quali metriche analytics misurare per il sito aziendale: traffico qualificato, conversioni, velocità, retention. Guida pratica 2026."
keywords:
  - analytics sito web
  - google analytics 4 guida
  - metriche sito web
---

Google Analytics 4 ha 200 metriche. Dashboard piene di grafici colorati. Però la maggior parte degli imprenditori che gestiscono un sito non sa rispondere alla domanda fondamentale: "il sito porta soldi o no?". Vediamo cosa misurare davvero.

### Le 6 metriche che contano per davvero

**1. Traffico qualificato (non visite totali).**

"Visite totali" è vanity metric. Conta le visite che hanno fatto **qualcosa**: scroll oltre il 50%, tempo > 30 secondi, almeno una pagina interna, oppure click su CTA. Questo è il numero che riflette interesse reale.

In GA4 lo configuri come "engaged session" (visite > 10 secondi e/o > 1 evento e/o > 2 pagine).

**2. Conversioni macro.**

L'azione che genera valore: form compilato, telefonata partita (con tracking call), prenotazione, vendita. Va settata in GA4 come "key event".

**Numero da monitorare:** conversioni totali / mese, segmentate per canale (organico, diretto, social, paid).

**3. Conversion rate per pagina.**

Quale pagina del tuo sito porta più conversioni in proporzione al traffico? Spesso non è la home — è la pagina del singolo servizio o un caso studio specifico.

Sapere quali pagine convertono = sapere dove investire (più contenuto, più traffico verso quelle).

**4. Costo per acquisizione (CPA).**

Per ogni canale: quanto stai spendendo (Google Ads, agency SEO, social) diviso quante conversioni stai ottenendo da quel canale.

Se il tuo cliente medio vale €2.000 e CPA Google Ads è €450, ottimo. Se CPA è €2.500, stai bruciando soldi.

**5. Velocità delle pagine principali.**

Web Vitals (LCP, INP, CLS) per le 5 pagine top traffic. Sono direttamente correlate al posizionamento Google e alla conversion rate.

Approfondimento: [Core Web Vitals 2026](/blog/core-web-vitals-2026).

**6. Retention contenuti.**

Per chi fa content marketing: quante persone tornano sul tuo sito? Visitatori unici nuovi vs returning. Una percentuale sana è 25–40% returning.

Se sotto 15%, i contenuti non fidelizzano. Se sopra 50%, magari non stai attirando nuovi visitatori abbastanza.

### Le metriche da ignorare (vanity)

- **Bounce rate** (in GA4 è cambiato significato, è meno utile)
- **Pageviews totali** senza segmentazione
- **Tempo medio sul sito** isolato da altre metriche
- **"Average position" Search Console** isolata (varia troppo per query, da segmentare)

### Setup minimo nel 2026

**1. Google Analytics 4** — gratis, standard del mercato. Configura key events per le conversioni che ti interessano.

**2. Google Search Console** — gratis, fondamentale per SEO. Mostra query reali, click, impression, posizione media.

**3. Hotjar / Microsoft Clarity** — gratis (Clarity), pagamento (Hotjar). Heatmap e session recordings. Vedi cosa fa l'utente sulla pagina.

**4. Tag Manager** — gestisci script (analytics, pixel, chat) senza toccare codice.

### Privacy-first analytics — l'alternativa europea

GA4 raccoglie dati che richiedono consenso (rallenta misurazione). Alternative privacy-friendly che spesso non richiedono cookie banner:

- **Plausible** — €9–69/mese, dati semplici e chiari
- **Fathom** — €15–90/mese, simile a Plausible
- **Matomo** — gratis self-hosted, più completo

Trade-off: meno dettaglio di GA4 ma misuri il 100% dei visitatori (non solo chi accetta cookie).

### Dashboard che muovi: la regola del "una pagina"

Un dashboard utile sta in una pagina A4. Se devi scrollare, è già troppo.

**Dashboard mensile minimo:**

- Traffico organico vs mese precedente vs anno precedente
- Conversioni totali + per canale
- Top 10 pagine per traffico + conversion rate
- CPA per canale paid
- LCP medio mobile per home + top 3 pagine

Niente di più. Tutto il resto è rumore.

### L'errore che fanno tutti

Misurare per misurare. "Abbiamo Google Analytics, fa qualcosa". Senza KPI definiti, senza decisioni che dipendono dai numeri, è solo sfondo.

Prima di guardare i dati, definisci: **cosa cambierei se questo numero scendesse del 30%?** Se la risposta è "niente", quel numero non serve.

### Range di costo

- **GA4 + Search Console + Clarity** — €0 (tutto gratis)
- **GA4 + Hotjar + Tag Manager** — €30–80/mese
- **Plausible/Fathom** privacy-first — €10–80/mese
- **Setup completo professionale** (custom events, funnel, segments) — €1.500–4.000 una tantum

Vuoi capire se misuri le cose giuste? [Scrivimi](/contatti) — audit del tuo setup analytics + 5 fix prioritari, gratis.
