"use client";

import { useState, type ReactNode } from "react";
import {
    AlertCircle,
    Check,
    ChevronDown,
    ChevronRight,
    Loader2,
    Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AiToolCallStatus = "running" | "success" | "error";

export type AiToolCallCardProps = {
    /** Tool name shown in header — e.g. "search_web", "read_file". */
    tool: string;
    /** Active state. */
    status: AiToolCallStatus;
    /** Short status verb shown next to the tool name — e.g. "Searching the web". */
    label?: string;
    /** Tool input, rendered as JSON if object / verbatim if string. */
    input?: unknown;
    /** Tool output / result — same rendering rules as input. */
    output?: unknown;
    /** Override icon. Default Wrench. */
    icon?: ReactNode;
    /** Auto-collapse on success. Default true. */
    collapseOnSuccess?: boolean;
    className?: string;
};

/**
 * <AiToolCallCard/> — the "Searching the web…" / "Reading file…" status card
 * pattern that ChatGPT, Claude, Cursor and Perplexity all ship now. Streams
 * from "running" → "success" / "error" with an animated indicator and
 * expandable input/output panes.
 *
 * Pure CSS animations (Loader2 spin via Tailwind's `animate-spin`).
 */
export function AiToolCallCard({
    tool,
    status,
    label,
    input,
    output,
    icon,
    collapseOnSuccess = true,
    className,
}: AiToolCallCardProps) {
    const [open, setOpen] = useState(status !== "success" || !collapseOnSuccess);

    const StatusIcon =
        status === "running" ? Loader2 : status === "error" ? AlertCircle : Check;

    return (
        <div
            data-status={status}
            className={cn(
                "overflow-hidden rounded-[10px] border bg-bg-alt",
                "[transition:border-color_220ms_var(--ease-out),background-color_220ms_var(--ease-out)]",
                status === "running" && "border-border-strong",
                status === "success" && "border-border",
                status === "error" && "border-red-500/40 bg-red-500/5",
                className,
            )}
        >
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={cn(
                    "press flex min-h-11 w-full items-center gap-3 px-3 py-2 text-left",
                    "[transition:transform_160ms_var(--ease-out),background-color_160ms_var(--ease-out)]",
                    "hover:bg-bg",
                )}
                aria-expanded={open}
            >
                <span
                    className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-md border",
                        status === "error"
                            ? "border-red-500/40 bg-red-500/10 text-red-500"
                            : "border-border bg-bg text-fg",
                    )}
                    aria-hidden
                >
                    {icon ?? <Wrench className="h-3.5 w-3.5" />}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex items-center gap-2">
                        <span className="font-mono text-[12px] text-fg">{tool}</span>
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-fg-soft">
                            {status === "running" ? "running…" : status}
                        </span>
                    </span>
                    {label ? (
                        <span className="truncate text-[12.5px] text-fg-muted">{label}</span>
                    ) : null}
                </span>
                <span className="flex shrink-0 items-center gap-2">
                    <StatusIcon
                        aria-hidden
                        className={cn(
                            "h-4 w-4",
                            status === "running" && "animate-spin text-fg-muted",
                            status === "success" && "text-emerald-500",
                            status === "error" && "text-red-500",
                        )}
                    />
                    {open ? (
                        <ChevronDown className="h-3.5 w-3.5 text-fg-soft" aria-hidden />
                    ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-fg-soft" aria-hidden />
                    )}
                </span>
            </button>

            {open && (input !== undefined || output !== undefined) ? (
                <div className="grid gap-2 border-t border-border bg-bg px-3 py-3">
                    {input !== undefined ? (
                        <Pane label="input" value={input} />
                    ) : null}
                    {output !== undefined ? (
                        <Pane
                            label="output"
                            value={status === "running" ? "(in attesa…)" : output}
                            dim={status === "running"}
                        />
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}

function Pane({
    label,
    value,
    dim = false,
}: {
    label: string;
    value: unknown;
    dim?: boolean;
}) {
    const text =
        typeof value === "string" ? value : JSON.stringify(value, null, 2);
    return (
        <div>
            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-soft">
                {label}
            </div>
            <pre
                className={cn(
                    "m-0 max-h-44 overflow-auto whitespace-pre-wrap break-words rounded-md bg-bg-alt px-2.5 py-2 font-mono text-[12px] leading-[1.55]",
                    dim ? "text-fg-soft" : "text-fg",
                )}
            >
                {text}
            </pre>
        </div>
    );
}
