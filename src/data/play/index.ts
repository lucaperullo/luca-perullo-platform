/**
 * Aggregatore curriculum /play.
 *
 * 36 corsi totali distribuiti su 7 materie e 4 livelli.
 * AI a 360° è la materia più estesa con 12 corsi (dal primo prompt
 * agli agenti con MCP). 9 corsi "must-have 2026" coprono i gap più
 * richiesti dal mercato: TypeScript, Tailwind, Accessibility,
 * Testing, Web Vitals, Cybersecurity, Cloud Edge, Python, Mobile.
 *
 * I corsi "live" hanno contenuto completo (lezioni cumulative).
 * I corsi "soon" hanno solo metadati ricchi: titolo, descrizione,
 * subjects, level. Saranno sbloccati uno alla volta nei prossimi turn.
 */
import type { Lesson, Module, PlayArea, PlayCourse, PlaySubject } from "./types";
import { AREA_SUBJECTS } from "./types";
import { playCourse as primoSitoCourse } from "@/data/play-courses";
import { accessibilitaWcagCourse } from "./courses/accessibilita-wcag";
import { animazioniAvanzateCourse } from "./courses/animazioni-avanzate";
import { formsHtml5Course } from "./courses/forms-html5";
import { htmlSemanticoCourse } from "./courses/html-semantico";
import { layoutModernoCourse } from "./courses/layout-moderno";
import { portfolioPersonaleCourse } from "./courses/portfolio-personale";
import { tailwindUtilityFirstCourse } from "./courses/tailwind-utility-first";
import { tipografiaDesignCourse } from "./courses/tipografia-design";

// ─────────────────────────────────────────────────────────────────────────
// Curriculum completo — 17 corsi
// ─────────────────────────────────────────────────────────────────────────

export const playCourses: PlayCourse[] = [
    primoSitoCourse,
    portfolioPersonaleCourse,
    tailwindUtilityFirstCourse,
    // ── batch live aprile-maggio 2026 (6 corsi paralleli) ──
    htmlSemanticoCourse,
    formsHtml5Course,
    tipografiaDesignCourse,
    layoutModernoCourse,
    animazioniAvanzateCourse,
    accessibilitaWcagCourse,

    // (i corsi html-semantico, forms-html5, tipografia-design,
    // layout-moderno, animazioni-avanzate sono ora live e definiti
    // nei rispettivi file ./courses/*.ts importati in cima.)

    // ─── JavaScript
    {
        slug: "javascript-base",
        title: "JavaScript dalle basi",
        subtitle:
            "Variabili, funzioni, oggetti, array. La logica di programmazione spiegata bene.",
        description:
            "Il primo passo da web designer a web developer. Imparerai variabili (let/const), funzioni (incluse arrow), array, oggetti, condizioni, cicli. Niente teoria astratta: ogni concetto applicato a un mini-progetto, dal contatore a un piccolo gioco di indovinello.",
        level: "base",
        subjects: ["javascript"],
        durationMin: 60,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },
    {
        slug: "javascript-vivo",
        title: "Il sito diventa vivo (DOM + eventi)",
        subtitle:
            "addEventListener, querySelector, createElement. Il tuo sito reagisce ai click.",
        description:
            "Da pagine statiche a pagine reattive. Imparerai DOM manipulation, eventi (click, submit, keypress), come rispondere alle azioni dell'utente. Applicheremo questi concetti al portfolio del Corso 2: toggle dark mode con JS (alternativa più potente del :has() puro), gallery con lightbox, form con validazione live.",
        level: "intermedio",
        subjects: ["javascript"],
        durationMin: 50,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },
    {
        slug: "javascript-async",
        title: "Async/await e fetch",
        subtitle:
            "Parla con le API: chiamate HTTP, promesse, gestione errori, async/await.",
        description:
            "Il pezzo che separa frontend statico da frontend connesso. fetch() per chiamare API, async/await per gestire le risposte, try/catch per gli errori. Costruirai una mini-app che chiama un'API (es. weather, GitHub) e visualizza i dati live. Plus: pattern di loading state e gestione errori.",
        level: "intermedio",
        subjects: ["javascript"],
        durationMin: 45,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },

    // ─── React & Components
    {
        slug: "react-base",
        title: "React: dal CSS al componente",
        subtitle:
            "JSX, props, state. Il salto fondamentale: dal markup statico ai componenti riusabili.",
        description:
            "Il salto fondamentale: invece di scrivere HTML/CSS in un singolo file, costruisci componenti che incapsulano markup + stato + comportamento. JSX, props, useState, useEffect — applicati al portfolio del Corso 2 ora trasformato in componenti React. Setup minimale con Vite.",
        level: "avanzato",
        subjects: ["react", "javascript"],
        durationMin: 70,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },
    {
        slug: "react-state",
        title: "State management e hooks",
        subtitle:
            "useState, useReducer, useContext. Stato condiviso senza Redux.",
        description:
            "Lo state in React: locale, condiviso, derivato. useState per il locale, useContext + useReducer per il condiviso senza tirare fuori Redux. Pattern moderni: lift state up, custom hooks, state machines minimali. Quando serve Zustand e quando no.",
        level: "avanzato",
        subjects: ["react"],
        durationMin: 60,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },

    // ─── Backend & Database
    {
        slug: "supabase-db",
        title: "Database con Supabase",
        subtitle:
            "Postgres senza il dolore del DBA. Schema design, query, signed URLs.",
        description:
            "Postgres è il database serio. Supabase lo rende avvicinabile. Imparerai schema design (relazioni, vincoli, indici), query con SQL, JS client per CRUD, storage per file. Costruirai un mini-CMS dove utenti possono scrivere e leggere note.",
        level: "intermedio",
        subjects: ["backend"],
        durationMin: 55,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },
    {
        slug: "auth-rls",
        title: "Auth e Row Level Security",
        subtitle:
            "Magic link, OAuth, RLS policies. Sicurezza senza buchi.",
        description:
            "Il 99% dei breach inizia con auth scritta male. Imparerai magic link (passwordless), OAuth (Google/GitHub), e soprattutto RLS — Row Level Security di Postgres che fa rispettare le regole di accesso a livello DB, non application. Ogni endpoint diventa sicuro per default.",
        level: "avanzato",
        subjects: ["backend"],
        durationMin: 60,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },

    // ─── Full-stack
    {
        slug: "nextjs-app",
        title: "Next.js: il tuo primo full-stack",
        subtitle:
            "Server components, file-system routing, data fetching, deploy.",
        description:
            "Da React a un'app full-stack moderna. Server Components per fetch dei dati senza client roundtrip, App Router file-based, layouts annidati, streaming, deploy su Vercel in 2 click. Costruirai un'app multi-pagina con auth e database.",
        level: "pro",
        subjects: ["fullstack", "react"],
        durationMin: 90,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },
    {
        slug: "saas-2-ore",
        title: "SaaS in 2 ore",
        subtitle:
            "Auth, database, Stripe, dashboard. Da zero a app pagante in pomeriggio.",
        description:
            "Il corso finale: metti insieme tutto. Auth Supabase + DB Postgres + payments Stripe + dashboard Next.js. Costruirai un mini-SaaS reale (lista task condivise) dove gli utenti pagano per accedere. 2 ore di lavoro focused, una piccola app vendibile.",
        level: "pro",
        subjects: ["fullstack", "backend"],
        durationMin: 120,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },

    // ─────────────────────────────────────────────────────────────────
    // AI a 360° — 12 corsi
    // Fonti: docs ufficiali Anthropic + OpenAI + MCP, ricerca maggio 2026.
    // Filo conduttore: ogni corso parte da "cosa puoi fare oggi
    // pomeriggio gratis" e arriva al "trucco che usano i pro".
    // ─────────────────────────────────────────────────────────────────

    // ─── Base: zero codice, browser e basta
    {
        slug: "ai-primi-passi",
        title: "AI senza paura: il tour delle 5 grandi (gratis)",
        subtitle:
            "ChatGPT, Claude, Gemini, Perplexity, DeepSeek a confronto. In 40 minuti capisci quale serve a te — senza pagare niente.",
        description:
            "ChatGPT ha 900 milioni di utenti settimanali. Tu sei tra loro? Se la risposta è \"no\" o \"sì ma non so bene cosa farci\", questo è il punto da cui partire. Apriamo insieme i 5 chatbot principali (tutti hanno tier gratis vero, niente carta) e facciamo lo stesso compito su ognuno: chiediamo un consiglio, riassumiamo un articolo, traduciamo una mail. Vedrai con i tuoi occhi che ChatGPT è bravo a tutto, Claude scrive meglio i testi lunghi, Gemini è cucito su Gmail e Drive, Perplexity ti dà sempre le fonti come Wikipedia, DeepSeek è cinese e gratuito senza limiti seri. Alla fine sai esattamente quale aprire per quale problema. Niente codice, solo browser.",
        level: "base",
        subjects: ["ai-tools"],
        durationMin: 40,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },
    {
        slug: "prompt-engineering",
        title: "Prompt engineering: come parlare all'AI per davvero",
        subtitle:
            "Le 6 mosse di OpenAI + Anthropic ufficiali. Stessa AI, prompt diverso = risposta 10× migliore.",
        description:
            "Stessa AI, due prompt diversi, due risposte abissalmente diverse. La differenza la fanno 6 mosse documentate sui blog ufficiali di OpenAI e Anthropic: istruzioni chiare, testo di riferimento, dividere compiti complessi, dare tempo di pensare (chain-of-thought), usare strumenti esterni, testare in modo sistematico. Le impari tutte con esempi prima/dopo. Bonus 2026: l'evoluzione si chiama \"context engineering\" — non più cosa scrivi nel singolo prompt, ma quale insieme di informazioni metti a disposizione dell'AI. E un trucco killer: il meta-prompt, cioè chiedere all'AI di scrivere il prompt perfetto al posto tuo.",
        level: "base",
        subjects: ["ai-tools"],
        durationMin: 45,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },
    {
        slug: "ai-quotidiana",
        title: "AI tutti i giorni: 5 ore di tempo libero a settimana",
        subtitle:
            "Email, PDF lunghi, traduzioni, brainstorming, NotebookLM. Il secondo cervello che hai sempre voluto, gratis.",
        description:
            "Non serve essere developer. Serve solo un browser e 50 minuti per sbloccare i workflow che fanno risparmiare 5 ore a settimana al 90% delle persone. Email perfette in 10 secondi (con il giusto tono per ogni interlocutore). Riassunto di un PDF di 100 pagine in 30 secondi. Traduzioni che mantengono la voce originale. Brainstorming dove l'AI gioca l'avvocato del diavolo. NotebookLM (gratis di Google) che ti studia 50 documenti caricati e ti risponde solo da quelli. La parte più importante: come capire quando l'AI sta inventando (allucinazioni) e i 3 modi per costringerla a dire \"non lo so\" invece di mentirti con sicurezza.",
        level: "base",
        subjects: ["ai-tools"],
        durationMin: 50,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },

    // ─── Intermedio: generi contenuti, costruisci parlando
    {
        slug: "ai-immagini",
        title: "Immagini AI: dal prompt al brand kit completo",
        subtitle:
            "Bing Image Creator illimitato + ImageFX di Google + Flux. Stessa qualità degli illustratori da 500€, costo zero.",
        description:
            "Nel 2026 ci sono 3 strumenti zero-attrito senza signup (Raphael AI, Craiyon, Perchance) e 2 generatori illimitati gratuiti che fanno qualità professionale: Bing Image Creator con DALL·E 3 (basta account Microsoft) e Google ImageFX con Imagen — il migliore in assoluto se l'immagine deve contenere testo leggibile. Aggiungi Flux Schnell (open-source, gira anche sul tuo PC). Imparerai l'anatomia di un prompt che funziona davvero — soggetto, stile, lighting, inquadratura, mood, palette — più i parametri (negative prompt, seed, aspect ratio) che separano il dilettante dal pro. Esercizio finale: brand kit completo (logo, social cover, mockup prodotto, hero website) per un cliente fittizio in 60 minuti, costo totale 0€.",
        level: "intermedio",
        subjects: ["ai-tools"],
        durationMin: 60,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },
    {
        slug: "ai-video-voce",
        title: "Video, voce e musica AI in un pomeriggio",
        subtitle:
            "Veo 3 senza watermark + Seedance 1080p + Suno musica + ElevenLabs voce. Una clip social finita, costo zero.",
        description:
            "OpenAI ha annunciato che Sora chiude. Veo 3 di Google ha preso il trono: gratis su AI Studio, niente watermark, qualità da agenzia. Per video social orientati al verticale c'è Seedance (1080p, 100 crediti/giorno gratis, niente watermark). Per la musica: Suno v5.5 free tier che fa colonne sonore originali con voce. Per la voce: ElevenLabs clona la tua in 30 secondi. Per avatar parlanti: HeyGen mette uno te davanti alla camera senza camera. Costruiamo insieme una clip social di 30 secondi end-to-end. Il trucco che usa chi vende contenuti: image-to-video batte sempre text-to-video, perché ti dà controllo totale sulla composizione del primo frame.",
        level: "intermedio",
        subjects: ["ai-tools"],
        durationMin: 65,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },
    {
        slug: "vibe-coding",
        title: "Vibe coding: descrivi un'app, ce l'hai online in 30 minuti",
        subtitle:
            "Lovable, Bolt.new, v0, Replit. Word of the Year 2025 — ora il 63% di chi costruisce app non scrive una riga.",
        description:
            "Vibe coding significa: descrivi a parole l'app che vuoi, l'AI scrive il codice, ti dà un link funzionante online. Era una novità nel 2024, oggi è lo standard per i founder non-tecnici. Tour onesto dei 4 strumenti: Lovable (full-stack zero-attrito, React + Tailwind + Supabase + auth integrata, il più amato dai principianti), Bolt.new (browser-only, lanciato da StackBlitz, Claude sotto il cofano), v0 di Vercel (perfetto per UI React polished se hai già un backend), Replit (per chi vuole imparare a programmare lungo la strada). Anatomia di un brief che produce app davvero usabili: markdown strutturato, screenshot di riferimento, vincoli espliciti. Esercizio: landing page con form lead funzionante online in 30 minuti.",
        level: "intermedio",
        subjects: ["ai-tools"],
        durationMin: 55,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },
    {
        slug: "claude-integration",
        title: "Integra Claude AI sul tuo sito (chat vera, in 30 minuti)",
        subtitle:
            "Bottone chat in basso a destra che parla con Claude. Streaming, system prompt, prompt caching del 90%.",
        description:
            "I chatbot \"WhatsApp con noi\" sono morti. Quelli vivi parlano con Claude o GPT e rispondono come una persona vera. Costruiamo insieme la versione moderna: bottone chat in basso a destra del tuo sito, modalità streaming (le parole appaiono come le scrive un umano), system prompt che dà personalità all'assistente (\"sei l'assistente di Anna, designer freelance milanese, parli con tono professionale ma calmo\"), prompt caching per tagliare i costi del 90% sui prompt lunghi. Gestiamo anche errori, rate limit, e moderazione. Stack: Next.js + SDK Anthropic ufficiale + 5€ di credito che ti durano un mese intero anche con traffico reale.",
        level: "intermedio",
        subjects: ["ai-tools", "fullstack"],
        durationMin: 60,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },
    {
        slug: "n8n-automazioni",
        title: "Automazioni con n8n: il tuo Zapier privato e gratis",
        subtitle:
            "Form → CRM → email → Slack, no-code, self-hosted. Nodi AI Agent che eseguono Claude/GPT nel workflow.",
        description:
            "n8n è Zapier ma open-source: collega qualunque tool a qualunque altro senza scrivere codice. Self-hosted significa gratis senza limiti — gli unici limiti sono il server tuo (anche un Raspberry Pi basta). Costruiamo 5 workflow che valgono come automazioni vere: lead capture (form sito → CRM → email di benvenuto), OCR fatture con AI → riga in spreadsheet contabilità, monitor recensioni Google con notifica Slack se sotto le 4 stelle, email drip personalizzate scritte da Claude per ogni lead, sync calendari Google + Apple + Outlook. La novità 2026: nodo AI Agent che fa girare un agente intero dentro il workflow.",
        level: "intermedio",
        subjects: ["ai-tools"],
        durationMin: 55,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },

    // ─── Avanzato: free APIs vere, privacy locale, RAG production
    {
        slug: "ai-api-gratis",
        title: "AI gratis per sviluppatori: Gemini + Groq + Cerebras",
        subtitle:
            "1500 req/giorno su Gemini Flash, 60K token/min su Cerebras, 28 modelli free su OpenRouter. Senza carta.",
        description:
            "Pagare per l'AI nel 2026 è facoltativo, anche per app vere. Free tier reali (testati maggio 2026): Google AI Studio dà 1500 richieste/giorno su Gemini 2.5 Flash con 1M token di contesto, niente carta. Cerebras è il più generoso in throughput puro (60.000 token/minuto, ~3-5× più veloce di Groq). Groq vince in latenza singola (315 token/secondo, il più rapido al mondo grazie ai chip LPU). OpenRouter è il \"router unificato\": 28 modelli gratis al momento, da Llama 3.3 70B a Qwen 2.5 — un'unica API key, scegli il modello al volo. Costruiamo una mini-app chat che gira gratis con fallback automatico tra provider quando uno satura.",
        level: "avanzato",
        subjects: ["ai-tools", "fullstack"],
        durationMin: 65,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },
    {
        slug: "ai-locale",
        title: "AI sul tuo computer: Ollama + LM Studio",
        subtitle:
            "Llama 3.3, DeepSeek-R1, Qwen 3 che girano sul tuo Mac. Privacy assoluta, zero costi, anche offline.",
        description:
            "Quando i dati non possono lasciare il tuo computer (clienti, contratti, codice proprietario) l'AI cloud non è un'opzione. Ollama è lo standard CLI (un comando, hai Llama 3.3 sul Mac) — perfetto per integrarla nelle app tue. LM Studio è la versione con interfaccia grafica, perfetta per chi non ama il terminale e vuole solo \"aprire e parlarci\". Imparerai a scegliere il modello giusto per il tuo hardware (RAM e GPU), capire la quantizzazione (Q4 occupa 1/4 ed è quasi indistinguibile da Q8), e a esporre l'AI locale come API standard OpenAI, così la usi dalle tue app come se fosse cloud. Esercizio: chat con un PDF locale, niente cloud, privacy assoluta.",
        level: "avanzato",
        subjects: ["ai-tools"],
        durationMin: 55,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },
    {
        slug: "rag-da-zero",
        title: "RAG: l'AI che legge e capisce i tuoi documenti",
        subtitle:
            "Chunk → embed → retrieve → generate. Q&A su 100 PDF tuoi con pgvector + hnsw, in 1 ora.",
        description:
            "RAG è il pattern dietro al 90% dei chatbot aziendali del 2026: prima cerco nei tuoi documenti, poi passo i pezzi rilevanti all'AI insieme alla domanda. Risultato: l'AI risponde con i tuoi dati, niente allucinazioni, citazioni alla riga giusta. Le 4 fasi (chunk → embed → retrieve → generate) le costruiamo passo passo su Supabase con pgvector — l'estensione vector di Postgres che ormai è production-ready (la usano OpenAI, Supabase, Neon). Best practice 2026: chunks di 200-800 token con overlap, indice hnsw con cosine similarity per progetti sotto il milione di righe, hybrid search che mescola semantic + keyword, re-ranking finale. Costruirai un Q&A su 100 PDF che è la stessa identica feature che le aziende pagano 50.000€/anno alle agenzie.",
        level: "avanzato",
        subjects: ["ai-tools", "backend"],
        durationMin: 75,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },

    // ─── Pro: il futuro è già qui (MCP, agenti)
    {
        slug: "mcp-server",
        title: "MCP: lo standard che collega AI e mondo reale",
        subtitle:
            "Costruisci un server MCP che parla con qualunque AI. \"USB-C dell'AI\", donato a Linux Foundation nel 2025.",
        description:
            "Hai 5 strumenti aziendali (Slack, Drive, CRM, calendar, DB) e 3 AI (Claude, ChatGPT, Gemini). Senza MCP devi costruire 15 integrazioni — n×m. Con MCP ne costruisci 8 — n+m. Per questo Anthropic l'ha progettato e poi donato all'Agentic AI Foundation (Linux Foundation) a fine 2025: ora è lo standard di OpenAI, Google, Microsoft, tutti. Costruiamo insieme un server MCP completo seguendo i docs ufficiali (Python 3.10+, MCP SDK 1.2.0+, package manager uv) che espone i 3 mattoni del protocollo: Resources (file letti dall'AI), Tools (funzioni eseguite dall'AI), Prompts (template riusabili). Lo connetti a Claude Desktop e parli con la tua API come se fosse magia.",
        level: "pro",
        subjects: ["ai-tools", "fullstack"],
        durationMin: 80,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },
    {
        slug: "agenti-ai",
        title: "Agenti AI autonomi: oltre la chat, l'AI che agisce",
        subtitle:
            "Il loop perceive → plan → act → reflect. Tool use, memoria, guardrails. Claude Agent SDK in pratica.",
        description:
            "Un chatbot ti risponde. Un agente decide, agisce, valuta il risultato, riprova. La differenza è enorme e il 2026 ci ha portato gli SDK ufficiali per costruirli sul serio. Imparerai il loop core (perceive → plan → act → reflect), tool use con schema JSON ben definito, memoria di lavoro (la conversazione corrente) vs memoria a lungo termine (un DB), e — la parte critica — i guardrails per evitare loop infiniti che ti svuotano il portafoglio. Useremo Claude Agent SDK ma i pattern valgono per OpenAI Agents e tutti gli altri. Esercizio: agente che ogni mattina cerca offerte di lavoro nei criteri tuoi, le valuta in autonomia, e ti manda email solo per le 3 migliori della giornata.",
        level: "pro",
        subjects: ["ai-tools", "fullstack"],
        durationMin: 90,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },

    // ─────────────────────────────────────────────────────────────────
    // 2026 MUST-HAVE — corsi che il mercato chiede esplicitamente.
    // Ricerca maggio 2026: TypeScript ovunque richiesto, Tailwind
    // standard, Accessibility (WCAG) obbligatoria per legge UE,
    // Testing/Performance/Cybersecurity skill ad alto valore,
    // Cloud edge dominante, Python+ML porta a $160k+ NLP roles,
    // React Native top mobile skill.
    // ─────────────────────────────────────────────────────────────────

    // ─── TypeScript: il salto fondamentale del frontend moderno
    {
        slug: "typescript-pratico",
        title: "TypeScript senza paura (per chi sa già JS)",
        subtitle:
            "Tipi che ti salvano dalle 3 di notte: union, narrowing, generics, satisfies. Da JS a TS in 2 ore.",
        description:
            "Nel 2026 quasi tutti i progetti seri usano TypeScript: lo standard di Next.js, lo standard delle big tech, lo standard di chi non vuole bug a runtime. Imparerai i tipi base (string, number, ma anche union 'success' | 'error'), narrowing con typeof/instanceof, interfacce e types, generics che fanno funzioni riutilizzabili (Array<T>, Promise<T>), il keyword `satisfies` (versione moderna di `as`), e i pattern critici: optional fields, discriminated unions, `Pick`/`Omit`/`Partial`. Il corso è volutamente pratico: ogni concetto ha un esempio reale tratto dal lavoro freelance.",
        level: "intermedio",
        subjects: ["javascript"],
        durationMin: 90,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },

    // (tailwind-utility-first è ora live, definito in
    // ./courses/tailwind-utility-first.ts e importato in cima)

    // (accessibilita-wcag è ora live, definito in
    // ./courses/accessibilita-wcag.ts e importato in cima)

    // ─── Testing: ormai obbligatorio in produzione
    {
        slug: "testing-moderno",
        title: "Testing moderno: Vitest + Playwright",
        subtitle:
            "Unit test, integration, end-to-end. Dormi la notte sapendo che il deploy non rompe nulla.",
        description:
            "Senza test, ogni deploy è una preghiera. Imparerai i 3 livelli del testing moderno: unit (Vitest, sostituto di Jest che è 5x più veloce e nativo Vite) per testare funzioni e componenti React isolati, integration (Testing Library) per testare interazioni utente sui componenti, end-to-end (Playwright, ufficiale Microsoft) per testare flussi completi nel vero browser. Best practice 2026: cosa testare e cosa NO, mocking server-side con MSW, snapshot test ragionati, CI/CD con GitHub Actions. Avrai un repo con coverage > 80% senza essere ossessivo.",
        level: "avanzato",
        subjects: ["javascript", "react"],
        durationMin: 90,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },

    // ─── Web Vitals: ranking Google + UX critical
    {
        slug: "web-vitals-performance",
        title: "Performance web: Core Web Vitals & ottimizzazione",
        subtitle:
            "LCP, INP, CLS sotto le soglie Google. Lazy loading, caching, bundle splitting, image optimization.",
        description:
            "Sito lento = clienti persi + ranking Google in caduta. Imparerai i Core Web Vitals 2026 (LCP < 2.5s, INP < 200ms — sostituisce FID, CLS < 0.1) e come ottimizzarli sul serio: lazy loading di immagini con loading='lazy' nativo, code splitting con dynamic imports Next.js, font display swap, preconnect/prefetch per third-party, caching strategy con Cloudflare, bundle analysis con @next/bundle-analyzer per scoprire quali dependency pesano davvero. Tool reali: Lighthouse CI, PageSpeed Insights, WebPageTest. Risultato: passi da 'verdi solo qualche volta' a verdi sempre.",
        level: "avanzato",
        subjects: ["css", "fullstack"],
        durationMin: 75,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },

    // ─── Cybersecurity web: PMI italiane lo cercano molto
    {
        slug: "sicurezza-web",
        title: "Sicurezza web: OWASP Top 10 in pratica",
        subtitle:
            "XSS, CSRF, SQL injection, auth sicura, secret management. Niente più 'admin/admin' né credenziali in chiaro.",
        description:
            "Le PMI italiane sono target n°1 dei cyber attack — e cercano disperatamente sviluppatori che sanno proteggerle. Imparerai l'OWASP Top 10 in pratica: XSS (cross-site scripting) e perché React ti protegge per default ma non sempre, CSRF e i token anti-falsificazione, SQL injection (anche se usi un ORM), broken auth (rate limiting, password rules che hanno senso), security headers (CSP, HSTS, X-Frame-Options), secret management (mai .env nel repo, rotation di chiavi). Bonus: penetration testing base con strumenti gratis tipo OWASP ZAP. Skill che ti distingue immediatamente nel mercato freelance.",
        level: "avanzato",
        subjects: ["backend", "fullstack"],
        durationMin: 80,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },

    // ─── Cloud Deploy edge: dove i siti vivono nel 2026
    {
        slug: "cloud-deploy-edge",
        title: "Deploy moderno: Vercel, Cloudflare, Edge functions",
        subtitle:
            "Da localhost a produzione mondiale in 5 minuti. Static, ISR, SSR, edge computing — quale per cosa.",
        description:
            "Il 'mettere online un sito' è cambiato radicalmente. Imparerai la mappa moderna del deploy: Vercel (l'home di Next.js: zero-config, preview per ogni PR, auto-rollback), Cloudflare Pages + Workers (edge globale, gratis fino a 100k req/giorno, KV/D1 inclusi), Netlify, e quando ha senso un VPS classico (Hetzner, DigitalOcean). Capirai le strategie di rendering: static (massimo veloce ma non dinamico), ISR (revalidate ogni N min), SSR per dati real-time, RSC streaming. Bonus: edge functions con Cloudflare Workers per esperienze < 50ms ovunque nel mondo. Setup CI/CD con GitHub → deploy automatico.",
        level: "intermedio",
        subjects: ["fullstack"],
        durationMin: 70,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },

    // ─── Python: porta a tutto AI/ML/data
    {
        slug: "python-da-zero",
        title: "Python da zero per chi viene da JavaScript",
        subtitle:
            "Sintassi essenziale, list comprehension, decorators. La porta verso AI/ML, data, scripting, automazione.",
        description:
            "Python è ufficialmente il linguaggio #1 al mondo (GitHub Octoverse 2025) e domina AI, data science, automazione. Se vieni da JavaScript la curva è bassa: imparerai le 5 differenze chiave (indentation, snake_case, list comprehension, decorators, type hints), come strutturare un progetto Python (venv, pyproject.toml, pyenv per multi-versioni), le librerie standard più utili (requests, pathlib, json, csv, argparse), e ti porto su una mini-pipeline di scraping + analysis. Da qui il cammino è aperto: pandas/numpy per data, FastAPI per API, PyTorch per ML, LangChain per AI agent.",
        level: "base",
        subjects: ["backend", "ai-tools"],
        durationMin: 80,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },

    // ─── React Native + Expo: top mobile skill 2026
    {
        slug: "react-native-mobile",
        title: "App mobile vere con React Native + Expo",
        subtitle:
            "Una codebase, due piattaforme (iOS + Android). Da web a mobile in 1 corso, store-ready in 1 settimana.",
        description:
            "Il 80% del tuo codice React funziona su React Native — sfrutti quello che già sai per fare app mobile native. Imparerai: setup Expo (l'ambiente moderno, niente più Xcode/Android Studio per cose base), navigazione con expo-router (file-based come Next.js), componenti core (View invece di div, Text invece di p), styling con Tailwind via NativeWind, gestione stato (Zustand pattern), accesso a sensori (camera, GPS, contacts), build e pubblicazione su App Store + Google Play con EAS Build (cloud, no Mac richiesto per Android). Esercizio finale: app fitness/contatore funzionante su entrambi gli store.",
        level: "avanzato",
        subjects: ["react", "fullstack"],
        durationMin: 100,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },
];

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

export function getCourseBySlug(slug: string): PlayCourse | undefined {
    return playCourses.find((c) => c.slug === slug);
}

export function getLessonByOrder(
    courseSlug: string,
    order: number,
): Lesson | undefined {
    const course = getCourseBySlug(courseSlug);
    return course?.lessons.find((l) => l.order === order);
}

export function getModuleForLesson(
    courseSlug: string,
    order: number,
): Module | undefined {
    const course = getCourseBySlug(courseSlug);
    if (!course) return undefined;
    const idx = Math.floor((order - 1) / 4);
    return course.modules[idx] ?? course.modules[course.modules.length - 1];
}

export function lessonsByModule(
    courseSlug: string,
    moduleOrder: number,
): Lesson[] {
    const course = getCourseBySlug(courseSlug);
    if (!course) return [];
    return course.lessons.filter(
        (l) => getModuleForLesson(courseSlug, l.order)?.order === moduleOrder,
    );
}

/** Filtra corsi per materia. Un corso può apparire in più materie. */
export function getCoursesBySubject(subject: PlaySubject): PlayCourse[] {
    return playCourses.filter((c) => c.subjects.includes(subject));
}

/**
 * Filtra corsi per area macro. Un corso appare in un'area se almeno
 * uno dei suoi `subjects` appartiene all'area. I corsi multi-materia
 * (es. "RAG" è ai-tools+backend) appaiono in entrambe le aree.
 */
export function getCoursesByArea(area: PlayArea): PlayCourse[] {
    const areaSubjects = new Set<PlaySubject>(AREA_SUBJECTS[area]);
    return playCourses.filter((c) =>
        c.subjects.some((s) => areaSubjects.has(s)),
    );
}

/** Tutte le materie con almeno un corso (live o soon). */
export function getAllSubjects(): PlaySubject[] {
    const set = new Set<PlaySubject>();
    for (const c of playCourses) {
        for (const s of c.subjects) set.add(s);
    }
    return Array.from(set);
}

export const liveCourses = playCourses.filter((c) => c.status === "live");
export const upcomingCourses = playCourses.filter((c) => c.status === "soon");
