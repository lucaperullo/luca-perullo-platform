"use client";

import { useState, useSyncExternalStore } from "react";
import { ArrowRight, X } from "lucide-react";
import { LottieAvatar } from "./lottie-avatar";

const KEY = "lp-play-welcome-seen-v1";
const EVENT = "lp-play-welcome-update";

/**
 * Welcome modal mostrato la PRIMA volta che l'utente apre una lezione.
 * Spiega in 3 schermate il concetto di apertura/chiusura dei tag e
 * come si "parla" all'editor.
 *
 * Una volta chiuso, è ricordato in localStorage e non riappare più.
 * (Si può forzarlo via `lp-play-welcome-seen-v1` cancellato dal devtool.)
 */
export function WelcomeModal() {
    const seen = useSyncExternalStore<boolean>(
        subscribe,
        () => {
            if (typeof window === "undefined") return true;
            return window.localStorage.getItem(KEY) === "1";
        },
        () => true, // SSR: pretendi sia visto, mostra il modal solo dopo idratazione
    );

    const [step, setStep] = useState(0);
    const [closed, setClosed] = useState(false);

    // Quando `seen` (dal localStorage) è true, il modal non si renderizza
    // proprio. Niente reset di step/closed necessario perché lo userai una
    // volta sola: se cancelli localStorage e ricarichi, lo useState parte
    // da capo.
    if (seen || closed) return null;

    const next = () => {
        if (step < STEPS.length - 1) {
            setStep((s) => s + 1);
        } else {
            close();
        }
    };

    const close = () => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(KEY, "1");
            window.dispatchEvent(new Event(EVENT));
        }
        setClosed(true);
    };

    const cur = STEPS[step];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
        >
            <div className="relative w-full max-w-md rounded-lg border border-border-strong bg-bg p-6 shadow-2xl sm:p-8">
                <button
                    type="button"
                    onClick={close}
                    aria-label="Chiudi"
                    className="press absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-md text-fg-soft hover:bg-bg-alt hover:text-fg"
                >
                    <X className="h-4 w-4" aria-hidden />
                </button>

                <div className="flex items-start gap-4">
                    <LottieAvatar mood="encouraging" size={64} isSpeaking={false} />
                    <div className="flex-1 pt-1">
                        <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                            {step + 1} di {STEPS.length}
                        </p>
                        <h2
                            id="welcome-title"
                            className="mt-1 text-xl font-semibold tracking-tight text-fg"
                        >
                            {cur.title}
                        </h2>
                    </div>
                </div>

                <div className="mt-5 space-y-3 text-[14.5px] leading-[1.6] text-fg">
                    {cur.content}
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                        {STEPS.map((_, i) => (
                            <span
                                key={i}
                                className={
                                    i === step
                                        ? "h-1.5 w-6 rounded-full bg-fg"
                                        : i < step
                                          ? "h-1.5 w-1.5 rounded-full bg-fg-muted"
                                          : "h-1.5 w-1.5 rounded-full bg-border-strong"
                                }
                                aria-hidden
                            />
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={next}
                        className="press inline-flex items-center gap-2 rounded-md border border-fg bg-fg px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-bg hover:bg-fg/90"
                    >
                        {step < STEPS.length - 1 ? "Avanti" : "Inizia"}
                        <ArrowRight className="h-3 w-3" aria-hidden />
                    </button>
                </div>
            </div>
        </div>
    );
}

const STEPS = [
    {
        title: "Ciao, sono Luca",
        content: (
            <>
                <p>
                    Insieme costruiamo un sito vero, lezione dopo lezione,
                    scrivendo il codice tu — non guardandolo in un video.
                </p>
                <p className="text-fg-muted">
                    Servono ~30 minuti, niente da installare, niente da
                    pagare. Si va per piccoli passi.
                </p>
            </>
        ),
    },
    {
        title: "I tag HTML hanno DUE parti",
        content: (
            <>
                <p>
                    Ogni tag HTML è come una scatola: si{" "}
                    <strong>apre</strong> e si <strong>chiude</strong>.
                </p>
                <pre className="rounded-md border border-border bg-bg-alt p-3 font-mono text-[12.5px] text-fg">
                    <code>{`<header>      ← apertura
   ...
</header>     ← chiusura (con la slash)`}</code>
                </pre>
                <p className="text-fg-muted">
                    Quando scrivi il tag d&apos;apertura nell&apos;editor,
                    quello di chiusura te lo aggiungo io: tu pensa solo al
                    contenuto.
                </p>
            </>
        ),
    },
    {
        title: "Tasti che servono",
        content: (
            <>
                <p>
                    I caratteri <code className="font-mono">&lt;</code> e{" "}
                    <code className="font-mono">&gt;</code> li trovi qui:
                </p>
                <ul className="space-y-1.5 text-[13.5px]">
                    <li>
                        <span className="font-mono text-fg-soft">Mac:</span>{" "}
                        il tasto a sinistra dello{" "}
                        <code className="font-mono">Z</code> (con Shift per{" "}
                        <code className="font-mono">&gt;</code>).
                    </li>
                    <li>
                        <span className="font-mono text-fg-soft">Win:</span>{" "}
                        <code className="font-mono">Shift + ,</code> per{" "}
                        <code className="font-mono">&lt;</code>,{" "}
                        <code className="font-mono">Shift + .</code> per{" "}
                        <code className="font-mono">&gt;</code>.
                    </li>
                </ul>
                <p className="text-fg-muted">
                    Se ti dimentichi, il pannello &quot;Tasti per
                    HTML&quot; è sempre visibile a sinistra durante la
                    lezione.
                </p>
            </>
        ),
    },
];

const subscribe = (cb: () => void) => {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("storage", cb);
    window.addEventListener(EVENT, cb);
    return () => {
        window.removeEventListener("storage", cb);
        window.removeEventListener(EVENT, cb);
    };
};
