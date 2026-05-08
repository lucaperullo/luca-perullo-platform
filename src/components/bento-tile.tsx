import type { ComponentType, ReactNode, SVGProps } from "react";
import { cn } from "@/lib/utils";

export type BentoTileSize = "sm" | "md" | "lg";
export type BentoTileVariant = "minimal" | "accent" | "mono";
export type BentoTilePreviewFit = "scale" | "cover";

export type BentoTileProps = {
    /** Lucide icon component, rendered top-left when no preview is set. */
    icon?: ComponentType<SVGProps<SVGSVGElement>>;
    /** Component name. */
    name: string;
    /** Optional kicker shown above the name (mono small caps). */
    group?: string;
    /** Visual variant. Default "minimal". */
    variant?: BentoTileVariant;
    /** Vertical size. Default "md". */
    size?: BentoTileSize;
    /** Mark the tile as a "new" — shows an accent dot. */
    isNew?: boolean;
    /**
     * Live preview rendered without a fog overlay. The whole subtree gets
     * `animation: none !important` and `transition: none !important` applied
     * so 24+ tiles in side gutters don't tank performance.
     *
     * When provided, the icon/name labels are NOT rendered — the preview is
     * the tile. Use the parent context (catalog row, detail page) for the
     * canonical label.
     */
    preview?: ReactNode;
    /**
     * How the preview fits inside the tile.
     *  - "scale" (default): preview rendered in a 320px-wide wrapper, scaled
     *    by `previewScale`, centred. Best for component-style previews that
     *    are already laid out.
     *  - "cover": preview fills the tile (consumer controls sizing). Use for
     *    imagery that should fill edge-to-edge (e.g. `<img object-cover/>`).
     */
    previewFit?: BentoTilePreviewFit;
    /** Width of the rendered preview before it's scaled down. Default 320. */
    previewInnerWidth?: number;
    /** Scale factor applied to the preview. Default 0.5. */
    previewScale?: number;
    className?: string;
};

const SIZE_HEIGHT: Record<BentoTileSize, string> = {
    sm: "h-20", // 80px
    md: "h-32", // 128px
    lg: "h-44", // 176px
};

const VARIANT_FRAME: Record<BentoTileVariant, string> = {
    minimal: "border-border bg-bg",
    accent: "border-accent/40 bg-accent/[0.04]",
    mono: "border-fg bg-fg text-bg",
};

const VARIANT_ICON_CHIP: Record<BentoTileVariant, string> = {
    minimal: "border-border bg-bg-alt text-fg",
    accent: "border-accent/30 bg-bg text-accent",
    mono: "border-bg/30 bg-bg/10 text-bg",
};

const VARIANT_LABEL: Record<BentoTileVariant, string> = {
    minimal: "text-fg",
    accent: "text-fg",
    mono: "text-bg",
};

const VARIANT_KICKER: Record<BentoTileVariant, string> = {
    minimal: "text-fg-soft",
    accent: "text-accent",
    mono: "text-bg/60",
};

/**
 * Decorative bento card. Two render paths:
 *
 *  - **with preview**: the preview fills the tile, no overlay, no labels.
 *    Optional accent dot (top-right) for `isNew`. The preview subtree is
 *    frozen — animations + transitions disabled — so dozens of tiles in
 *    side gutters don't tank performance.
 *  - **without preview**: labelled card (icon top-left, kicker + name
 *    bottom). The icon-only fallback is what the gutters show for the few
 *    components that don't ship a `preview()` (e.g. interactive demos that
 *    don't snapshot well).
 *
 * Three variants for visual rhythm without resorting to randomness — pick
 * one deterministically (e.g. via slug hash) so SSR stays stable.
 */
export function BentoTile({
    icon: Icon,
    name,
    group,
    variant = "minimal",
    size = "md",
    isNew = false,
    preview,
    previewFit = "scale",
    previewInnerWidth = 320,
    previewScale = 0.5,
    className,
}: BentoTileProps) {
    if (preview) {
        return (
            <div
                aria-hidden
                className={cn(
                    "relative w-full overflow-hidden rounded-md border",
                    SIZE_HEIGHT[size],
                    VARIANT_FRAME[variant],
                    className,
                )}
            >
                <div className="pointer-events-none absolute inset-0 select-none [&_*]:!animate-none [&_*]:!transition-none [&_*]:!will-change-auto">
                    {previewFit === "cover" ? (
                        <div className="absolute inset-0">{preview}</div>
                    ) : (
                        <div
                            className="absolute left-1/2 top-1/2"
                            style={{
                                width: `${previewInnerWidth}px`,
                                transform: `translate(-50%, -50%) scale(${previewScale})`,
                                transformOrigin: "center",
                            }}
                        >
                            {preview}
                        </div>
                    )}
                </div>
                {isNew ? (
                    <span
                        aria-hidden
                        className={cn(
                            "absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full ring-2",
                            variant === "mono" ? "bg-bg ring-fg" : "bg-accent ring-bg",
                        )}
                    />
                ) : null}
            </div>
        );
    }

    return (
        <div
            aria-hidden
            className={cn(
                "relative flex w-full flex-col justify-between overflow-hidden rounded-md border p-3",
                SIZE_HEIGHT[size],
                VARIANT_FRAME[variant],
                className,
            )}
        >
            <div className="flex items-start justify-between">
                {Icon ? (
                    <span
                        className={cn(
                            "grid h-7 w-7 place-items-center rounded-md border",
                            VARIANT_ICON_CHIP[variant],
                        )}
                    >
                        <Icon className="h-3.5 w-3.5" aria-hidden />
                    </span>
                ) : <span aria-hidden />}
                {isNew ? (
                    <span
                        className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            variant === "mono" ? "bg-bg" : "bg-accent",
                        )}
                    />
                ) : null}
            </div>
            <div className="flex flex-col gap-0.5">
                {group ? (
                    <span
                        className={cn(
                            "font-mono text-[9.5px] uppercase tracking-[0.08em]",
                            VARIANT_KICKER[variant],
                        )}
                    >
                        {group}
                    </span>
                ) : null}
                <span
                    className={cn(
                        "text-[12.5px] font-medium leading-[1.3]",
                        VARIANT_LABEL[variant],
                    )}
                >
                    {name}
                </span>
            </div>
        </div>
    );
}

/**
 * Stable visual rhythm helpers — pick a size and variant from the slug so
 * the bento layout is identical between SSR and client hydration.
 */
export function bentoSizeForSlug(slug: string): BentoTileSize {
    const sum = [...slug].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return (["sm", "md", "lg"] as const)[sum % 3];
}

export function bentoVariantForSlug(slug: string, isNew: boolean | undefined): BentoTileVariant {
    if (isNew) return "accent";
    const sum = [...slug].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return sum % 5 === 0 ? "mono" : "minimal";
}
