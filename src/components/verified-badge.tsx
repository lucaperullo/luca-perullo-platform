import { cn } from "@/lib/utils";

export type VerifiedBadgeProps = {
    className?: string;
    size?: number;
};

/**
 * X/Twitter-style verified blue checkmark, used next to the name in the hero.
 * Pure SVG so it inherits the accent color from CSS variables.
 */
export function VerifiedBadge({ className, size = 18 }: VerifiedBadgeProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            aria-hidden
            className={cn("inline-block text-accent", className)}
        >
            <path
                fill="currentColor"
                d="M12 1.6 9.96 3.34 7.27 3l-1.05 2.5L4 6.97l.42 2.66L3 12l1.42 2.37L4 17.03l2.22 1.47L7.27 21l2.69-.34L12 22.4l2.04-1.74 2.69.34 1.05-2.5L20 17.03l-.42-2.66L21 12l-1.42-2.37.42-2.66-2.22-1.47L16.73 3l-2.69.34zM10.5 15.7 7 12.2l1.4-1.4 2.1 2.1 5.1-5.1 1.4 1.4z"
            />
        </svg>
    );
}
