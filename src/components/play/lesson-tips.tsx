"use client";

import { useState } from "react";
import { ChevronDown, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTipsForLesson } from "@/data/play-tips";

export type LessonTipsProps = {
    lessonOrder: number;
};

/**
 * Pannello "Suggerimenti" contestuali alla lezione corrente.
 * Diversi per ogni lezione, definiti in src/data/play-tips.ts.
 *
 * Aperto di default (gli utenti li vogliono leggere). Stato collapsed
 * NON persistito: si resetta a ogni cambio lezione, perché i tip sono
 * rilevanti per quella lezione specifica e vogliamo che vengano notati.
 */
export function LessonTips({ lessonOrder }: LessonTipsProps) {
    const tips = getTipsForLesson(lessonOrder);
    const [open, setOpen] = useState(true);

    if (tips.length === 0) return null;

    return (
        <div className="rounded-md border border-border bg-bg">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="press flex w-full items-center justify-between gap-2 px-3 py-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-muted hover:text-fg"
            >
                <span className="inline-flex items-center gap-1.5">
                    <Lightbulb className="h-3 w-3" aria-hidden />
                    Suggerimenti
                    <span className="rounded-sm bg-bg-alt px-1 font-mono text-[9.5px] text-fg-soft">
                        {tips.length}
                    </span>
                </span>
                <ChevronDown
                    className={cn(
                        "h-3 w-3 transition-transform",
                        open && "rotate-180",
                    )}
                    aria-hidden
                />
            </button>
            {open ? (
                <ul className="space-y-3 border-t border-border px-3 py-3">
                    {tips.map((tip) => (
                        <li key={tip.title} className="flex flex-col gap-0.5">
                            <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-accent">
                                {tip.title}
                            </p>
                            <p className="text-[12.5px] leading-[1.5] text-fg">
                                {tip.body}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}
