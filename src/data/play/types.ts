/**
 * Tipi condivisi tra tutti i corsi /play.
 *
 * Ogni corso vive in un file separato sotto courses/ ed esporta un
 * `PlayCourse` immutabile con tutto il suo contenuto.
 */

export type AvatarMood =
    | "idle"
    | "talking"
    | "thinking"
    | "happy"
    | "encouraging";

export type PlayCourseLevel = "base" | "intermedio" | "avanzato" | "pro";

export type PlayCourseStatus = "live" | "soon";

/**
 * Materie (subjects). Un corso può appartenere a più materie — es. il
 * corso "Il tuo primo sito" copre sia HTML che CSS.
 */
export type PlaySubject =
    | "html"
    | "css"
    | "javascript"
    | "react"
    | "backend"
    | "fullstack"
    | "ai-tools";

/**
 * Macro-aree del curriculum. Raggruppano le 7 materie tradizionali in 4
 * categorie più digeribili a colpo d'occhio sul catalogo. La materia
 * "html" non sparisce — resta come tag tecnico fine, ma sulla landing
 * il visitatore vede 4 cards grandi (Frontend / Backend / Full-stack /
 * AI) invece di 7 piccole.
 */
export type PlayArea = "frontend" | "backend" | "fullstack" | "ai";

/**
 * Materia → area. Una materia appartiene a UNA sola area (la sua casa
 * naturale). I corsi multi-materia (es. "Web Vitals" è css+fullstack)
 * vengono mostrati in tutte le aree pertinenti tramite le pagine
 * `/play/area/[area]` che filtrano per intersezione subjects.
 */
export const SUBJECT_TO_AREA: Record<PlaySubject, PlayArea> = {
    html: "frontend",
    css: "frontend",
    javascript: "frontend",
    react: "frontend",
    backend: "backend",
    fullstack: "fullstack",
    "ai-tools": "ai",
};

/**
 * Subjects che compongono ogni area. Inverso di SUBJECT_TO_AREA + i
 * subjects "secondari" che vogliamo includere quando filtriamo per area
 * (es. AI include anche corsi marcati come "fullstack" ma con
 * "ai-tools" tra i subjects — tipo Claude integration o RAG).
 */
export const AREA_SUBJECTS: Record<PlayArea, PlaySubject[]> = {
    frontend: ["html", "css", "javascript", "react"],
    backend: ["backend"],
    fullstack: ["fullstack"],
    ai: ["ai-tools"],
};

export const AREA_META: Record<
    PlayArea,
    {
        label: string;
        tagline: string;
        description: string;
        /** Token CSS gradient per il bg della card. */
        gradient: string;
        /** Colore accento dominante (testo, bordi). */
        accent: string;
        /** Colore complementare. */
        accentSoft: string;
    }
> = {
    frontend: {
        label: "Sviluppo frontend",
        tagline: "Tutto quello che il browser disegna.",
        description:
            "HTML, CSS, JavaScript, React: le 4 materie che trasformano un'idea in un sito che la gente vede e usa. Dalle ossa semantiche alla logica reattiva.",
        gradient:
            "linear-gradient(135deg, #fef3c7 0%, #fed7aa 35%, #fdba74 70%, #f97316 100%)",
        accent: "#ea580c",
        accentSoft: "#fed7aa",
    },
    backend: {
        label: "Sviluppo backend",
        tagline: "Dati veri, utenti veri, sicurezza vera.",
        description:
            "Database Postgres, autenticazione passwordless, Row Level Security, API. Il livello che fa la differenza tra un sito vetrina e un'app dove gli utenti possono salvare cose.",
        gradient:
            "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 30%, #60a5fa 70%, #1e40af 100%)",
        accent: "#1e40af",
        accentSoft: "#bfdbfe",
    },
    fullstack: {
        label: "Full-stack",
        tagline: "Frontend + backend + deploy in un solo flusso.",
        description:
            "Next.js dall'inizio alla fine: Server Components, file-system routing, deploy edge. Più SaaS in 2 ore che mette tutto insieme con Stripe.",
        gradient:
            "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 35%, #a78bfa 70%, #6d28d9 100%)",
        accent: "#6d28d9",
        accentSoft: "#ddd6fe",
    },
    ai: {
        label: "AI & Automazioni",
        tagline: "Da ChatGPT al tuo MCP server.",
        description:
            "12 corsi AI a 360°: prompt engineering, immagini, video, voce, vibe coding, n8n automazioni, agenti autonomi, MCP. Quasi tutto gratis, niente carta richiesta.",
        gradient:
            "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 30%, #34d399 70%, #047857 100%)",
        accent: "#047857",
        accentSoft: "#a7f3d0",
    },
};

export const SUBJECT_META: Record<
    PlaySubject,
    { label: string; description: string; emoji: string }
> = {
    html: {
        label: "HTML & Markup",
        description:
            "Le ossa del web. Tag semantici, accessibilità, struttura.",
        emoji: "🦴",
    },
    css: {
        label: "CSS & Design",
        description:
            "I vestiti del web. Layout, tipografia, animazioni, design moderno.",
        emoji: "🎨",
    },
    javascript: {
        label: "JavaScript",
        description:
            "La logica. Il sito diventa vivo: eventi, dati, interattività.",
        emoji: "⚡",
    },
    react: {
        label: "React & Components",
        description:
            "Costruisci interfacce con componenti riusabili. Lo standard del web moderno.",
        emoji: "⚛️",
    },
    backend: {
        label: "Backend & Database",
        description:
            "Salva dati reali, autentica utenti, costruisci API. Postgres + Supabase.",
        emoji: "🗄️",
    },
    fullstack: {
        label: "Full-stack",
        description:
            "Il pacchetto completo: frontend, backend, deploy. Next.js dall'inizio alla fine.",
        emoji: "🚀",
    },
    "ai-tools": {
        label: "AI a 360°",
        description:
            "Dalle prime conversazioni con ChatGPT al tuo MCP server. 12 corsi: prompt engineering, immagini, video, vibe coding, agenti. Tutto gratis o quasi.",
        emoji: "🤖",
    },
};

export type ValidationRule =
    | {
          type: "querySelector";
          selector: string;
          textContent?: string;
          existsOnly?: boolean;
          message: string;
      }
    | {
          type: "computedStyle";
          selector: string;
          property: string;
          value: string;
          message: string;
      }
    | {
          type: "textIncludes";
          needle: string;
          flexible?: boolean;
          message: string;
      }
    | {
          type: "all";
          rules: ValidationRule[];
          message: string;
      };

export type Lesson = {
    order: number;
    slug: string;
    title: string;
    durationSec: number;
    script: string;
    avatarMood: AvatarMood;
    audioPath?: string;
    instruction: string;
    hint: string;
    expectedSnapshot: string;
    validate: ValidationRule;
    successScript: string;
    encourageScript: string;
};

export type Module = {
    order: number;
    slug: string;
    title: string;
    summary: string;
};

export type PlayCourse = {
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    level: PlayCourseLevel;
    /** Materie a cui appartiene il corso. Un corso può coprire più materie. */
    subjects: PlaySubject[];
    /** Durata stimata del corso in minuti. */
    durationMin: number;
    /** Stato di pubblicazione. "soon" mostra una card disabilitata nel catalogo. */
    status: PlayCourseStatus;
    /** Codice di partenza della prima lezione. */
    initialCode: string;
    /** Codice finale (= expectedSnapshot dell'ultima lezione). */
    finalCode: string;
    modules: Module[];
    lessons: Lesson[];
};
