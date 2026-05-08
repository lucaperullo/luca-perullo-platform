"use client";

import {
    useCallback,
    useEffect,
    useState,
    type ButtonHTMLAttributes,
    type MouseEvent,
} from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewTransitionDoc = Document & {
    startViewTransition?: (cb: () => void) => unknown;
};

export type AnimatedThemeTogglerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
};

/**
 * <AnimatedThemeToggler/> — toggles `html.dark` with a circular wipe
 * expanding from the click point via the View Transitions API. Falls back
 * to a plain class swap when the API is unavailable.
 */
export function AnimatedThemeToggler({
    className,
    onClick,
    ...rest
}: AnimatedThemeTogglerProps) {
    const [isDark, setIsDark] = useState<boolean>(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
    }, []);

    const onToggle = useCallback(
        async (event: MouseEvent<HTMLButtonElement>) => {
            const root = document.documentElement;
            const x = event.clientX;
            const y = event.clientY;
            const radius = Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y),
            );
            const next = !root.classList.contains("dark");
            const apply = () => {
                root.classList.toggle("dark", next);
                setIsDark(next);
            };

            const doc = document as ViewTransitionDoc;
            if (typeof doc.startViewTransition !== "function") {
                apply();
                onClick?.(event);
                return;
            }

            const transition = doc.startViewTransition(apply);
            type TransitionWithReady = { ready?: Promise<unknown> };
            const tx = transition as TransitionWithReady;
            try {
                await tx.ready;
            } catch {
                /* ignore */
            }
            // Resolve `--ease-out` from the page tokens at runtime so the
            // wipe matches the rest of the site's motion. Falls back to
            // the same curve hard-coded if the token is unset.
            const easeOut =
                getComputedStyle(root)
                    .getPropertyValue("--ease-out")
                    .trim() || "cubic-bezier(0.23, 1, 0.32, 1)";
            root.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${radius}px at ${x}px ${y}px)`,
                    ],
                },
                {
                    duration: 600,
                    easing: easeOut,
                    pseudoElement: "::view-transition-new(root)",
                },
            );
            onClick?.(event);
        },
        [onClick],
    );

    return (
        <button
            type="button"
            aria-label={isDark ? "Passa al tema chiaro" : "Passa al tema scuro"}
            aria-pressed={isDark}
            {...rest}
            onClick={onToggle}
            className={cn(
                "press inline-flex h-11 w-11 items-center justify-center",
                "rounded-md border border-border bg-bg-alt text-fg",
                "transition-colors duration-150 [transition-timing-function:var(--ease-out)]",
                "hover:border-border-strong",
                className,
            )}
        >
            {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </button>
    );
}
