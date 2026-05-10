/**
 * Risolve l'URL pubblico per un MP3 lezione su Supabase Storage
 * (bucket `play-audio`).
 *
 * Pattern URL Supabase Storage pubblico:
 *   {SUPABASE_URL}/storage/v1/object/public/play-audio/{course}/{file}.mp3
 *
 * Convenzione file:
 *   {order}.mp3            → narrazione principale (script)
 *   {order}-success.mp3    → feedback verifica OK (successScript)
 *   {order}-encourage.mp3  → feedback verifica KO (encourageScript)
 *
 * Fallback locale: se NEXT_PUBLIC_SUPABASE_URL non è settato (es. setup
 * iniziale o test offline), torniamo al path /play-audio/... che cerca
 * dentro public/. In produzione la env è sempre presente.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const BUCKET = "play-audio";

/** Base URL del bucket pubblico, senza slash finale. */
function audioBaseUrl(): string {
    if (SUPABASE_URL) {
        return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;
    }
    return `/${BUCKET}`; // fallback: public/play-audio/
}

/**
 * URL della narrazione principale per (courseSlug, order).
 *   getLessonAudioUrl("primo-sito", 1) →
 *     "https://xxx.supabase.co/storage/v1/object/public/play-audio/primo-sito/1.mp3"
 */
export function getLessonAudioUrl(
    courseSlug: string,
    lessonOrder: number,
): string {
    return `${audioBaseUrl()}/${courseSlug}/${lessonOrder}.mp3`;
}

/**
 * URL del feedback "verifica OK" per la lezione.
 *   getLessonFeedbackUrl("primo-sito", 1, "success") →
 *     ".../primo-sito/1-success.mp3"
 */
export function getLessonFeedbackUrl(
    courseSlug: string,
    lessonOrder: number,
    kind: "success" | "encourage",
): string {
    return `${audioBaseUrl()}/${courseSlug}/${lessonOrder}-${kind}.mp3`;
}
