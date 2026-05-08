/**
 * Root — registers the two paired compositions exposed to the CLI / Studio.
 *
 * The page consumes `public/scroll-video/{left,right}/frame-NNNN.webp` so
 * the IDs here MUST stay `scroll-video-left` and `scroll-video-right` —
 * the render script greps for them.
 */

import { Composition } from "remotion";
import { ScrollVideoLeft, ScrollVideoRight } from "./compositions/scroll-video";

export const FPS = 30;
export const DURATION_FRAMES = 150; // 5 seconds @ 30fps
/** Render at portrait 1:2 to match the page side-gutter aspect on lg/xl
 *  displays. Gutters typically sit at aspect 0.3–0.7 — a 0.5 (1:2) source
 *  cover-crops gracefully across that whole range without losing content. */
export const WIDTH = 1080;
export const HEIGHT = 2160;
/** The composition was authored at this width — scale all px values from
 *  this base so the visual stays identical regardless of render size. */
export const BASE_WIDTH = 1080;

export function RemotionRoot() {
    return (
        <>
            <Composition
                id="scroll-video-left"
                component={ScrollVideoLeft}
                durationInFrames={DURATION_FRAMES}
                fps={FPS}
                width={WIDTH}
                height={HEIGHT}
            />
            <Composition
                id="scroll-video-right"
                component={ScrollVideoRight}
                durationInFrames={DURATION_FRAMES}
                fps={FPS}
                width={WIDTH}
                height={HEIGHT}
            />
        </>
    );
}
