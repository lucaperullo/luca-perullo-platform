"use client";

import { useEffect, useState } from "react";

export type ThemeClass = "light" | "dark";

/**
 * Reactive `<html>.dark` class state.
 *
 * Returns `"dark"` when the documentElement carries the `.dark` class, and
 * `"light"` otherwise. Re-renders if something else (e.g. the theme
 * toggler) flips the class at runtime, via a `MutationObserver` watching
 * `class` on `<html>`. SSR-safe — starts as `"light"` on the server,
 * hydrates to the real value on mount.
 *
 * This is the *read* side of the theme. The *write* side (toggling the
 * class) lives in `<AnimatedThemeToggler/>`. R3F scenes that need to
 * branch their material colours / tone mapping on theme should use this
 * hook rather than re-implementing the observer per file.
 */
export function useThemeClass(): ThemeClass {
    const [theme, setTheme] = useState<ThemeClass>("light");

    useEffect(() => {
        if (typeof document === "undefined") return;
        const root = document.documentElement;
        const update = () => {
            setTheme(root.classList.contains("dark") ? "dark" : "light");
        };
        update();
        const obs = new MutationObserver(update);
        obs.observe(root, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => obs.disconnect();
    }, []);

    return theme;
}
