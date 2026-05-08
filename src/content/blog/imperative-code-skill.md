---
title: "Imperative-Code: come ho costruito una skill che pulisce lo slop accumulato dalle sessioni AI"
excerpt: "Costruire un progetto su molte sessioni AI fa accumulare incoerenze: la stessa lista in due lingue, tre type per lo stesso concetto, magic string ripetuti. Ho costruito una skill per Claude Code che lo trova e lo consolida — e l'ho testata su questo stesso portfolio."
publishedAt: 2026-05-08
tag: AI Tooling
seoTitle: "Skill Claude Code per consolidare codice generato in più sessioni AI"
seoDescription: "Costruire un progetto su molte sessioni AI accumula incoerenze (slop): nomi diversi per lo stesso concetto, liste duplicate in due lingue, magic string. Ecco come ho costruito una skill che fa l'audit e propone una dichiarazione canonica per concetto."
keywords:
  - claude code skill
  - ai slop refactoring
  - codice generato ai consolidare
  - cross-session ai cleanup
---

Quando un progetto cresce su tante sessioni AI, ogni sessione arriva senza memoria della precedente e re-inventa gli stessi sostantivi: una sessione dichiara `const fruits = [...]`, la successiva scrive `export const FRUTTA: string[] = [...]`, una terza definisce `type FoodCategory = "fruit" | "veg"`. Tutti descrivono lo stesso concetto di dominio, ma vivono in file diversi, con nomi diversi, in shape diversi. Questo è **AI slop**: ogni pezzo funziona in isolamento, ma il codebase nel suo insieme diventa incoerente. Un nuovo sviluppatore che lo legge passa un'ora a capire quale dei tre type "user" sia quello vero.

Ho costruito una skill per Claude Code, **`/imperative-code-perullo`**, che lo audita e propone come consolidarlo. "Imperative" qui non è il senso del paradigma di programmazione — è il senso *decretato*: **una dichiarazione governa l'intero progetto**.

## Il workflow in quattro fasi

La skill non aggredisce il codice. Apre con un audit, aspetta l'approvazione, poi esegue.

1. **Discover** — inventario di candidati, file per file. Liste ripetute, type paralleli, magic string, drift di naming convention, identificatori tradotti (italiano + inglese non per i18n ma per ridichiarazione). Si usa il token più generico possibile per il grep, non quello più specifico — `matchMedia(` invece di `prefers-reduced-motion`, perché il secondo manca i siti che mettono la query in una `const`.
2. **Cluster** — raggruppa i candidati per *concetto di dominio*, non per somiglianza testuale. `Frutta` e `Fruits` finiscono nello stesso cluster. `BillingAddress` e `ShippingAddress`, no — sono concetti distinti che condividono campi per coincidenza (codice postale, città).
3. **Plan** — un report scritto, con nome canonico, file canonico, shape canonica, costo di migrazione per ogni cluster. **Stop**. L'utente approva (o scarta) ogni cluster prima che parta qualsiasi edit.
4. **Refactor + verify** — un cluster alla volta. Crea la dichiarazione canonica prima di toccare i call site. Migra. Type-check + lint dopo ogni cluster, non dopo ogni file. Se rompe, revert solo del cluster, non di tutto. Manifest scritto a fine cluster come audit trail.

## Il caso reale: questo portfolio

Per testarla davvero, l'ho fatta girare su questo stesso codebase: 133 file Next.js, cinque mesi di iterazioni cross-session. L'audit ha trovato **otto cluster** in circa sette minuti.

Il finding più rumoroso: **l'intero sistema `Spider` e `Fly` è stato costruito due volte in parallelo**. Sessioni diverse hanno indipendentemente ricostruito la stessa infrastruttura — circa 250 righe simmetriche (storage key, custom event, getter/setter, picker UI, enclosure shell) che potrebbero diventare ~120 con un singolo `createVariantStore<V>` factory + un `VariantPicker<V>` generico. Nessuno se ne era accorto perché nessuno aveva mai aperto i due file fianco a fianco.

Altri cluster trovati:
- Lo stesso union `"live" | "wip" | "soon"` dichiarato sotto due nomi (`ToolStatus`, `LibStatus`) e con la mappa colore copia-incollata in un terzo file.
- Il pattern `prefers-reduced-motion` ripetuto in **13 file** (più altri 4 che l'audit aveva inizialmente mancato — più sotto).
- Theme detection (`documentElement.classList.contains("dark")` + `MutationObserver`) ripetuto in 4 scene R3F.
- `lucaperullo@outlook.it` hardcoded in 9 file diversi, anche se `data/profile.ts` esiste.
- Convenzione di naming per le storage key divisa in tre stili (`lp-fly-variant`, `lp:fly-variant`, `lp.cookies.v1`).

E un finding "negativo" che mi è piaciuto: la skill ha **esplicitamente riconosciuto come già canonico** il lavoro fresco su `BustAvatar` / `SharedBust`. Niente falsi positivi su codice appena consolidato.

## Cosa è servito davvero, cosa no

Il primo ciclo (skill v1, 3 fixture sintetiche) ha dato un benchmark con **+6 punti percentuali** rispetto al baseline (Sonnet senza skill). Il fatto interessante: il baseline cattura quasi tutto da solo. Il modello moderno è abbastanza bravo da trovare lo slop senza istruzioni esplicite.

Il valore della skill non è il *cosa cattura* — è la **disciplina e la struttura**. L'output ha sempre la stessa forma (Summary, Clusters, Members, Canonical, Migration, Diff preview). I pattern hanno nomi espliciti ("AI slop", "boundary types", "skip rules", "back-compat re-export"). Una sessione futura che ri-esegue l'audit produce un report comparabile, non un report ad-hoc.

Eseguendola dal vivo sul portfolio, ho raccolto **sette punti di attrito** che la v1 non gestiva bene:

1. **Recall del grep** — la v1 grep-pava sui token più specifici e mancava il 24% dei membri di un cluster.
2. **Albero git non pulito** — la v1 assumeva un working tree pulito, cosa rara nella vita vera.
3. **`useEffect` con concerns multipli intrecciati** — un blocco solo che sottoscrive matchMedia + osserva il theme + gestisce viewport. Migrare uno richiede chirurgia, non delete.
4. **Siti che legittimamente non si possono migrare** — un toggler che legge e scrive lo stesso DOM attribute dentro `startViewTransition`. Forzare un hook introduce una race. La v1 non insegnava il "skip ruling".
5. **Union duplicati nascosti dentro Record value type** — il campo `tone: "live" | "wip" | "soon"` dentro `Record<X, {…}>` è una quarta copia che nessun grep su nomi di type vede.
6. **Numeri di riga obsoleti** quando cluster successivi toccano gli stessi file.
7. **Re-export back-compat come strategia di default** — `export type ToolStatus = ReleaseStatus;` significa che zero call site cambiano. Un consolidamento a costo quasi zero.

Tutti e sette sono finiti in v2. Re-benchmark: **delta passato da +0.06 a +0.08**, mentre il pass-rate ha raggiunto il 100% sui fixture (ceiling). Costo: +13% di token, +35% di latenza per la nuova guidance di completeness check. Trade-off accettabile per un audit one-shot, da ottimizzare se gira in CI.

## Honest take

La skill è production-ready dopo due iterazioni. Non perché sia perfetta — perché ha raggiunto il limite di quello che si può misurare con benchmark sintetici e una sola codebase reale. Da qui in poi serve uso reale ripetuto per trovare il prossimo punto di attrito.

Le tre cose che continuo a credere siano vere dopo averla scritta e averla fatta girare:

- **Il valore dell'AI tooling non è la cattura, è la disciplina.** Sonnet sa già trovare il duplicato. La skill garantisce che lo trovi *nello stesso modo ogni volta*, con lo stesso vocabolario, con la stessa pausa per approvazione.
- **L'output è il template.** Il singolo cambio che ha mosso più punti percentuali nel benchmark è stato pretendere il template (Summary / Clusters / Borderline / Out-of-scope / Suggested execution order). Tutto il resto del valore deriva da lì.
- **L'unica vera misura è il dispatch dal vivo.** I sette insights sono usciti tutti dall'eseguire la v1 su un codebase reale. Nessuno sarebbe uscito da un benchmark sintetico.

La skill, i fixture, e i manifest dei test sono nel mio dotfiles `~/.claude/skills/imperative-code-perullo/`. Se ti capita uno strato di slop accumulato, ti dico volentieri come adattarla al tuo flusso.
