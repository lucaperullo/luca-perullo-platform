import { cn } from "@/lib/utils";

type AvatarShape = string | { src: string; alt?: string };

export type AvatarCirclesProps = {
    /** Total people the row represents (used for the +N pill). */
    numPeople?: number;
    /** Avatars to render. Accepts either string URLs or `{ src, alt }`. */
    avatarUrls: AvatarShape[];
    /** How many avatars to show before collapsing to a +N pill. Default 4. */
    max?: number;
    className?: string;
};

const normalize = (value: AvatarShape): { src: string; alt: string } =>
    typeof value === "string"
        ? { src: value, alt: "" }
        : { src: value.src, alt: value.alt ?? "" };

/**
 * <AvatarCircles/> — row of overlapping circular avatars with an optional
 * `+N` pill for the overflow. Rings are `ring-bg` so the gaps adapt to
 * dark/light theme automatically.
 */
export function AvatarCircles({
    numPeople,
    avatarUrls,
    max = 4,
    className,
}: AvatarCirclesProps) {
    const visible = avatarUrls.slice(0, max).map(normalize);
    const total = numPeople ?? avatarUrls.length;
    const overflow = Math.max(0, total - visible.length);

    return (
        <div className={cn("flex items-center", className)}>
            {visible.map((a, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    key={`${a.src}-${i}`}
                    src={a.src}
                    alt={a.alt}
                    width={40}
                    height={40}
                    className={cn(
                        "h-10 w-10 rounded-full border-2 border-bg bg-bg-alt object-cover",
                        i > 0 && "-ml-2.5",
                    )}
                />
            ))}
            {overflow > 0 && (
                <span className="-ml-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-bg bg-bg-alt font-mono text-xs text-fg-muted">
                    +{overflow}
                </span>
            )}
        </div>
    );
}
