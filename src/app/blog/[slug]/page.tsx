import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getAllNotes, getNote, getPublishedNotes } from "@/lib/notes";
import { MarkdownBody } from "@/components/markdown-body";
import { StripeRule } from "@/components/stripe-rule";
import { formatItalianDate } from "@/lib/utils";

type Params = { slug: string };
type Props = { params: Promise<Params> };

export const revalidate = 3600;

export async function generateStaticParams(): Promise<Params[]> {
    // Pre-build every slug (including future-dated ones). The page itself
    // will 404 in production until the publishedAt date is reached.
    const all = await getAllNotes();
    return all.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const note = await getNote(slug);
    if (!note) return {};
    return {
        title: note.seoTitle ?? note.title,
        description: note.seoDescription ?? note.excerpt,
        keywords: note.keywords,
        openGraph: {
            type: "article",
            title: note.title,
            description: note.excerpt,
            publishedTime: note.publishedAt,
            images: note.cover ? [{ url: note.cover }] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: note.title,
            description: note.excerpt,
            images: note.cover ? [note.cover] : undefined,
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const note = await getNote(slug);
    if (!note) notFound();

    const all = await getPublishedNotes();
    const more = all.filter((n) => n.slug !== slug).slice(0, 2);

    return (
        <article className="mx-auto w-full max-w-[var(--container-prose)] px-4 py-10 sm:px-6">
            {/* Back link */}
            <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 font-mono text-[12px] text-fg-muted transition-colors hover:text-fg"
            >
                <ArrowLeft className="h-3 w-3" aria-hidden />
                Tutte le note
            </Link>

            {/* Header */}
            <header className="mt-8 flex flex-col gap-3">
                <div className="flex items-center gap-2 font-mono text-[11.5px] text-fg-muted">
                    <time dateTime={note.publishedAt}>{formatItalianDate(note.publishedAt)}</time>
                    {note.tag ? (
                        <>
                            <span className="text-fg-soft">/</span>
                            <span>{note.tag}</span>
                        </>
                    ) : null}
                </div>
                <h1 className="text-[28px] font-semibold leading-[1.2] tracking-tight text-fg sm:text-[34px]">
                    {note.title}
                </h1>
                <p className="text-[16px] leading-relaxed text-fg-muted">{note.excerpt}</p>
            </header>

            {/* Cover */}
            {note.cover ? (
                <div className="-mx-4 mt-8 overflow-hidden border border-border sm:-mx-6 sm:rounded-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={note.cover}
                        alt={note.title}
                        className="aspect-[16/9] w-full object-cover"
                        loading="eager"
                    />
                </div>
            ) : null}

            <StripeRule className="mt-10" />

            {/* Body */}
            <div className="mt-10">
                <MarkdownBody>{note.body}</MarkdownBody>
            </div>

            {/* Author footer */}
            <footer className="mt-12 flex flex-col gap-4">
                <StripeRule />
                <div className="flex flex-col gap-2 pt-2 text-[13px] text-fg-muted">
                    <p>
                        Scritto da <span className="font-medium text-fg">Luca Perullo</span> —
                        software architect & AI engineer.
                    </p>
                    <p>
                        Hai un progetto? Scrivimi a{" "}
                        <a
                            href="mailto:lucaperullo@outlook.it"
                            className="text-fg underline decoration-fg-soft underline-offset-4 hover:decoration-fg"
                        >
                            lucaperullo@outlook.it
                        </a>{" "}
                        oppure usa il{" "}
                        <Link
                            href="/tools/preventivo"
                            className="text-fg underline decoration-fg-soft underline-offset-4 hover:decoration-fg"
                        >
                            calcolatore preventivo
                        </Link>
                        .
                    </p>
                </div>
            </footer>

            {/* More to read */}
            {more.length > 0 ? (
                <section className="mt-12">
                    <h2 className="mb-3 font-mono text-[12px] uppercase tracking-wider text-fg-muted">
                        Continua a leggere
                    </h2>
                    <ul className="-mx-4 sm:-mx-6">
                        {more.map((m, i) => (
                            <li
                                key={m.slug}
                                className={i === 0 ? "border-y border-border" : "border-b border-border"}
                            >
                                <Link
                                    href={`/blog/${m.slug}`}
                                    className="group flex flex-col gap-1.5 px-4 py-4 transition-colors hover:bg-bg-alt sm:px-6"
                                >
                                    <span className="flex items-center gap-2 font-mono text-[11px] text-fg-muted">
                                        <time dateTime={m.publishedAt}>
                                            {formatItalianDate(m.publishedAt)}
                                        </time>
                                        {m.tag ? (
                                            <>
                                                <span className="text-fg-soft">/</span>
                                                <span>{m.tag}</span>
                                            </>
                                        ) : null}
                                    </span>
                                    <span className="text-[14.5px] font-medium text-fg group-hover:underline group-hover:underline-offset-4">
                                        {m.title}
                                    </span>
                                    <span className="text-[13px] text-fg-muted">{m.excerpt}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}
        </article>
    );
}
