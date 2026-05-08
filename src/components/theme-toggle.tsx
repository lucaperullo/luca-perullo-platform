"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "lp-theme";

type Theme = "light" | "dark";

function readInitialTheme(): Theme {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle({ className }: { className?: string }) {
    const [theme, setTheme] = useState<Theme>("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const initial = readInitialTheme();
        setTheme(initial);
        document.documentElement.classList.toggle("dark", initial === "dark");
        setMounted(true);
    }, []);

    const apply = (next: Theme) => {
        setTheme(next);
        document.documentElement.classList.toggle("dark", next === "dark");
        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // ignore — incognito or storage disabled
        }
    };

    return (
        <button
            type="button"
            aria-label={theme === "dark" ? "Passa a light mode" : "Passa a dark mode"}
            onClick={() => apply(theme === "dark" ? "light" : "dark")}
            className={cn(
                "grid h-8 w-8 place-items-center rounded-md text-fg-muted transition-colors hover:text-fg",
                className,
            )}
        >
            {mounted ? (
                theme === "dark" ? (
                    <Sun className="h-4 w-4" aria-hidden />
                ) : (
                    <Moon className="h-4 w-4" aria-hidden />
                )
            ) : (
                <span className="h-4 w-4" />
            )}
        </button>
    );
}
