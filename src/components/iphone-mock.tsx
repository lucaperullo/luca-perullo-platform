import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type IphoneMockProps = {
    imageSrc?: string;
    videoSrc?: string;
    children?: ReactNode;
    width?: number;
    height?: number;
    /** v1 = notch, v2 = dynamic island. Default v2. */
    variant?: "v1" | "v2";
    className?: string;
};

/**
 * <IphoneMock/> — iPhone 15 Pro–style frame with dynamic island (v2) or
 * notch (v1), volume/action/power side buttons. Inner screen is
 * `bg-black`; chrome uses `bg-fg` so it inverts cleanly with the theme.
 */
export function IphoneMock({
    imageSrc,
    videoSrc,
    children,
    width = 433,
    height = 882,
    variant = "v2",
    className,
}: IphoneMockProps) {
    return (
        <div
            className={cn("relative", className)}
            style={{ aspectRatio: `${width} / ${height}` }}
        >
            <div className="absolute inset-0 rounded-[3rem] bg-fg p-[6px] shadow-md">
                <div className="absolute -left-[3px] top-[18%] h-12 w-[3px] rounded-l-md bg-fg-muted" />
                <div className="absolute -left-[3px] top-[28%] h-20 w-[3px] rounded-l-md bg-fg-muted" />
                <div className="absolute -left-[3px] top-[38%] h-20 w-[3px] rounded-l-md bg-fg-muted" />
                <div className="absolute -right-[3px] top-[28%] h-28 w-[3px] rounded-r-md bg-fg-muted" />

                <div className="relative h-full w-full overflow-hidden rounded-[2.6rem] bg-black">
                    {variant === "v2" ? (
                        <div className="absolute left-1/2 top-2 z-20 h-[26px] w-[100px] -translate-x-1/2 rounded-full bg-black" />
                    ) : (
                        <div className="absolute left-1/2 top-0 z-20 h-6 w-40 -translate-x-1/2 rounded-b-2xl bg-black" />
                    )}
                    {videoSrc ? (
                        <video
                            src={videoSrc}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="h-full w-full object-cover"
                        />
                    ) : imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={imageSrc}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        children
                    )}
                </div>
            </div>
        </div>
    );
}
