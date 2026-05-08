/**
 * Cross-component shared state for fly ↔ spider ↔ web interactions.
 * Lives in a module so any insect on the page can register, and any
 * other insect (or rendering layer) can observe.
 *
 * Why module-level: the simulation runs in rAF loops scoped to each
 * component, but interactions (fly caught in spider's web, spider
 * rushing toward a fly) need to read across components. A React
 * Context would force re-renders we don't want; a module-level Map
 * + listener set is decoupled and re-render-free.
 */

export type ActiveWeb = {
    /** Stable id (e.g. spider's instance id). */
    id: string;
    /** Web centre in *viewport* coords. */
    x: number;
    y: number;
    /** Catch-zone radius (in px). The fly gets snared inside. */
    radius: number;
    /** 0..1 build progress. Spiders register webs immediately so the
     *  visual layer can render them growing; we only treat the web as
     *  "armed" (catches flies) when state === "ready". */
    state: "building" | "ready";
};

const webs = new Map<string, ActiveWeb>();
type WebListener = () => void;
const webListeners = new Set<WebListener>();

export function subscribeWebs(fn: WebListener): () => void {
    webListeners.add(fn);
    return () => {
        webListeners.delete(fn);
    };
}
export function getActiveWebs(): ReadonlyMap<string, ActiveWeb> {
    return webs;
}
/** Set or remove a web entry. Pass `null` to remove. */
export function setActiveWeb(id: string, web: ActiveWeb | null) {
    if (web) webs.set(id, web);
    else webs.delete(id);
    for (const fn of webListeners) fn();
}

/** Find the first armed web that contains a viewport point.
 *  Returns the closest one if multiple cover it (shouldn't happen
 *  in practice with one spider, but cheap to be correct). */
export function findEnclosingWeb(x: number, y: number): ActiveWeb | null {
    let best: ActiveWeb | null = null;
    let bestDist = Infinity;
    for (const w of webs.values()) {
        if (w.state !== "ready") continue;
        const dx = x - w.x;
        const dy = y - w.y;
        const d = Math.hypot(dx, dy);
        if (d < w.radius && d < bestDist) {
            best = w;
            bestDist = d;
        }
    }
    return best;
}
