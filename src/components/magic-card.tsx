"use client";

import {
    useCallback,
    useRef,
    useState,
    type CSSProperties,
    type PointerEvent,
    type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type MagicCardProps = {
    children: ReactNode;
    className?: string;
    /** Spotlight diameter in px. Default 200. */
    gradientSize?: number;
    /** Spotlight color. Default `var(--accent)`. */
    gradientColor?: string;
    /** Peak alpha. Default 0.18. */
    gradientOpacity?: number;
};

/**
 * <MagicCard/> — card whose surface lights up under the cursor with a soft
 * radial spotlight. Hover effect is gated to fine pointers, so touch
 * devices see the static card. The spotlight follows the cursor via a
 * CSS custom property; opacity fades in/out on enter/leave.
 */
export function MagicCard({
    children,
    className,
    gradientSize = 200,
    gradientColor = "var(--accent)",
    gradientOpacity = 0.18,
}: MagicCardProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [hovered, setHovered] = useState(false);

    const onMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        el.style.setProperty("--my", `${event.clientY - rect.top}px`);
    }, []);

    const baseStyle = {
        "--mc-size": `${gradientSize}px`,
        "--mc-color": gradientColor,
        "--mc-opacity": gradientOpacity,
    } as CSSProperties;

    return (
        <>
            <style>{`
                @media (hover: hover) and (pointer: fine) {
                    .magic-card-shell[data-hovered="true"] .magic-card-glow {
                        opacity: var(--mc-opacity);
                    }
                }
            `}</style>
            <div
                ref={ref}
                data-hovered={hovered ? "true" : "false"}
                onPointerEnter={() => setHovered(true)}
                onPointerMove={onMove}
                onPointerLeave={() => setHovered(false)}
                style={baseStyle}
                className={cn(
                    "magic-card-shell relative isolate overflow-hidden rounded-md border border-border bg-bg-alt",
                    className,
                )}
            >
                <span
                    aria-hidden
                    className="magic-card-glow pointer-events-none absolute inset-0 transition-opacity duration-300 [transition-timing-function:var(--ease-out)]"
                    style={{
                        opacity: 0,
                        background:
                            "radial-gradient(var(--mc-size) circle at var(--mx, 50%) var(--my, 50%), var(--mc-color), transparent 60%)",
                    }}
                />
                <div className="relative">{children}</div>
            </div>
        </>
    );
}
