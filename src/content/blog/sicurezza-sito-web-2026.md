---
title: "Sicurezza dei siti web nel 2026: i 10 attacchi più comuni e come blindarli"
excerpt: "Il 70% dei siti WordPress non aggiornati viene bucato entro 12 mesi. La sicurezza non è paranoia, è igiene di base."
publishedAt: 2026-05-26
tag: Sicurezza
seoTitle: "Sicurezza sito web 2026 — guida pratica anti-attacchi"
seoDescription: "I 10 attacchi più comuni ai siti web nel 2026 e come proteggersi: brute force, SQL injection, XSS, malware. Guida pratica."
keywords:
  - sicurezza sito web
  - proteggere sito wordpress
  - attacchi sito web
---

Un sito bucato è un disastro che si moltiplica: dati clienti rubati, sanzioni GDPR, downtime, recovery fees, reputazione. Eppure la maggioranza dei siti italiani usa hosting scadenti, plugin abbandonati e password "Password123". Vediamo i 10 attacchi reali e i contromisure pratiche.

### 1. Brute force su pannello admin

Bot che provano migliaia di combinazioni user/password contro `/wp-admin`, `/wp-login.php`, `/admin`.

**Difesa:**
- Rinomina URL admin (plugin WP Cerber o equivalente)
- 2FA obbligatoria su tutti gli account
- Rate limiting (max 5 tentativi/IP/ora)
- Password manager — niente "Mario1234"

### 2. SQL injection

Form mal scritti che permettono di iniettare query SQL malevole. Storico problema di siti custom o WordPress con plugin scadenti.

**Difesa:**
- Framework moderni (Next.js, Laravel, Django) hanno protezione built-in
- Mai costruire query con string concatenation
- Plugin/temi solo da repository ufficiale

### 3. XSS (Cross-Site Scripting)

Iniezione di JS malevolo nei tuoi form (es. campo commenti). Quando un altro utente visita la pagina, il JS gira nel suo browser.

**Difesa:**
- Sanitizzazione input lato server (mai trustare il client)
- Content Security Policy (CSP) headers configurati
- Framework moderni escapano output by default

### 4. Plugin/tema obsoleti

Il 90% dei siti WordPress bucati lo è per plugin abbandonati. Una vulnerabilità nota in un plugin = chiunque può entrare.

**Difesa:**
- Aggiornamenti automatici di plugin/tema/core
- Eliminare plugin che non usi (no, anche se "potrebbero servire")
- Audit trimestrale: quali plugin sono ancora mantenuti?

### 5. File upload arbitrari

Form di caricamento file senza filtri. Hacker carica un .php o .jsp che diventa webshell.

**Difesa:**
- Whitelist estensioni permesse (.jpg, .pdf, etc.) — non blacklist
- Salvare uploads in cartella fuori dal webroot
- Antivirus scan automatico (es. ClamAV)

### 6. Credential stuffing

Hacker prova credenziali rubate da altri siti (database leak) sul tuo. Funziona perché molti utenti riusano password.

**Difesa:**
- 2FA obbligatoria sugli account critici
- Detect "device" (cookie) e richiedi verifica per dispositivi nuovi
- Integrazione con HaveIBeenPwned per bloccare password compromesse

### 7. DDoS

Migliaia di richieste fake che mandano giù il sito.

**Difesa:**
- Cloudflare gratis davanti al sito (mitiga 95% degli attacchi)
- CDN che assorbe i picchi
- Hosting che ha protezione DDoS inclusa

### 8. Phishing del dominio (DNS hijacking)

Attaccante prende il controllo del DNS e devia i visitatori a un sito clone.

**Difesa:**
- Registrar serio (Cloudflare Registrar, Gandi)
- Lock domain attivo
- DNSSEC abilitato
- Email account del registrar con 2FA

### 9. Spear phishing al team

Email finta del "CEO" che chiede a un dipendente di trasferire fondi o cliccare link malevolo.

**Difesa:**
- Training del team annuale
- Procedure scritte per richieste di pagamento
- Email signing (DKIM, SPF, DMARC) configurato per ridurre spoofing

### 10. Backup mancante o inutilizzabile

Quando ti hackerano, l'unica vera difesa è ripristinare. Se il backup non c'è o non funziona, sei finito.

**Difesa:**
- Backup automatici giornalieri off-site (NON sullo stesso server)
- Test di ripristino ogni 3 mesi (verifichi che funzionano davvero)
- Backup retention almeno 30 giorni
- Strumenti: UpdraftPlus, BlogVault, hosting con backup native

### Le tre regole d'igiene di base

Se non sai da dove iniziare, queste tre coprono il 70% del rischio:

1. **2FA su tutti gli account** (admin sito, hosting, registrar, email)
2. **Aggiornamenti automatici attivi** + audit trimestrale plugin
3. **Backup giornalieri off-site testati**

### Cosa fare se sei stato bucato

1. **Disconnetti il sito** (manutenzione mode o offline temporaneo)
2. **Cambia tutte le password** (admin, hosting, database, FTP)
3. **Identifica come sono entrati** (log analysis)
4. **Pulisci da zero** (idealmente: ripristina backup pre-attacco + applica patches)
5. **Notifica utenti** se dati personali sono stati compromessi (obbligatorio GDPR entro 72h)

### Range di costo per sicurezza adeguata

- **Sito vetrina:** €0–200/anno (Cloudflare gratis + 2FA + aggiornamenti automatici)
- **E-commerce:** €300–1.200/anno (hosting hardenato + WAF + backup gestiti)
- **Sito con dati sensibili:** €1.500+/anno (audit periodici + WAF + monitoring 24/7)

Hai dubbi sulla sicurezza del tuo sito? [Scrivimi](/contatti) — audit di 1 ora gratis con i 10 fix prioritari.
