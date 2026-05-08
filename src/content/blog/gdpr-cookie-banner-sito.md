---
title: "GDPR e cookie banner: come essere compliant nel 2026 senza far scappare i visitatori"
excerpt: "Cookie banner mal fatti uccidono conversioni e ti espongono a sanzioni. Ecco come fare uno che protegge legalmente e non distrugge l'esperienza utente."
publishedAt: 2026-05-27
tag: Compliance
seoTitle: "GDPR cookie banner 2026 — guida pratica"
seoDescription: "Come fare un cookie banner conforme GDPR e ePrivacy nel 2026 senza distruggere conversioni. Best practice e errori da evitare."
keywords:
  - gdpr cookie banner
  - cookie banner conforme
  - sito gdpr italia
---

Cookie banner = legge + UX. La maggior parte dei siti italiani ne ha uno che è **non conforme** (rischio sanzioni) oppure **distrugge le conversioni** (rischio business). Vediamo come farne uno che funziona su entrambi i fronti.

### Cosa dice davvero la normativa

Due testi guida:
- **GDPR (UE 2016/679)** — protezione dati personali in generale
- **Direttiva ePrivacy** + Garante Privacy italiano — specifica sui cookie

**Le 4 regole base:**

1. **Consenso esplicito** prima di installare cookie non necessari (analytics, marketing). Non più "scrolling = consenso".
2. **Granularità** — l'utente sceglie categorie separate (necessari, analytics, marketing, performance).
3. **Facilità di rifiuto pari a quella di accettazione** — se "Accetta tutti" è 1 click, "Rifiuta tutti" deve essere 1 click. Non sotto un menù.
4. **Revocabilità** — l'utente deve poter cambiare idea in qualsiasi momento (link sempre visibile).

Sanzioni: fino a 4% del fatturato annuo o €20M (la più alta delle due).

### Le 3 categorie di cookie

**1. Tecnici / necessari** — non richiedono consenso. Sessione, autenticazione, carrello.

**2. Analytics** — Google Analytics, Plausible, Matomo. Richiedono consenso.

**3. Marketing / profilazione** — Facebook Pixel, Google Ads, retargeting. Consenso esplicito separato.

### L'errore più costoso: dark pattern

Banner classici "fregature":
- Bottone "Accetta tutti" verde grosso, "Rifiuta" piccolo grigio
- "Solo i necessari" nascosto dietro 3 click
- Pre-spunta delle categorie analytics/marketing
- Banner che ricompare ad ogni pagina anche dopo il consenso

Tutti questi sono **violazioni** secondo le linee guida del Garante 2024. Sanzioni reali sono già state comminate.

### Il banner che funziona (legalmente E sulle conversioni)

**Layout tipico conforme:**

- Banner non bloccante (non modal full-screen — Google penalizza)
- 4 bottoni o 4 toggle: Necessari (sempre on, non disattivabili), Analytics, Marketing, Performance
- Bottoni di pari peso visivo: "Accetta tutti", "Rifiuta tutti", "Personalizza"
- Link a Privacy Policy e Cookie Policy
- "Salva preferenze" come terza opzione

### Le piattaforme conformi più usate

- **Iubenda** — italiana, completa, €30–100/mese
- **Cookiebot** — danese, popolare, €15–80/mese
- **OneTrust** — enterprise, costosa, scalabilissima
- **Custom in-house** — se hai sviluppatore, conformità garantita ma manutenzione tua

### Cosa NON fare (errori comuni)

- **Caricare Google Analytics PRIMA del consenso** — violazione esplicita. Lo script va caricato condizionalmente.
- **Cookie wall** ("accetta o esci") — non conforme da 2023. Va offerta alternativa equivalente senza accept.
- **Pre-spunta** delle categorie analytics/marketing — vietato.
- **Privacy policy auto-generata** copia-incollata — il Garante la riconosce e ti sanziona.

### Privacy Policy — il documento serio

Va scritta in modo specifico per il TUO sito, indicando:

- Titolare del trattamento (chi sei tu legalmente)
- Quali dati raccogli e perché
- Per quanto li conservi
- A chi li comunichi (cloud provider, processor)
- Diritti dell'utente (accesso, cancellazione, portabilità)
- Cookie usati con finalità specifica per ognuno

Strumenti: Iubenda Pro genera privacy policy custom (€30/mese). Avvocato dedicato: €500–1.500 una tantum.

### Tecnicamente, come si fa nel codice

**Pattern moderno:**
1. Banner appare. JS analytics/marketing **NON viene caricato**.
2. Utente sceglie. Consenso salvato in cookie/localStorage.
3. **Solo se accetta**, lo script viene iniettato dinamicamente.
4. Refresh / nuova pagina: banner nascosto, script caricati secondo consenso.

Strumenti come Cookiebot, Iubenda gestiscono tutto questo. Se vai custom, devi implementarlo bene.

### L'effetto sulle conversioni

Un banner conforme bene ottimizzato ottiene **75–85% accept rate** sulle analytics (sufficiente per misurazioni utili).

Un banner cattivo (dark pattern) ottiene 95%+ accept rate ma rischia sanzioni e distrugge fiducia. Non vale la pena.

### Range di costo

- **Iubenda standard** — €100–500/anno
- **Banner custom in-house ben fatto** — €1.500–4.000 una tantum
- **Privacy policy avvocato + Iubenda** — €1.000–2.500 una tantum + €100–500/anno

Vuoi un audit del tuo banner attuale? [Scrivimi](/contatti) — segnalo dove sei non conforme e cosa fixare.
