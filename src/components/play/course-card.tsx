import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import type { PlayCourse } from "@/data/play/types";
import { SUBJECT_META } from "@/data/play/types";
import { cn } from "@/lib/utils";

const LEVEL_LABELS: Record<string, string> = {
    base: "Base",
    intermedio: "Intermedio",
    avanzato: "Avanzato",
    pro: "Pro",
};

const LEVEL_COLORS: Record<string, string> = {
    base: "border-accent/40 bg-accent/5 text-accent",
    intermedio: "border-border-strong bg-bg-alt text-fg",
    avanzato: "border-fg/30 bg-fg/5 text-fg",
    pro: "border-fg bg-fg text-bg",
};

export function CourseCard({
    course,
    showSubjects = true,
}: {
    course: PlayCourse;
    showSubjects?: boolean;
}) {
    const isLive = course.status === "live";

    const inner = (
        <div
            className={cn(
                "flex flex-col gap-3 px-4 py-5 sm:px-6 transition-colors",
                isLive ? "hover:bg-bg-alt" : "opacity-60",
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className={cn(
                                "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em]",
                                LEVEL_COLORS[course.level],
                            )}
                        >
                            {LEVEL_LABELS[course.level]}
                        </span>
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-soft">
                            {course.durationMin} min
                            {course.lessons.length > 0
                                ? ` · ${course.lessons.length} lezioni`
                                : ""}
                        </span>
                        {!isLive ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-alt px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-fg-soft">
                                <Lock className="h-2.5 w-2.5" aria-hidden />
                                Presto
                            </span>
                        ) : null}
                    </div>
                    <h3 className="text-[18px] font-semibold leading-tight tracking-tight text-fg">
                        {course.title}
                    </h3>
                    <p className="text-[13.5px] leading-[1.55] text-fg-muted">
                        {course.subtitle}
                    </p>
                    {showSubjects && course.subjects.length > 0 ? (
                        <div className="flex flex-wrap gap-1 pt-1">
                            {course.subjects.map((s) => (
                                <span
                                    key={s}
                                    className="inline-flex items-center gap-1 font-mono text-[10px] text-fg-soft"
                                >
                                    <span aria-hidden>
                                        {SUBJECT_META[s].emoji}
                                    </span>
                                    {SUBJECT_META[s].label}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </div>
                {isLive ? (
                    <ArrowRight
                        className="h-4 w-4 shrink-0 self-center text-fg-soft"
                        aria-hidden
                    />
                ) : null}
            </div>
        </div>
    );

    if (isLive) {
        return (
            <Link href={`/play/${course.slug}`} className="group block">
                {inner}
            </Link>
        );
    }
    return inner;
}
