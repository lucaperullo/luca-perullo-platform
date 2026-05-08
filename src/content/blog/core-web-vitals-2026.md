---
title: "Core Web Vitals 2026: perché Google penalizza i siti lenti (e come accelerare il tuo)"
excerpt: "I Core Web Vitals non sono optional dal 2021. Nel 2026 sono il pavimento. Ecco le tre metriche che contano e come migliorarle."
publishedAt: 2026-05-15
tag: Performance
seoTitle: "Core Web Vitals 2026 — guida pratica per migliorare"
seoDescription: "Cosa sono i Core Web Vitals (LCP, INP, CLS), perché Google li usa per il ranking, e come migliorare il tuo sito nel 2026."
keywords:
  - core web vitals
  - velocità sito web
  - lighthouse score
---

Google misura tre metriche tecniche per ogni sito web. Sono i Core Web Vitals. Se il tuo sito le sbaglia, Google ti retrocede nei risultati di ricerca anche se hai i contenuti migliori del mondo. Ecco cosa sono, e come sistemarle.

### Le tre metriche che contano

**LCP — Largest Contentful Paint.** Quanto tempo passa dal click del visitatore fino a quando vede il "pezzo grande" della pagina (l'hero, l'immagine principale). **Target: sotto 2.5 secondi.**

**INP — Interaction to Next Paint.** Quanto tempo passa da quando il visitatore clicca un bottone a quando la pagina risponde visivamente. Sostituisce FID dal 2024. **Target: sotto 200ms.**

**CLS — Cumulative Layout Shift.** Quanto la pagina "salta" mentre carica (immagini che cambiano dimensione, banner che appaiono spostando contenuto). **Target: sotto 0.1.**

Queste tre, misurate in field (utenti reali) tramite Chrome User Experience Report, finiscono direttamente nel ranking di Google.

### Come scoprire come stai

**PageSpeed Insights** (gratis): inserisci URL, vedi i tre numeri. Fa anche Lab data + Field data. Field data è quello che conta per il ranking.

**Search Console — Core Web Vitals report**: ti dice quali URL del tuo sito hanno problemi.

**Web Vitals Chrome extension**: misura in tempo reale mentre navighi.

### Le 6 cause più comuni di LCP lento

1. **Immagini hero non ottimizzate** — JPEG da 2MB invece di WebP da 200KB
2. **Hosting condiviso lento** — TTFB > 600ms
3. **Render-blocking resources** — CSS o JS che bloccano il primo paint
4. **Font web non preloaded** — il browser aspetta i font prima di mostrare il testo
5. **CDN assente** — utenti lontani dal server
6. **CMS pesante non cachato** — WordPress senza caching genera ogni pagina dal database

### Come ridurre LCP (in ordine di impatto)

1. **Comprimi e converti le immagini** — tutto in WebP/AVIF. Risparmi 70%.
2. **Preload dell'immagine hero** — `<link rel="preload" as="image">`. Aumento del 15–25% LCP.
3. **Hosting edge** (Vercel, Cloudflare, Netlify) — TTFB < 100ms da qualsiasi parte d'Italia.
4. **Caching aggressivo** — pagine pre-renderizzate (SSG) sono istantanee.
5. **Font display swap** — `font-display: swap` mostra testo subito con font fallback.

### Le 4 cause più comuni di INP alto

1. **Tanto JavaScript** — bundle da 1MB+ che blocca il main thread
2. **Event handler pesanti** — calcoli sincroni durante il click
3. **Re-render eccessivi React** — componenti che ri-renderizzano alberi giganti
4. **Third-party scripts** — analytics, chat, ads che interferiscono

### Come ridurre INP

1. **Code splitting** — carica solo il JS della pagina visualizzata
2. **Defer di tutto il non critico** — analytics, chat widgets, ads dopo l'interazione
3. **Throttle event handlers** pesanti (es. `scroll`, `mousemove`)
4. **Server components / RSC** — sposta lavoro al server, manda HTML al client

### CLS — di solito si aggiusta in poche ore

1. **Imposta width/height su tutte le immagini** — il browser riserva lo spazio
2. **Banner non al di sopra del contenuto** — push fuori dal viewport invece di overlay
3. **Font preload** — evita FOUT (Flash of Unstyled Text)
4. **Spazio riservato per ads/embed** — `min-height` esplicito

### La differenza tra lab e field

PageSpeed dà due numeri: Lab (test simulato) e Field (utenti reali). **Solo Field data finisce nel ranking.** Il Lab è utile per debug.

Spesso il Lab è 95/100 e il Field è 60/100. Significa: gli utenti reali, sui loro device reali, con la loro connessione reale, vivono male il tuo sito. Il Lab non vede questo.

### Quanto vale tutto questo

Studi recenti (2025–2026) mostrano che migliorare LCP da 4s a 2s aumenta del 7–15% il traffico organico in 60–90 giorni, mantenendo invariato il content. È uno dei pochi interventi tecnici con ROI misurabile certo.

Vuoi una review tecnica del tuo sito? [Scrivimi](/contatti) — un report di 1 pagina con i 5 fix prioritari, gratis.
