"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { bustAnchor } from "./shared-bust";
import { useReducedMotion } from "./use-reduced-motion";

const STORAGE_KEY = "lp.cookies.v1";
const POLICY_VERSION = 1;
const POLICY_HREF = "/legal/cookie-policy";

type Categories = {
    necessary: true;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
};

type ConsentRecord = {
    version: number;
    timestamp: string;
    method: "accept-all" | "reject-all" | "customize";
    categories: Categories;
};

type View = "dialogue" | "choices" | "panel";

const dialogue: { html: string }[] = [
    { html: "Ciao. Benvenuto." },
    { html: "Una nota veloce sui cookie prima di entrare." },
    { html: "Alcuni sono essenziali — servono al sito per funzionare." },
    {
        html: "Altri sono opzionali: <em>preferenze</em>, <em>analytics</em>, <em>marketing</em>. Disattivati per default.",
    },
    {
        html: "La tua scelta viene salvata con timestamp e puoi cambiarla quando vuoi.<span class=\"cc-small\">Conservata in locale — richiesto dal GDPR per tracciabilità.</span>",
    },
    { html: "Che facciamo?" },
];

const choices = [
    {
        key: "accept-all" as const,
        label: "Accetta tutti",
        sub: "Necessari, funzionali, analytics e marketing.",
    },
    {
        key: "reject-all" as const,
        label: "Rifiuta opzionali",
        sub: "Solo i cookie strettamente necessari.",
    },
    {
        key: "customize" as const,
        label: "Personalizza",
        sub: "Scegli categoria per categoria.",
    },
];

function loadConsent(): ConsentRecord | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as ConsentRecord;
        if (parsed.version !== POLICY_VERSION) return null;
        return parsed;
    } catch {
        return null;
    }
}

function saveConsent(
    method: ConsentRecord["method"],
    categories: Pick<Categories, "functional" | "analytics" | "marketing">,
): ConsentRecord {
    const record: ConsentRecord = {
        version: POLICY_VERSION,
        timestamp: new Date().toISOString(),
        method,
        categories: {
            necessary: true,
            functional: categories.functional,
            analytics: categories.analytics,
            marketing: categories.marketing,
        },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    window.dispatchEvent(new CustomEvent("cookieconsent:change", { detail: record }));
    return record;
}

/**
 * Tiny "blip" — soft square-wave ping for keystrokes / selection / commit.
 * Lazy-creates the AudioContext on first user gesture so autoplay policy
 * is satisfied. Volume kept low (0.025–0.05) to read as texture, not noise.
 */
function useBlip() {
    const ctxRef = useRef<AudioContext | null>(null);
    return useCallback(
        (freq = 520, dur = 0.05, type: OscillatorType = "square", vol = 0.04) => {
            try {
                const Ctor =
                    window.AudioContext ||
                    (window as unknown as { webkitAudioContext?: typeof AudioContext })
                        .webkitAudioContext;
                if (!Ctor) return;
                ctxRef.current ??= new Ctor();
                if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
                const ctx = ctxRef.current;
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.type = type;
                o.frequency.value = freq;
                g.gain.value = vol;
                o.connect(g).connect(ctx.destination);
                o.start();
                g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
                o.stop(ctx.currentTime + dur + 0.02);
            } catch {
                // ignore — sound is decorative
            }
        },
        [],
    );
}

export function CookieConsent() {
    // Hydration-safe: never render on the server, decide on mount.
    const [hydrated, setHydrated] = useState(false);
    const [open, setOpen] = useState(false);
    const [view, setView] = useState<View>("dialogue");
    const [step, setStep] = useState(0);
    const [typed, setTyped] = useState("");
    const [typing, setTyping] = useState(false);
    const [activeChoice, setActiveChoice] = useState(0);
    const [showGem, setShowGem] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [prefs, setPrefs] = useState({
        functional: false,
        analytics: false,
        marketing: false,
    });

    const cancelTypeRef = useRef<(() => void) | null>(null);
    const reducedMotion = useReducedMotion();
    const blip = useBlip();

    // ─── Boot: decide whether to open the banner on first paint ──────
    useEffect(() => {
        setHydrated(true);

        // URL escape hatch for testing: `?cc=reset` clears consent and
        // strips the param so reloads stay clean. `?cc=manage` opens
        // straight onto the customize panel.
        let urlIntent: "reset" | "manage" | null = null;
        try {
            const u = new URL(window.location.href);
            const cc = u.searchParams.get("cc");
            if (cc === "reset") {
                localStorage.removeItem(STORAGE_KEY);
                urlIntent = "reset";
                u.searchParams.delete("cc");
                window.history.replaceState(null, "", u.toString());
            } else if (cc === "manage") {
                urlIntent = "manage";
                u.searchParams.delete("cc");
                window.history.replaceState(null, "", u.toString());
            }
        } catch {
            // Ignore — URL access can fail in some embed contexts.
        }

        const saved = loadConsent();
        if (urlIntent === "manage") {
            setOpen(true);
            setView("panel");
            if (saved) {
                setPrefs({
                    functional: saved.categories.functional,
                    analytics: saved.categories.analytics,
                    marketing: saved.categories.marketing,
                });
            }
        } else if (!saved) {
            setOpen(true);
            setView("dialogue");
            setStep(0);
        } else {
            setShowGem(true);
            setPrefs({
                functional: saved.categories.functional,
                analytics: saved.categories.analytics,
                marketing: saved.categories.marketing,
            });
        }

        // Dev helper: window.CookieQuest in DevTools to inspect / reset.
        const helper = {
            get: loadConsent,
            reset: () => {
                localStorage.removeItem(STORAGE_KEY);
                window.location.reload();
            },
            open: () => {
                setShowGem(false);
                setOpen(true);
                setView("dialogue");
                setStep(0);
            },
        };
        (window as unknown as { CookieQuest?: typeof helper }).CookieQuest = helper;
    }, []);

    // ─── Typewriter for the current dialogue line ────────────────────
    useEffect(() => {
        if (view !== "dialogue") return;
        const text = dialogue[step].html;

        cancelTypeRef.current?.();

        if (reducedMotion) {
            setTyped(text);
            setTyping(false);
            return;
        }

        let cancelled = false;
        let i = 0;
        setTyped("");
        setTyping(true);
        let timer: ReturnType<typeof setTimeout> | null = null;

        const next = () => {
            if (cancelled) return;
            // Walk past inline tags atomically so we don't show "<em" mid-tag.
            while (i < text.length && text[i] === "<") {
                const close = text.indexOf(">", i);
                if (close < 0) break;
                i = close + 1;
            }
            if (i >= text.length) {
                setTyping(false);
                return;
            }
            i++;
            setTyped(text.slice(0, i));
            const ch = text[i - 1] ?? "";
            if (/\S/.test(ch) && Math.random() < 0.5) {
                blip(700 + Math.random() * 180, 0.015, "square", 0.025);
            }
            timer = setTimeout(next, /[.,!?…]/.test(ch) ? 120 : 18);
        };

        cancelTypeRef.current = () => {
            cancelled = true;
            if (timer) clearTimeout(timer);
            setTyped(text);
            setTyping(false);
        };
        next();
        return () => {
            cancelled = true;
            if (timer) clearTimeout(timer);
        };
    }, [view, step, reducedMotion, blip]);

    // ─── Advance dialogue (click or Space) ──────────────────────────
    const nextOrComplete = useCallback(() => {
        if (typing) {
            cancelTypeRef.current?.();
            return;
        }
        if (step < dialogue.length - 1) {
            blip(540, 0.04);
            setStep((s) => s + 1);
        } else {
            blip(820, 0.06);
            setView("choices");
            setActiveChoice(0);
        }
    }, [typing, step, blip]);

    const finish = useCallback(
        (method: ConsentRecord["method"]) => {
            const final =
                method === "accept-all"
                    ? { functional: true, analytics: true, marketing: true }
                    : method === "reject-all"
                      ? { functional: false, analytics: false, marketing: false }
                      : prefs;
            saveConsent(method, final);
            setPrefs(final);
            // The cookie anchor unmounts when `open` flips false; the
            // shared bust then morphs back onto the profile anchor.
            setOpen(false);
            setShowGem(true);
            blip(1000, 0.08, "triangle", 0.05);
            setToast(
                method === "reject-all"
                    ? "Cookie opzionali rifiutati"
                    : method === "accept-all"
                      ? "Tutti i cookie accettati"
                      : "Preferenze salvate",
            );
            window.setTimeout(() => setToast(null), 2200);
        },
        [prefs, blip],
    );

    const runChoice = useCallback(
        (key: (typeof choices)[number]["key"]) => {
            blip(900, 0.05);
            if (key === "customize") setView("panel");
            else finish(key);
        },
        [blip, finish],
    );

    // ─── Keyboard shortcuts ─────────────────────────────────────────
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === " " || e.key === "Enter") {
                if (view === "dialogue") {
                    e.preventDefault();
                    nextOrComplete();
                } else if (view === "choices") {
                    e.preventDefault();
                    runChoice(choices[activeChoice].key);
                }
            } else if (view === "choices") {
                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveChoice((i) => (i + 1) % choices.length);
                    blip(620, 0.02);
                } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveChoice((i) => (i - 1 + choices.length) % choices.length);
                    blip(620, 0.02);
                }
            } else if (view === "panel" && e.key === "Escape") {
                e.preventDefault();
                setView("choices");
                blip(440, 0.04);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, view, activeChoice, nextOrComplete, runChoice, blip]);

    // ─── Re-open from the floating manage-cookies pill ─────────────
    const reopenForManage = useCallback(() => {
        blip(700, 0.04);
        setShowGem(false);
        setOpen(true);
        setView("panel");
    }, [blip]);

    // ─── Render guards ──────────────────────────────────────────────
    if (!hydrated) return null;

    return (
        <>
            {open ? (
                <section
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="cc-title"
                    aria-describedby="cc-desc"
                    className={cn(
                        "fixed inset-x-0 bottom-0 z-50",
                        "border-t border-border bg-bg",
                        "before:pointer-events-none before:absolute before:inset-x-0 before:-top-[7px] before:h-[6px]",
                        "before:bg-[image:repeating-linear-gradient(-45deg,var(--stripe)_0,var(--stripe)_1px,transparent_1px,transparent_6px)]",
                    )}
                >
                    <div
                        className={cn(
                            "mx-auto max-w-[var(--container-frame)] px-6 py-6 sm:py-7",
                            "animate-[cc-up_420ms_var(--ease-drawer)] motion-reduce:animate-none",
                        )}
                    >
                        {/* Header strip */}
                        <header className="flex items-center gap-3 border-b border-border pb-4">
                            <span className="caption-mono">
                                <span id="cc-title" className="text-fg">
                                    LUCA
                                </span>
                                <span aria-hidden> · </span>
                                <span>COOKIE NOTICE</span>
                            </span>
                            <span className="ml-auto inline-flex items-center gap-2 caption-mono">
                                <span
                                    aria-hidden
                                    className="size-1.5 bg-accent"
                                />
                                SESSIONE APERTA
                            </span>
                        </header>

                        {view === "dialogue" ? (
                            <div className="flex flex-col gap-5 py-6 sm:flex-row sm:gap-6">
                                {/* Sized anchor for <SharedBust>. While this
                                    element is in the DOM the shared bust
                                    morphs onto it (priority over profile),
                                    then morphs back when the banner closes.
                                    Square + hairline matches the rest of
                                    the brutalist banner. */}
                                <div
                                    {...bustAnchor("cookie")}
                                    aria-hidden
                                    className="size-20 flex-none border border-border bg-bg-alt sm:size-24"
                                />
                                <div className="flex-1">
                                    <p
                                        id="cc-desc"
                                        aria-live="polite"
                                        className="text-base leading-relaxed text-fg sm:text-lg"
                                        dangerouslySetInnerHTML={{
                                            __html: typed +
                                                (typing
                                                    ? "<span class=\"cc-caret\" aria-hidden></span>"
                                                    : ""),
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={nextOrComplete}
                                        className={cn(
                                            "press mt-3 inline-flex items-center gap-2 caption-mono",
                                            "text-fg-muted hover:text-fg",
                                        )}
                                    >
                                        <span
                                            aria-hidden
                                            className="text-accent motion-safe:animate-[cc-bob_1.2s_var(--ease-in-out)_infinite]"
                                        >
                                            →
                                        </span>
                                        CLICK · SPACE
                                    </button>
                                </div>
                            </div>
                        ) : null}

                        {view === "choices" ? (
                            <div
                                role="menu"
                                aria-label="Scelte sui cookie"
                                className="grid border-t border-border"
                            >
                                {choices.map((c, idx) => {
                                    const isActive = idx === activeChoice;
                                    return (
                                        <button
                                            key={c.key}
                                            ref={(el) => {
                                                if (el && isActive)
                                                    el.focus({ preventScroll: true });
                                            }}
                                            type="button"
                                            role="menuitem"
                                            onClick={() => runChoice(c.key)}
                                            onMouseEnter={() => {
                                                setActiveChoice(idx);
                                                blip(620, 0.02);
                                            }}
                                            onFocus={() => setActiveChoice(idx)}
                                            className={cn(
                                                "press group grid items-center gap-4 border-b border-border py-4 text-left",
                                                "grid-cols-[28px_1fr_auto] sm:grid-cols-[32px_1fr_auto] sm:gap-5",
                                                "transition-colors hover:bg-bg-alt focus-visible:bg-bg-alt focus-visible:outline-none",
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "caption-mono pl-1",
                                                    isActive ? "text-accent" : "text-fg-soft",
                                                )}
                                            >
                                                0{idx + 1}
                                            </span>
                                            <span className="text-fg">
                                                <span className="block text-base sm:text-lg leading-tight">
                                                    {c.label}
                                                </span>
                                                <span className="mt-0.5 block text-sm text-fg-muted">
                                                    {c.sub}
                                                </span>
                                            </span>
                                            <span
                                                aria-hidden
                                                className={cn(
                                                    "pr-1 font-mono text-sm transition-[transform,color]",
                                                    isActive
                                                        ? "translate-x-1 text-accent"
                                                        : "text-fg-soft group-hover:translate-x-1 group-hover:text-accent",
                                                )}
                                            >
                                                →
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : null}

                        {view === "panel" ? (
                            <div className="border-t border-border">
                                <CategoryRow
                                    title="Strettamente necessari"
                                    description="Necessari al funzionamento del sito (sicurezza, sessione, lingua). Non disattivabili."
                                    meta="LEGITTIMO INTERESSE · ART. 6(1)(f) GDPR"
                                    locked
                                    checked
                                />
                                <CategoryRow
                                    title="Funzionali"
                                    description="Memorizzano preferenze come tema o stato salvato fra sessioni."
                                    meta="CONSENSO · ART. 6(1)(a) GDPR · 30 GIORNI"
                                    checked={prefs.functional}
                                    onChange={(v) =>
                                        setPrefs((p) => ({ ...p, functional: v }))
                                    }
                                />
                                <CategoryRow
                                    title="Analytics"
                                    description="Dati anonimi e aggregati su quali pagine vengono visitate, per migliorare l'esperienza."
                                    meta="CONSENSO · ART. 6(1)(a) GDPR · 13 MESI"
                                    checked={prefs.analytics}
                                    onChange={(v) =>
                                        setPrefs((p) => ({ ...p, analytics: v }))
                                    }
                                />
                                <CategoryRow
                                    title="Marketing"
                                    description="Annunci pertinenti e misurazione campagne. Disattivati per default."
                                    meta="CONSENSO · ART. 6(1)(a) GDPR · 12 MESI"
                                    checked={prefs.marketing}
                                    onChange={(v) =>
                                        setPrefs((p) => ({ ...p, marketing: v }))
                                    }
                                />
                                <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setView("choices");
                                            blip(440, 0.04);
                                        }}
                                        className="press caption-mono mr-auto border border-border px-3 py-2 text-fg hover:bg-bg-alt hover:border-border-strong"
                                    >
                                        ← INDIETRO
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => finish("reject-all")}
                                        className="press caption-mono border border-border-strong bg-bg px-4 py-2 text-fg hover:bg-bg-alt"
                                    >
                                        RIFIUTA OPZIONALI
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => finish("accept-all")}
                                        className="press caption-mono border border-border-strong bg-bg px-4 py-2 text-fg hover:bg-bg-alt"
                                    >
                                        ACCETTA TUTTI
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => finish("customize")}
                                        className={cn(
                                            "press caption-mono px-4 py-2",
                                            "border border-fg bg-fg text-bg",
                                            "hover:bg-accent hover:border-accent hover:text-accent-fg",
                                        )}
                                    >
                                        SALVA SCELTE
                                    </button>
                                </div>
                            </div>
                        ) : null}

                        {/* Footer */}
                        <footer className="mt-5 flex flex-col gap-2 border-t border-border pt-4 text-xs sm:flex-row sm:items-center sm:justify-between">
                            <span className="caption-mono">
                                Titolare: Luca Perullo ·{" "}
                                <a
                                    href={POLICY_HREF}
                                    className="border-b border-border-strong text-fg hover:border-accent hover:text-accent"
                                >
                                    Privacy &amp; Cookie Policy
                                </a>
                            </span>
                            <span className="caption-mono">
                                <kbd className="cc-kbd">SPACE</kbd> next ·{" "}
                                <kbd className="cc-kbd">↑</kbd>
                                <kbd className="cc-kbd">↓</kbd> select ·{" "}
                                <kbd className="cc-kbd">ENTER</kbd> conferma ·{" "}
                                <kbd className="cc-kbd">ESC</kbd> indietro
                            </span>
                        </footer>
                    </div>
                </section>
            ) : null}

            {showGem ? (
                <button
                    type="button"
                    onClick={reopenForManage}
                    aria-label="Gestisci cookie"
                    className={cn(
                        "press fixed bottom-5 left-5 z-40 inline-flex items-center gap-2",
                        "border border-border-strong bg-bg px-3 py-2",
                        "caption-mono hover:bg-bg-alt hover:border-fg-soft",
                    )}
                >
                    <span aria-hidden className="size-1.5 bg-accent" />
                    GESTISCI COOKIE
                </button>
            ) : null}

            {toast ? (
                <div
                    role="status"
                    aria-live="polite"
                    className={cn(
                        "fixed bottom-6 left-1/2 z-[60] -translate-x-1/2",
                        "bg-fg px-4 py-2 text-bg caption-mono",
                        "animate-[cc-up_220ms_var(--ease-out)]",
                    )}
                >
                    {toast}
                </div>
            ) : null}

            {/* Component-scoped helpers (inline tag styling, caret, kbd, animations).
                Inline because these don't deserve a global utility — they are only
                referenced by this component. */}
            <style>{`
                @keyframes cc-up { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes cc-bob { 0%,100% { transform: translateX(0); } 50% { transform: translateX(3px); } }
                @keyframes cc-blink { 50% { opacity: 0; } }
                .cc-caret { display:inline-block; width:.5ch; height:1em; vertical-align:-2px; background:currentColor; margin-left:2px; animation: cc-blink 1s steps(1) infinite; }
                .cc-small { display:block; margin-top:.5rem; font-size:.875rem; color: var(--fg-muted); line-height:1.5; }
                #cc-desc em { color: var(--accent); font-style: normal; font-weight: 500; }
                .cc-kbd { display:inline-block; padding:1px 6px; margin:0 2px; background: var(--bg-alt); color: var(--fg); border:1px solid var(--border-strong); font-family: var(--font-mono); font-size: 10px; }
                @media (prefers-reduced-motion: reduce) {
                    .cc-caret { animation: none; }
                }
            `}</style>
        </>
    );
}

/* ───────────────── Toggle row ───────────────────────────────── */
function CategoryRow({
    title,
    description,
    meta,
    checked,
    onChange,
    locked,
}: {
    title: string;
    description: string;
    meta: string;
    checked: boolean;
    onChange?: (v: boolean) => void;
    locked?: boolean;
}) {
    return (
        <div className="grid grid-cols-[1fr_auto] items-start gap-4 border-b border-border py-5 sm:gap-6">
            <div>
                <h4 className="mb-1.5 font-mono text-[12px] uppercase tracking-[0.06em] text-fg">
                    {title}
                </h4>
                <p className="text-sm leading-relaxed text-fg-muted">{description}</p>
                <span className="caption-mono mt-2 block">{meta}</span>
            </div>
            <Toggle
                checked={checked}
                disabled={locked}
                onChange={onChange ?? (() => {})}
                label={title}
            />
        </div>
    );
}

function Toggle({
    checked,
    disabled,
    onChange,
    label,
}: {
    checked: boolean;
    disabled?: boolean;
    onChange: (v: boolean) => void;
    label: string;
}) {
    return (
        <label
            className={cn(
                "relative inline-block h-6 w-11 flex-none cursor-pointer",
                disabled && "pointer-events-none opacity-50",
            )}
        >
            <input
                type="checkbox"
                aria-label={label}
                checked={checked}
                disabled={disabled}
                onChange={(e) => onChange(e.target.checked)}
                className="absolute inset-0 z-[2] m-0 cursor-pointer opacity-0"
            />
            <span
                aria-hidden
                className={cn(
                    "absolute inset-0 border transition-colors duration-200",
                    checked
                        ? "bg-accent border-accent"
                        : "bg-bg-alt border-border-strong",
                )}
            />
            <span
                aria-hidden
                className={cn(
                    "absolute top-0.5 size-[18px] border transition-[left,background,border-color] duration-200",
                    checked
                        ? "left-[22px] bg-accent-fg border-accent-fg"
                        : "left-0.5 bg-fg border-fg",
                )}
            />
        </label>
    );
}
