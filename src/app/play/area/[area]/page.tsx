import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CourseCard } from "@/components/play/course-card";
import { SectionRule } from "@/components/section-rule";
import { SideLines } from "@/components/side-lines";
import { getCoursesByArea } from "@/data/play";
import {
    AREA_META,
    type PlayArea,
    type PlayCourseLevel,
} from "@/data/play/types";

/**
 * Pagina aggregatore per macro-area: /play/area/[area].
 *
 * Le 4 macro-aree (frontend, backend, fullstack, ai) raggruppano i
 * corsi taggati con i subjects relativi. Stesso layout della pagina
 * `/play/materia/[subject]` ma con hero personalizzato (gradient
 * background dell'area, illustrazione SVG inline) e raggruppamento
 * per livello sottostante.
 */

type Params = { area: string };

const VALID_AREAS = new Set<string>([
    "frontend",
    "backend",
    "fullstack",
    "ai",
]);

const LEVEL_LABELS: Record<PlayCourseLevel, string> = {
    base: "Base · per chi parte da zero",
    intermedio: "Intermedio · servono basi solide",
    avanzato: "Avanzato · concetti tecnici",
    pro: "Pro · livello produzione",
};

const LEVELS: PlayCourseLevel[] = ["base", "intermedio", "avanzato", "pro"];

export function generateStaticParams(): Params[] {
    return Array.from(VALID_AREAS).map((area) => ({ area }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<Params>;
}): Promise<Metadata> {
    const { area } = await params;
    if (!VALID_AREAS.has(area)) {
        return { title: "Area non trovata · Luca Perullo" };
    }
    const meta = AREA_META[area as PlayArea];
    return {
        title: `${meta.label} · Corsi · Luca Perullo`,
        description: meta.description,
    };
}

export default async function AreaPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { area } = await params;
    if (!VALID_AREAS.has(area)) notFound();

    const areaKey = area as PlayArea;
    const meta = AREA_META[areaKey];
    const courses = getCoursesByArea(areaKey);
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
                {/* ─── HERO con gradient di area ────────────────────── */}
                <header className="pt-10 pb-12 sm:pt-14 sm:pb-16">
                    <Link
                        href="/play"
                        className="press inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-fg-muted transition-colors hover:text-fg"
                    >
                        <ArrowLeft className="h-3 w-3" aria-hidden />
                        Tutto il curriculum
                    </Link>

                    {/* Banner illustrato pieno: gradient + tagline grossa */}
                    <div
                        className="mt-6 overflow-hidden rounded-lg border border-border p-6 sm:p-9"
                        style={{
                            backgroundImage: meta.gradient,
                        }}
                    >
                        <p
                            className="font-mono text-[10.5px] uppercase tracking-[0.14em]"
                            style={{ color: meta.accent }}
                        >
                            Area · {courses.length} corsi
                        </p>
                        <h1
                            className="mt-2 text-[32px] font-bold leading-[1.05] tracking-tight text-zinc-900 sm:text-[48px]"
                            style={{ textWrap: "balance" }}
                        >
                            {meta.label}
                        </h1>
                        <p
                            className="mt-3 max-w-[42ch] text-[16px] font-medium sm:text-[18px]"
                            style={{ color: meta.accent }}
                        >
                            {meta.tagline}
                        </p>
                        <p className="mt-4 max-w-[60ch] text-[14px] leading-[1.6] text-zinc-800/85 sm:text-[15px]">
                            {meta.description}
                        </p>
                    </div>

                    {/* Stats sotto */}
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
                                            showSubjects={true}
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
