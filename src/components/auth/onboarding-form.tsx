"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type OnboardingFormProps = {
    userId: string;
    defaultName: string;
    next: string;
};

type ExperienceLevel = "mai" | "poco" | "abbastanza" | "dev";
type ClientTimeline = "subito" | "breve" | "flessibile" | "esplorando";

const INTEREST_OPTIONS = [
    {
        id: "imparare-codice",
        label: "Imparare a programmare",
        body: "Voglio capire come si fa un sito da zero",
    },
    {
        id: "costruire-sito",
        label: "Voglio un sito per la mia attività",
        body: "Cerco qualcuno che me lo costruisca",
    },
    {
        id: "consulenza-ai",
        label: "Consulenza AI / automazioni",
        body: "Mi serve aiuto per integrare AI nei miei processi",
    },
    {
        id: "info-corsi",
        label: "Info sui corsi",
        body: "Voglio formarmi seriamente",
    },
    {
        id: "curiosare",
        label: "Sono qui di passaggio",
        body: "Curioso, niente di specifico",
    },
];

const EXPERIENCE_OPTIONS: { id: ExperienceLevel; label: string; body: string }[] = [
    { id: "mai", label: "Mai scritto codice", body: "Sono un principiante completo" },
    { id: "poco", label: "Un po' di HTML/CSS", body: "Ho seguito qualche tutorial" },
    { id: "abbastanza", label: "So scrivere codice", body: "JavaScript / Python / altro" },
    { id: "dev", label: "Sono uno sviluppatore", body: "È il mio mestiere" },
];

const TIMELINE_OPTIONS: { id: ClientTimeline; label: string; body: string }[] = [
    { id: "subito", label: "Subito", body: "Mi serve nelle prossime 1-2 settimane" },
    { id: "breve", label: "Nel breve", body: "Idealmente 1-2 mesi" },
    { id: "flessibile", label: "Flessibile", body: "Niente urgenza, valuto bene" },
    { id: "esplorando", label: "Sto esplorando", body: "Voglio capire prezzi e opzioni" },
];

const STUDENT_INTERESTS = ["imparare-codice", "info-corsi"];
const CLIENT_INTERESTS = ["costruire-sito", "consulenza-ai"];

/**
 * Decide la destinazione post-onboarding in base agli interessi.
 * Priorità: imparare > costruire > consulenza > info-corsi > curiosare.
 */
function computeRedirect(interests: string[], fallback: string): string {
    if (interests.includes("imparare-codice")) return "/play";
    if (interests.includes("costruire-sito")) return "/servizi#siti";
    if (interests.includes("consulenza-ai")) return "/servizi#consulenze";
    if (interests.includes("info-corsi")) return "/play";
    if (interests.includes("curiosare")) return "/";
    return fallback;
}

export function OnboardingForm({
    userId,
    defaultName,
    next,
}: OnboardingFormProps) {
    const [step, setStep] = useState(0);
    const [name, setName] = useState(defaultName);
    const [interests, setInterests] = useState<string[]>([]);
    const [experience, setExperience] = useState<ExperienceLevel | null>(null);
    const [timeline, setTimeline] = useState<ClientTimeline | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    // Branching logic basato sugli interessi:
    // - Se include studente → chiedi experience
    // - Else se include cliente → chiedi timeline
    // - Else (solo curiosare o vuoto) → salta Q3
    const showsExperience = interests.some((i) => STUDENT_INTERESTS.includes(i));
    const showsTimeline =
        !showsExperience && interests.some((i) => CLIENT_INTERESTS.includes(i));
    const hasStep3 = showsExperience || showsTimeline;
    const totalSteps = hasStep3 ? 3 : 2;

    const toggleInterest = (id: string) => {
        setInterests((cur) => {
            const next = cur.includes(id)
                ? cur.filter((x) => x !== id)
                : [...cur, id];
            // Se l'utente cambia categoria di interessi e Q3 cambia ramo,
            // resetto la risposta Q3 vecchia per non salvare dati incoerenti.
            const wasStudent = cur.some((x) => STUDENT_INTERESTS.includes(x));
            const isStudent = next.some((x) => STUDENT_INTERESTS.includes(x));
            if (wasStudent !== isStudent) {
                setExperience(null);
                setTimeline(null);
            }
            return next;
        });
    };

    const onSubmit = async () => {
        setErr(null);
        setIsPending(true);

        const destination =
            next && next !== "/play" ? next : computeRedirect(interests, next);

        try {
            // Server-side via /api/onboarding/complete: bypassa eventuali
            // estensioni browser che bloccano richieste cross-origin
            // verso Supabase (anti-tracker, ad blocker, ecc).
            const res = await fetch("/api/onboarding/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: name,
                    interests,
                    experienceLevel: showsExperience ? experience : null,
                    clientTimeline: showsTimeline ? timeline : null,
                }),
            });

            if (!res.ok) {
                const data = (await res.json().catch(() => ({}))) as {
                    error?: string;
                };
                throw new Error(
                    data.error ?? `Errore ${res.status}. Riprova.`,
                );
            }

            window.location.href = destination;
        } catch (e) {
            console.error("[onboarding] submit error", e);
            setErr(e instanceof Error ? e.message : "Errore. Riprova.");
            setIsPending(false);
        }
        // Il `userId` non serve più: il server lo ricava dalla sessione.
        // Manteniamo la prop per compatibilità con la pagina che la passa.
        void userId;
    };

    const canNext0 = name.trim().length > 0;
    const canNext1 = interests.length > 0;
    const canFinish = !hasStep3
        ? canNext1
        : showsExperience
          ? experience !== null
          : timeline !== null;

    // Step 1 senza Q3 = step finale, altrimenti porta a Q3
    const handleStep1Next = () => {
        if (hasStep3) {
            setStep(2);
        } else {
            onSubmit();
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Step indicator */}
            <div className="flex items-center gap-2">
                {Array.from({ length: totalSteps }, (_, i) => (
                    <span
                        key={i}
                        className={cn(
                            "h-1.5 rounded-full transition-all",
                            i === step ? "w-8 bg-fg" : "w-1.5 bg-border-strong",
                            i < step && "bg-fg-muted",
                        )}
                        aria-hidden
                    />
                ))}
            </div>

            {step === 0 ? (
                <div className="space-y-5">
                    <div>
                        <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                            Domanda 1 di {totalSteps}
                        </p>
                        <h2 className="mt-1 text-xl font-semibold tracking-tight text-fg">
                            Come ti chiami?
                        </h2>
                        <p className="mt-1.5 text-[14px] text-fg-muted">
                            Solo per salutarti. Niente cognome se non vuoi.
                        </p>
                    </div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Es. Marco"
                        className="w-full rounded-md border border-border bg-bg px-3.5 py-3 text-[16px] text-fg outline-none transition-colors focus:border-fg"
                        autoFocus
                    />
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            disabled={!canNext0}
                            className="press inline-flex items-center gap-2 rounded-md border border-fg bg-fg px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] text-bg hover:bg-fg/90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Avanti
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                        </button>
                    </div>
                </div>
            ) : null}

            {step === 1 ? (
                <div className="space-y-5">
                    <div>
                        <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                            Domanda 2 di {totalSteps}
                        </p>
                        <h2 className="mt-1 text-xl font-semibold tracking-tight text-fg">
                            Cosa ti porta qui?
                        </h2>
                        <p className="mt-1.5 text-[14px] text-fg-muted">
                            Anche più di una. Scegli quello che ti
                            rappresenta adesso — la prossima domanda si
                            adatta alla tua scelta.
                        </p>
                    </div>
                    <ul className="space-y-2">
                        {INTEREST_OPTIONS.map((opt) => {
                            const selected = interests.includes(opt.id);
                            return (
                                <li key={opt.id}>
                                    <button
                                        type="button"
                                        onClick={() => toggleInterest(opt.id)}
                                        className={cn(
                                            "press flex w-full items-start gap-3 rounded-md border px-4 py-3 text-left transition-colors",
                                            selected
                                                ? "border-fg bg-fg/5"
                                                : "border-border hover:border-border-strong hover:bg-bg-alt",
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-sm border",
                                                selected
                                                    ? "border-fg bg-fg text-bg"
                                                    : "border-border-strong",
                                            )}
                                            aria-hidden
                                        >
                                            {selected ? (
                                                <Check className="h-3 w-3" />
                                            ) : null}
                                        </span>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[14.5px] font-medium text-fg">
                                                {opt.label}
                                            </span>
                                            <span className="text-[12.5px] text-fg-muted">
                                                {opt.body}
                                            </span>
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    {err ? (
                        <p className="text-[12.5px] text-fg-muted">{err}</p>
                    ) : null}
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setStep(0)}
                            className="press inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-bg px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-fg hover:bg-bg-alt"
                        >
                            <ArrowLeft className="h-3 w-3" aria-hidden />
                            Indietro
                        </button>
                        <button
                            type="button"
                            onClick={handleStep1Next}
                            disabled={!canNext1 || isPending}
                            className="press inline-flex items-center gap-2 rounded-md border border-fg bg-fg px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] text-bg hover:bg-fg/90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPending ? (
                                <>
                                    <Loader2
                                        className="h-3.5 w-3.5 animate-spin"
                                        aria-hidden
                                    />
                                    Salvo…
                                </>
                            ) : hasStep3 ? (
                                <>
                                    Avanti
                                    <ArrowRight
                                        className="h-3.5 w-3.5"
                                        aria-hidden
                                    />
                                </>
                            ) : (
                                <>
                                    Inizia
                                    <ArrowRight
                                        className="h-3.5 w-3.5"
                                        aria-hidden
                                    />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : null}

            {step === 2 && showsExperience ? (
                <div className="space-y-5">
                    <div>
                        <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                            Domanda 3 di {totalSteps}
                        </p>
                        <h2 className="mt-1 text-xl font-semibold tracking-tight text-fg">
                            Hai mai scritto codice?
                        </h2>
                        <p className="mt-1.5 text-[14px] text-fg-muted">
                            Per calibrare le spiegazioni. Se sei
                            principiante, vedrai più suggerimenti.
                        </p>
                    </div>
                    <ul className="space-y-2">
                        {EXPERIENCE_OPTIONS.map((opt) => {
                            const selected = experience === opt.id;
                            return (
                                <li key={opt.id}>
                                    <button
                                        type="button"
                                        onClick={() => setExperience(opt.id)}
                                        className={cn(
                                            "press flex w-full items-start gap-3 rounded-md border px-4 py-3 text-left transition-colors",
                                            selected
                                                ? "border-fg bg-fg/5"
                                                : "border-border hover:border-border-strong hover:bg-bg-alt",
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                                                selected
                                                    ? "border-fg bg-fg"
                                                    : "border-border-strong",
                                            )}
                                            aria-hidden
                                        >
                                            {selected ? (
                                                <span className="block h-1.5 w-1.5 rounded-full bg-bg" />
                                            ) : null}
                                        </span>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[14.5px] font-medium text-fg">
                                                {opt.label}
                                            </span>
                                            <span className="text-[12.5px] text-fg-muted">
                                                {opt.body}
                                            </span>
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    {err ? (
                        <p className="text-[12.5px] text-fg-muted">{err}</p>
                    ) : null}
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            disabled={isPending}
                            className="press inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-bg px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-fg hover:bg-bg-alt"
                        >
                            <ArrowLeft className="h-3 w-3" aria-hidden />
                            Indietro
                        </button>
                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={!canFinish || isPending}
                            className="press inline-flex items-center gap-2 rounded-md border border-fg bg-fg px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] text-bg hover:bg-fg/90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPending ? (
                                <>
                                    <Loader2
                                        className="h-3.5 w-3.5 animate-spin"
                                        aria-hidden
                                    />
                                    Salvo…
                                </>
                            ) : (
                                <>
                                    Inizia il corso
                                    <ArrowRight
                                        className="h-3.5 w-3.5"
                                        aria-hidden
                                    />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : null}

            {step === 2 && showsTimeline ? (
                <div className="space-y-5">
                    <div>
                        <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                            Domanda 3 di {totalSteps}
                        </p>
                        <h2 className="mt-1 text-xl font-semibold tracking-tight text-fg">
                            Quando ti serve?
                        </h2>
                        <p className="mt-1.5 text-[14px] text-fg-muted">
                            Per capire l&apos;urgenza del tuo progetto.
                            Mostro proposte e tempistiche adatte.
                        </p>
                    </div>
                    <ul className="space-y-2">
                        {TIMELINE_OPTIONS.map((opt) => {
                            const selected = timeline === opt.id;
                            return (
                                <li key={opt.id}>
                                    <button
                                        type="button"
                                        onClick={() => setTimeline(opt.id)}
                                        className={cn(
                                            "press flex w-full items-start gap-3 rounded-md border px-4 py-3 text-left transition-colors",
                                            selected
                                                ? "border-fg bg-fg/5"
                                                : "border-border hover:border-border-strong hover:bg-bg-alt",
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                                                selected
                                                    ? "border-fg bg-fg"
                                                    : "border-border-strong",
                                            )}
                                            aria-hidden
                                        >
                                            {selected ? (
                                                <span className="block h-1.5 w-1.5 rounded-full bg-bg" />
                                            ) : null}
                                        </span>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[14.5px] font-medium text-fg">
                                                {opt.label}
                                            </span>
                                            <span className="text-[12.5px] text-fg-muted">
                                                {opt.body}
                                            </span>
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    {err ? (
                        <p className="text-[12.5px] text-fg-muted">{err}</p>
                    ) : null}
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            disabled={isPending}
                            className="press inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-bg px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-fg hover:bg-bg-alt"
                        >
                            <ArrowLeft className="h-3 w-3" aria-hidden />
                            Indietro
                        </button>
                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={!canFinish || isPending}
                            className="press inline-flex items-center gap-2 rounded-md border border-fg bg-fg px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] text-bg hover:bg-fg/90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPending ? (
                                <>
                                    <Loader2
                                        className="h-3.5 w-3.5 animate-spin"
                                        aria-hidden
                                    />
                                    Salvo…
                                </>
                            ) : (
                                <>
                                    Vedi i pacchetti
                                    <ArrowRight
                                        className="h-3.5 w-3.5"
                                        aria-hidden
                                    />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
