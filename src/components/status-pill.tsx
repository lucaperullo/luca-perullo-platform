import { cn } from "@/lib/utils";

export type StatusTone = "live" | "wip" | "soon" | "neutral";

export type StatusPillProps = {
    /** Visual tone — "live" (emerald), "wip" (amber), "soon" / "neutral" (soft). */
    tone?: StatusTone;
    /** Override the default label derived from the tone. */
    label?: string;
    className?: string;
};

const TONE_DOT: Record<StatusTone, string> = {
    live: "bg-emerald-500",
    wip: "bg-amber-500",
    soon: "bg-fg-soft",
    neutral: "bg-fg-soft",
};

const TONE_LABEL: Record<StatusTone, string> = {
    live: "Live",
    wip: "WIP",
    soon: "Soon",
    neutral: "Note",
};

export function StatusPill({ tone = "neutral", label, className }: StatusPillProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-alt px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-fg-muted",
                className,
            )}
        >
            <span className={cn("h-1.5 w-1.5 rounded-full", TONE_DOT[tone])} aria-hidden />
            {label ?? TONE_LABEL[tone]}
        </span>
    );
}
