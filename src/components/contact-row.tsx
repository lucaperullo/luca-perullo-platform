import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";

export type ContactRowProps = {
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    children: React.ReactNode;
    className?: string;
    href?: string;
    external?: boolean;
};

export function ContactRow({
    icon: Icon,
    children,
    className,
    href,
    external,
}: ContactRowProps) {
    const inner = (
        <span className="flex items-center gap-2.5 text-[13.5px] text-fg">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border bg-bg-alt text-fg-muted">
                <Icon className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="font-mono leading-none">{children}</span>
        </span>
    );

    if (!href) {
        return <span className={cn("inline-flex", className)}>{inner}</span>;
    }
    return (
        <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className={cn(
                "inline-flex transition-opacity hover:opacity-70",
                className,
            )}
        >
            {inner}
        </a>
    );
}
