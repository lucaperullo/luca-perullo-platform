import { promises as fs } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink, FileCode2, Package, Sparkles } from "lucide-react";

import { SectionLabel } from "@/components/section-label";
import { StripeRule } from "@/components/stripe-rule";
import { PreviewFrame } from "@/components/preview-frame";
import { PreviewTabs } from "@/components/preview-tabs";
import { CodeBlock } from "@/components/code-block";
import { CopyButton } from "@/components/copy-button";
import { StatusPill } from "@/components/status-pill";
import {
    components,
    getComponent,
} from "@/data/components-library";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
    return components.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
    const { slug } = await params;
    const c = getComponent(slug);
    if (!c) return { title: "Componente non trovato" };
    return {
        title: `${c.name} — Components`,
        description: c.summary,
    };
}

async function readSource(sourcePath?: string): Promise<string | null> {
    if (!sourcePath) return null;
    try {
        const safe = sourcePath.replace(/^\/+/, "");
        const abs = path.join(process.cwd(), safe);
        return await fs.readFile(abs, "utf8");
    } catch {
        return null;
    }
}

export default async function ComponentDetailPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { slug } = await params;
    const component = getComponent(slug);
    if (!component) notFound();

    const code = await readSource(component.sourcePath);
    const githubBlobUrl = component.sourcePath
        ? `https://github.com/lucaperullo/luca-perullo-platform/blob/main/${component.sourcePath}`
        : null;

    const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(component.prompt)}`;

    const Icon = component.icon;

    return (
        <div className="mx-auto w-full max-w-[var(--container-prose)] border-x border-border px-4 py-12 sm:px-6">
            <Link
                href="/components"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-fg-muted transition-colors hover:text-fg"
            >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                Components
            </Link>

            <div className="mt-3 flex flex-wrap items-center gap-2">
                <p className="font-mono text-[12px] text-fg-muted">Component</p>
                <span className="text-fg-soft" aria-hidden>·</span>
                <StatusPill tone={component.status} />
                {component.isNew ? (
                    <span className="inline-flex items-center rounded-full border border-accent bg-accent/10 px-1.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-accent">
                        New
                    </span>
                ) : null}
            </div>
            <div className="mt-2 flex items-start gap-3">
                {Icon ? (
                    <span className="icon-ring mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-[8px] text-fg" aria-hidden>
                        <Icon className="h-4.5 w-4.5" />
                    </span>
                ) : null}
                <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                    {component.name}
                </h1>
            </div>
            <p className="mt-3 max-w-prose text-[15px] leading-[1.7] text-fg-muted">
                {component.tagline ?? component.summary}
            </p>

            {component.tags.length ? (
                <div className="mt-4 flex flex-wrap gap-1.5">
                    {component.tags.map((t) => (
                        <span
                            key={t}
                            className="rounded-sm border border-border bg-bg-alt px-1.5 py-0.5 font-mono text-[10.5px] text-fg-muted"
                        >
                            {t}
                        </span>
                    ))}
                </div>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-2">
                {code ? (
                    <CopyButton value={code} label="Copy code" tone="primary" />
                ) : null}
                <CopyButton
                    value={component.prompt}
                    label="Copy prompt"
                    icon="prompt"
                    tone={code ? "secondary" : "primary"}
                />
                <a
                    href={claudeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-3 py-1.5 text-[13px] font-medium text-fg transition-colors hover:bg-bg-alt"
                >
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    Open in Claude
                    <ArrowUpRight className="h-3.5 w-3.5 text-fg-soft" aria-hidden />
                </a>
                {githubBlobUrl ? (
                    <a
                        href={githubBlobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-3 py-1.5 text-[13px] font-medium text-fg transition-colors hover:bg-bg-alt"
                    >
                        <FileCode2 className="h-3.5 w-3.5" aria-hidden />
                        Sorgente
                        <ExternalLink className="h-3 w-3 text-fg-soft" aria-hidden />
                    </a>
                ) : null}
            </div>

            <StripeRule className="mt-10" />

            {component.preview && code ? (
                <>
                    <SectionLabel index={1} className="mt-10 mb-5">
                        Esempio
                    </SectionLabel>
                    <PreviewTabs
                        preview={component.preview()}
                        code={
                            <CodeBlock
                                code={code}
                                filename={component.sourcePath}
                                language="tsx"
                                floatingCopy
                            />
                        }
                        aside={component.sourcePath?.split("/").pop()}
                        bleed={component.bleed}
                    />
                </>
            ) : component.preview ? (
                <>
                    <SectionLabel index={1} className="mt-10 mb-5">
                        Anteprima
                    </SectionLabel>
                    <PreviewFrame label="Anteprima" grid>
                        {component.preview()}
                    </PreviewFrame>
                </>
            ) : (
                <>
                    <SectionLabel index={1} className="mt-10 mb-5">
                        Anteprima
                    </SectionLabel>
                    <div className="rounded-md border border-dashed border-border bg-bg-alt px-5 py-8 text-center text-[13.5px] text-fg-muted">
                        Anteprima non ancora pubblicata. Per ora puoi copiare il prompt qui sotto e
                        rigenerare il componente con il tuo brand.
                    </div>
                </>
            )}

            {component.notes ? (
                <p className="mt-4 text-[13.5px] leading-[1.6] text-fg-muted">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-fg-soft">
                        Note
                    </span>{" "}
                    — {component.notes}
                </p>
            ) : null}

            <StripeRule className="mt-10" />

            <SectionLabel id="prompt" index={2} className="mt-10 mb-2">
                Prompt LLM
            </SectionLabel>
            <p className="mb-4 text-[13.5px] text-fg-muted">
                Incolla in Claude o ChatGPT per generare la tua variante. Include il contesto del
                brand, i token e i vincoli del progetto.
            </p>
            <article className="overflow-hidden rounded-[9px] border border-border bg-bg">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-bg-alt px-3 py-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-fg-muted">
                        Prompt · {component.slug}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <a
                            href={claudeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-md border border-transparent bg-transparent px-2 py-1 text-[12px] font-medium text-fg-muted transition-colors hover:bg-bg hover:text-fg"
                        >
                            <Sparkles className="h-3 w-3" aria-hidden />
                            Open in Claude
                        </a>
                        <CopyButton
                            value={component.prompt}
                            label="Copy"
                            icon="prompt"
                            tone="ghost"
                        />
                    </div>
                </div>
                <pre className="m-0 max-h-[420px] overflow-auto whitespace-pre-wrap break-words px-4 py-4 font-mono text-[12.5px] leading-[1.65] text-fg">
                    {component.prompt}
                </pre>
            </article>

            {code && !component.preview ? (
                <>
                    <StripeRule className="mt-10" />
                    <SectionLabel id="codice" index={3} className="mt-10 mb-2">
                        Codice
                    </SectionLabel>
                    <p className="mb-4 text-[13.5px] text-fg-muted">
                        Sorgente live di{" "}
                        <code className="rounded-sm bg-bg-alt px-1 font-mono text-[12.5px] text-fg">
                            {component.sourcePath}
                        </code>
                        . Letto a request-time dal repo — sempre allineato al sito.
                    </p>
                    <CodeBlock code={code} filename={component.sourcePath} language="tsx" />
                </>
            ) : null}

            {component.usage ? (
                <>
                    <StripeRule className="mt-10" />
                    <SectionLabel
                        index={component.preview && code ? 3 : code ? 4 : 3}
                        className="mt-10 mb-4"
                    >
                        Uso tipico
                    </SectionLabel>
                    <CodeBlock code={component.usage} language="tsx" maxHeight={180} />
                </>
            ) : null}

            {(component.dependencies?.length || component.requires?.length) ? (
                <>
                    <StripeRule className="mt-10" />
                    <SectionLabel
                        index={
                            component.usage
                                ? component.preview && code
                                    ? 4
                                    : code
                                        ? 5
                                        : 4
                                : component.preview && code
                                    ? 3
                                    : code
                                        ? 4
                                        : 3
                        }
                        className="mt-10 mb-4"
                    >
                        Dipendenze
                    </SectionLabel>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {component.dependencies?.length ? (
                            <div className="rounded-md border border-border bg-bg-alt p-4">
                                <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.08em] text-fg-soft">
                                    <Package className="h-3.5 w-3.5" aria-hidden />
                                    npm
                                </div>
                                <ul className="mt-2 space-y-1">
                                    {component.dependencies.map((d) => (
                                        <li key={d} className="font-mono text-[12.5px] text-fg">
                                            {d}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                        {component.requires?.length ? (
                            <div className="rounded-md border border-border bg-bg-alt p-4">
                                <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.08em] text-fg-soft">
                                    <FileCode2 className="h-3.5 w-3.5" aria-hidden />
                                    Interno
                                </div>
                                <ul className="mt-2 space-y-1">
                                    {component.requires.map((d) => (
                                        <li key={d} className="font-mono text-[12.5px] text-fg">
                                            {d}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                    </div>
                </>
            ) : null}

            <StripeRule className="mt-12" />

            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-bg-alt p-4">
                <p className="text-[13.5px] text-fg-muted">
                    Ti è servito? Dimmelo, oppure proponi il prossimo componente.
                </p>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href="/components"
                        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-3 py-1.5 text-[13px] font-medium text-fg transition-colors hover:bg-bg-alt"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                        Catalogo
                    </Link>
                    <a
                        href={`mailto:lucaperullo@outlook.it?subject=Component%20feedback%20·%20${encodeURIComponent(
                            component.name,
                        )}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-fg bg-fg px-3 py-1.5 text-[13px] font-medium text-bg transition-colors hover:bg-fg/90"
                    >
                        Scrivimi feedback
                    </a>
                </div>
            </div>
        </div>
    );
}
