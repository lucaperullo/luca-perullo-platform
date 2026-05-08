"use client";

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type ButtonHTMLAttributes,
    type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type DockContextValue = {
    iconSize: number;
    iconMagnification: number;
    iconDistance: number;
    pointer: { x: number; y: number; active: boolean };
    direction: "horizontal" | "vertical";
};

const DockContext = createContext<DockContextValue | null>(null);

export type DockProps = {
    children: ReactNode;
    className?: string;
    iconSize?: number;
    iconMagnification?: number;
    /** Proximity radius for magnification (px). */
    iconDistance?: number;
    direction?: "horizontal" | "vertical";
};

/**
 * <Dock/> — macOS-style dock with proximity magnification. Tracks pointer
 * position via `pointermove`, exposes it via context so each `<DockIcon/>`
 * can compute its own scale based on distance.
 */
export function Dock({
    children,
    className,
    iconSize = 44,
    iconMagnification = 64,
    iconDistance = 140,
    direction = "horizontal",
}: DockProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [pointer, setPointer] = useState<{ x: number; y: number; active: boolean }>({
        x: 0,
        y: 0,
        active: false,
    });

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const onMove = (e: PointerEvent) => {
            const rect = el.getBoundingClientRect();
            setPointer({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
        };
        const onLeave = () =>
            setPointer((p) => ({ ...p, active: false }));
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerleave", onLeave);
        };
    }, []);

    return (
        <DockContext.Provider
            value={{ iconSize, iconMagnification, iconDistance, pointer, direction }}
        >
            <div
                ref={ref}
                className={cn(
                    "inline-flex items-end gap-2 rounded-2xl border border-border bg-bg-alt/80 px-3 py-2 backdrop-blur",
                    direction === "vertical" && "flex-col items-center",
                    className,
                )}
            >
                {children}
            </div>
        </DockContext.Provider>
    );
}

export type DockIconProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    className?: string;
};

/**
 * <DockIcon/> — child button inside `<Dock/>`. Reads pointer position from
 * context and scales between `iconSize` and `iconMagnification` by
 * proximity. The slot retains its original size; only the inner content
 * scales, so the position math stays stable.
 */
export function DockIcon({ children, className, ...rest }: DockIconProps) {
    const ctx = useContext(DockContext);
    const slotRef = useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (!ctx) return;
        const slot = slotRef.current;
        if (!slot) return;
        const parent = slot.parentElement;
        if (!parent) return;

        if (!ctx.pointer.active) {
            setScale(1);
            return;
        }

        const slotRect = slot.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();
        const slotCenter =
            ctx.direction === "horizontal"
                ? slotRect.left - parentRect.left + slotRect.width / 2
                : slotRect.top - parentRect.top + slotRect.height / 2;
        const target =
            ctx.direction === "horizontal" ? ctx.pointer.x : ctx.pointer.y;
        const dist = Math.abs(slotCenter - target);
        const t = Math.max(0, 1 - dist / ctx.iconDistance);
        const target_size =
            ctx.iconSize + (ctx.iconMagnification - ctx.iconSize) * t;
        setScale(target_size / ctx.iconSize);
    }, [ctx]);

    const baseSize = ctx?.iconSize ?? 44;

    return (
        <div
            ref={slotRef}
            style={{ width: baseSize, height: baseSize }}
            className="flex items-end justify-center"
        >
            <button
                type="button"
                {...rest}
                className={cn(
                    "press inline-flex items-center justify-center rounded-xl border border-border bg-bg text-fg",
                    "origin-bottom transition-transform duration-150 [transition-timing-function:var(--ease-out)]",
                    className,
                )}
                style={{
                    width: baseSize,
                    height: baseSize,
                    transform: `scale(${scale})`,
                }}
            >
                {children}
            </button>
        </div>
    );
}
