"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type ProjectType = "landing" | "site" | "webapp" | "ecommerce" | "ai";
type Complexity = "lite" | "std" | "pro";
type Timeline = "asap" | "normal" | "flex";

const PROJECT_TYPES: { id: ProjectType; label: string; hint: string; base: [number, number] }[] = [
    { id: "landing", label: "Landing page", hint: "1–2 pagine, marketing & lead-gen", base: [1500, 3500] },
    { id: "site", label: "Sito multi-pagina", hint: "Brand site, blog, sezioni multiple", base: [3500, 7500] },
    { id: "webapp", label: "Web app", hint: "App con login, dashboard, dati", base: [8000, 25000] },
    { id: "ecommerce", label: "E-commerce", hint: "Catalogo, checkout, pagamenti", base: [6000, 18000] },
    { id: "ai", label: "Prodotto AI", hint: "Chatbot, RAG, automazioni intelligenti", base: [10000, 30000] },
];

const COMPLEXITY: { id: Complexity; label: string; multiplier: number; hint: string }[] = [
    { id: "lite", label: "Essenziale", multiplier: 0.85, hint: "Funzionalità core, design pulito" },
    { id: "std", label: "Standard", multiplier: 1, hint: "Set completo di feature, design curato" },
    { id: "pro", label: "Pro / custom", multiplier: 1.4, hint: "Animazioni, integrazioni avanzate, motion design" },
];

const TIMELINES: { id: Timeline; label: string; multiplier: number; hint: string }[] = [
    { id: "asap", label: "ASAP", multiplier: 1.25, hint: "Entro 2 settimane (rush)" },
    { id: "normal", label: "Normale", multiplier: 1, hint: "4–8 settimane" },
    { id: "flex", label: "Flessibile", multiplier: 0.92, hint: "Tempi guidati dalla qualità" },
];

const ADDONS = [
    { id: "design", label: "Brand & design system", price: [800, 2500] as [number, number] },
    { id: "seo", label: "SEO tecnico + contenuti base", price: [400, 1200] as [number, number] },
    { id: "i18n", label: "Multilingua (i18n)", price: [600, 1800] as [number, number] },
    { id: "ai-extra", label: "Integrazione AI aggiuntiva", price: [1500, 5000] as [number, number] },
    { id: "support", label: "Supporto continuativo (3 mesi)", price: [1200, 3600] as [number, number] },
];

const WEEKS: Record<ProjectType, number> = {
    landing: 1.5,
    site: 3,
    webapp: 8,
    ecommerce: 6,
    ai: 9,
};

const formatEur = (n: number) =>
    new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
    }).format(Math.round(n / 50) * 50);

export function PreventivoCalculator() {
    const [projectType, setProjectType] = useState<ProjectType>("webapp");
    const [complexity, setComplexity] = useState<Complexity>("std");
    const [timeline, setTimeline] = useState<Timeline>("normal");
    const [addons, setAddons] = useState<Set<string>>(new Set());

    const result = useMemo(() => {
        const proj = PROJECT_TYPES.find((p) => p.id === projectType)!;
        const cpx = COMPLEXITY.find((c) => c.id === complexity)!;
        const tl = TIMELINES.find((t) => t.id === timeline)!;

        const baseLow = proj.base[0] * cpx.multiplier * tl.multiplier;
        const baseHigh = proj.base[1] * cpx.multiplier * tl.multiplier;

        const addonSums = ADDONS.filter((a) => addons.has(a.id)).reduce(
            ([lo, hi], a) => [lo + a.price[0], hi + a.price[1]] as [number, number],
            [0, 0] as [number, number],
        );

        const low = baseLow + addonSums[0];
        const high = baseHigh + addonSums[1];
        const weeks = WEEKS[projectType] * cpx.multiplier * (tl.multiplier > 1 ? 0.6 : tl.multiplier < 1 ? 1.3 : 1);
        return {
            low,
            high,
            weeksLow: Math.max(1, Math.round(weeks * 0.8)),
            weeksHigh: Math.max(2, Math.round(weeks * 1.3)),
        };
    }, [projectType, complexity, timeline, addons]);

    const toggleAddon = (id: string) => {
        setAddons((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <div className="flex flex-col gap-7">
                <Field label="01 · Tipo di progetto">
                    <Choices
                        items={PROJECT_TYPES.map((p) => ({ id: p.id, label: p.label, hint: p.hint }))}
                        value={projectType}
                        onChange={(v) => setProjectType(v as ProjectType)}
                    />
                </Field>

                <Field label="02 · Livello">
                    <Choices
                        items={COMPLEXITY.map((c) => ({ id: c.id, label: c.label, hint: c.hint }))}
                        value={complexity}
                        onChange={(v) => setComplexity(v as Complexity)}
                    />
                </Field>

                <Field label="03 · Tempistica">
                    <Choices
                        items={TIMELINES.map((t) => ({ id: t.id, label: t.label, hint: t.hint }))}
                        value={timeline}
                        onChange={(v) => setTimeline(v as Timeline)}
                    />
                </Field>

                <Field label="04 · Add-on opzionali">
                    <ul className="grid gap-2 sm:grid-cols-2">
                        {ADDONS.map((a) => {
                            const active = addons.has(a.id);
                            return (
                                <li key={a.id}>
                                    <button
                                        type="button"
                                        onClick={() => toggleAddon(a.id)}
                                        className={cn(
                                            "flex w-full items-start gap-2 rounded-md border px-3 py-2.5 text-left text-[13.5px] transition-colors",
                                            active
                                                ? "border-fg bg-fg text-bg"
                                                : "border-border bg-bg-alt text-fg hover:border-border-strong",
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-sm border",
                                                active
                                                    ? "border-bg bg-bg text-fg"
                                                    : "border-border-strong",
                                            )}
                                        >
                                            {active ? "✓" : ""}
                                        </span>
                                        <span className="flex-1">{a.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </Field>
            </div>

            {/* Sticky result panel */}
            <aside className="lg:sticky lg:top-20 lg:self-start">
                <div className="rounded-md border border-border bg-bg-alt p-5">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-fg-muted">
                        Range stimato
                    </p>
                    <p className="mt-2 text-[28px] font-semibold tracking-tight text-fg sm:text-[32px]">
                        {formatEur(result.low)}
                        <span className="mx-1 text-fg-soft">—</span>
                        {formatEur(result.high)}
                    </p>
                    <p className="mt-1 font-mono text-[12px] text-fg-muted">
                        ~{result.weeksLow}–{result.weeksHigh} settimane
                    </p>

                    <hr className="my-4 border-border" />

                    <p className="text-[13px] leading-relaxed text-fg-muted">
                        Stima orientativa, IVA esclusa. Il preventivo finale dipende dal brief specifico.
                        Range più stretto dopo una call di 20 minuti.
                    </p>

                    <a
                        href={
                            "mailto:lucaperullo@outlook.it?subject=" +
                            encodeURIComponent("Preventivo: " + (PROJECT_TYPES.find((p) => p.id === projectType)?.label ?? "")) +
                            "&body=" +
                            encodeURIComponent(
                                `Ciao Luca, ho usato il calcolatore e mi è uscito ${formatEur(result.low)}–${formatEur(result.high)}. ` +
                                `Vorrei parlarne. Ecco i dettagli del progetto:\n\n`,
                            )
                        }
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-fg px-3 py-2.5 text-[13.5px] font-medium text-bg transition-opacity hover:opacity-90"
                    >
                        <Mail className="h-3.5 w-3.5" aria-hidden />
                        Parliamone via email
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </a>
                </div>
            </aside>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-3">
            <p className="font-mono text-[11.5px] uppercase tracking-wider text-fg-muted">{label}</p>
            {children}
        </div>
    );
}

function Choices<T extends string>({
    items,
    value,
    onChange,
}: {
    items: { id: T; label: string; hint?: string }[];
    value: T;
    onChange: (v: T) => void;
}) {
    return (
        <ul className="grid gap-2 sm:grid-cols-2">
            {items.map((item) => {
                const active = item.id === value;
                return (
                    <li key={item.id}>
                        <button
                            type="button"
                            onClick={() => onChange(item.id)}
                            className={cn(
                                "flex w-full flex-col gap-0.5 rounded-md border px-3 py-2.5 text-left transition-colors",
                                active
                                    ? "border-fg bg-fg text-bg"
                                    : "border-border bg-bg-alt text-fg hover:border-border-strong",
                            )}
                        >
                            <span className="text-[13.5px] font-medium">{item.label}</span>
                            {item.hint ? (
                                <span
                                    className={cn(
                                        "text-[12px]",
                                        active ? "text-bg/70" : "text-fg-muted",
                                    )}
                                >
                                    {item.hint}
                                </span>
                            ) : null}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
