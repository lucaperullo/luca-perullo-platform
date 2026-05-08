import Link from "next/link";
import { ArrowUpRight, Mail, MessageCircle, Sparkles } from "lucide-react";
import { Github, Linkedin, XSocial, Youtube } from "@/components/brand-icons";
import { ProfileCard } from "@/components/profile-card";
import { SectionLabel } from "@/components/section-label";
import { SectionRule } from "@/components/section-rule";
import { SocialTile } from "@/components/social-tile";
import { Marquee } from "@/components/marquee";
import { MarqueeTicker } from "@/components/marquee-ticker";
import { MarqueeStack } from "@/components/marquee-stack";
import { SideLines } from "@/components/side-lines";
import { HangingSpider } from "@/components/hanging-spider";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { tools } from "@/data/tools";
import { stack } from "@/data/stack";
import { showcase } from "@/data/showcase";
import { getPublishedNotes } from "@/lib/notes";
import { cn, formatItalianDate } from "@/lib/utils";

export const revalidate = 3600;

const SOCIAL_LINKS = [
    {
        icon: XSocial,
        label: "X / Twitter",
        href: "https://x.com/lucaperullo",
        handle: "@lucaperullo",
    },
    {
        icon: Github,
        label: "GitHub",
        href: "https://github.com/lucaperullo",
        handle: "lucaperullo",
    },
    {
        icon: Linkedin,
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/lucaperullo",
        handle: "in/lucaperullo",
    },
    {
        icon: Youtube,
        label: "YouTube",
        href: "https://www.youtube.com/@lucaperullo",
        handle: "@lucaperullo",
    },
    {
        icon: MessageCircle,
        label: "WhatsApp",
        href: "https://wa.me/393445820014",
        handle: "+39 344 5820014",
    },
    {
        icon: Mail,
        label: "Email",
        href: "mailto:lucaperullo@outlook.it",
        handle: "lucaperullo@outlook.it",
    },
];

/** Personal manifest — short editorial tags about what I build & share. */
const TICKER_ITEMS = [
    "Web app · Next.js",
    "AI integration · OpenAI / Anthropic",
    "E-commerce custom · Stripe",
    "Design system · components + token",
    "Open-source · tools gratuiti",
    "Mobile-first · iOS / Android",
    "Architettura · serverless + edge",
    "Performance · Core Web Vitals",
    "AURA Academy · coaching",
    "Note tecniche · lezioni dal lavoro reale",
];

const STACK_TONE: Record<string, string> = {
    Frontend: "border-fg bg-bg text-fg",
    Backend: "border-border-strong bg-bg-alt text-fg",
    AI: "border-accent bg-accent/5 text-accent",
    DX: "border-border bg-bg-alt text-fg-muted",
};

export default async function HomePage() {
    const allNotes = await getPublishedNotes();
    const notes = allNotes.slice(0, 3);
    return (
        <>
            <SideLines side="left" />
            <SideLines side="right" />
            <HangingSpider />

            <div className="mx-auto w-full max-w-[var(--container-prose)] px-4 sm:px-6">

            <ProfileCard className="pt-2 sm:pt-4" />

            {/* Personal manifest — newscaster ticker with what I build & share. */}
            <div className="-mx-4 mt-6 sm:-mx-6">
                <div className="px-4 sm:px-6">
                    <MarqueeTicker
                        kicker="Builds"
                        tone="muted"
                        durationSec={32}
                        gap="1rem"
                    >
                        {TICKER_ITEMS.map((item) => (
                            <span key={item}>{item}</span>
                        ))}
                    </MarqueeTicker>
                </div>
            </div>

            <SectionRule className="mt-10" />

            <Section anchor="about" index={1} title="About">
                <p className="text-[15px] leading-[1.7] text-fg">{profile.summary}</p>
                <p className="mt-3 text-[15px] leading-[1.7] text-fg-muted">
                    Lavoro con clienti su prodotti web e mobile, dall&apos;idea iniziale al lancio.
                    Per chi vuole imparare ho costruito{" "}
                    <a
                        href="https://lucaperullo.it/academy"
                        className="text-fg underline decoration-fg-soft underline-offset-4 hover:decoration-fg"
                    >
                        AURA Academy
                    </a>
                    : corsi, coaching, e una community di persone che costruiscono cose vere.
                </p>
            </Section>

            <SectionRule />

            <Section anchor="connect" index={2} title="Connect">
                <p className="mb-4 text-[14px] text-fg-muted">
                    Scrivimi dove preferisci. Rispondo entro 24 ore nei giorni lavorativi.
                </p>
                <div className="-mx-4 grid grid-cols-1 bg-bg sm:-mx-6 sm:grid-cols-2 lg:grid-cols-3">
                    {SOCIAL_LINKS.map((s, i) => (
                        <div
                            key={s.label}
                            data-spider-anchor="square"
                            className={cn(
                                "row-rule sm:border-border sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0",
                                i === 0 && "row-rule-top",
                            )}
                        >
                            <SocialTile
                                icon={s.icon}
                                label={s.label}
                                href={s.href}
                                handle={s.handle}
                            />
                        </div>
                    ))}
                </div>
            </Section>

            <SectionRule />

            <Section anchor="tools" index={3} title="Tools">
                <p className="mb-5 text-[14px] text-fg-muted">
                    Strumenti gratuiti che uso ogni giorno e ho reso pubblici. Niente account, niente paywall.
                </p>
                <ul className="-mx-4 sm:-mx-6">
                    {tools.map((tool, i) => (
                        <li
                            key={tool.slug}
                            className={cn("row-rule", i === 0 && "row-rule-top")}
                        >
                            <Link
                                href={tool.href}
                                className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-bg-alt sm:px-6"
                            >
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-bg-alt text-fg">
                                    <tool.icon className="h-4 w-4" aria-hidden />
                                </span>
                                <span className="flex flex-1 flex-col gap-0.5">
                                    <span className="flex items-center gap-2 text-[14.5px] font-medium text-fg">
                                        {tool.name}
                                        <ToolStatus status={tool.status} />
                                    </span>
                                    <span className="text-[13px] text-fg-muted">{tool.summary}</span>
                                </span>
                                <ArrowUpRight
                                    className="h-4 w-4 shrink-0 text-fg-soft transition-colors group-hover:text-fg"
                                    aria-hidden
                                />
                            </Link>
                        </li>
                    ))}
                </ul>
            </Section>

            <SectionRule />

            <Section anchor="stack" index={4} title="Stack">
                <p className="mb-4 text-[13.5px] text-fg-muted">
                    Le tecnologie con cui lavoro ogni giorno. Quando un progetto chiede altro, lo
                    imparo: non sono fedele agli stack, sono fedele a quello che funziona.
                </p>
                <div className="-mx-4 sm:-mx-6">
                    <div className="px-4 sm:px-6">
                        <MarqueeStack rows={2} durationSec={42} gap="0.5rem" rowGap="0.5rem">
                            {stack.map((s) => {
                                const tone = STACK_TONE[s.group] ?? STACK_TONE.DX;
                                return (
                                    <span
                                        key={s.label}
                                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11.5px] whitespace-nowrap ${tone}`}
                                    >
                                        <span className="text-fg-soft">{s.group}</span>
                                        <span aria-hidden>·</span>
                                        <span>{s.label}</span>
                                    </span>
                                );
                            })}
                        </MarqueeStack>
                    </div>
                </div>
            </Section>

            <SectionRule />

            <Section anchor="showcase" index={5} title="Showcase">
                <p className="mb-4 text-[14px] text-fg-muted">
                    Studi visivi — non sono prodotti reali, sono dimostrazioni del livello di
                    cura che porto nei progetti. Tipografia, 3D, dati, mobile, brand, motion.
                </p>

                {/* Slow horizontal marquee — preview strip of all studies, scroll
                    pauses on hover so curious eyes can land on a tile. */}
                <div className="-mx-4 mb-5 sm:-mx-6">
                    <div className="flex items-center gap-3 px-4 pb-2 sm:px-6">
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-soft">
                            Tutti i pezzi
                        </span>
                        <span aria-hidden className="h-px flex-1 bg-border" />
                    </div>
                    <Marquee durationSec={48} gap="0.75rem" pauseOnHover className="py-1">
                        {showcase.map((item) => (
                            <figure
                                key={item.slug}
                                className="group/tile flex h-20 w-32 shrink-0 overflow-hidden rounded-md border border-border bg-bg-alt transition-transform duration-200 ease-[var(--ease-out)] hover:scale-[1.02]"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                />
                            </figure>
                        ))}
                    </Marquee>
                </div>

                <ul className="-mx-4 grid grid-cols-1 gap-px bg-border sm:-mx-6 sm:grid-cols-2">
                    {showcase.map((item) => (
                        <li
                            key={item.slug}
                            data-spider-anchor="square"
                            className="bg-bg"
                        >
                            <figure className="flex h-full flex-col">
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-alt">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <figcaption className="flex flex-col gap-0.5 px-4 py-3 sm:px-6">
                                    <span className="font-mono text-[11px] uppercase tracking-wider text-fg-muted">
                                        {item.discipline}
                                    </span>
                                    <span className="text-[14px] font-medium text-fg">
                                        {item.title}
                                    </span>
                                    {item.caption ? (
                                        <span className="text-[12.5px] text-fg-muted">
                                            {item.caption}
                                        </span>
                                    ) : null}
                                </figcaption>
                            </figure>
                        </li>
                    ))}
                </ul>
            </Section>

            <SectionRule />

            <Section anchor="projects" index={6} title="Projects">
                <ul className="-mx-4 sm:-mx-6">
                    {projects.map((p, i) => (
                        <li
                            key={p.slug}
                            className={cn("row-rule", i === 0 && "row-rule-top")}
                        >
                            <a
                                href={p.href}
                                target={p.external ? "_blank" : undefined}
                                rel={p.external ? "noopener noreferrer" : undefined}
                                className="group flex items-stretch gap-4 px-4 py-4 transition-colors hover:bg-bg-alt sm:px-6"
                            >
                                <span className="hidden h-16 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-bg-alt sm:block">
                                    {p.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <span className="grid-dots block h-full w-full" />
                                    )}
                                </span>
                                <span className="flex flex-1 flex-col gap-1.5">
                                    <span className="text-[14.5px] font-medium text-fg">{p.name}</span>
                                    <span className="text-[13px] text-fg-muted">{p.summary}</span>
                                    <span className="mt-0.5 flex flex-wrap gap-1.5">
                                        {p.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="font-mono text-[11px] text-fg-soft"
                                            >
                                                #{tag.toLowerCase().replace(/\s+/g, "-")}
                                            </span>
                                        ))}
                                    </span>
                                </span>
                                <ArrowUpRight
                                    className="h-4 w-4 shrink-0 text-fg-soft transition-colors group-hover:text-fg"
                                    aria-hidden
                                />
                            </a>
                        </li>
                    ))}
                </ul>
            </Section>

            <SectionRule />

            <Section anchor="notes" index={7} title="Notes">
                <ul className="-mx-4 sm:-mx-6">
                    {notes.map((n, i) => (
                        <li
                            key={n.slug}
                            className={cn("row-rule", i === 0 && "row-rule-top")}
                        >
                            <Link
                                href={`/blog/${n.slug}`}
                                className="group flex items-stretch gap-4 px-4 py-4 transition-colors hover:bg-bg-alt sm:px-6"
                            >
                                {n.cover ? (
                                    <span className="hidden h-16 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-bg-alt sm:block">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={n.cover}
                                            alt={n.title}
                                            loading="lazy"
                                            className="h-full w-full object-cover"
                                        />
                                    </span>
                                ) : null}
                                <span className="flex flex-1 flex-col gap-1.5">
                                    <span className="flex items-center gap-2 font-mono text-[11px] text-fg-muted">
                                        <time dateTime={n.publishedAt}>
                                            {formatItalianDate(n.publishedAt)}
                                        </time>
                                        {n.tag ? (
                                            <>
                                                <span className="text-fg-soft">/</span>
                                                <span>{n.tag}</span>
                                            </>
                                        ) : null}
                                    </span>
                                    <span className="text-[14.5px] font-medium text-fg group-hover:underline group-hover:underline-offset-4">
                                        {n.title}
                                    </span>
                                    <span className="text-[13px] text-fg-muted">{n.excerpt}</span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 text-right">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-1 font-mono text-[12px] text-fg-muted hover:text-fg"
                    >
                        Tutte le note <ArrowUpRight className="h-3 w-3" aria-hidden />
                    </Link>
                </div>
            </Section>
        </div>
        </>
    );
}

function Section({
    index,
    title,
    anchor,
    children,
}: {
    index: number;
    title: string;
    anchor: string;
    children: React.ReactNode;
}) {
    return (
        <section id={anchor} className="py-10">
            <SectionLabel index={index} className="mb-5">
                {title}
            </SectionLabel>
            {children}
        </section>
    );
}

function ToolStatus({ status }: { status: "live" | "wip" | "soon" }) {
    const map: Record<"live" | "wip" | "soon", { label: string; className: string }> = {
        live: { label: "live", className: "bg-accent/15 text-accent" },
        wip: { label: "wip", className: "border border-border bg-bg-alt text-fg-muted" },
        soon: { label: "soon", className: "border border-border bg-bg-alt text-fg-soft" },
    };
    const v = map[status];
    return (
        <span
            className={
                "inline-flex items-center rounded-full px-1.5 py-0.5 font-mono text-[10px] uppercase " +
                v.className
            }
        >
            {v.label}
        </span>
    );
}
