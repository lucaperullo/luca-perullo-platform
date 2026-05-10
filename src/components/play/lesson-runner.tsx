"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Eye,
    Lightbulb,
    PlayCircle,
    RotateCcw,
    Settings,
    Volume2,
    VolumeX,
    X,
    Smartphone,
    Monitor,
} from "lucide-react";
import type { AvatarMood, Lesson, Module } from "@/data/play-courses";
import { AccountButton } from "@/components/auth/account-button";
import { CodeEditor } from "./code-editor";
import { KeyboardHelp } from "./keyboard-help";
import { LessonTips } from "./lesson-tips";
import { LivePreview, type LivePreviewHandle } from "./live-preview";
import { LessonDialogOverlay } from "./lesson-dialog-overlay";
import { LottieAvatar } from "./lottie-avatar";
import { VoicePackModal } from "./voice-pack-modal";
import { WelcomeModal } from "./welcome-modal";
import { validate } from "./exercise-validator";
import {
    isLessonAccessible,
    getProgress,
    completeLessonAndAdvance,
    persistCurrentCode,
    resetProgress,
    syncFromCloud,
} from "./progress-tracker";
import { playTts, type TTSHandle } from "./tts-player";
import { getLessonAudioUrl, getLessonFeedbackUrl } from "@/lib/play-audio-url";
import { cn } from "@/lib/utils";

export type LessonRunnerProps = {
    lesson: Lesson;
    courseSlug: string;
    /** Titolo del corso, mostrato nel breadcrumb top bar. */
    courseTitle?: string;
    courseInitialCode: string;
    totalLessons: number;
    module: Module;
};

type RunState =
    | { kind: "idle" }
    | { kind: "validating" }
    | { kind: "success" }
    | { kind: "error"; message: string };

export function LessonRunner({
    lesson,
    courseSlug,
    courseTitle,
    courseInitialCode,
    totalLessons,
    module,
}: LessonRunnerProps) {
    const router = useRouter();

    // Codice nell'editor — inizializzato dal localStorage al mount
    // (via flag mounted). Server-side mostra initialCode.
    const [code, setCode] = useState(courseInitialCode);
    const [showSolution, setShowSolution] = useState(false);
    const [run, setRun] = useState<RunState>({ kind: "idle" });
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [avatarMood, setAvatarMood] = useState<AvatarMood>(lesson.avatarMood);
    const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
        "desktop",
    );
    // Tab attivo SOLO su mobile (< lg breakpoint). Su desktop tutti i
    // 3 pannelli sono visibili in 3 colonne, lo state non viene letto.
    const [mobileTab, setMobileTab] = useState<"lesson" | "code" | "preview">(
        "lesson",
    );

    const previewRef = useRef<LivePreviewHandle>(null);
    const ttsHandleRef = useRef<TTSHandle | null>(null);
    const codeBeforeLessonRef = useRef<string | null>(null);

    // Access guard via useSyncExternalStore: server-side "checking",
    // client-side legge localStorage.
    const accessGuard = useSyncExternalStore<"checking" | "ok" | "blocked">(
        progressSubscribe,
        () => {
            const p = getProgress(courseSlug, courseInitialCode);
            return isLessonAccessible(p, lesson.order) ? "ok" : "blocked";
        },
        () => "checking",
    );

    // Init client-only del codice. Prima legge localStorage (sincrono),
    // poi tenta sync dal cloud DB se l'utente è loggato (asincrono).
    const initialSyncDoneRef = useRef(false);
    useEffect(() => {
        if (initialSyncDoneRef.current) return;
        if (typeof window === "undefined") return;
        const p = getProgress(courseSlug, courseInitialCode);
        const snapshot = p.snapshots[lesson.slug];
        const codeToUse = snapshot ?? p.currentCode ?? courseInitialCode;
        codeBeforeLessonRef.current = codeToUse;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCode(codeToUse);
        initialSyncDoneRef.current = true;

        // Async: cloud sync (se loggato, può aggiornare con dati DB più avanzati)
        void syncFromCloud(courseSlug, courseInitialCode).then((cloud) => {
            const cloudSnap = cloud.snapshots[lesson.slug];
            const cloudCode = cloudSnap ?? cloud.currentCode;
            if (cloudCode && cloudCode !== codeToUse) {
                codeBeforeLessonRef.current = cloudCode;
                setCode(cloudCode);
            }
        });
    }, [courseSlug, courseInitialCode, lesson.slug]);

    // Persistenza throttled del codice durante l'editing
    useEffect(() => {
        if (!initialSyncDoneRef.current) return;
        const t = setTimeout(() => {
            persistCurrentCode(courseSlug, courseInitialCode, code);
        }, 800);
        return () => clearTimeout(t);
    }, [code, courseSlug, courseInitialCode]);

    // Riproduzione TTS automatica al mount
    useEffect(() => {
        if (accessGuard !== "ok" || isMuted) return;
        let cancelled = false;
        (async () => {
            const handle = await playTts({
                audioPath:
                    lesson.audioPath ??
                    getLessonAudioUrl(courseSlug, lesson.order),
                script: lesson.script,
                onStart: () => {
                    if (!cancelled) setIsSpeaking(true);
                },
                onEnd: () => {
                    if (!cancelled) setIsSpeaking(false);
                },
            });
            ttsHandleRef.current = handle;
            handle.play();
        })();
        return () => {
            cancelled = true;
            ttsHandleRef.current?.stop();
            ttsHandleRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lesson.order, accessGuard]);

    const handleVerify = () => {
        setRun({ kind: "validating" });
        setTimeout(() => {
            const doc = previewRef.current?.getDoc() ?? null;
            const result = validate(lesson.validate, doc, code);
            if (result.ok) {
                completeLessonAndAdvance({
                    courseSlug,
                    initialCode: courseInitialCode,
                    lessonOrder: lesson.order,
                    lessonSlug: lesson.slug,
                    finalCode: code,
                    nextLessonOrder: Math.min(lesson.order + 1, totalLessons),
                });
                setRun({ kind: "success" });
                setAvatarMood("happy");
                // Su mobile, riporta l'utente al tab Lezione per fargli
                // vedere il messaggio di successo (e poi cliccare il
                // bottone Prossima nel footer).
                setMobileTab("lesson");
                if (!isMuted) {
                    void playFeedback(
                        getLessonFeedbackUrl(
                            courseSlug,
                            lesson.order,
                            "success",
                        ),
                        lesson.successScript,
                    );
                }
            } else {
                setRun({ kind: "error", message: result.message });
                setAvatarMood("encouraging");
                // Stesso ragionamento: il dettaglio dell'errore + hint
                // sta nel pannello Lezione, portalo lì.
                setMobileTab("lesson");
                if (!isMuted) {
                    void playFeedback(
                        getLessonFeedbackUrl(
                            courseSlug,
                            lesson.order,
                            "encourage",
                        ),
                        lesson.encourageScript,
                    );
                }
            }
        }, 100);
    };

    const handleReset = () => {
        // Torna allo stato di codice DA PRIMA che lo studente toccasse
        // questa lezione (lo snapshot della lezione precedente, o l'initial
        // code se siamo alla 1).
        const fallback = codeBeforeLessonRef.current ?? courseInitialCode;
        setCode(fallback);
        setRun({ kind: "idle" });
        setShowSolution(false);
    };

    const handleResetAll = () => {
        if (
            typeof window !== "undefined" &&
            !window.confirm(
                "Sicuro? Questo cancella tutti i progressi del corso e ti riporta alla lezione 1.",
            )
        ) {
            return;
        }
        resetProgress(courseSlug, courseInitialCode);
        router.push(`/play/${courseSlug}/1`);
    };

    const handleNext = () => {
        if (lesson.order < totalLessons) {
            router.push(`/play/${courseSlug}/${lesson.order + 1}`);
        } else {
            router.push(`/play/${courseSlug}?completed=1`);
        }
    };

    const handlePlayScript = () => {
        ttsHandleRef.current?.stop();
        playTts({
            audioPath:
                lesson.audioPath ??
                getLessonAudioUrl(courseSlug, lesson.order),
            script: lesson.script,
            onStart: () => setIsSpeaking(true),
            onEnd: () => setIsSpeaking(false),
        }).then((h) => {
            ttsHandleRef.current = h;
            h.play();
        });
    };

    if (accessGuard === "checking") {
        return (
            <div className="flex h-full items-center justify-center font-mono text-[12px] text-fg-muted">
                Carico la lezione…
            </div>
        );
    }

    if (accessGuard === "blocked") {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center px-6">
                <X className="h-8 w-8 text-fg-soft" aria-hidden />
                <p className="text-[15px] text-fg max-w-md">
                    Questa lezione è bloccata. Devi prima completare la
                    precedente.
                </p>
                <Link
                    href={`/play/${courseSlug}/${lesson.order - 1}`}
                    className="press inline-flex items-center gap-2 rounded-md border border-fg bg-fg px-3.5 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-bg hover:bg-fg/90"
                >
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                    Torna alla lezione precedente
                </Link>
            </div>
        );
    }

    const progressPct = Math.round(((lesson.order - 1) / totalLessons) * 100);

    const editorCode = showSolution ? lesson.expectedSnapshot : code;

    return (
        <div className="flex h-full w-full flex-col bg-bg">
            {/* Welcome modal — mostrato la prima volta che l'utente apre
                una lezione. Si auto-disattiva dopo. */}
            <WelcomeModal />

            {/* Voice-pack modal — appare DOPO il WelcomeModal alla prima
                lezione, una sola volta, per scegliere se usare la voce
                clonata di Luca / la voce del sistema / mute. */}
            <VoicePackModal />

            {/* Dialog overlay video-game style: mostra il testo dello
                script quando l'avatar parla MA l'utente è su un tab
                diverso da "Lezione" (Codice o Anteprima). Solo mobile.
                Su desktop il pannello aside è sempre visibile. */}
            <LessonDialogOverlay
                text={lesson.script}
                visible={isSpeaking && mobileTab !== "lesson"}
            />

            {/* Top bar: breadcrumb + progress */}
            <div className="flex items-center justify-between gap-3 border-b border-border bg-bg-alt px-3 py-2 sm:px-6 sm:py-2.5">
                <div className="flex min-w-0 items-center gap-2">
                    <Link
                        href={`/play/${courseSlug}`}
                        aria-label="Torna all'indice del corso"
                        className="press inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-bg px-2 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-fg-muted hover:text-fg sm:px-2.5"
                    >
                        <ArrowLeft className="h-3 w-3" aria-hidden />
                        <span className="hidden sm:inline">Indice</span>
                    </Link>
                    {/* Su mobile mostriamo solo il numero lezione, niente
                        modulo: lo spazio non c'è e l'info è nel tab attivo. */}
                    <span className="hidden truncate font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft sm:inline">
                        {courseTitle ? `${courseTitle} · ` : ""}
                        Modulo {String(module.order).padStart(2, "0")} ·{" "}
                        {module.title}
                    </span>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft sm:hidden">
                        {lesson.title}
                    </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <span className="font-mono text-[10.5px] tabular-nums uppercase tracking-[0.12em] text-fg-soft">
                        {lesson.order}/{totalLessons}
                    </span>
                    <div className="hidden h-1.5 w-32 overflow-hidden rounded-full bg-border-strong/50 md:block">
                        <div
                            className="h-full rounded-full bg-fg transition-[width] duration-500"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                    <AccountButton
                        nextOnLogin={`/play/${courseSlug}/${lesson.order}`}
                    />
                </div>
            </div>

            {/* Tab switcher — SOLO mobile (< lg). Su desktop le 3 colonne
                sono già visibili insieme nella griglia sotto. */}
            <div className="flex items-stretch border-b border-border bg-bg lg:hidden">
                <MobileTab
                    active={mobileTab === "lesson"}
                    onClick={() => setMobileTab("lesson")}
                    badge={
                        run.kind === "success"
                            ? "ok"
                            : run.kind === "error"
                              ? "err"
                              : null
                    }
                >
                    Lezione
                </MobileTab>
                <MobileTab
                    active={mobileTab === "code"}
                    onClick={() => setMobileTab("code")}
                >
                    Codice
                </MobileTab>
                <MobileTab
                    active={mobileTab === "preview"}
                    onClick={() => setMobileTab("preview")}
                >
                    Anteprima
                </MobileTab>
            </div>

            {/* Body: 3-col grid on desktop, single tab on mobile */}
            <div className="flex-1 grid grid-cols-1 overflow-hidden lg:grid-cols-[340px_1fr_1fr]">
                {/* Pannello sinistro: avatar + script + esercizio */}
                <aside
                    className={cn(
                        "flex-col overflow-y-auto border-b border-border bg-bg-alt p-5 lg:flex lg:border-b-0 lg:border-r",
                        mobileTab === "lesson" ? "flex" : "hidden",
                    )}
                >
                    <div className="flex items-start gap-3.5">
                        <LottieAvatar
                            mood={avatarMood}
                            isSpeaking={isSpeaking}
                            size={72}
                        />
                        <div className="min-w-0 flex-1">
                            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-soft">
                                Lezione {String(lesson.order).padStart(2, "0")}
                            </p>
                            <h2 className="mt-0.5 text-[18px] font-semibold leading-tight tracking-tight text-fg">
                                {lesson.title}
                            </h2>
                        </div>
                    </div>

                    <p className="mt-4 text-[14px] leading-[1.6] text-fg">
                        {lesson.script}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={handlePlayScript}
                            className="press inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-bg px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-fg hover:bg-bg-alt"
                        >
                            <PlayCircle className="h-3 w-3" aria-hidden />
                            Riascolta
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (isMuted) {
                                    setIsMuted(false);
                                } else {
                                    ttsHandleRef.current?.stop();
                                    setIsMuted(true);
                                    setIsSpeaking(false);
                                }
                            }}
                            className="press inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-fg-muted hover:text-fg"
                        >
                            {isMuted ? (
                                <>
                                    <VolumeX className="h-3 w-3" aria-hidden />
                                    Muto
                                </>
                            ) : (
                                <>
                                    <Volume2 className="h-3 w-3" aria-hidden />
                                    Audio
                                </>
                            )}
                        </button>
                        {/* Settings gear: riapre il modale voce per
                            cambiare preferenza in qualunque momento. */}
                        <button
                            type="button"
                            onClick={() =>
                                window.dispatchEvent(
                                    new Event("lp-play-voice-pack-open"),
                                )
                            }
                            aria-label="Impostazioni voce"
                            title="Cambia voce"
                            className="press inline-flex h-[26px] w-[26px] items-center justify-center rounded-md border border-border bg-bg text-fg-muted hover:text-fg"
                        >
                            <Settings className="h-3 w-3" aria-hidden />
                        </button>
                    </div>

                    {/* Esercizio */}
                    <div className="mt-5 rounded-md border border-accent/40 bg-accent/5 px-3.5 py-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                            Esercizio
                        </p>
                        <p className="mt-1 text-[13.5px] leading-[1.55] text-fg">
                            {lesson.instruction}
                        </p>
                    </div>

                    {/* Suggerimenti contestuali — diversi per ogni lezione */}
                    <div className="mt-3">
                        <LessonTips lessonOrder={lesson.order} />
                    </div>

                    {/* Keyboard help: come fare < > sulla tastiera italiana.
                        Aperto di default nelle lezioni 1-4 (HTML basics),
                        chiuso dalla 5 in poi. L'utente può comunque
                        espanderlo con un click; la preferenza è ricordata. */}
                    <div className="mt-3">
                        <KeyboardHelp lessonOrder={lesson.order} />
                    </div>

                    {/* Feedback */}
                    {run.kind === "error" ? (
                        <div className="mt-4 rounded-md border border-fg-soft bg-bg px-3.5 py-3">
                            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-soft">
                                Quasi
                            </p>
                            <p className="mt-1 text-[13px] leading-[1.55] text-fg">
                                {run.message}
                            </p>
                            <p className="mt-2 font-mono text-[11px] text-fg-muted">
                                Suggerimento: {lesson.hint}
                            </p>
                        </div>
                    ) : null}

                    {run.kind === "success" ? (
                        <div className="mt-4 rounded-md border border-accent bg-accent/10 px-3.5 py-3">
                            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                                Completata ✓
                            </p>
                            <p className="mt-1 text-[13px] leading-[1.55] text-fg">
                                {lesson.successScript}
                            </p>
                        </div>
                    ) : null}

                    <div className="mt-auto pt-5">
                        <button
                            type="button"
                            onClick={handleResetAll}
                            className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-soft hover:text-fg-muted underline decoration-fg-soft underline-offset-3"
                        >
                            Ricomincia da zero
                        </button>
                    </div>
                </aside>

                {/* Editor */}
                <div
                    className={cn(
                        "flex-col overflow-hidden border-b border-border lg:flex lg:border-b-0 lg:border-r",
                        mobileTab === "code" ? "flex" : "hidden lg:flex",
                    )}
                >
                    <div className="flex items-center justify-between border-b border-zinc-800 bg-[#1e1e1e] px-3 py-2">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-zinc-400">
                            index.html
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="press inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[10px] uppercase text-zinc-400 hover:bg-zinc-800 hover:text-white"
                            >
                                <RotateCcw className="h-3 w-3" aria-hidden />
                                Reset
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowSolution((v) => !v)}
                                className="press inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[10px] uppercase text-zinc-400 hover:bg-zinc-800 hover:text-white"
                            >
                                {showSolution ? (
                                    <>
                                        <Eye className="h-3 w-3" aria-hidden />
                                        Nascondi
                                    </>
                                ) : (
                                    <>
                                        <Lightbulb className="h-3 w-3" aria-hidden />
                                        Soluzione
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="min-h-[300px] flex-1 bg-[#1e1e1e]">
                        <CodeEditor
                            value={editorCode}
                            onChange={(v) => {
                                if (!showSolution) setCode(v);
                            }}
                            height="100%"
                            language="html"
                        />
                    </div>
                </div>

                {/* Preview */}
                <div
                    className={cn(
                        "flex-col overflow-hidden bg-bg lg:flex",
                        mobileTab === "preview" ? "flex" : "hidden lg:flex",
                    )}
                >
                    <div className="flex items-center justify-between border-b border-border bg-bg-alt px-3 py-2">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-muted">
                            Anteprima live
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setPreviewMode("desktop")}
                                className={cn(
                                    "press inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[10px] uppercase",
                                    previewMode === "desktop"
                                        ? "bg-fg text-bg"
                                        : "text-fg-muted hover:bg-bg hover:text-fg",
                                )}
                            >
                                <Monitor className="h-3 w-3" aria-hidden />
                                Desktop
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreviewMode("mobile")}
                                className={cn(
                                    "press inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[10px] uppercase",
                                    previewMode === "mobile"
                                        ? "bg-fg text-bg"
                                        : "text-fg-muted hover:bg-bg hover:text-fg",
                                )}
                            >
                                <Smartphone className="h-3 w-3" aria-hidden />
                                Mobile
                            </button>
                        </div>
                    </div>
                    <div className="min-h-[300px] flex-1 overflow-auto bg-zinc-100 p-4 dark:bg-zinc-900">
                        <div
                            className={cn(
                                "mx-auto h-full overflow-hidden rounded-md border border-border-strong bg-white shadow-sm transition-[max-width] duration-300",
                                previewMode === "mobile"
                                    ? "max-w-[375px]"
                                    : "max-w-full",
                            )}
                        >
                            <LivePreview ref={previewRef} code={editorCode} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer azioni — sticky in fondo, primario sempre raggiungibile */}
            <div className="flex items-center justify-between gap-2 border-t border-border bg-bg-alt px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-3">
                <div className="flex shrink-0 items-center gap-2">
                    {lesson.order > 1 ? (
                        <Link
                            href={`/play/${courseSlug}/${lesson.order - 1}`}
                            aria-label="Lezione precedente"
                            className="press inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-bg px-2.5 py-2 font-mono text-[10.5px] uppercase tracking-[0.08em] text-fg hover:bg-bg-alt sm:px-3"
                        >
                            <ArrowLeft className="h-3 w-3" aria-hidden />
                            <span className="hidden sm:inline">
                                Precedente
                            </span>
                        </Link>
                    ) : null}
                </div>
                <div className="flex flex-1 items-center justify-end gap-2 sm:flex-initial">
                    {run.kind === "success" ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="press inline-flex w-full items-center justify-center gap-2 rounded-md border border-accent bg-accent px-4 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-bg hover:bg-accent/90 sm:w-auto"
                        >
                            {lesson.order < totalLessons
                                ? "Prossima"
                                : "Fine corso"}
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleVerify}
                            disabled={
                                run.kind === "validating" || showSolution
                            }
                            className="press inline-flex w-full items-center justify-center gap-2 rounded-md border border-fg bg-fg px-4 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-bg hover:bg-fg/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                            {run.kind === "validating"
                                ? "Verifico…"
                                : "Verifica"}
                            <Check className="h-3.5 w-3.5" aria-hidden />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Tab mobile dello switcher in cima al body. Solo visibile sotto lg.
 * Mostra un pallino piccolo (status) sul tab Lezione quando l'utente
 * ha appena verificato (success o error) ed è su un altro tab — così
 * sa che c'è qualcosa da vedere lì.
 */
function MobileTab({
    active,
    onClick,
    children,
    badge,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    badge?: "ok" | "err" | null;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "press relative flex-1 px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors",
                active
                    ? "border-b-2 border-fg text-fg"
                    : "border-b-2 border-transparent text-fg-muted hover:text-fg",
            )}
        >
            {children}
            {!active && badge ? (
                <span
                    aria-hidden
                    className={cn(
                        "absolute right-2 top-2 h-1.5 w-1.5 rounded-full",
                        badge === "ok" ? "bg-accent" : "bg-fg",
                    )}
                />
            ) : null}
        </button>
    );
}

// ─────────────────────────────────────────────────────────────────────────
// Helpers

const progressSubscribe = (cb: () => void) => {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("storage", cb);
    window.addEventListener("lp-play-progress-update", cb);
    return () => {
        window.removeEventListener("storage", cb);
        window.removeEventListener("lp-play-progress-update", cb);
    };
};

/**
 * Riproduce uno script di feedback (success o encourage) usando
 * il TTS player principale → cerca prima l'MP3 pre-renderizzato
 * con la voce di Luca, fallback gestito da preference utente
 * (mai più speechSynthesis fortuito qui).
 *
 * Nota: questa funzione vive fuori dal componente perché richiede
 * di avere accesso a setIsSpeaking via closure dalla call site.
 * In realtà il setIsSpeaking lo passiamo tramite onStart/onEnd.
 */
async function playFeedback(audioPath: string, script: string): Promise<void> {
    const handle = await playTts({
        audioPath,
        script,
        // onStart/onEnd: il lesson runner scope già aggiorna isSpeaking
        // tramite il TTS principale del mount. Per i feedback è ok
        // lasciarli no-op — l'audio parte e finisce, l'avatar mood
        // è già stato cambiato dal chiamante.
    });
    handle.play();
}
