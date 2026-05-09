/**
 * Progress tracker hybrid: localStorage per anonimi, Supabase DB per
 * loggati. La logica core (`Progress`, `currentCode`, `snapshots`) è
 * identica nei due path; cambia solo dove vengono persistiti i dati.
 *
 * Le funzioni "sync" sono async perché possono toccare il DB. Il
 * LessonRunner le invoca all'evento giusto (debounced sull'editing,
 * immediate sul successo della lezione).
 */

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const KEY = "lp-play-progress-v2";

export type Progress = {
    courseSlug: string;
    currentCode: string;
    currentLessonOrder: number;
    completedLessons: string[];
    snapshots: Record<string, string>;
    updatedAt: string;
};

const empty = (courseSlug: string, initialCode: string): Progress => ({
    courseSlug,
    currentCode: initialCode,
    currentLessonOrder: 1,
    completedLessons: [],
    snapshots: {},
    updatedAt: new Date().toISOString(),
});

// ───── LocalStorage layer (anonimi)
function readLocal(courseSlug: string, initialCode: string): Progress {
    if (typeof window === "undefined") return empty(courseSlug, initialCode);
    try {
        const raw = window.localStorage.getItem(KEY);
        if (!raw) return empty(courseSlug, initialCode);
        const parsed = JSON.parse(raw) as Progress;
        if (parsed.courseSlug !== courseSlug)
            return empty(courseSlug, initialCode);
        if (typeof parsed.currentCode !== "string" || !parsed.snapshots) {
            return empty(courseSlug, initialCode);
        }
        return parsed;
    } catch {
        return empty(courseSlug, initialCode);
    }
}

function writeLocal(p: Progress): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(KEY, JSON.stringify(p));
        window.dispatchEvent(new Event("lp-play-progress-update"));
    } catch {
        // ignore
    }
}

// ───── DB layer (loggati)
type DbProgressRow = {
    current_code?: string | null;
    current_lesson_order?: number | null;
    completed_lessons?: string[] | null;
    snapshots?: Record<string, string> | null;
    updated_at?: string | null;
};

async function readDB(
    userId: string,
    courseSlug: string,
    initialCode: string,
): Promise<Progress> {
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase
        .from("play_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("course_slug", courseSlug)
        .maybeSingle();
    if (error || !data) return empty(courseSlug, initialCode);
    const row = data as DbProgressRow;
    return {
        courseSlug,
        currentCode: row.current_code ?? initialCode,
        currentLessonOrder: row.current_lesson_order ?? 1,
        completedLessons: row.completed_lessons ?? [],
        snapshots: row.snapshots ?? {},
        updatedAt: row.updated_at ?? new Date().toISOString(),
    };
}

async function writeDB(userId: string, p: Progress): Promise<void> {
    const supabase = createBrowserSupabaseClient();
    await supabase.from("play_progress").upsert(
        {
            user_id: userId,
            course_slug: p.courseSlug,
            current_code: p.currentCode,
            current_lesson_order: p.currentLessonOrder,
            completed_lessons: p.completedLessons,
            snapshots: p.snapshots,
            updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,course_slug" },
    );
}

// ───── Auth helper
async function getCurrentUserId(): Promise<string | null> {
    if (typeof window === "undefined") return null;
    try {
        const supabase = createBrowserSupabaseClient();
        const { data } = await supabase.auth.getUser();
        return data.user?.id ?? null;
    } catch {
        return null;
    }
}

// ───── API pubblica (back-compat con la versione localStorage-only)

/** Lettura sincrona — usata in render. NON tocca il DB; restituisce
 *  sempre il valore localStorage (più veloce, più consistente per il
 *  server-render). Il sync con DB avviene tramite syncFromCloud. */
export function getProgress(
    courseSlug: string,
    initialCode: string,
): Progress {
    return readLocal(courseSlug, initialCode);
}

/** Persiste il currentCode (debounced dal chiamante). Scrive su entrambi
 *  i layer in parallelo se l'utente è loggato. */
export function persistCurrentCode(
    courseSlug: string,
    initialCode: string,
    code: string,
): Progress {
    const cur = readLocal(courseSlug, initialCode);
    const next: Progress = {
        ...cur,
        currentCode: code,
        updatedAt: new Date().toISOString(),
    };
    writeLocal(next);
    // Async best-effort sul DB
    void getCurrentUserId().then((uid) => {
        if (uid) writeDB(uid, next).catch(() => {});
    });
    return next;
}

export function completeLessonAndAdvance(opts: {
    courseSlug: string;
    initialCode: string;
    lessonOrder: number;
    lessonSlug: string;
    finalCode: string;
    nextLessonOrder?: number;
}): Progress {
    const cur = readLocal(opts.courseSlug, opts.initialCode);
    const completed = new Set(cur.completedLessons);
    completed.add(opts.lessonSlug);
    const next: Progress = {
        ...cur,
        currentCode: opts.finalCode,
        currentLessonOrder: opts.nextLessonOrder ?? opts.lessonOrder,
        completedLessons: Array.from(completed),
        snapshots: { ...cur.snapshots, [opts.lessonSlug]: opts.finalCode },
        updatedAt: new Date().toISOString(),
    };
    writeLocal(next);
    void getCurrentUserId().then((uid) => {
        if (uid) writeDB(uid, next).catch(() => {});
    });
    return next;
}

export function isLessonAccessible(
    progress: Progress,
    lessonOrder: number,
): boolean {
    if (lessonOrder <= 1) return true;
    return lessonOrder <= progress.currentLessonOrder;
}

export function resetProgress(
    courseSlug: string,
    initialCode: string,
): Progress {
    const fresh = empty(courseSlug, initialCode);
    writeLocal(fresh);
    void getCurrentUserId().then((uid) => {
        if (uid) writeDB(uid, fresh).catch(() => {});
    });
    return fresh;
}

/**
 * Sincronizza il progresso dal cloud al localStorage. Chiamato dopo
 * il login: scarica il progresso dal DB (se esiste) e lo mette in
 * localStorage, così il LessonRunner lo trova al prossimo render.
 *
 * Strategia di merge: se DB ha più progressi del local (più lezioni
 * completate o currentLessonOrder maggiore), DB vince. Altrimenti
 * upload del local sul DB.
 */
export async function syncFromCloud(
    courseSlug: string,
    initialCode: string,
): Promise<Progress> {
    const uid = await getCurrentUserId();
    if (!uid) return readLocal(courseSlug, initialCode);

    const dbProgress = await readDB(uid, courseSlug, initialCode);
    const localProgress = readLocal(courseSlug, initialCode);

    // Quale è "più avanti"?
    const dbAhead =
        dbProgress.completedLessons.length >
            localProgress.completedLessons.length ||
        dbProgress.currentLessonOrder > localProgress.currentLessonOrder;

    if (dbAhead) {
        writeLocal(dbProgress);
        return dbProgress;
    } else {
        // Local è più avanti (o uguale): upload sul DB
        await writeDB(uid, localProgress).catch(() => {});
        return localProgress;
    }
}
