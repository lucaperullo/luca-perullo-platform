import { cn } from "@/lib/utils";

export type SectionLabelProps = {
    /** Numeric index, e.g. 1, 2, 3 — rendered as a superscript. */
    index?: number;
    /** Title text, e.g. "About". Will be rendered uppercase-cased visually. */
    children: React.ReactNode;
    className?: string;
    /** When true, renders the title in the page-h2 size; otherwise a section caption. */
    asHeading?: boolean;
    /** Optional id to attach to the heading (anchor target). */
    id?: string;
};

export function SectionLabel({
    index,
    children,
    className,
    asHeading = true,
    id,
}: SectionLabelProps) {
    const padded = typeof index === "number" ? String(index).padStart(2, "0") : null;
    const Tag = asHeading ? "h2" : "p";
    return (
        <Tag
            id={id}
            className={cn(
                asHeading
                    ? "text-2xl font-semibold tracking-tight text-fg sm:text-3xl"
                    : "text-sm font-medium text-fg-muted",
                "scroll-mt-20",
                className,
            )}
        >
            <span>{children}</span>
            {padded ? (
                <sup className="ml-1 align-super text-[11px] font-mono font-normal text-fg-muted">
                    {padded}
                </sup>
            ) : null}
        </Tag>
    );
}
