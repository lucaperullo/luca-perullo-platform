/**
 * Aggregatore curriculum /play.
 *
 * 27 corsi totali distribuiti su 7 materie e 4 livelli.
 * AI a 360° è la materia più estesa con 12 corsi (dal primo prompt
 * agli agenti con MCP).
 *
 * I corsi "live" hanno contenuto completo (lezioni cumulative).
 * I corsi "soon" hanno solo metadati ricchi: titolo, descrizione,
 * subjects, level. Saranno sbloccati uno alla volta nei prossimi turn.
 */
import type { Lesson, Module, PlayCourse, PlaySubject } from "./types";
import { playCourse as primoSitoCourse } from "@/data/play-courses";
import { portfolioPersonaleCourse } from "./courses/portfolio-personale";

// ─────────────────────────────────────────────────────────────────────────
// Curriculum completo — 17 corsi
// ─────────────────────────────────────────────────────────────────────────

export const playCourses: PlayCourse[] = [
    primoSitoCourse,
    portfolioPersonaleCourse,

    // ─── HTML & Markup
    {
        slug: "html-semantico",
        title: "HTML semantico (e accessibile)",
        subtitle:
            "Tag che parlano: header, nav, article, aside, role, aria. Il sito che Google ama e lo screen reader capisce.",
        description:
            "Il 90% dei siti usa <div> ovunque. Il 10% che spicca usa il tag giusto al posto giusto. Imparerai gerarchia di heading, landmark roles, attributi aria, ed errori comuni di accessibilità che escludono il 15% degli utenti dal tuo sito senza che te ne accorga.",
        level: "base",
        subjects: ["html"],
        durationMin: 35,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },
    {
        slug: "forms-html5",
        title: "Forms HTML5 evoluti",
        subtitle:
            "Form che catturano lead davvero: validazione native, multi-step, accessibilità, anti-spam.",
        description:
            "Un form di contatto è il punto in cui un visitatore diventa lead. Imparerai a costruirne uno che funziona: validazione client-side senza JavaScript, errori chiari, campi condizionali, integrazione con servizi email tipo Resend, anti-spam con honeypot.",
        level: "intermedio",
        subjects: ["html", "javascript"],
        durationMin: 45,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },

    // ─── CSS & Design
    {
        slug: "tipografia-design",
        title: "Tipografia che parla",
        subtitle:
            "Coppie di font, scale tipografiche, leading, letter-spacing. Trasforma testo in design.",
        description:
            "Il 70% del web è tipografia. Imparerai a scegliere font che si parlano (display + body), a costruire una scala tipografica modulare, a giocare con leading e letter-spacing per creare gerarchia. Bonus: variable fonts e font-display per performance.",
        level: "intermedio",
        subjects: ["css"],
        durationMin: 40,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },
    {
        slug: "layout-moderno",
        title: "Layout moderno: Grid + Container Queries",
        subtitle:
            "Oltre le media query: subgrid, container queries, intrinsic web design.",
        description:
            "Le media query (max-width: 768px) sono il passato. Il presente è il container query: 'questo componente si adatta in base alla SUA larghezza, non a quella del viewport'. Imparerai subgrid, container queries, has(), e i nuovi pattern che permettono layout responsive senza media query.",
        level: "avanzato",
        subjects: ["css"],
        durationMin: 55,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },
    {
        slug: "animazioni-avanzate",
        title: "Animazioni che fanno girare la testa",
        subtitle:
            "View Transitions API, scroll-driven animations, keyframes orchestrati.",
        description:
            "Le animazioni che vedi sui siti Apple/Linear sono fatte con queste tecniche. View Transitions API per transizioni di stato pulite, animation-timeline per scroll-driven, custom cursor, hover-lift orchestrati. Niente librerie esterne (Framer Motion non serve), solo CSS e qualche riga di JS.",
        level: "avanzato",
        subjects: ["css", "javascript"],
        durationMin: 50,
        status: "soon",
        initialCode: "",
        finalCode: "",
        modules: [],
        lessons: [],
    },

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
