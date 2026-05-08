import Link from "next/link";
import { ArrowUpRight, MailPlus } from "lucide-react";
import { SectionLabel } from "@/components/section-label";
import { StripeRule } from "@/components/stripe-rule";
import { tools, STATUS_META, type Tool, type ToolStatus } from "@/data/tools";
import {
    RELEASE_STATUS_DOT as STATUS_DOT,
    RELEASE_STATUS_ORDER as STATUS_ORDER,
} from "@/lib/release-status";
import { cn } from "@/lib/utils";

export const metadata = {
    title: "Tools",
    description:
        "Strumenti gratuiti per chi vuole costruire un prodotto digitale: preventivo, stack picker, guide e molto altro. Niente account, niente lead-gen.",
};

function StatusPill({ status }: { status: ToolStatus }) {
    const meta = STATUS_META[status];
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-alt px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-fg-muted">
            <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[status])} aria-hidden />
            {meta.label}
        </span>
    );
}

function MetaCell({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1 px-4 py-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-soft">
                {label}
            </span>
            <span className="text-[13.5px] leading-[1.4] text-fg">{value}</span>
        </div>
    );
}

function FeaturedTool({ tool }: { tool: Tool }) {
    const Icon = tool.icon;
    return (
        <article className="overflow-hidden rounded-md border border-border-strong bg-bg-alt">
            <div className="flex items-start gap-4 border-b border-border bg-bg px-5 py-5 sm:px-6">
                <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-md border border-border bg-bg-alt text-fg"
                    aria-hidden
                >
                    <Icon className="h-5 w-5" />
                </span>
                <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-soft">
                            Pinned
                        </p>
                        <span className="text-fg-soft" aria-hidden>·</span>
                        <StatusPill status={tool.status} />
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight text-fg">{tool.name}</h3>
                    <p className="text-[14px] leading-[1.6] text-fg-muted">
                        {tool.tagline ?? tool.summary}
                    </p>
                </div>
            </div>

            {(tool.input || tool.output || tool.time) ? (
                <dl className="grid grid-cols-1 divide-y divide-border border-b border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                    {tool.input ? <MetaCell label="Input" value={tool.input} /> : null}
                    {tool.output ? <MetaCell label="Output" value={tool.output} /> : null}
                    {tool.time ? <MetaCell label="Tempo" value={tool.time} /> : null}
                </dl>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
                <div className="flex flex-wrap items-center gap-1.5">
                    {tool.tags?.map((t) => (
                        <span
                            key={t}
                            className="rounded-sm border border-border bg-bg px-1.5 py-0.5 font-mono text-[10.5px] text-fg-muted"
                        >
                            {t}
                        </span>
                    ))}
                </div>
                <Link
                    href={tool.href}
                    className="group inline-flex items-center gap-1.5 rounded-md border border-fg bg-fg px-3 py-1.5 text-[13px] font-medium text-bg transition-colors hover:bg-fg/90"
                >
                    {tool.ctaLabel ?? "Apri"}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </Link>
            </div>
        </article>
    );
}

function CatalogRow({ tool }: { tool: Tool }) {
    const Icon = tool.icon;
    const showEta = tool.eta && (tool.status === "soon" || tool.status === "wip");
    return (
        <li className="border-b border-border last:border-b-0">
            <Link
                href={tool.href}
                className="group flex items-start gap-4 px-4 py-4 transition-colors hover:bg-bg-alt sm:px-6"
            >
                <span
                    className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-bg-alt text-fg"
                    aria-hidden
                >
                    <Icon className="h-4 w-4" />
                </span>
                <div className="flex flex-1 flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14.5px] font-medium text-fg">{tool.name}</span>
                        <StatusPill status={tool.status} />
                    </div>
                    <span className="text-[13px] leading-[1.55] text-fg-muted">{tool.summary}</span>
                    {(tool.tags?.length || showEta) ? (
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.06em] text-fg-soft">
                            {tool.tags?.map((t, i) => (
                                <span key={t} className="flex items-center gap-2">
                                    {i > 0 ? <span aria-hidden>·</span> : null}
                                    <span>{t}</span>
                                </span>
                            ))}
                            {showEta ? (
                                <span className="flex items-center gap-2">
                                    {tool.tags?.length ? <span aria-hidden>·</span> : null}
                                    <span className="text-fg-muted">ETA {tool.eta}</span>
                                </span>
                            ) : null}
                        </div>
                    ) : null}
                </div>
                <ArrowUpRight
                    className="mt-1 h-4 w-4 shrink-0 text-fg-soft transition-colors group-hover:text-fg"
                    aria-hidden
                />
            </Link>
        </li>
    );
}

export default function ToolsPage() {
    const counts = tools.reduce<Record<ToolStatus, number>>(
        (acc, t) => ({ ...acc, [t.status]: acc[t.status] + 1 }),
        { live: 0, wip: 0, soon: 0 },
    );

    const grouped = STATUS_ORDER.map((status) => ({
        status,
        meta: STATUS_META[status],
        items: tools.filter((t) => t.status === status),
    }));

    const featured = tools.find((t) => t.status === "live");
    const remaining = grouped.filter((g) => g.status !== "live" || !featured);

    return (
        <div className="mx-auto w-full max-w-[var(--container-prose)] border-x border-border px-4 py-12 sm:px-6">
            <p className="font-mono text-[12px] text-fg-muted">Tools</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                Utility gratuite,
                <br className="hidden sm:block" /> fatte da chi le usa.
            </h1>
            <p className="mt-3 max-w-prose text-[15px] leading-[1.7] text-fg-muted">
                Strumenti che ho costruito per il mio lavoro quotidiano e ho reso pubblici.
                Niente account, niente lead-gen aggressivo, niente paywall mascherati.
                Se ti sono utili, dimmelo — è il mio modo preferito di sapere cosa costruire dopo.
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
                <div className="bg-bg px-3 py-2.5">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-soft">
                        Totale
                    </dt>
                    <dd className="mt-0.5 text-[15px] font-medium text-fg">{tools.length}</dd>
                </div>
                {STATUS_ORDER.map((s) => (
                    <div key={s} className="bg-bg px-3 py-2.5">
                        <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-fg-soft">
                            <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[s])} aria-hidden />
                            {STATUS_META[s].label}
                        </dt>
                        <dd className="mt-0.5 text-[15px] font-medium text-fg">{counts[s]}</dd>
                    </div>
                ))}
            </dl>

            <StripeRule className="mt-10" />

            {featured ? (
                <>
                    <SectionLabel index={1} className="mt-10 mb-5">
                        Pinned
                    </SectionLabel>
                    <p className="-mt-3 mb-5 text-[13.5px] text-fg-muted">
                        {STATUS_META.live.groupHint}
                    </p>
                    <FeaturedTool tool={featured} />
                </>
            ) : null}

            <StripeRule className="mt-10" />

            <SectionLabel index={featured ? 2 : 1} className="mt-10 mb-5">
                Catalogo
            </SectionLabel>

            <div className="space-y-8">
                {remaining
                    .filter((g) => g.items.length > 0 && g.status !== "live")
                    .map((group, idx) => (
                        <section key={group.status}>
                            <header className="flex items-baseline justify-between gap-3 pb-2">
                                <h3 className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg">
                                    {group.meta.group}
                                </h3>
                                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-soft">
                                    {group.items.length} {group.items.length === 1 ? "tool" : "tools"}
                                </span>
                            </header>
                            <p className="mb-3 text-[13px] text-fg-muted">{group.meta.groupHint}</p>
                            <ul
                                className={cn(
                                    "-mx-4 sm:-mx-6",
                                    idx === 0 ? "border-y border-border" : "border-b border-border border-t",
                                )}
                            >
                                {group.items.map((tool) => (
                                    <CatalogRow key={tool.slug} tool={tool} />
                                ))}
                            </ul>
                        </section>
                    ))}
            </div>

            <StripeRule className="mt-12" />

            <SectionLabel index={featured ? 3 : 2} className="mt-10 mb-5">
                Roadmap
            </SectionLabel>
            <div className="rounded-md border border-border bg-bg-alt p-5 sm:p-6">
                <div className="flex items-start gap-3">
                    <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-bg text-fg"
                        aria-hidden
                    >
                        <MailPlus className="h-4 w-4" />
                    </span>
                    <div className="flex flex-1 flex-col gap-2">
                        <p className="text-[14.5px] font-medium text-fg">
                            Quale tool ti farebbe risparmiare tempo?
                        </p>
                        <p className="text-[13.5px] leading-[1.6] text-fg-muted">
                            Costruisco solo cose che mi servono o che mi vengono chieste con costanza.
                            Se hai un&apos;idea — anche grezza — scrivimela. La aggiungo alla roadmap pubblica.
                        </p>
                        <div className="mt-1 flex flex-wrap gap-2">
                            <a
                                href="mailto:lucaperullo@outlook.it?subject=Idea%20per%20un%20tool"
                                className="inline-flex items-center gap-1.5 rounded-md border border-fg bg-fg px-3 py-1.5 text-[13px] font-medium text-bg transition-colors hover:bg-fg/90"
                            >
                                Scrivimi un&apos;idea
                                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                            </a>
                            <Link
                                href="/#connect"
                                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-3 py-1.5 text-[13px] font-medium text-fg transition-colors hover:bg-bg-alt"
                            >
                                Altri canali
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
