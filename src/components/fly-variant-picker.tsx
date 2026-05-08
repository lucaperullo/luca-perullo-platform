"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import {
    FlyArtwork,
    getActiveFlyVariant,
    setActiveFlyVariant,
    type FlyVariant,
} from "@/components/fly";
import { cn } from "@/lib/utils";

const VARIANTS: ReadonlyArray<{
    v: FlyVariant;
    label: string;
    sub: string;
    note: string;
}> = [
    {
        v: "housefly",
        label: "Housefly",
        sub: "Musca domestica",
        note: "Mosca classica grigio-nera",
    },
    {
        v: "blue-bottle",
        label: "Blue-bottle",
        sub: "Calliphora vomitoria",
        note: "Iridescente blu metallico",
    },
    {
        v: "green-bottle",
        label: "Green-bottle",
        sub: "Lucilia sericata",
        note: "Verde smeraldo iridescente",
    },
    {
        v: "fruit-fly",
        label: "Fruit fly",
        sub: "Drosophila melanogaster",
        note: "Ambrata, occhi arancio-rosso",
    },
];

/**
 * Variant picker: clicking any tile switches the live mounted `<Fly />`
 * to that species. Persists the selection in localStorage. Currently
 * active species shows a check badge + bordered surface. Pure client
 * component — uses `setActiveFlyVariant` for the global broadcast.
 */
export function FlyVariantPicker() {
    const [active, setActive] = useState<FlyVariant>("blue-bottle");

    useEffect(() => {
        const stored = getActiveFlyVariant();
        if (stored) setActive(stored);
    }, []);

    const onSelect = (v: FlyVariant) => {
        setActive(v);
        setActiveFlyVariant(v);
    };

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {VARIANTS.map(({ v, label, sub, note }) => {
                const isActive = active === v;
                return (
                    <button
                        key={v}
                        type="button"
                        onClick={() => onSelect(v)}
                        aria-pressed={isActive}
                        className={cn(
                            "group relative flex flex-col items-center gap-2 rounded-md border p-4 text-left transition-colors press",
                            isActive
                                ? "border-fg bg-bg shadow-[0_0_0_1px_var(--color-fg)]"
                                : "border-border bg-bg-alt hover:border-border-strong hover:bg-bg",
                        )}
                    >
                        {isActive ? (
                            <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-fg text-bg">
                                <Check className="h-2.5 w-2.5" aria-hidden />
                            </span>
                        ) : null}
                        <div className="grid h-20 w-20 place-items-center">
                            <FlyArtwork variant={v} size={68} />
                        </div>
                        <div className="text-center">
                            <div
                                className={cn(
                                    "text-[12px] font-medium",
                                    isActive ? "text-fg" : "text-fg",
                                )}
                            >
                                {label}
                            </div>
                            <div className="font-mono text-[10px] text-fg-muted">
                                {sub}
                            </div>
                            <div className="mt-1 text-[10.5px] text-fg-soft">
                                {note}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
