"use client";

import {
    useCallback,
    useRef,
    useState,
    type ButtonHTMLAttributes,
    type MouseEvent,
    type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Ripple = { id: number; x: number; y: number; size: number };

export type RippleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    /** Tint of the ripple. Default `currentColor` at low alpha. */
    rippleColor?: string;
    className?: string;
};

/**
 * <RippleButton/> — Material-style ink ripples on click. Each ripple is a
 * span injected into the DOM, scaled 0→4 with opacity 0.4→0 over 600ms via
 * the project's `--ease-out` curve, then removed on `onAnimationEnd`.
 */
export function RippleButton({
    children,
    rippleColor,
    className,
    onClick,
    ...rest
}: RippleButtonProps) {
    const idRef = useRef(0);
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const handleClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            const button = event.currentTarget;
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            const id = idRef.current++;
            setRipples((prev) => [...prev, { id, x, y, size }]);
            onClick?.(event);
        },
        [onClick],
    );

    const removeRipple = useCallback((id: number) => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
    }, []);

    return (
        <>
            <style>{`
                @keyframes ripple-button-fade {
                    from { transform: scale(0); opacity: 0.4; }
                    to   { transform: scale(4); opacity: 0; }
                }
            `}</style>
            <button
                type="button"
                onClick={handleClick}
                {...rest}
                className={cn(
                    "press relative inline-flex items-center justify-center gap-2",
                    "min-h-[44px] rounded-md px-5 py-2",
                    "border border-border bg-bg-alt text-fg",
                    "font-sans text-sm font-medium",
                    "overflow-hidden",
                    "transition-colors duration-150 [transition-timing-function:var(--ease-out)]",
                    "hover:border-border-strong",
                    className,
                )}
            >
                <span className="relative z-10">{children}</span>
                {ripples.map((r) => (
                    <span
                        key={r.id}
                        aria-hidden
                        onAnimationEnd={() => removeRipple(r.id)}
                        className="pointer-events-none absolute rounded-full"
                        style={{
                            left: r.x,
                            top: r.y,
                            width: r.size,
                            height: r.size,
                            background: rippleColor ?? "currentColor",
                            opacity: 0.4,
                            animation: "ripple-button-fade 600ms var(--ease-out) forwards",
                        }}
                    />
                ))}
            </button>
        </>
    );
}
