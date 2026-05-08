import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatTrend = "up" | "down" | "flat";

export type StatCardProps = {
    /** Mono kicker label, top of the card. */
    label: string;
    /** Primary value: numeric or string. */
    value: ReactNode;
    /** Optional unit appended to the value (e.g. "%"), styled smaller and in fg-muted. */
    unit?: string;
    /** Optional delta: e.g. "+12%" or { value: 12, trend: "up" }. */
    delta?: string | { value: string; trend: StatTrend };
    /** Body caption shown below value. */
    caption?: string;
    /** Render in dense mode for small grids. */
    dense?: boolean;
    className?: string;
};

const TREND_ICON = { up: ArrowUpRight, down: ArrowDownRight, flat: Minus };
const TREND_TEXT = {
    up: "text-emerald-600 dark:text-emerald-400",
    down: "text-rose-600 dark:text-rose-400",
    flat: "text-fg-muted",
};

function normalizeDelta(delta: StatCardProps["delta"]): { value: string; trend: StatTrend } | null {
    if (!delta) return null;
    if (typeof delta === "string") {
        const trend: StatTrend = delta.startsWith("-") ? "down" : delta.startsWith("+") ? "up" : "flat";
        return { value: delta, trend };
    }
    return delta;
}

export function StatCard({ label, value, unit, delta, caption, dense, className }: StatCardProps) {
    const d = normalizeDelta(delta);
    const Trend = d ? TREND_ICON[d.trend] : null;

    return (
        <div
            className={cn(
                "flex flex-col gap-1 rounded-md border border-border bg-bg",
                dense ? "px-3 py-2.5" : "px-4 py-3.5",
                className,
            )}
        >
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-soft">
                {label}
            </span>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span
                    className={cn(
                        "font-medium tabular-nums tracking-tight text-fg",
                        dense ? "text-[18px]" : "text-2xl sm:text-[28px]",
                    )}
                >
                    {value}
                </span>
                {unit ? (
                    <span className="text-[13px] tabular-nums text-fg-muted">{unit}</span>
                ) : null}
                {d && Trend ? (
                    <span
                        className={cn(
                            "ml-auto inline-flex items-center gap-0.5 font-mono text-[11px] tabular-nums",
                            TREND_TEXT[d.trend],
                        )}
                    >
                        <Trend className="h-3 w-3" aria-hidden />
                        {d.value}
                    </span>
                ) : null}
            </div>
            {caption ? (
                <span className="text-[12.5px] leading-[1.5] text-fg-muted">{caption}</span>
            ) : null}
        </div>
    );
}
