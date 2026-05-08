import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export type MarkdownBodyProps = {
    children: string;
    className?: string;
};

/**
 * Long-form article renderer. Tuned to match the chanhdai-style minimal
 * surface — narrow column, generous line-height, mono pre-blocks, hairline
 * blockquotes. Uses Tailwind classes directly (no `prose` plugin) so the
 * styling stays predictable inside our brand tokens.
 */
export function MarkdownBody({ children, className }: MarkdownBodyProps) {
    return (
        <div className={cn("flex flex-col gap-5 text-[15px] leading-[1.75] text-fg", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ node: _n, ...p }) => (
                        <h1 className="mt-2 text-[26px] font-semibold tracking-tight text-fg" {...p} />
                    ),
                    h2: ({ node: _n, ...p }) => (
                        <h2 className="mt-6 text-[20px] font-semibold tracking-tight text-fg" {...p} />
                    ),
                    h3: ({ node: _n, ...p }) => (
                        <h3 className="mt-6 text-[17px] font-semibold tracking-tight text-fg" {...p} />
                    ),
                    h4: ({ node: _n, ...p }) => (
                        <h4 className="mt-4 text-[15px] font-semibold uppercase tracking-wider text-fg-muted" {...p} />
                    ),
                    p: ({ node: _n, ...p }) => <p className="text-fg" {...p} />,
                    a: ({ node: _n, ...p }) => (
                        <a
                            className="text-fg underline decoration-fg-soft underline-offset-4 transition-colors hover:decoration-fg"
                            {...p}
                        />
                    ),
                    strong: ({ node: _n, ...p }) => (
                        <strong className="font-semibold text-fg" {...p} />
                    ),
                    em: ({ node: _n, ...p }) => <em className="text-fg-muted" {...p} />,
                    ul: ({ node: _n, ...p }) => (
                        <ul className="my-2 ml-5 list-disc space-y-1.5 text-fg marker:text-fg-soft" {...p} />
                    ),
                    ol: ({ node: _n, ...p }) => (
                        <ol className="my-2 ml-5 list-decimal space-y-1.5 text-fg marker:text-fg-muted" {...p} />
                    ),
                    li: ({ node: _n, ...p }) => <li className="text-fg" {...p} />,
                    blockquote: ({ node: _n, ...p }) => (
                        <blockquote
                            className="border-l-2 border-border-strong bg-bg-alt/60 px-5 py-3 text-fg-muted italic"
                            {...p}
                        />
                    ),
                    code: ({ node: _n, className: cls, ...p }) => (
                        <code
                            className={cn(
                                "rounded-md bg-bg-alt px-1.5 py-0.5 font-mono text-[13px] text-fg",
                                cls,
                            )}
                            {...p}
                        />
                    ),
                    pre: ({ node: _n, ...p }) => (
                        <pre
                            className="overflow-x-auto rounded-md border border-border bg-bg-alt p-4 font-mono text-[13px] leading-relaxed text-fg"
                            {...p}
                        />
                    ),
                    hr: () => <hr className="my-6 border-border" />,
                    img: ({ node: _n, alt, ...p }) => (
                        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                        <img
                            className="my-2 rounded-md border border-border"
                            alt={alt ?? ""}
                            loading="lazy"
                            {...p}
                        />
                    ),
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
}
