import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { SectionLabel } from "@/components/section-label";
import { StripeRule } from "@/components/stripe-rule";
import { PreviewFrame } from "@/components/preview-frame";
import { CopyButton } from "@/components/copy-button";
import { StatusPill, type StatusTone } from "@/components/status-pill";
import { Callout } from "@/components/callout";
import { Kbd } from "@/components/kbd";
import { Marquee } from "@/components/marquee";
import { Squiggle } from "@/components/squiggle";
import { SketchArrow } from "@/components/sketch-arrow";
import { NumberFlow } from "@/components/number-flow";
import {
    components,
    LIB_STATUS_DOT,
    LIB_STATUS_META,
    LIB_STATUS_ORDER,
    type LibComponent,
    type LibStatus,
} from "@/data/components-library";
import { cn } from "@/lib/utils";

export const metadata = {
    title: "Components",
    description:
        "Una libreria di componenti React + Tailwind che uso ogni giorno nei progetti reali. Ogni componente include preview, codice copiabile e un prompt LLM per riadattarlo.",
};

function statusTone(status: LibStatus): StatusTone {
    return status;
}

function FeaturedCard({ component }: { component: LibComponent }) {
    const Icon = component.icon;
    return (
        <article className="overflow-hidden rounded-[9px] border border-border-strong bg-bg">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border bg-bg-alt px-4 py-3 sm:px-5">
                <div className="flex min-w-0 items-start gap-3">
                    {Icon ? (
                        <span className="icon-ring grid h-9 w-9 shrink-0 place-items-center rounded-[8px] text-fg" aria-hidden>
                            <Icon className="h-4 w-4" />
                        </span>
                    ) : null}
                    <div className="flex min-w-0 flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-soft">
                                Featured
                            </p>
                            <span className="text-fg-soft" aria-hidden>·</span>
                            <StatusPill tone={statusTone(component.status)} />
                            {component.isNew ? (
                                <span className="inline-flex items-center rounded-full border border-accent bg-accent/10 px-1.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-accent">
                                    New
                                </span>
                            ) : null}
                        </div>
                        <Link
                            href={`/components/${component.slug}`}
                            className="text-[15px] font-semibold tracking-tight text-fg hover:underline hover:decoration-fg-soft hover:underline-offset-4"
                        >
                            {component.name}
                        </Link>
                        <p className="text-[13px] leading-[1.55] text-fg-muted">{component.summary}</p>
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <CopyButton
                        value={component.prompt}
                        label="Copy prompt"
                        icon="prompt"
                        tone="secondary"
                    />
                    <Link
                        href={`/components/${component.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-fg bg-fg px-3 py-1.5 text-[13px] font-medium text-bg transition-colors hover:bg-fg/90"
                    >
                        Apri
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                </div>
            </div>
            {component.preview ? (
                <div className="grid-dots flex min-h-[200px] items-center justify-center px-5 py-7 sm:px-8">
                    <div className="w-full max-w-[480px]">{component.preview()}</div>
                </div>
            ) : null}
        </article>
    );
}

function CatalogRow({ component }: { component: LibComponent }) {
    const detailHref = `/components/${component.slug}`;
    const Icon = component.icon;
    return (
        <li className="group relative border-b border-border last:border-b-0">
            <Link
                href={detailHref}
                aria-label={`Apri ${component.name}`}
                className="absolute inset-0 z-0 transition-colors group-hover:bg-bg-alt"
            />
            <div className="pointer-events-none relative z-10 flex items-start gap-4 px-4 py-4 sm:px-6">
                {Icon ? (
                    <span className="icon-ring relative mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-[8px] text-fg" aria-hidden>
                        <Icon className="h-4 w-4" />
                        {component.isNew ? (
                            <span
                                className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-accent ring-[1.5px] ring-bg"
                                aria-label="Novità"
                            />
                        ) : null}
                    </span>
                ) : null}
                <div className="flex flex-1 flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14.5px] font-medium text-fg">{component.name}</span>
                        <StatusPill tone={statusTone(component.status)} />
                        {component.isNew && !Icon ? (
                            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent">
                                · New
                            </span>
                        ) : null}
                    </div>
                    <span className="text-[13px] leading-[1.55] text-fg-muted">
                        {component.summary}
                    </span>
                    {component.tags.length ? (
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.06em] text-fg-soft">
                            {component.tags.map((t, i) => (
                                <span key={t} className="flex items-center gap-2">
                                    {i > 0 ? <span aria-hidden>·</span> : null}
                                    <span>{t}</span>
                                </span>
                            ))}
                        </div>
                    ) : null}
                </div>
                <div className="pointer-events-auto flex shrink-0 items-center gap-1.5">
                    <CopyButton
                        value={component.prompt}
                        label="Copy prompt"
                        ariaLabel={`Copia prompt per ${component.name}`}
                        icon="prompt"
                        tone="ghost"
                        iconOnly
                        className="hidden sm:inline-flex"
                    />
                    <ArrowUpRight
                        className="h-4 w-4 text-fg-soft transition-colors group-hover:text-fg"
                        aria-hidden
                    />
                </div>
            </div>
        </li>
    );
}

export default function ComponentsPage() {
    const counts = components.reduce<Record<LibStatus, number>>(
        (acc, c) => ({ ...acc, [c.status]: acc[c.status] + 1 }),
        { live: 0, wip: 0, soon: 0 },
    );
    const newCount = components.filter((c) => c.isNew).length;

    const featured = components
        .filter((c) => c.status === "live" && c.preview && c.isNew)
        .slice(0, 2);
    const grouped = LIB_STATUS_ORDER.map((status) => ({
        status,
        meta: LIB_STATUS_META[status],
        items: components.filter((c) => c.status === status),
    }));

    const meta = LIB_STATUS_META;

    return (
        <div className="mx-auto w-full max-w-[var(--container-prose)] border-x border-border px-4 py-12 sm:px-6">
            <p className="font-mono text-[12px] text-fg-muted">Components</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                <Squiggle tone="accent" weight={2.4}>
                    Pixel-perfect
                </Squiggle>
                ,
                <br className="hidden sm:block" /> fatti per essere usati.
            </h1>
            <p className="mt-3 max-w-prose text-[15px] leading-[1.7] text-fg-muted">
                Una libreria di componenti React + Tailwind che uso ogni giorno nei progetti reali.
                Ogni componente ha preview live, codice copiabile, e un prompt pensato per Claude/ChatGPT
                per riadattarlo al tuo brand in un colpo solo.
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
                <div className="bg-bg px-3 py-2.5">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-soft">
                        Totale
                    </dt>
                    <dd className="mt-0.5 flex items-baseline gap-1.5 text-[15px] font-medium text-fg">
                        <NumberFlow value={components.length} />
                        {newCount > 0 ? (
                            <span className="font-mono text-[10px] text-accent">
                                +<NumberFlow value={newCount} /> new
                            </span>
                        ) : null}
                    </dd>
                </div>
                {LIB_STATUS_ORDER.map((s) => (
                    <div key={s} className="bg-bg px-3 py-2.5">
                        <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-fg-soft">
                            <span className={cn("h-1.5 w-1.5 rounded-full", LIB_STATUS_DOT[s])} aria-hidden />
                            {meta[s].label}
                        </dt>
                        <dd className="mt-0.5 text-[15px] font-medium text-fg">
                            <NumberFlow value={counts[s]} />
                        </dd>
                    </div>
                ))}
            </dl>

            {/* Latest rail — gentle marquee of newly-added components.
                Pause on hover, fades to bg at the edges. */}
            <div className="mt-5 -mx-4 sm:-mx-6">
                <div className="flex items-center gap-3 px-4 sm:px-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-soft">
                        Latest
                    </span>
                    <span className="h-px flex-1 bg-border" aria-hidden />
                </div>
                <Marquee className="mt-2 py-1" durationSec={42} gap="0.75rem">
                    {components
                        .filter((c) => c.isNew)
                        .map((c) => (
                            <Link
                                key={c.slug}
                                href={`/components/${c.slug}`}
                                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-alt px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.06em] text-fg-muted transition-colors hover:border-fg hover:text-fg"
                            >
                                <Sparkles className="h-3 w-3 text-accent" aria-hidden />
                                <span className="text-fg">{c.name}</span>
                                <span aria-hidden>·</span>
                                <span>new</span>
                            </Link>
                        ))}
                </Marquee>
            </div>

            <Callout
                tone="info"
                label="Tip"
                className="mt-5"
            >
                <span className="flex items-start gap-3">
                    <SketchArrow
                        direction="down-right"
                        tone="muted"
                        width={64}
                        className="-mt-1 hidden sm:inline-block"
                    />
                    <span className="block">
                        Ogni riga ha un pulsante <span className="font-mono text-fg">Copy prompt</span>{" "}
                        <Kbd keys={["cmd", "v"]} size="sm" className="ml-1" />{" "}
                        pronto per Claude o ChatGPT — genera la tua variante con il tuo brand in un colpo.
                    </span>
                </span>
            </Callout>

            <StripeRule className="mt-10" />

            {featured.length > 0 ? (
                <>
                    <SectionLabel index={1} className="mt-10 mb-2">
                        Featured
                    </SectionLabel>
                    <p className="mb-5 text-[13.5px] text-fg-muted">
                        Le novità più recenti, con preview live. Niente trick, niente iframe.
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                        {featured.map((c) => (
                            <FeaturedCard key={c.slug} component={c} />
                        ))}
                    </div>
                    <StripeRule className="mt-10" />
                </>
            ) : null}

            <SectionLabel index={featured.length > 0 ? 2 : 1} className="mt-10 mb-5">
                Catalogo
            </SectionLabel>

            <div className="space-y-8">
                {grouped
                    .filter((g) => g.items.length > 0)
                    .map((group) => (
                        <section key={group.status}>
                            <header className="flex items-baseline justify-between gap-3 pb-2">
                                <h3 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-fg">
                                    <span
                                        className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            LIB_STATUS_DOT[group.status],
                                        )}
                                        aria-hidden
                                    />
                                    {group.meta.group}
                                </h3>
                                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-soft">
                                    {group.items.length}{" "}
                                    {group.items.length === 1 ? "componente" : "componenti"}
                                </span>
                            </header>
                            <p className="mb-3 text-[13px] text-fg-muted">{group.meta.groupHint}</p>
                            <ul className="-mx-4 border-y border-border sm:-mx-6">
                                {group.items.map((c) => (
                                    <CatalogRow key={c.slug} component={c} />
                                ))}
                            </ul>
                        </section>
                    ))}
            </div>

            <StripeRule className="mt-12" />

            <SectionLabel index={featured.length > 0 ? 3 : 2} className="mt-10 mb-5">
                Come si usa
            </SectionLabel>
            <ol className="space-y-3 text-[14px] leading-[1.6] text-fg-muted">
                <li>
                    <span className="font-medium text-fg">1. Scegli un componente.</span> Ogni
                    pagina ha preview, codice e dipendenze.
                </li>
                <li>
                    <span className="font-medium text-fg">2. Copia il codice o il prompt.</span> Il
                    codice è pronto per <code className="rounded-sm bg-bg-alt px-1 font-mono text-[12.5px] text-fg">src/components/</code>;
                    il prompt è pronto per Claude/ChatGPT.
                </li>
                <li>
                    <span className="font-medium text-fg">3. Adatta i token.</span> Sostituisci{" "}
                    <code className="rounded-sm bg-bg-alt px-1 font-mono text-[12.5px] text-fg">
                        --bg / --fg / --accent
                    </code>{" "}
                    con i tuoi.
                </li>
            </ol>

            <PreviewFrame
                label="Esempio mini-preview"
                grid
                className="mt-8"
                minHeight={120}
            >
                <div className="flex flex-col items-center gap-4">
                    <SectionLabel index={1}>Live preview</SectionLabel>
                    <p className="text-center text-[13px] text-fg-muted">
                        Tutte le anteprime girano sul tuo stesso runtime — niente iframe, niente trucchi.
                    </p>
                </div>
            </PreviewFrame>
        </div>
    );
}
