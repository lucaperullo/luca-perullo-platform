import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SafariMockProps = {
    /** URL pill copy. */
    url?: string;
    /** Image to render in the content area. */
    imageSrc?: string;
    /** Video file to render in the content area. */
    videoSrc?: string;
    /** Custom content (overrides imageSrc/videoSrc). */
    children?: ReactNode;
    /** Aspect ratio width hint. Default 1203. */
    width?: number;
    /** Aspect ratio height hint. Default 753. */
    height?: number;
    className?: string;
};

/**
 * <SafariMock/> — div-based Safari window chrome (traffic-light dots +
 * URL pill) with a content slot. No SVG to keep the inner content
 * editable. Uses design tokens; bg-fg / text-bg switch automatically with
 * the theme.
 */
export function SafariMock({
    url,
    imageSrc,
    videoSrc,
    children,
    width = 1203,
    height = 753,
    className,
}: SafariMockProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-lg border border-border bg-bg-alt shadow-sm",
                className,
            )}
            style={{ aspectRatio: `${width} / ${height}` }}
        >
            <div className="flex h-9 items-center gap-2 border-b border-border bg-bg-alt px-3">
                <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                </div>
                <div className="mx-auto flex h-6 max-w-[60%] flex-1 items-center justify-center rounded-md bg-bg px-3 font-mono text-[11px] text-fg-muted">
                    {url ?? "lucaperullo.it"}
                </div>
                <div className="w-12" aria-hidden />
            </div>
            <div className="absolute inset-0 top-9 bg-bg">
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
                    <div className="h-full w-full">{children}</div>
                )}
            </div>
        </div>
    );
}
