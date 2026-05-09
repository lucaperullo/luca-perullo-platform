/**
 * Catalogo servizi ready-to-buy.
 *
 * Ogni voce = un prodotto Stripe con prezzo fisso. La pagina /servizi
 * lista tutto, /servizi/[slug] mostra il dettaglio, /api/checkout crea
 * la sessione Stripe.
 *
 * IMPORTANTE: i campi `stripePriceId` sono placeholder. Da sostituire con
 * i veri Price ID dopo aver creato i prodotti nella Dashboard Stripe.
 * Convenzione: usa `price_...` di test in dev, `price_...` di live in prod.
 */

import {
    Bot,
    Code2,
    Globe,
    LineChart,
    type LucideIcon,
    MessageSquare,
    PhoneCall,
    Rocket,
    Search,
    ShoppingBag,
    Sparkles,
    Workflow,
    Zap,
} from "lucide-react";

export type ServiceFamily = "siti" | "ai" | "automazioni" | "consulenze";

export type Service = {
    slug: string;
    family: ServiceFamily;
    name: string;
    /** Una riga, max 80 caratteri. Mostrato sotto il nome. */
    tagline: string;
    /** Paragrafo lungo, mostrato nella pagina di dettaglio. */
    description: string;
    /** Prezzo in euro, IVA esclusa. Numero intero. 0 = gratuito (call scoping). */
    priceEur: number;
    /** Stripe Price ID — DA INSERIRE dopo aver creato il prodotto su Stripe. */
    stripePriceId?: string;
    /** Timeline di consegna pubblica. */
    timeline: string;
    /** Cosa è incluso. 4–6 voci. */
    includes: string[];
    /** Cosa NON è incluso. Trasparenza > sorprese. */
    excludes: string[];
    /** Per chi è ideale (1 frase). */
    idealFor: string;
    /** Icona lucide-react. */
    icon: LucideIcon;
    /** Disponibilità — "live" è il default, "soon" mostra badge "Presto". */
    status?: "live" | "soon";
    /** Se true, NON crea checkout Stripe, ma rimanda a Cal.com/contatto. */
    bookOnly?: boolean;
    /** Override esplicito del CTA quando bookOnly = true (raro: di norma usa `cal`). */
    bookHref?: string;
    /**
     * Quando presente, abilita il flusso Cal.com: la pagina dettaglio mostra i
     * prossimi slot disponibili e l'embed inline invece del bottone neutro.
     */
    cal?: {
        /** Slug dell'event type su Cal.com (es. "15min", "audit-1h"). */
        eventSlug: string;
    };
};

/**
 * Username Cal.com pubblico, esposto al client via NEXT_PUBLIC_*.
 * Default `lucaperullo` se la var non è settata, così il sito non si rompe
 * in build environment senza env.
 */
export const CAL_USERNAME =
    process.env.NEXT_PUBLIC_CAL_USERNAME ?? "lucaperullo";

/** Compone il link pubblico di booking Cal.com per un dato eventSlug. */
export const calBookHref = (eventSlug: string) =>
    `https://cal.com/${CAL_USERNAME}/${eventSlug}`;

/**
 * Restituisce il bookHref effettivo del servizio, in ordine di priorità:
 * 1. service.bookHref esplicito (override)
 * 2. composizione da service.cal.eventSlug
 * 3. undefined (servizio non bookable)
 */
export const getBookHref = (service: Service): string | undefined => {
    if (service.bookHref) return service.bookHref;
    if (service.cal) return calBookHref(service.cal.eventSlug);
    return undefined;
};

// Helper per cifre formattate.
export const formatEur = (n: number) =>
    n === 0
        ? "Gratuito"
        : new Intl.NumberFormat("it-IT", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
          }).format(n);

export const FAMILIES: Record<
    ServiceFamily,
    { label: string; kicker: string; description: string; icon: LucideIcon }
> = {
    siti: {
        label: "Siti web",
        kicker: "A pacchetto fisso",
        description:
            "Prezzo dichiarato, timeline garantita, deliverable chiari. Niente preventivi infiniti.",
        icon: Globe,
    },
    ai: {
        label: "AI & Claude bot",
        kicker: "Setup chiavi in mano",
        description:
            "Assistenti AI che rispondono ai tuoi clienti, leggono i tuoi documenti, smistano le tue email.",
        icon: Sparkles,
    },
    automazioni: {
        label: "Automazioni",
        kicker: "n8n / Make / Zapier",
        description:
            "Flussi che fanno girare la tua attività mentre dormi. Dal lead al CRM, dalla fattura alla contabilità.",
        icon: Workflow,
    },
    consulenze: {
        label: "Consulenze",
        kicker: "A ore, slot prenotabili",
        description:
            "Audit, code review, strategia AI. Una sessione, un report scritto, decisioni concrete.",
        icon: PhoneCall,
    },
};

export const services: Service[] = [
    // ───────── Famiglia A — SITI WEB
    {
        slug: "landing-essenziale",
        family: "siti",
        name: "Landing Page Essenziale",
        tagline: "Una pagina pensata per convertire. Online in una settimana.",
        description:
            "Una landing page mono-scopo (lancio prodotto, evento, lead-gen). Design custom, copy guidato, integrazione form e analytics. Il pacchetto più rapido del catalogo: dal brief al live in 7 giorni lavorativi.",
        priceEur: 790,
        timeline: "7 giorni lavorativi",
        includes: [
            "1 landing page custom (no template)",
            "Copy guidato — ti aiuto a scriverlo",
            "Integrazione form → email + Google Sheet",
            "Hosting Vercel primo anno + dominio",
            "Analytics privacy-first (Plausible)",
            "2 round di revisione",
        ],
        excludes: [
            "Animazioni custom complesse",
            "Multilingua (vedi pacchetto Sito Vetrina PRO)",
            "Integrazioni CRM custom (vedi Automazioni)",
        ],
        idealFor: "Startup al primo lancio, eventi, campagne ads.",
        icon: Rocket,
    },
    {
        slug: "sito-vetrina",
        family: "siti",
        name: "Sito Vetrina",
        tagline: "Il sito che la tua attività si merita. Pronto in 14 giorni.",
        description:
            "Sito multi-pagina (5 pagine: home, servizi, chi siamo, contatti, blog opzionale). Per ristoranti, studi professionali, artigiani, palestre, B&B. Mobile-first, SEO base inclusa, foglio Google Business Profile incluso.",
        priceEur: 1490,
        timeline: "14 giorni lavorativi",
        includes: [
            "5 pagine custom",
            "Mobile-first + Core Web Vitals 90+",
            "SEO base (meta tag, sitemap, schema)",
            "Setup Google Business Profile",
            "Hosting Vercel primo anno + dominio",
            "3 round di revisione",
            "Dashboard cliente per vedere lo stato",
        ],
        excludes: [
            "E-commerce (vedi E-commerce Starter)",
            "Multilingua avanzato",
            "AI chatbot (vedi famiglia AI)",
        ],
        idealFor: "Ristoranti, studi, parrucchieri, palestre, B&B, artigiani.",
        icon: Globe,
    },
    {
        slug: "sito-vetrina-pro",
        family: "siti",
        name: "Sito Vetrina PRO",
        tagline: "Brand site curato, blog SEO, animazioni. Per chi vuole distinguersi.",
        description:
            "Versione premium del Sito Vetrina. Fino a 10 pagine, blog editoriale con CMS, animazioni custom, possibile multilingua (IT + 1 lingua), integrazione newsletter. Pensato per brand che usano il sito come asset di vendita.",
        priceEur: 2490,
        timeline: "21 giorni lavorativi",
        includes: [
            "Fino a 10 pagine + blog CMS",
            "Animazioni custom in CSS-first",
            "Multilingua IT + 1 lingua",
            "Newsletter (Mailchimp/Brevo)",
            "SEO tecnico avanzato + 5 articoli iniziali",
            "Hosting Vercel primo anno + dominio",
            "Dashboard cliente",
        ],
        excludes: [
            "E-commerce",
            "App con login utente",
            "Integrazioni custom oltre 1 (incluse di base)",
        ],
        idealFor: "Brand emergenti, studi associati, professionisti che fanno content.",
        icon: Sparkles,
    },
    {
        slug: "ecommerce-starter",
        family: "siti",
        name: "E-commerce Starter",
        tagline: "Shop online completo fino a 100 prodotti. Pagamenti, spedizioni, fatture.",
        description:
            "E-commerce custom su Next.js + Stripe (o Shopify headless se preferito). Catalogo, checkout, gestione ordini, integrazione corrieri, fatturazione elettronica italiana. Il pacchetto più completo per chi vende online.",
        priceEur: 3490,
        timeline: "30 giorni lavorativi",
        includes: [
            "Catalogo fino a 100 prodotti",
            "Checkout Stripe + carte/SEPA",
            "Gestione ordini + email automatiche",
            "Integrazione corriere (BRT/SDA/Poste)",
            "Fatturazione elettronica (Fatture in Cloud)",
            "Hosting + dominio primo anno",
            "Training 1h sull'uso del backend",
        ],
        excludes: [
            "Marketplace multi-vendor",
            "B2B con prezzi personalizzati per cliente",
            "App mobile nativa",
        ],
        idealFor: "Negozi fisici che vogliono vendere anche online, brand DTC piccoli.",
        icon: ShoppingBag,
    },

    // ───────── Famiglia B — AI / CLAUDE BOT
    {
        slug: "ai-chat-base",
        family: "ai",
        name: "AI Chat sul tuo sito",
        tagline: "Un assistente AI che risponde alle FAQ dei tuoi clienti, 24/7.",
        description:
            "Bottone chat in basso a destra del tuo sito. Powered by Claude (Anthropic). Risponde alle domande frequenti basandosi su un set di FAQ che mi fornisci. Setup completo, non devi capirne nulla.",
        priceEur: 890,
        timeline: "5 giorni lavorativi",
        includes: [
            "Widget chat custom sul tuo sito",
            "Setup API Claude + prompt engineering",
            "Training su 50 FAQ tue",
            "Escalation a umano (form/WhatsApp)",
            "Fino a 50.000 messaggi/mese inclusi",
            "1 mese di monitoraggio dopo il go-live",
        ],
        excludes: [
            "Lettura di documenti complessi (vedi AI Chat con base di conoscenza)",
            "Integrazione con CRM (vedi Automazioni)",
            "Voce / parlato",
        ],
        idealFor: "Siti con molte richieste ripetitive: studi, e-commerce, hospitality.",
        icon: MessageSquare,
    },
    {
        slug: "ai-chat-rag",
        family: "ai",
        name: "AI Chat con base di conoscenza",
        tagline: "Il bot legge i tuoi PDF, manuali, sito — e risponde citando le fonti.",
        description:
            "Versione avanzata del chat AI. Implementa RAG (Retrieval Augmented Generation): caricami i tuoi documenti (PDF, sito, Notion, Google Drive), il bot li indicizza e risponde citando il documento da cui ha preso la risposta. Riduce drasticamente le risposte inventate.",
        priceEur: 1890,
        timeline: "10 giorni lavorativi",
        includes: [
            "Indicizzazione fino a 500 documenti/pagine",
            "Vector DB (Supabase pgvector)",
            "Citazione delle fonti in ogni risposta",
            "Aggiornamento incrementale documenti",
            "Dashboard analytics (domande più frequenti)",
            "Fino a 100.000 messaggi/mese",
            "2 mesi di monitoraggio",
        ],
        excludes: [
            "Documenti scansionati (richiedono OCR — addon €290)",
            "Integrazione con CRM (vedi Automazioni)",
        ],
        idealFor: "Studi legali/medici, scuole, software con docs estese.",
        icon: Bot,
    },
    {
        slug: "ai-whatsapp-bot",
        family: "ai",
        name: "Assistente AI su WhatsApp",
        tagline: "Risponde ai clienti su WhatsApp Business mentre fai altro.",
        description:
            "Setup completo di un bot AI sul tuo numero WhatsApp Business. Risponde alle domande standard, prende prenotazioni semplici, escalation a te quando serve un umano. Gli italiani usano WhatsApp più di tutto: questo è il punto in cui ti perdi clienti se non rispondi entro 5 minuti.",
        priceEur: 1490,
        timeline: "7 giorni lavorativi",
        includes: [
            "Setup WhatsApp Business API (Meta)",
            "Bot Claude con regole custom",
            "Prenotazioni base (data, persone, contatto)",
            "Notifica push a te per casi complessi",
            "Fino a 10.000 conversazioni/mese",
            "1 mese di tuning post-launch",
        ],
        excludes: [
            "Numero WhatsApp Business (te lo procuri tu — gratis)",
            "Pagamenti via WhatsApp (richiede addon)",
        ],
        idealFor: "Ristoranti, studi prenotabili, e-commerce con tanto supporto pre-vendita.",
        icon: MessageSquare,
    },
    {
        slug: "ai-email-triage",
        family: "ai",
        name: "Triage email AI",
        tagline: "L'AI legge la tua casella, smista, e ti scrive le bozze di risposta.",
        description:
            "Connetti la tua casella email (Gmail/Outlook). Un agente AI legge le email in arrivo, le categorizza (urgente / cliente / spam / fattura), e ti prepara una bozza di risposta. Tu apri Gmail e devi solo cliccare invia.",
        priceEur: 990,
        timeline: "5 giorni lavorativi",
        includes: [
            "Setup OAuth Gmail/Outlook",
            "Categorie email custom (4–6)",
            "Bozze di risposta pre-compilate",
            "Riassunto giornaliero della casella",
            "Fino a 1.000 email/mese processate",
            "1 mese di tuning del prompt",
        ],
        excludes: [
            "Risposta automatica senza approvazione (per scelta — non si fa)",
            "Casella PEC (formato non standard)",
        ],
        idealFor: "Professionisti tempestati di email, agenti commerciali, founder.",
        icon: Zap,
    },

    // ───────── Famiglia C — AUTOMAZIONI
    {
        slug: "auto-lead-capture",
        family: "automazioni",
        name: "Lead → CRM → Email",
        tagline: "Form sito → CRM → email di benvenuto, automatico.",
        description:
            "Quando un visitatore compila un form sul tuo sito, il flusso parte: salva il lead nel CRM (HubSpot/Pipedrive/Notion), invia un'email di benvenuto personalizzata, ti notifica su Slack o WhatsApp. Niente più lead persi nel dimenticatoio.",
        priceEur: 490,
        timeline: "3 giorni lavorativi",
        includes: [
            "Connessione form sito (qualsiasi)",
            "Setup CRM destinazione",
            "Email di benvenuto custom",
            "Notifica Slack/WhatsApp/Telegram",
            "Documentazione write-up",
        ],
        excludes: [
            "Sviluppo CRM custom (è plug-in di esistenti)",
            "Email marketing complesse (vedi Sito Vetrina PRO)",
        ],
        idealFor: "Chi vuole un funnel ordinato senza copiare lead a mano.",
        icon: Workflow,
    },
    {
        slug: "auto-fattura-ai",
        family: "automazioni",
        name: "OCR fatture → contabilità",
        tagline: "Foto fattura → estrazione dati → registrazione automatica.",
        description:
            "Carichi una fattura (PDF o foto), un agente AI estrae numero, data, importo, partita IVA del fornitore, e li registra nel tuo gestionale (Fatture in Cloud, Aruba, ecc) o in un Google Sheet. Stop a inserire dati a mano.",
        priceEur: 690,
        timeline: "5 giorni lavorativi",
        includes: [
            "OCR + estrazione campi (Claude Vision)",
            "Validazione partita IVA",
            "Push verso gestionale/Sheet",
            "Email mensile di riepilogo",
            "Fino a 200 fatture/mese",
        ],
        excludes: [
            "Fatture in lingue diverse da IT/EN",
            "Integrazione SAP / gestionali enterprise",
        ],
        idealFor: "Piccole imprese senza commercialista interno.",
        icon: LineChart,
    },
    {
        slug: "auto-recensioni",
        family: "automazioni",
        name: "Auto-richiesta recensioni Google",
        tagline: "Cliente paga → 24h dopo → SMS/email per chiedere recensione Google.",
        description:
            "Quando completi una vendita o un servizio, parte un follow-up automatico (SMS o email) che chiede al cliente di lasciare una recensione su Google Business Profile. Il SEO locale vola con le recensioni: questo flusso le moltiplica senza lavoro manuale.",
        priceEur: 390,
        timeline: "2 giorni lavorativi",
        includes: [
            "Trigger personalizzabile (Stripe, gestionale, Sheet)",
            "Template SMS + email",
            "Link diretto a Google Reviews",
            "Cooldown anti-spam (1 richiesta per cliente/anno)",
        ],
        excludes: [
            "Costo SMS (passa per il tuo provider — Twilio €0.05/SMS)",
        ],
        idealFor: "Ristoranti, studi, B&B, artigiani che vivono di SEO locale.",
        icon: Search,
    },
    {
        slug: "auto-bundle",
        family: "automazioni",
        name: "Bundle 3 automazioni",
        tagline: "Scegli 3 automazioni qualsiasi, risparmi €270.",
        description:
            "Sconto bundle: prendi 3 automazioni dal catalogo (Lead capture + Fattura AI + Recensioni Google, o qualsiasi combinazione) a prezzo ridotto. Setup in parallelo, documentazione unica.",
        priceEur: 1290,
        timeline: "7 giorni lavorativi",
        includes: [
            "3 automazioni a scelta dal catalogo",
            "Setup in parallelo",
            "Documentazione unica",
            "1 mese di monitoraggio + tuning",
        ],
        excludes: [],
        idealFor: "Chi vuole digitalizzare i flussi dell'attività in un colpo solo.",
        icon: Workflow,
    },

    // ───────── Famiglia D — CONSULENZE
    {
        slug: "call-strategia-15",
        family: "consulenze",
        name: "Call gratuita di scoping",
        tagline: "15 minuti per capire se posso aiutarti. Zero impegno, zero costo.",
        description:
            "Una video-call di 15 minuti per parlare del tuo progetto. Capiamo insieme se c'è fit. Se sì, ti mando una proposta concreta entro 48h. Se no, ti dico chi potrebbe essere il professionista giusto. È gratis perché aiuta entrambi a non perdere tempo.",
        priceEur: 0,
        timeline: "Slot prenotabili sul calendario",
        includes: [
            "15 minuti di video-call",
            "Inquadramento del progetto",
            "Indicazione di pacchetto adatto (se c'è)",
            "Proposta scritta entro 48h",
        ],
        excludes: [
            "Consulenza vera e propria (vedi Audit 1h)",
            "Codice / soluzione operativa",
        ],
        idealFor: "Chi non sa ancora bene cosa gli serve.",
        icon: PhoneCall,
        bookOnly: true,
        cal: { eventSlug: "15min" },
    },
    {
        slug: "call-audit-1h",
        family: "consulenze",
        name: "Audit conversione del tuo sito",
        tagline: "1 ora insieme + report scritto con 10 fix concreti per convertire di più.",
        description:
            "Esamino il tuo sito attuale: home, pagine prodotto, funnel, mobile, performance, SEO base. Una call di 1 ora insieme, poi ti mando un report scritto con i 10 fix prioritari (ordinati per ROI). Puoi implementarli da solo, o farti fare un preventivo per i lavori.",
        priceEur: 149,
        timeline: "Call entro 5 giorni dalla prenotazione",
        includes: [
            "Audit pre-call del tuo sito",
            "Call 1 ora con screen-share",
            "Report scritto: 10 fix prioritari",
            "Stima d'impatto (% di conversione attesa)",
            "1 follow-up email entro 30 giorni",
        ],
        excludes: [
            "Implementazione dei fix (preventivabili separatamente)",
        ],
        idealFor: "Chi ha un sito che non converte e vuole capire perché.",
        icon: LineChart,
    },
    {
        slug: "call-strategia-3h",
        family: "consulenze",
        name: "Strategia AI per la tua azienda",
        tagline: "3 ore per disegnare la roadmap AI della tua impresa, fattibile in 90 giorni.",
        description:
            "Sessione strategica di 3 ore (può essere divisa in 2 incontri). Mappiamo i processi della tua azienda, identifichiamo i 5 punti dove l'AI ti farebbe risparmiare più ore, e disegniamo una roadmap di implementazione realistica. Output: documento di 8–12 pagine con priorità, costi stimati, ordine di esecuzione.",
        priceEur: 390,
        timeline: "Sessione entro 10 giorni",
        includes: [
            "3 ore di lavoro insieme",
            "Mappatura processi attuali",
            "Identificazione 5 quick wins AI",
            "Roadmap 90 giorni scritta",
            "Stima budget per ogni intervento",
        ],
        excludes: [
            "Implementazione (preventivabile separatamente)",
        ],
        idealFor: "Founder, direttori operativi, professionisti curiosi sull'AI.",
        icon: Sparkles,
    },
    {
        slug: "code-review",
        family: "consulenze",
        name: "Code review tecnica",
        tagline: "1.5 ore con uno sviluppatore senior che legge il tuo codice e dice cosa cambiare.",
        description:
            "Mi mandi il repo (GitHub/GitLab). Lo leggo per 1 ora prima della call. Ci vediamo per 1.5 ore, ti mostro i punti deboli e ti spiego come risolverli. Output: write-up tecnico con commenti puntuali sul repo (commit / PR su una branch).",
        priceEur: 290,
        timeline: "Call entro 7 giorni",
        includes: [
            "Lettura asincrona repo (1 ora)",
            "Call 1.5 ore con screen-share",
            "Write-up tecnico in PR su branch dedicata",
            "Suggerimenti per architettura, security, performance",
        ],
        excludes: [
            "Implementazione fix (a parte)",
            "Repo > 50.000 righe (richiede pacchetto custom)",
        ],
        idealFor: "Team che hanno ereditato codice o vogliono un parere indipendente.",
        icon: Code2,
    },
];

export const getServiceBySlug = (slug: string): Service | undefined =>
    services.find((s) => s.slug === slug);

export const getServicesByFamily = (family: ServiceFamily): Service[] =>
    services.filter((s) => s.family === family);
