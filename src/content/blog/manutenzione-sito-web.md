---
title: "Manutenzione del sito web: cosa va fatto ogni mese, ogni trimestre, ogni anno"
excerpt: "Un sito senza manutenzione muore lentamente: lento, insicuro, mai in posizione. Ecco la checklist che tiene il tuo sito vivo e produttivo."
publishedAt: 2026-06-03
tag: Metodo
seoTitle: "Manutenzione sito web aziendale — checklist 2026"
seoDescription: "Cosa fare ogni mese e anno per mantenere il sito web aziendale: aggiornamenti, sicurezza, contenuti, performance. Checklist pratica."
keywords:
  - manutenzione sito web
  - manutenzione wordpress
  - aggiornamenti sito aziendale
---

Un sito web NON è un quadro che metti al muro e dimentichi. È un'auto che richiede tagliando regolare. Senza, lentamente: ti rallenta, ti diventa insicuro, scende nelle posizioni Google, si rompono cose. Vediamo la routine reale che tiene un sito al top.

### Le tre cadenze: mensile, trimestrale, annuale

Manutenzione efficace ha tre orizzonti temporali. Ogni cadenza ha task specifici.

### Mensile (1–2 ore al mese)

**1. Aggiornamenti.**

Plugin, temi, core CMS. Su WordPress: vai su `Aggiornamenti`, fai backup prima, applica. Per Jamstack: aggiorna dipendenze npm con cautela (`npm outdated`).

**2. Backup verificato.**

Backup automatici giornalieri sono il default. Ma vanno **testati**: una volta al mese, scarica il backup e prova a ripristinarlo in ambiente di test. Senza test, scopri che il backup non funziona quando ti serve.

**3. Controllo Search Console.**

- Errori di copertura nuovi
- URL con problemi mobile
- Core Web Vitals report
- Query nuove per cui appari (e cosa potresti ottimizzare)

**4. Spam comments / form submissions.**

Form di contatto che riceve spam? Captcha forte (hCaptcha o reCAPTCHA v3) attivo? Nessuna mail spam che inonda team support?

**5. Broken links interni.**

Tool come Screaming Frog gratis (sotto 500 URL) trova link rotti che linkano a pagine cancellate o esterne morte. Aggiusti o rimuovi.

### Trimestrale (3–4 ore al trimestre)

**1. Audit performance.**

PageSpeed Insights su home + 3 pagine top traffic. LCP < 2.5s? INP < 200ms? Se peggio, identifica cause e intervieni.

Approfondimento: [Core Web Vitals 2026](/blog/core-web-vitals-2026).

**2. Audit sicurezza.**

- Plugin abbandonati da disinstallare
- Account utenti inutilizzati da rimuovere
- 2FA attiva su tutti gli admin
- Versioni PHP/Node aggiornate
- HTTPS valido (certificato non scaduto)

**3. Review analytics.**

Cosa è cambiato in 90 giorni:
- Traffico organico vs trimestre prima
- Conversioni: trend up o down?
- Pagine top: cambiate?
- Bounce rate, tempo sulla pagina: cambiamenti significativi?

Decisioni: dove investire content/marketing nel trimestre prossimo.

**4. Pulizia database.**

Su WordPress: revisioni vecchie, transient scaduti, commenti spam, post in cestino. Plugin come WP Sweep gestisce. Riduci 30–60% dimensione database.

Su DB custom: archive di righe vecchie, vacuum (PostgreSQL), optimization (MySQL).

**5. Aggiornamento contenuti.**

Le pagine che ranking-poco vanno revisionate. Aggiungi sezioni, aggiorna dati 2024 → 2026, aggiungi nuovi screenshot, link interni nuovi.

Google premia il "freshness".

### Annuale (1 giornata)

**1. Audit SEO completo.**

Tool come Ahrefs, SEMrush (a pagamento) o Search Console + Screaming Frog (gratis). Verifica:
- Posizioni medie per le keyword target
- Backlink profile (chi linka a te, qualità)
- Competitor: cosa hanno aggiunto loro
- Keyword nuove emergenti nel tuo settore

**2. Audit conversion.**

Le pagine che convertivano l'anno prima continuano a convertire? Test sezioni che non funzionano. A/B test se hai abbastanza traffico (vedi [analytics](/blog/analytics-sito-web)).

**3. Review legali e compliance.**

Privacy policy aggiornata con eventuali nuovi cookie/strumenti?
Cookie banner conforme a linee guida 2026?
Termini di servizio rivisti dall'avvocato?

Approfondimento: [GDPR e cookie banner](/blog/gdpr-cookie-banner-sito).

**4. Audit costi infrastruttura.**

Stai pagando hosting/CDN/strumenti che non usi più? Quanto è il TCO totale del sito? Vale la pena migrare a piattaforme più efficienti?

**5. Strategia content per anno successivo.**

Calendario editoriale per i prossimi 12 mesi. Topic ricerca, cluster di articoli, milestone di traffico organic da raggiungere.

### Quando assumere qualcuno per la manutenzione

Se hai sito custom o WordPress complesso e:
- Non hai team tecnico interno
- Hai > 5.000 visite/mese (il sito conta sul business)
- Hai e-commerce attivo

Allora vale la pena un contratto di manutenzione: €100–500/mese a seconda complessità. Ti garantisce che le cose vengano fatte, non rimandate.

### Cosa succede se NON fai manutenzione

Linea temporale tipica di un sito WordPress lasciato a se stesso:

- **Mese 3:** primo plugin obsoleto crea piccoli bug
- **Mese 6:** Core Web Vitals scende, traffico organico inizia a scendere
- **Mese 9:** sito bucato (60% probability secondo statistiche del settore)
- **Mese 12:** ranking sceso del 30%, conversioni sotto del 25%, sito da rifare

Il sito si paga in performance. Senza manutenzione, lo perdi gradualmente senza rendertene conto.

### Range di costo manutenzione

**Self-managed (tu o team interno):** 2–4 ore/mese → costo opportunità tuo

**Managed by agency / freelance:**
- Sito vetrina semplice: €60–150/mese
- Sito strutturato + blog: €150–400/mese
- E-commerce: €300–800/mese
- Web app: €500–2.500/mese a seconda complessità

Per la maggior parte delle PMI italiane, **un contratto di manutenzione mensile da €150–300** copre tutto il necessario e libera il tempo del team per il business.

Vuoi sapere cosa serve davvero per il tuo sito? [Scrivimi](/contatti) — audit di stato attuale + checklist personalizzata.
