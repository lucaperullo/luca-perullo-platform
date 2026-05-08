import type { ComponentType, SVGProps } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type SocialTileProps = {
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    label: string;
    href: string;
    handle?: string;
    className?: string;
};

export function SocialTile({ icon: Icon, label, href, handle, className }: SocialTileProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "group flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-bg-alt",
                className,
            )}
        >
            <span className="flex min-w-0 items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-fg text-bg">
                    <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="flex min-w-0 flex-col leading-tight">
                    <span className="text-[13.5px] font-medium text-fg">{label}</span>
                    {handle ? (
                        <span className="font-mono text-[11px] text-fg-muted">{handle}</span>
                    ) : null}
                </span>
            </span>
            <ArrowUpRight
                className="h-4 w-4 shrink-0 text-fg-soft transition-colors group-hover:text-fg"
                aria-hidden
            />
        </a>
    );
}
