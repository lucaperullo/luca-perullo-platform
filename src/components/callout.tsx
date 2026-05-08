import type { ComponentType, ReactNode, SVGProps } from "react";
import { AlertTriangle, CheckCircle2, Info, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalloutTone = "info" | "warning" | "success" | "note";

export type CalloutProps = {
    tone?: CalloutTone;
    /** Mono kicker label. Defaults to the tone uppercased. */
    label?: string;
    /** Title — first line, semi-bold. Optional. */
    title?: string;
    /** Body content. */
    children: ReactNode;
    /** Override the icon. */
    icon?: ComponentType<SVGProps<SVGSVGElement>>;
    /** Optional CTA element (e.g. <Link>). Rendered at the right side. */
    action?: ReactNode;
    className?: string;
};

const TONE_ICON: Record<CalloutTone, ComponentType<SVGProps<SVGSVGElement>>> = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle2,
    note: Lightbulb,
};

const TONE_LABEL: Record<CalloutTone, string> = {
    info: "Info",
    warning: "Attenzione",
    success: "Ok",
    note: "Nota",
};

const TONE_BAR: Record<CalloutTone, string> = {
    info: "bg-accent",
    warning: "bg-amber-500",
    success: "bg-emerald-500",
    note: "bg-fg-soft",
};

const TONE_ICON_COLOR: Record<CalloutTone, string> = {
    info: "text-accent",
    warning: "text-amber-600 dark:text-amber-400",
    success: "text-emerald-600 dark:text-emerald-400",
    note: "text-fg-muted",
};

export function Callout({
    tone = "info",
    label,
    title,
    children,
    icon,
    action,
    className,
}: CalloutProps) {
    const Icon = icon ?? TONE_ICON[tone];

    return (
        <aside
            className={cn(
                "relative grid grid-cols-[2px_minmax(0,1fr)] overflow-hidden rounded-md border border-border bg-bg-alt",
                className,
            )}
        >
            <span aria-hidden className={cn("h-full w-full", TONE_BAR[tone])} />
            <div className="flex items-start gap-3 px-4 py-3">
                <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", TONE_ICON_COLOR[tone])} aria-hidden />
                <div className="flex flex-1 flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-soft">
                        {label ?? TONE_LABEL[tone]}
                    </span>
                    {title ? (
                        <span className="text-[14px] font-medium text-fg">{title}</span>
                    ) : null}
                    <div className="text-[13.5px] leading-[1.6] text-fg-muted">{children}</div>
                </div>
                {action ? <div className="shrink-0">{action}</div> : null}
            </div>
        </aside>
    );
}
