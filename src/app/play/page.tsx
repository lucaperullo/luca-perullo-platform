import type { Metadata } from "next";
import Link from "next/link";
import {
    ArrowRight,
    Code2,
    GraduationCap,
    Sparkles,
} from "lucide-react";
import { SectionLabel } from "@/components/section-label";
import { SectionRule } from "@/components/section-rule";
import { SideLines } from "@/components/side-lines";
import {
    getAllSubjects,
    getCoursesBySubject,
    liveCourses,
    playCourses,
    upcomingCourses,
} from "@/data/play";
import {
    SUBJECT_META,
    type PlayCourse,
    type PlayCourseLevel,
    type PlaySubject,
} from "@/data/play/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Play · Corsi interattivi · Luca Perullo",
    description:
        "Curriculum completo: 7 materie, 4 livelli, 36 corsi. Dalle prime righe di HTML agli agenti AI con MCP, passando per TypeScript, Tailwind, Accessibility, Testing, Performance, Cybersecurity, Mobile.",
    alternates: { canonical: "/play" },
};

const SUBJECT_ORDER: PlaySubject[] = [
    "html",
    "css",
    "javascript",
    "react",
    "backend",
    "fullstack",
    "ai-tools",
];

const LEVELS: PlayCourseLevel[] = ["base", "intermedio", "avanzato", "pro"];

const LEVEL_META: Record<
    PlayCourseLevel,
    { label: string; tagline: string; chip: string }
> = {
    base: {
        label: "Base",
        tagline: "Per chi parte da zero. Niente prerequisiti.",
        chip: "border-accent/40 bg-accent/5 text-accent",
    },
    intermedio: {
        label: "Intermedio",
        tagline: "Servono basi solide.",
        chip: "border-border-strong bg-bg-alt text-fg",
    },
    avanzato: {
        label: "Avanzato",
        tagline: "Concetti tecnici, attenzione richiesta.",
        chip: "border-fg/30 bg-fg/5 text-fg",
    },
    pro: {
        label: "Pro",
        tagline: "Livello produzione.",
        chip: "border-fg bg-fg text-bg",
    },
};

export default function PlayCatalogPage() {
    const totalLessons = liveCourses.reduce(
        (sum, c) => sum + c.lessons.length,
        0,
    );
    const subjects = SUBJECT_ORDER.filter((s) =>
        getAllSubjects().includes(s),
    );
    const featured = liveCourses;
    const firstCourseSlug = featured[0]?.slug ?? "primo-sito";

    return (
        <>
            <SideLines side="left" />
            <SideLines side="right" />

            <main className="mx-auto w-full max-w-[var(--container-prose)] px-4 sm:px-6">
                {/* ─── HERO ─────────────────────────────────────────── */}
                <header className="pt-12 pb-12 sm:pt-20 sm:pb-16">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">
                        Curriculum interattivo · gratis
                    </p>
                    <h1 className="mt-3 text-[40px] font-semibold leading-[1.05] tracking-tight text-fg sm:text-[56px]">
                        Impara programmando,
                        <br />
                        <span
                            style={{
                                backgroundImage:
                                    "linear-gradient(to right, #1a0f0a, var(--brand) 45%, #f97316)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                color: "transparent",
                            }}
                        >
                            non guardando.
                        </span>
                    </h1>
                    <p className="mt-5 max-w-[60ch] text-[15.5px] leading-[1.7] text-fg-muted">
                        {playCourses.length} corsi in {subjects.length}{" "}
                        materie, dalle prime righe di HTML agli agenti AI con
                        MCP. Avatar che ti spiega, codice che scrivi, sito che
                        cresce. Niente video passivi, niente carta di credito.
                    </p>
                    <div className="mt-7 flex flex-wrap items-center gap-3">
                        <Link
                            href={`/play/${firstCourseSlug}`}
                            className="press inline-flex items-center gap-2 rounded-md border border-fg bg-fg px-5 py-3 font-mono text-[12px] uppercase tracking-[0.08em] text-bg transition-colors hover:bg-fg/90"
                        >
                            Inizia dal corso 01
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                        </Link>
                        <Link
                            href="#materie"
                            className="press inline-flex items-center gap-2 rounded-md border border-border bg-bg-alt px-5 py-3 font-mono text-[12px] uppercase tracking-[0.08em] text-fg transition-colors hover:border-border-strong"
                        >
                            Esplora le 7 materie
                        </Link>
                    </div>

                    {/* Stats */}
                    <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-8 sm:grid-cols-4 sm:gap-x-8">
                        <Stat n={playCourses.length} label="corsi totali" />
                        <Stat n={subjects.length} label="materie" />
                        <Stat n={LEVELS.length} label="livelli" />
                        <Stat
                            n={liveCourses.length}
                            label={`live (${totalLessons} lezioni)`}
                        />
                    </dl>
                </header>

                <SectionRule />

                {/* ─── FEATURED — corsi live pronti ─────────────────── */}
                <section className="py-12 sm:py-16">
                    <SectionLabel index={1}>Inizia da qui</SectionLabel>
                    <p className="mt-3 max-w-[60ch] text-[15px] leading-[1.7] text-fg-muted">
                        I primi {featured.length} corsi sono pronti adesso.
                        Pensati per chi parte da zero: alla fine hai un sito
                        vero, online, esportabile come zip o pubblicabile su
                        GitHub.
                    </p>
                    <ul className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {featured.map((c, i) => (
                            <li key={c.slug}>
                                <FeaturedCard course={c} index={i + 1} />
                            </li>
                        ))}
                    </ul>
                </section>

                <SectionRule />

                {/* ─── MATERIE — 7 cards che linkano a /materia/[s] ─── */}
                <section
                    id="materie"
                    className="py-12 scroll-mt-20 sm:py-16"
                >
                    <SectionLabel index={2}>Le 7 materie</SectionLabel>
                    <p className="mt-3 max-w-[60ch] text-[15px] leading-[1.7] text-fg-muted">
                        Ogni materia copre più livelli, dal base al pro.
                        Scegli quello che parte da dove sei già tu.
                    </p>
                    <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {subjects.map((s) => (
                            <li key={s}>
                                <SubjectCard subject={s} />
                            </li>
                        ))}
                    </ul>
                </section>

                <SectionRule />

                {/* ─── ROADMAP — 4 livelli ──────────────────────────── */}
                <section className="py-12 sm:py-16">
                    <SectionLabel index={3}>Il percorso</SectionLabel>
                    <p className="mt-3 max-w-[60ch] text-[15px] leading-[1.7] text-fg-muted">
                        Da zero a app full-stack in 4 livelli. Ogni livello
                        costruisce sul precedente: non importa da quale
                        materia entri, le difficoltà sono allineate.
                    </p>
                    <ol className="mt-7 space-y-3">
                        {LEVELS.map((level, i) => (
                            <li key={level}>
                                <LevelRow level={level} index={i + 1} />
                            </li>
                        ))}
                    </ol>
                </section>

                <SectionRule />

                {/* ─── COME FUNZIONA ────────────────────────────────── */}
                <section className="py-12 sm:py-16">
                    <SectionLabel index={4}>Come funziona</SectionLabel>
                    <p className="mt-3 max-w-[60ch] text-[15px] leading-[1.7] text-fg-muted">
                        L&apos;approccio è semplice: tre cose che gli altri
                        corsi raramente mettono insieme.
                    </p>
                    <ul className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <How
                            icon={GraduationCap}
                            title="Avatar che ti spiega"
                            body="Il Luca digitale legge ogni lezione a voce. Un capitolo, due minuti, un'azione concreta."
                        />
                        <How
                            icon={Code2}
                            title="Sito che cresce"
                            body="Ogni lezione aggiunge un pezzo al sito che hai costruito finora. Niente esercizi scollegati."
                        />
                        <How
                            icon={Sparkles}
                            title="Risultato pubblicabile"
                            body="Alla fine di ogni corso hai un sito reale, esportabile come zip o pubblicabile su GitHub."
                        />
                    </ul>
                </section>

                <SectionRule />

                {/* ─── FOOTER CTA ───────────────────────────────────── */}
                <section className="py-12 sm:py-16">
                    <div className="rounded-md border border-border bg-bg-alt p-6 sm:p-8">
                        <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                            Pronto a partire?
                        </p>
                        <h2 className="mt-2 text-[22px] font-semibold leading-tight tracking-tight text-fg sm:text-[26px]">
                            Il primo corso si fa in 25 minuti.
                            <br />
                            Senza account, senza pagamenti.
                        </h2>
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <Link
                                href={`/play/${firstCourseSlug}`}
                                className="press inline-flex items-center gap-2 rounded-md border border-fg bg-fg px-5 py-3 font-mono text-[12px] uppercase tracking-[0.08em] text-bg transition-colors hover:bg-fg/90"
                            >
                                Apri la prima lezione
                                <ArrowRight
                                    className="h-3.5 w-3.5"
                                    aria-hidden
                                />
                            </Link>
                            <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-soft">
                                {upcomingCourses.length} corsi in arrivo ·
                                aggiornamenti settimanali
                            </span>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────
// Sub-components (server-rendered, niente state)
// ─────────────────────────────────────────────────────────────────────────

function Stat({ n, label }: { n: number; label: string }) {
    return (
        <div>
            <dt className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-soft">
                {label}
            </dt>
            <dd className="mt-1 font-semibold text-[28px] tabular-nums tracking-tight text-fg sm:text-[32px]">
                {n}
            </dd>
        </div>
    );
}

function FeaturedCard({
    course,
    index,
}: {
    course: PlayCourse;
    index: number;
}) {
    return (
        <Link
            href={`/play/${course.slug}`}
            className="group flex h-full flex-col rounded-md border border-border bg-bg-alt p-6 transition-colors hover:border-border-strong hover:bg-bg sm:p-7"
        >
            <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                    Corso {String(index).padStart(2, "0")} ·{" "}
                    {LEVEL_META[course.level].label}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent">
                    <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full bg-accent"
                    />
                    Live
                </span>
            </div>
            <h3 className="mt-4 text-[22px] font-semibold leading-tight tracking-tight text-fg sm:text-[24px]">
                {course.title}
            </h3>
            <p className="mt-2 text-[14px] leading-[1.6] text-fg-muted">
                {course.subtitle}
            </p>
            <div className="mt-auto flex items-center justify-between pt-6">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-soft">
                    {course.lessons.length} lezioni · {course.durationMin} min
                </span>
                <ArrowRight
                    className="h-4 w-4 text-fg-soft transition-transform group-hover:translate-x-1"
                    aria-hidden
                />
            </div>
        </Link>
    );
}

function SubjectCard({ subject }: { subject: PlaySubject }) {
    const meta = SUBJECT_META[subject];
    const courses = getCoursesBySubject(subject);
    const liveCount = courses.filter((c) => c.status === "live").length;
    return (
        <Link
            href={`/play/materia/${subject}`}
            className="group flex h-full flex-col rounded-md border border-border bg-bg-alt p-5 transition-colors hover:border-border-strong hover:bg-bg"
        >
            <div className="flex items-baseline gap-3">
                <span aria-hidden className="text-[26px] leading-none">
                    {meta.emoji}
                </span>
                <span className="text-[17px] font-semibold tracking-tight text-fg">
                    {meta.label}
                </span>
            </div>
            <p className="mt-3 text-[13.5px] leading-[1.55] text-fg-muted">
                {meta.description}
            </p>
            <div className="mt-auto flex items-center justify-between pt-5">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-soft">
                    {courses.length} corsi
                    {liveCount > 0 ? ` · ${liveCount} live` : ""}
                </span>
                <ArrowRight
                    className="h-3.5 w-3.5 text-fg-soft transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                />
            </div>
        </Link>
    );
}

function LevelRow({
    level,
    index,
}: {
    level: PlayCourseLevel;
    index: number;
}) {
    const meta = LEVEL_META[level];
    const courses = playCourses.filter((c) => c.level === level);
    const liveCount = courses.filter((c) => c.status === "live").length;
    const preview = courses.slice(0, 4).map((c) => c.title);
    const extra = courses.length - preview.length;
    return (
        <div className="flex flex-col gap-4 rounded-md border border-border bg-bg-alt p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            {/* Lato sx — numero + label livello */}
            <div className="flex items-center gap-4 sm:w-[200px] sm:shrink-0">
                <span className="font-mono text-[34px] leading-none tabular-nums text-fg-soft sm:text-[40px]">
                    {String(index).padStart(2, "0")}
                </span>
                <div>
                    <span
                        className={cn(
                            "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em]",
                            meta.chip,
                        )}
                    >
                        {meta.label}
                    </span>
                    <p className="mt-1 text-[12.5px] leading-[1.5] text-fg-muted">
                        {meta.tagline}
                    </p>
                </div>
            </div>

            {/* Lato dx — preview corsi */}
            <div className="flex-1">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-soft">
                    {courses.length} corsi
                    {liveCount > 0 ? ` · ${liveCount} live` : " · in arrivo"}
                </p>
                <p className="mt-2 text-[13.5px] leading-[1.6] text-fg">
                    {preview.join(" · ")}
                    {extra > 0 ? (
                        <span className="text-fg-soft">
                            {" "}
                            · +{extra} altri
                        </span>
                    ) : null}
                </p>
            </div>
        </div>
    );
}

function How({
    icon: Icon,
    title,
    body,
}: {
    icon: typeof Code2;
    title: string;
    body: string;
}) {
    return (
        <li className="rounded-md border border-border bg-bg-alt p-5">
            <span className="grid h-9 w-9 place-items-center rounded-md border border-border bg-bg text-fg-muted">
                <Icon className="h-4 w-4" aria-hidden />
            </span>
            <p className="mt-3 text-[14.5px] font-medium text-fg">{title}</p>
            <p className="mt-1 text-[13px] leading-[1.55] text-fg-muted">
                {body}
            </p>
        </li>
    );
}
