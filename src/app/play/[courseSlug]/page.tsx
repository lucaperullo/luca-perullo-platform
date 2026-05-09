import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, Clock } from "lucide-react";
import { SectionLabel } from "@/components/section-label";
import { SectionRule } from "@/components/section-rule";
import { SideLines } from "@/components/side-lines";
import { getCourseBySlug, playCourses } from "@/data/play";

type Params = { courseSlug: string };

export function generateStaticParams(): Params[] {
    return playCourses
        .filter((c) => c.status === "live")
        .map((c) => ({ courseSlug: c.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<Params>;
}): Promise<Metadata> {
    const { courseSlug } = await params;
    const course = getCourseBySlug(courseSlug);
    if (!course) return { title: "Corso non trovato · Luca Perullo" };
    return {
        title: `${course.title} · Luca Perullo`,
        description: course.description,
    };
}

export default async function CourseIntroPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { courseSlug } = await params;

    // Legacy redirect: vecchie URL /play/[N] (quando c'era un solo corso)
    // ora vanno a /play/primo-sito/[N]. I bookmark esistenti continuano
    // a funzionare anche dopo lo split per corso/lezione.
    if (/^\d+$/.test(courseSlug)) {
        redirect(`/play/primo-sito/${courseSlug}`);
    }

    const course = getCourseBySlug(courseSlug);
    if (!course || course.status !== "live") notFound();

    return (
        <>
            <SideLines side="left" />
            <SideLines side="right" />

            <div className="mx-auto w-full max-w-[var(--container-prose)] px-4 sm:px-6">
                <header className="pt-12 pb-8 sm:pt-16">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">
                        <Link href="/play" className="hover:text-fg">
                            Curriculum
                        </Link>
                        {" / "}
                        <span className="text-fg-soft">{course.level}</span>
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                        {course.title}
                    </h1>
                    <p className="mt-3 text-[16px] leading-[1.6] text-fg-muted">
                        {course.subtitle}
                    </p>
                    <p className="mt-4 max-w-[60ch] text-[15px] leading-[1.7] text-fg">
                        {course.description}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link
                            href={`/play/${course.slug}/1`}
                            className="press inline-flex items-center gap-2 rounded-md border border-fg bg-fg px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] text-bg hover:bg-fg/90"
                        >
                            Inizia adesso
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                        </Link>
                        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-fg-soft">
                            <Clock className="h-3 w-3" aria-hidden />
                            {course.durationMin} min · {course.lessons.length}{" "}
                            lezioni
                        </span>
                    </div>
                </header>

                <SectionRule />

                {course.modules.map((m, mi) => {
                    // 4 lezioni per modulo (convenzione del nostro
                    // getModuleForLesson — vedi @/data/play)
                    const lessons = course.lessons.filter((l) => {
                        const idx = Math.floor((l.order - 1) / 4);
                        return idx === mi;
                    });
                    return (
                        <section key={m.slug} className="py-10">
                            <SectionLabel index={mi + 1}>
                                {m.title}
                            </SectionLabel>
                            <p className="mt-3 max-w-[60ch] text-[14px] text-fg-muted">
                                {m.summary}
                            </p>
                            <ol className="mt-5 -mx-4 sm:-mx-6">
                                {lessons.map((l, i) => (
                                    <li
                                        key={l.order}
                                        className={`row-rule${i === 0 ? " row-rule-top" : ""}`}
                                    >
                                        <Link
                                            href={`/play/${course.slug}/${l.order}`}
                                            className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-bg-alt sm:px-6"
                                        >
                                            <span className="font-mono text-[12px] tabular-nums text-fg-soft w-8 shrink-0">
                                                {String(l.order).padStart(2, "0")}
                                            </span>
                                            <span className="flex-1 text-[14px] font-medium text-fg">
                                                {l.title}
                                            </span>
                                            <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-soft">
                                                {Math.round(l.durationSec / 60)} min
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ol>
                            {mi < course.modules.length - 1 ? (
                                <SectionRule className="mt-10" />
                            ) : null}
                        </section>
                    );
                })}
            </div>
        </>
    );
}
