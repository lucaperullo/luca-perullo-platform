import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CourseCard } from "@/components/play/course-card";
import { SectionRule } from "@/components/section-rule";
import { SideLines } from "@/components/side-lines";
import { getAllSubjects, getCoursesBySubject } from "@/data/play";
import {
    SUBJECT_META,
    type PlayCourseLevel,
    type PlaySubject,
} from "@/data/play/types";

type Params = { subject: string };

const VALID_SUBJECTS = new Set<string>([
    "html",
    "css",
    "javascript",
    "react",
    "backend",
    "fullstack",
    "ai-tools",
]);

const LEVEL_LABELS: Record<PlayCourseLevel, string> = {
    base: "Base · per chi parte da zero",
    intermedio: "Intermedio · servono basi solide",
    avanzato: "Avanzato · concetti tecnici",
    pro: "Pro · livello produzione",
};

const LEVELS: PlayCourseLevel[] = ["base", "intermedio", "avanzato", "pro"];

export function generateStaticParams(): Params[] {
    return getAllSubjects().map((s) => ({ subject: s }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<Params>;
}): Promise<Metadata> {
    const { subject } = await params;
    if (!VALID_SUBJECTS.has(subject)) {
        return { title: "Materia non trovata · Luca Perullo" };
    }
    const meta = SUBJECT_META[subject as PlaySubject];
    return {
        title: `${meta.label} · Corsi · Luca Perullo`,
        description: meta.description,
    };
}

export default async function MateriaPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { subject } = await params;
    if (!VALID_SUBJECTS.has(subject)) notFound();

    const subjectKey = subject as PlaySubject;
    const meta = SUBJECT_META[subjectKey];
    const courses = getCoursesBySubject(subjectKey);
    const liveCount = courses.filter((c) => c.status === "live").length;
    const totalMin = courses.reduce((s, c) => s + c.durationMin, 0);

    const byLevel: Record<PlayCourseLevel, typeof courses> = {
        base: courses.filter((c) => c.level === "base"),
        intermedio: courses.filter((c) => c.level === "intermedio"),
        avanzato: courses.filter((c) => c.level === "avanzato"),
        pro: courses.filter((c) => c.level === "pro"),
    };

    return (
        <>
            <SideLines side="left" />
            <SideLines side="right" />

            <main className="mx-auto w-full max-w-[var(--container-prose)] px-4 sm:px-6">
                {/* ─── HERO ─────────────────────────────────────────── */}
                <header className="pt-10 pb-10 sm:pt-14 sm:pb-12">
                    <Link
                        href="/play"
                        className="press inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-fg-muted transition-colors hover:text-fg"
                    >
                        <ArrowLeft className="h-3 w-3" aria-hidden />
                        Tutto il curriculum
                    </Link>

                    <div className="mt-6 flex items-start gap-5 sm:gap-6">
                        <span
                            aria-hidden
                            className="grid h-16 w-16 shrink-0 place-items-center rounded-md border border-border bg-bg-alt text-[34px] sm:h-20 sm:w-20 sm:text-[42px]"
                        >
                            {meta.emoji}
                        </span>
                        <div className="flex-1 pt-1">
                            <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                                Materia · {courses.length} corsi
                            </p>
                            <h1 className="mt-1.5 text-3xl font-semibold leading-[1.1] tracking-tight text-fg sm:text-[40px]">
                                {meta.label}
                            </h1>
                        </div>
                    </div>

                    <p className="mt-5 max-w-[60ch] text-[15px] leading-[1.7] text-fg-muted">
                        {meta.description}
                    </p>

                    {/* Stats */}
                    <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-4 sm:gap-x-8">
                        <Stat n={courses.length} label="corsi" />
                        <Stat n={liveCount} label="live ora" />
                        <Stat
                            n={
                                LEVELS.filter((l) => byLevel[l].length > 0)
                                    .length
                            }
                            label="livelli"
                        />
                        <Stat n={totalMin} label="min totali" />
                    </dl>
                </header>

                <SectionRule />

                {/* ─── CORSI per livello ─────────────────────────────── */}
                {LEVELS.map((level) => {
                    const list = byLevel[level];
                    if (list.length === 0) return null;
                    const liveInLevel = list.filter(
                        (c) => c.status === "live",
                    ).length;
                    return (
                        <section key={level} className="py-10 sm:py-12">
                            <p className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                                Livello
                            </p>
                            <h2 className="text-[20px] font-semibold tracking-tight text-fg sm:text-[22px]">
                                {LEVEL_LABELS[level]}
                            </h2>
                            <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-soft">
                                {list.length} corsi
                                {liveInLevel > 0
                                    ? ` · ${liveInLevel} live`
                                    : ""}
                            </p>
                            <ul className="-mx-4 mt-5 space-y-px sm:-mx-6">
                                {list.map((c, i) => (
                                    <li
                                        key={c.slug}
                                        className={`row-rule${i === 0 ? " row-rule-top" : ""}`}
                                    >
                                        <CourseCard
                                            course={c}
                                            showSubjects={false}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </section>
                    );
                })}
            </main>
        </>
    );
}

function Stat({ n, label }: { n: number; label: string }) {
    return (
        <div>
            <dt className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-soft">
                {label}
            </dt>
            <dd className="mt-1 text-[22px] font-semibold tabular-nums tracking-tight text-fg sm:text-[26px]">
                {n}
            </dd>
        </div>
    );
}
