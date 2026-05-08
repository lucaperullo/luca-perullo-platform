import type { ComponentType, SVGProps } from "react";
import { Calculator, Component, BookOpen, Wand2, Layers } from "lucide-react";
import type { ReleaseStatus } from "@/lib/release-status";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export type ToolStatus = ReleaseStatus;

export type Tool = {
    slug: string;
    name: string;
    summary: string;
    /** Longer one-liner used in featured / pinned cards. Falls back to summary. */
    tagline?: string;
    icon: IconType;
    href: string;
    status: ToolStatus;
    /** What the user gives the tool. */
    input?: string;
    /** What the user gets back. */
    output?: string;
    /** Realistic time to complete a single use. */
    time?: string;
    /** Tentative ETA, used for `soon` / `wip`. */
    eta?: string;
    /** Optional short tags shown as mono chips. */
    tags?: string[];
    /** Override CTA label. Defaults to "Apri" / "Anteprima" / "Notificami". */
    ctaLabel?: string;
};

export const tools: Tool[] = [
    {
        slug: "preventivo",
        name: "Preventivo gratuito",
        summary:
            "Stima trasparente per il tuo progetto in 60 secondi. Niente account, niente email obbligatoria.",
        tagline:
            "Rispondi a 6 domande e ottieni un range di costo realistico per il tuo progetto digitale, calcolato sulla base di lavori reali — non su template generici.",
        icon: Calculator,
        href: "/tools/preventivo",
        status: "live",
        input: "Tipo di progetto, scope, vincoli",
        output: "Range di costo + breakdown",
        time: "≈ 60 secondi",
        tags: ["Costing", "Discovery", "No-signup"],
        ctaLabel: "Apri il calcolatore",
    },
    {
        slug: "components",
        name: "Components library",
        summary:
            "Copia-incolla i componenti React/Tailwind che uso ogni giorno nei progetti reali.",
        tagline:
            "Una libreria viva di componenti React + Tailwind testati in produzione. Ogni blocco ha codice, anteprima, e note sul perché è fatto così.",
        icon: Component,
        href: "/components",
        status: "wip",
        input: "—",
        output: "Snippet React + Tailwind",
        time: "Self-serve",
        eta: "Q3 2026",
        tags: ["UI", "React", "Tailwind"],
        ctaLabel: "Anteprima",
    },
    {
        slug: "stack-pick",
        name: "Stack picker",
        summary:
            "Rispondi a 4 domande, ti dico quale stack scegliere per il tuo prodotto.",
        tagline:
            "Un decision-tree onesto: dai vincoli reali (team, budget, time-to-market), ti restituisco lo stack consigliato e perché — non quello che fa figo su Twitter.",
        icon: Wand2,
        href: "/tools",
        status: "soon",
        input: "Team, budget, deadline",
        output: "Stack consigliato + motivazioni",
        time: "≈ 2 minuti",
        eta: "Q4 2026",
        tags: ["Decisioni", "Architettura"],
        ctaLabel: "Notificami",
    },
    {
        slug: "imperative-code",
        name: "Imperative-Code Audit",
        summary:
            "Skill per Claude Code che trova lo slop accumulato tra sessioni AI e ti dice come consolidarlo. Una dichiarazione, ovunque.",
        tagline:
            "Se il tuo progetto è cresciuto su tante sessioni AI, ogni sessione ha re-inventato gli stessi nomi: una lista di prodotti in italiano qui, la stessa in inglese lì, tre type per lo stesso concetto, un magic string ripetuto cinque volte. Questa skill audita il codebase, raggruppa lo slop in cluster, e propone una sola dichiarazione canonica per concetto. Testata su questo stesso portfolio (133 file, 5 mesi di edits cross-session): 8 cluster trovati, 3 consolidati, type-check e lint verdi.",
        icon: Layers,
        href: "/blog/imperative-code-skill",
        status: "live",
        input: "Codebase (TS/JS/Python, Next.js…)",
        output: "Audit report + plan di consolidamento",
        time: "≈ 7 min su 130 file",
        tags: ["Claude Code", "Refactoring", "AI-slop"],
        ctaLabel: "Leggi il caso",
    },
    {
        slug: "guides",
        name: "Guide & checklist",
        summary:
            "Mini-guide pratiche per chi vuole lanciare un prodotto digitale senza perdersi.",
        tagline:
            "Checklist asciutte e mini-guide su come strutturare un progetto, validare un&apos;idea, e portarla online senza perdere mesi in dettagli che non spostano il risultato.",
        icon: BookOpen,
        href: "/blog",
        status: "wip",
        input: "—",
        output: "Markdown leggibile in 5 minuti",
        time: "Self-serve",
        eta: "Pubblicate man mano",
        tags: ["Formazione", "Lean"],
        ctaLabel: "Leggi le note",
    },
];

export const STATUS_META: Record<
    ToolStatus,
    { label: string; tone: "live" | "wip" | "soon"; group: string; groupHint: string }
> = {
    live: {
        label: "Live",
        tone: "live",
        group: "Pinned",
        groupHint: "Pronto da usare, oggi.",
    },
    wip: {
        label: "In sviluppo",
        tone: "wip",
        group: "In sviluppo",
        groupHint: "Ci sto lavorando — anteprima e fix iterativi.",
    },
    soon: {
        label: "In arrivo",
        tone: "soon",
        group: "In arrivo",
        groupHint: "Pianificato. Lascia che ti avvisi io quando esce.",
    },
};
