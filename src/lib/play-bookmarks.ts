"use client";

/**
 * Bookmark dei corsi /play — quali corsi l'utente vuole seguire.
 *
 * Storage: localStorage (immediato, no DB richiesto). Quando vorremo
 * cross-device sync, aggiungeremo una tabella Supabase
 * `play_course_bookmarks (user_id, course_slug, created_at)` e
 * rimpiazzeremo questo storage con un wrapper che fa write-through.
 *
 * API minima:
 *   readBookmarks()                 → string[]    (slugs salvati)
 *   isBookmarked(slug)              → boolean
 *   toggleBookmark(slug)            → void        (add se non c'è, remove se c'è)
 *   subscribeBookmarks(callback)    → unsubscribe
 *
 * Eventi: ad ogni write, dispatch su window di
 *   "lp-play-bookmarks-update"
 * + lo standard "storage" event (cross-tab sync). useSyncExternalStore
 * hook può subscribere a entrambi.
 */

const KEY = "lp-play-bookmarks";
const EVENT = "lp-play-bookmarks-update";


function safeParse(raw: string | null): string[] {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return parsed.filter((x): x is string => typeof x === "string");
        }
    } catch {
        /* corrupted, treat as empty */
    }
    return [];
}

export function readBookmarks(): string[] {
    if (typeof window === "undefined") return [];
    try {
        return safeParse(window.localStorage.getItem(KEY));
    } catch {
        return [];
    }
}

export function isBookmarked(slug: string): boolean {
    return readBookmarks().includes(slug);
}

export function toggleBookmark(slug: string): boolean {
    const current = readBookmarks();
    const next = current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug];
    write(next);
    return next.includes(slug);
}

export function addBookmark(slug: string): void {
    const current = readBookmarks();
    if (current.includes(slug)) return;
    write([...current, slug]);
}

export function removeBookmark(slug: string): void {
    const current = readBookmarks();
    if (!current.includes(slug)) return;
    write(current.filter((s) => s !== slug));
}

function write(next: string[]): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
        window.dispatchEvent(new Event(EVENT));
    } catch {
        /* ignore quota / private mode failures */
    }
}

/**
 * Subscribe per useSyncExternalStore. Reagisce sia all'evento
 * custom in-tab che al "storage" event cross-tab del browser.
 */
export function subscribeBookmarks(cb: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    window.addEventListener(EVENT, cb);
    window.addEventListener("storage", cb);
    return () => {
        window.removeEventListener(EVENT, cb);
        window.removeEventListener("storage", cb);
    };
}
