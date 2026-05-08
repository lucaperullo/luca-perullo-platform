"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContactRow } from "./contact-row";
import { VerifiedBadge } from "./verified-badge";
import { profile, contactDetails } from "@/data/profile";
import { bustAnchor } from "./shared-bust";

export function ProfileCard({ className }: { className?: string }) {
    return (
        <section className={cn("flex flex-col", className)}>
            {/* Banner — dotted-grid backdrop with stylized monogram. */}
            <div className="relative overflow-hidden border-b border-border">
                <div className="grid-dots flex h-44 items-center justify-center sm:h-56">
                    <Monogram />
                </div>
            </div>

            {/* Avatar + name row.
                The bust 3D model occupies the avatar slot but its head
                visibly extends UP into the dotted-grid banner above. */}
            <div className="flex flex-col gap-5 px-1 pt-5 sm:flex-row sm:items-end sm:px-0">
                {/* Sized anchor for <SharedBust>. The bust is rendered
                    once at the layout level and physically positions
                    itself over whichever anchor is active (priority:
                    cookie banner > profile). The dimensions and
                    border-radius below dictate the morph target. */}
                <div
                    {...bustAnchor("profile")}
                    aria-hidden
                    className="-mt-16 size-24 shrink-0 rounded-full sm:-mt-20 sm:size-28"
                />

                <div className="flex flex-1 flex-col gap-1.5">
                    <span className="font-mono text-[11px] text-fg-muted">
                        {profile.handle}
                    </span>
                    <h1 className="flex items-center gap-1.5 text-[28px] font-semibold leading-none tracking-tight text-fg sm:text-[32px]">
                        <span>{profile.name}</span>
                        <VerifiedBadge size={20} />
                        <button
                            type="button"
                            aria-label="Pronuncia il nome"
                            className="ml-1 grid h-6 w-6 place-items-center rounded-md text-fg-muted transition-colors hover:text-fg"
                        >
                            <Volume2 className="h-3.5 w-3.5" aria-hidden />
                        </button>
                    </h1>
                    <p className="font-mono text-[12px] text-fg-muted">{profile.role}</p>
                </div>
            </div>

            {/* Contact-detail grid */}
            <ul className="mt-7 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {contactDetails.map((detail) => (
                    <li key={detail.label}>
                        <ContactRow
                            icon={detail.icon}
                            href={detail.href}
                            external={detail.external}
                        >
                            {detail.value}
                        </ContactRow>
                    </li>
                ))}
                <li className="sm:col-span-1">
                    <ContactRow icon={ClockIcon}>
                        <LiveTime />
                    </ContactRow>
                </li>
            </ul>
        </section>
    );
}

function Monogram() {
    return (
        <div className="relative h-24 w-24 sm:h-28 sm:w-28">
            <Image
                src="/brand/monogram.jpg"
                alt="Luca Perullo monogram"
                fill
                sizes="112px"
                className="object-contain mix-blend-multiply dark:mix-blend-normal dark:invert"
                priority
            />
        </div>
    );
}

function AvatarFallback() {
    return (
        <Image
            src={profile.avatar}
            alt={profile.name}
            fill
            sizes="112px"
            className="object-cover"
            priority
        />
    );
}

// Provide a small inline icon to satisfy the "live time" row without
// importing yet another lucide icon redundantly.
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            {...props}
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
        </svg>
    );
}

function LiveTime() {
    const [text, setText] = useState("--:--");
    useEffect(() => {
        const tick = () => {
            const now = new Date();
            const t = now.toLocaleTimeString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: "Europe/Rome",
            });
            setText(`${t} // Italia`);
        };
        tick();
        const id = setInterval(tick, 30_000);
        return () => clearInterval(id);
    }, []);
    return <span>{text}</span>;
}
