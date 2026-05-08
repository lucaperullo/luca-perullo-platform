import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

/**
 * Server-only loader for blog notes. Each .md file in /src/content/blog/
 * is one article. Frontmatter shape:
 *
 *   ---
 *   title: ...
 *   excerpt: ...
 *   publishedAt: 2026-05-05      # ISO date — gates visibility
 *   tag: Costi
 *   cover: /blog/foo.jpg          # optional
 *   seoTitle: ...                 # optional
 *   seoDescription: ...           # optional
 *   keywords: [a, b, c]           # optional
 *   ---
 *
 *   Markdown body...
 *
 * Articles whose `publishedAt` is in the future are hidden in production.
 * In dev (NODE_ENV !== "production") we expose them so the calendar is
 * fully previewable while writing.
 */

export type Note = {
    slug: string;
    title: string;
    excerpt: string;
    publishedAt: string;
    tag?: string;
    cover?: string;
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    body: string;
};

const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");
const IS_DEV = process.env.NODE_ENV !== "production";

let cache: Note[] | null = null;

async function loadAll(): Promise<Note[]> {
    // In dev: never cache so newly-added .md files appear on next request.
    // In prod: cache once per process — ISR triggers fresh process slices.
    if (cache && !IS_DEV) return cache;
    const entries = await readdir(CONTENT_DIR);
    const out: Note[] = [];
    for (const entry of entries) {
        if (!entry.endsWith(".md")) continue;
        const raw = await readFile(path.join(CONTENT_DIR, entry), "utf8");
        const { data, content } = matter(raw);
        out.push({
            slug: entry.replace(/\.md$/, ""),
            title: String(data.title ?? ""),
            excerpt: String(data.excerpt ?? ""),
            publishedAt: toIsoDate(data.publishedAt),
            tag: data.tag ? String(data.tag) : undefined,
            cover: data.cover ? String(data.cover) : undefined,
            seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
            seoDescription: data.seoDescription
                ? String(data.seoDescription)
                : undefined,
            keywords: Array.isArray(data.keywords)
                ? data.keywords.map(String)
                : undefined,
            body: content.trim(),
        });
    }
    out.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    cache = out;
    return out;
}

/** All notes, including future-dated ones. Use only for sitemap/admin. */
export async function getAllNotes(): Promise<Note[]> {
    return loadAll();
}

/** Notes visible to the public — published-at is today or earlier. */
export async function getPublishedNotes(): Promise<Note[]> {
    const all = await loadAll();
    const cutoff = endOfTodayIso();
    return all.filter((n) => n.publishedAt <= cutoff);
}

/** A single note by slug, gated by publishedAt. Future-dated returns null. */
export async function getNote(slug: string): Promise<Note | null> {
    const all = await loadAll();
    const note = all.find((n) => n.slug === slug);
    if (!note) return null;
    if (note.publishedAt > endOfTodayIso()) return null;
    return note;
}

/**
 * Coerce a frontmatter publishedAt value to a YYYY-MM-DD string.
 * YAML parses unquoted `2026-05-05` as a Date object — `String(date)` would
 * produce a localized representation, not the ISO date we compare against.
 */
function toIsoDate(value: unknown): string {
    if (!value) return "";
    if (value instanceof Date) {
        const y = value.getUTCFullYear();
        const m = String(value.getUTCMonth() + 1).padStart(2, "0");
        const d = String(value.getUTCDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }
    const s = String(value).trim();
    // Already YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ — slice the date portion.
    return s.slice(0, 10);
}

function endOfTodayIso(): string {
    // Use Europe/Rome wall clock so a post scheduled for Day N goes live at
    // 00:00 Italian time, not at UTC midnight.
    const now = new Date();
    const fmt = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Rome",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    return fmt.format(now); // YYYY-MM-DD
}
