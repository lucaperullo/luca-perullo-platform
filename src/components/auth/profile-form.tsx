"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProfileFormProps = {
    userId: string;
    initialName: string;
    initialInterests: string[];
    initialExperience: string | null;
    initialTimeline?: string | null;
};

type ExperienceLevel = "mai" | "poco" | "abbastanza" | "dev";
type ClientTimeline = "subito" | "breve" | "flessibile" | "esplorando";

const STUDENT_INTERESTS = ["imparare-codice", "info-corsi"];
const CLIENT_INTERESTS = ["costruire-sito", "consulenza-ai"];

const INTEREST_OPTIONS = [
    { id: "imparare-codice", label: "Imparare a programmare" },
    { id: "costruire-sito", label: "Voglio un sito per la mia attività" },
    { id: "consulenza-ai", label: "Consulenza AI / automazioni" },
    { id: "info-corsi", label: "Info sui corsi" },
    { id: "curiosare", label: "Sono qui di passaggio" },
];

const EXPERIENCE_OPTIONS: { id: ExperienceLevel; label: string }[] = [
    { id: "mai", label: "Mai scritto codice" },
    { id: "poco", label: "Un po' di HTML/CSS" },
    { id: "abbastanza", label: "So scrivere codice" },
    { id: "dev", label: "Sono uno sviluppatore" },
];

const TIMELINE_OPTIONS: { id: ClientTimeline; label: string }[] = [
    { id: "subito", label: "Subito (1-2 settimane)" },
    { id: "breve", label: "Nel breve (1-2 mesi)" },
    { id: "flessibile", label: "Flessibile, niente fretta" },
    { id: "esplorando", label: "Sto solo esplorando" },
];

export function ProfileForm({
    userId,
    initialName,
    initialInterests,
    initialExperience,
    initialTimeline,
}: ProfileFormProps) {
    const router = useRouter();
    const [name, setName] = useState(initialName);
    const [interests, setInterests] = useState<string[]>(initialInterests);
    const [experience, setExperience] = useState<ExperienceLevel | null>(
        (initialExperience as ExperienceLevel | null) ?? null,
    );
    const [timeline, setTimeline] = useState<ClientTimeline | null>(
        (initialTimeline as ClientTimeline | null) ?? null,
    );
    const [isPending, startTransition] = useTransition();
    const [feedback, setFeedback] = useState<
        | { kind: "idle" }
        | { kind: "ok"; message: string }
        | { kind: "error"; message: string }
    >({ kind: "idle" });

    // Stesso branching logic dell'onboarding: studenti vedono experience,
    // clienti vedono timeline, curiosi vedono nulla.
    const showsExperience = interests.some((i) =>
        STUDENT_INTERESTS.includes(i),
    );
    const showsTimeline =
        !showsExperience && interests.some((i) => CLIENT_INTERESTS.includes(i));

    const dirty =
        name.trim() !== initialName.trim() ||
        JSON.stringify([...interests].sort()) !==
            JSON.stringify([...initialInterests].sort()) ||
        experience !== (initialExperience ?? null) ||
        timeline !== (initialTimeline ?? null);

    const toggleInterest = (id: string) => {
        setInterests((cur) => {
            const next = cur.includes(id)
                ? cur.filter((x) => x !== id)
                : [...cur, id];
            // Se cambia categoria di interessi, resetta la risposta Q3
            // vecchia per coerenza con quanto verrà salvato.
            const wasStudent = cur.some((x) => STUDENT_INTERESTS.includes(x));
            const isStudent = next.some((x) => STUDENT_INTERESTS.includes(x));
            if (wasStudent !== isStudent) {
                setExperience(null);
                setTimeline(null);
            }
            return next;
        });
    };

    const onSave = () => {
        setFeedback({ kind: "idle" });
        startTransition(async () => {
            try {
                // Server-side via API route: bypassa estensioni che
                // bloccano cross-origin (anti-tracker, ad blocker, ecc).
                const res = await fetch("/api/profile/update", {
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
                setFeedback({ kind: "ok", message: "Salvato." });
                // Refresh dei server components così la pagina riflette
                // i nuovi dati senza un reload completo.
                router.refresh();
            } catch (e) {
                setFeedback({
                    kind: "error",
                    message: e instanceof Error ? e.message : "Errore.",
                });
            }
        });
        void userId; // server lo deriva dal cookie sessione
    };

    return (
        <div className="flex flex-col gap-7">
            {/* Nome */}
            <div className="flex flex-col gap-2">
                <label className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                    Nome
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Come ti chiami"
                    className="w-full max-w-md rounded-md border border-border bg-bg px-3.5 py-2.5 text-[15px] text-fg outline-none transition-colors focus:border-fg"
                />
            </div>

            {/* Interessi */}
            <div className="flex flex-col gap-2">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                    Cosa cerchi qui (anche più di uno)
                </span>
                <ul className="space-y-2">
                    {INTEREST_OPTIONS.map((opt) => {
                        const selected = interests.includes(opt.id);
                        return (
                            <li key={opt.id}>
                                <button
                                    type="button"
                                    onClick={() => toggleInterest(opt.id)}
                                    className={cn(
                                        "press flex w-full items-center gap-3 rounded-md border px-3.5 py-2.5 text-left transition-colors",
                                        selected
                                            ? "border-fg bg-fg/5"
                                            : "border-border hover:border-border-strong hover:bg-bg-alt",
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "grid h-4 w-4 shrink-0 place-items-center rounded-sm border",
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
                                    <span className="text-[14px] text-fg">
                                        {opt.label}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Esperienza — solo per studenti */}
            {showsExperience ? (
                <div className="flex flex-col gap-2">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                        Esperienza con la programmazione
                    </span>
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {EXPERIENCE_OPTIONS.map((opt) => {
                            const selected = experience === opt.id;
                            return (
                                <li key={opt.id}>
                                    <button
                                        type="button"
                                        onClick={() => setExperience(opt.id)}
                                        className={cn(
                                            "press flex w-full items-center gap-3 rounded-md border px-3.5 py-2.5 text-left transition-colors",
                                            selected
                                                ? "border-fg bg-fg/5"
                                                : "border-border hover:border-border-strong hover:bg-bg-alt",
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "grid h-4 w-4 shrink-0 place-items-center rounded-full border",
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
                                        <span className="text-[14px] text-fg">
                                            {opt.label}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : null}

            {/* Timeline — solo per clienti */}
            {showsTimeline ? (
                <div className="flex flex-col gap-2">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                        Quando ti serve
                    </span>
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {TIMELINE_OPTIONS.map((opt) => {
                            const selected = timeline === opt.id;
                            return (
                                <li key={opt.id}>
                                    <button
                                        type="button"
                                        onClick={() => setTimeline(opt.id)}
                                        className={cn(
                                            "press flex w-full items-center gap-3 rounded-md border px-3.5 py-2.5 text-left transition-colors",
                                            selected
                                                ? "border-fg bg-fg/5"
                                                : "border-border hover:border-border-strong hover:bg-bg-alt",
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "grid h-4 w-4 shrink-0 place-items-center rounded-full border",
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
                                        <span className="text-[14px] text-fg">
                                            {opt.label}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : null}

            {/* Azioni */}
            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    onClick={onSave}
                    disabled={!dirty || isPending}
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
                        "Salva modifiche"
                    )}
                </button>
                {feedback.kind === "ok" ? (
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11.5px] text-accent">
                        <Check className="h-3.5 w-3.5" aria-hidden />
                        {feedback.message}
                    </span>
                ) : null}
                {feedback.kind === "error" ? (
                    <span className="font-mono text-[11.5px] text-fg-muted">
                        {feedback.message}
                    </span>
                ) : null}
            </div>
        </div>
    );
}
