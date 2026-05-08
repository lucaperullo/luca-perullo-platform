"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import {
    SpiderArtwork,
    getActiveSpiderVariant,
    setActiveSpiderVariant,
    type SpiderVariant,
} from "@/components/spider";
import { cn } from "@/lib/utils";

const VARIANTS: ReadonlyArray<{
    v: SpiderVariant;
    label: string;
    sub: string;
    note: string;
}> = [
    {
        v: "house-spider",
        label: "House spider",
        sub: "Tegenaria domestica",
        note: "Bruno-grigio neutro",
    },
    {
        v: "wolf-spider",
        label: "Wolf spider",
        sub: "Lycosa",
        note: "Bruno scuro a strisce",
    },
    {
        v: "garden-spider",
        label: "Garden spider",
        sub: "Araneus diadematus",
        note: "Arancio con croce bianca",
    },
    {
        v: "black-widow",
        label: "Black widow",
        sub: "Latrodectus",
        note: "Nero lucido + clessidra rossa",
    },
];

export function SpiderVariantPicker() {
    const [active, setActive] = useState<SpiderVariant>("house-spider");

    useEffect(() => {
        const stored = getActiveSpiderVariant();
        if (stored) setActive(stored);
    }, []);

    const onSelect = (v: SpiderVariant) => {
        setActive(v);
        setActiveSpiderVariant(v);
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
                            <SpiderArtwork variant={v} size={68} />
                        </div>
                        <div className="text-center">
                            <div className="text-[12px] font-medium text-fg">
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
