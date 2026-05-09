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
