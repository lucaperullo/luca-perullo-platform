/**
 * Canonical release-status declaration.
 *
 * Both `tools` and `components-library` surfaces share the same lifecycle
 * states ("live" | "wip" | "soon") with the same dot-color mapping. The
 * per-surface display copy (labels, group names, group hints) intentionally
 * differs by surface and stays declared next to each surface's data — only the
 * key type, dot-color map, and ordering live here.
 */

export const RELEASE_STATUSES = ["live", "wip", "soon"] as const;

export type ReleaseStatus = (typeof RELEASE_STATUSES)[number];

export const RELEASE_STATUS_DOT: Record<ReleaseStatus, string> = {
    live: "bg-emerald-500",
    wip: "bg-amber-500",
    soon: "bg-fg-soft",
};

export const RELEASE_STATUS_ORDER: readonly ReleaseStatus[] = RELEASE_STATUSES;
