import { cn } from "@/lib/utils";

export type StripeRuleProps = {
    className?: string;
    /** Vertical thickness of the stripe band — defaults to a 6px hatch. */
    height?: number;
};

export function StripeRule({ className, height = 6 }: StripeRuleProps) {
    return (
        <div
            role="separator"
            aria-hidden
            className={cn("stripe-rule w-full", className)}
            style={{ height }}
        />
    );
}
