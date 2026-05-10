"use client";

import { useSyncExternalStore } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import {
    isBookmarked,
    subscribeBookmarks,
    toggleBookmark,
} from "@/lib/play-bookmarks";
import { cn } from "@/lib/utils";

/**
 * Bottone "Salva corso" / "Rimuovi dai salvati".
 *
 * Sincronizzazione: usa useSyncExternalStore così quando si flagga
 * un corso, ogni altro BookmarkButton dello stesso slug nella stessa
 * pagina si aggiorna immediatamente.
 *
 * Click handling: stopPropagation + preventDefault perché tipicamente
 * questo button vive DENTRO un <Link> (il CourseCard è un link a
 * /play/[slug]). Senza fermarlo, click sulla stella naviga alla
 * pagina del corso invece di togglare il bookmark.
 */
export function BookmarkButton({
    slug,
    size = "md",
}: {
    slug: string;
    size?: "sm" | "md";
}) {
    const bookmarked = useSyncExternalStore<boolean>(
        subscribeBookmarks,
        () => isBookmarked(slug),
        () => false, // SSR fallback: niente bookmark visibile prima di idratare
    );

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(slug);
    };

    const dim = size === "sm" ? "h-7 w-7" : "h-8 w-8";
    const iconDim = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={bookmarked ? "Rimuovi dai salvati" : "Salva corso"}
            title={bookmarked ? "Rimuovi dai salvati" : "Salva per dopo"}
            className={cn(
                "press grid shrink-0 place-items-center rounded-full border transition-colors",
                dim,
                bookmarked
                    ? "border-accent/50 bg-accent/10 text-accent hover:border-accent hover:bg-accent/15"
                    : "border-border bg-bg text-fg-soft hover:border-border-strong hover:text-fg",
            )}
        >
            {bookmarked ? (
                <BookmarkCheck className={iconDim} aria-hidden />
            ) : (
                <Bookmark className={iconDim} aria-hidden />
            )}
        </button>
    );
}
