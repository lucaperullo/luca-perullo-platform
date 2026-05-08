import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AndroidMockProps = {
    imageSrc?: string;
    videoSrc?: string;
    children?: ReactNode;
    width?: number;
    height?: number;
    className?: string;
};

/**
 * <AndroidMock/> — Pixel-style frame with a centered front-camera
 * punch-hole. Tighter corner radius than iPhone, no dynamic island.
 */
export function AndroidMock({
    imageSrc,
    videoSrc,
    children,
    width = 433,
    height = 882,
    className,
}: AndroidMockProps) {
    return (
        <div
            className={cn("relative", className)}
            style={{ aspectRatio: `${width} / ${height}` }}
        >
            <div className="absolute inset-0 rounded-[2rem] bg-fg p-[5px] shadow-md">
                <div className="absolute -right-[3px] top-[12%] h-16 w-[3px] rounded-r-md bg-fg-muted" />
                <div className="absolute -right-[3px] top-[26%] h-24 w-[3px] rounded-r-md bg-fg-muted" />

                <div className="relative h-full w-full overflow-hidden rounded-[1.7rem] bg-black">
                    <div className="absolute left-1/2 top-2 z-20 h-3 w-3 -translate-x-1/2 rounded-full bg-black ring-1 ring-zinc-700" />
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
