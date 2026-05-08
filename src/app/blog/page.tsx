import Link from "next/link";
import { SectionLabel } from "@/components/section-label";
import { StripeRule } from "@/components/stripe-rule";
import { getPublishedNotes } from "@/lib/notes";
import { formatItalianDate } from "@/lib/utils";

export const metadata = {
    title: "Blog",
    description:
        "Note tecniche, pensieri sul lavoro, e analisi pratiche sull'industria web e AI.",
};

export const revalidate = 3600;

export default async function BlogPage() {
    const notes = await getPublishedNotes();
    return (
        <div className="mx-auto w-full max-w-[var(--container-prose)] px-4 py-12 sm:px-6">
            <p className="font-mono text-[12px] text-fg-muted">Blog</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                Note dal lavoro reale.
            </h1>
            <p className="mt-3 max-w-prose text-[15px] leading-[1.7] text-fg-muted">
                Pubblico quando ho qualcosa di onesto da dire. Niente listicle, niente hot-take su
                framework, niente roadmap predittive. Solo cose imparate spedendo prodotti.
            </p>

            <StripeRule className="mt-10" />

            <SectionLabel index={1} className="mt-10 mb-5">
                Tutti gli articoli
            </SectionLabel>
            <ul className="-mx-4 sm:-mx-6">
                {notes.map((n, i) => (
                    <li
                        key={n.slug}
                        className={i === 0 ? "border-y border-border" : "border-b border-border"}
                    >
                        <Link
                            href={`/blog/${n.slug}`}
                            className="group flex items-stretch gap-4 px-4 py-4 transition-colors hover:bg-bg-alt sm:px-6"
                        >
                            {n.cover ? (
                                <span className="hidden h-20 w-32 shrink-0 overflow-hidden rounded-md border border-border bg-bg-alt sm:block">
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
                                <span className="text-[15px] font-medium text-fg group-hover:underline group-hover:underline-offset-4">
                                    {n.title}
                                </span>
                                <span className="text-[13.5px] text-fg-muted">{n.excerpt}</span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
