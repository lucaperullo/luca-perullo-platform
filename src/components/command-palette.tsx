"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ArrowRight, CornerDownLeft, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type CommandItem = {
    id: string;
    label: string;
    /** Optional secondary text shown to the right (e.g. shortcut, group name). */
    hint?: string;
    icon?: ReactNode;
    /** Group label — items with the same group are visually grouped. */
    group?: string;
    keywords?: string[];
    onSelect: () => void;
};

export type CommandPaletteProps = {
    items: CommandItem[];
    /** Cmd/Ctrl + this letter opens the palette. Default "k". */
    triggerKey?: string;
    /** Placeholder for the search input. */
    placeholder?: string;
    /** Render the trigger button automatically. Set false to control externally. */
    showTrigger?: boolean;
    className?: string;
};

/**
 * <CommandPalette/> — Cmd+K modal launcher with fuzzy filter, keyboard
 * navigation (↑/↓/Enter/Esc), groups, and portal-rendered backdrop.
 *
 * Pure React + portal — no @radix-ui/react-dialog dependency. Power-user
 * signal that consistently lifts the perceived quality of dev portfolios.
 */
export function CommandPalette({
    items,
    triggerKey = "k",
    placeholder = "Cerca un comando…",
    showTrigger = true,
    className,
}: CommandPaletteProps) {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const [active, setActive] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // global cmd+k binding
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const meta = e.metaKey || e.ctrlKey;
            if (meta && e.key.toLowerCase() === triggerKey.toLowerCase()) {
                e.preventDefault();
                setOpen((o) => !o);
            } else if (e.key === "Escape") {
                setOpen(false);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [triggerKey]);

    // External open trigger — lets a button anywhere in the layout
    // (e.g. the site-header search icon) open this palette without
    // needing to share state. Header dispatches `new Event("cmdk:open")`.
    useEffect(() => {
        const onOpen = () => setOpen(true);
        const onClose = () => setOpen(false);
        window.addEventListener("cmdk:open", onOpen);
        window.addEventListener("cmdk:close", onClose);
        return () => {
            window.removeEventListener("cmdk:open", onOpen);
            window.removeEventListener("cmdk:close", onClose);
        };
    }, []);

    useEffect(() => {
        if (open) {
            setQ("");
            setActive(0);
            // focus next tick — after portal mounts
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [open]);

    const filtered = useMemo(() => {
        const needle = q.trim().toLowerCase();
        if (!needle) return items;
        return items.filter((it) => {
            const hay = [it.label, it.hint ?? "", it.group ?? "", ...(it.keywords ?? [])]
                .join(" ")
                .toLowerCase();
            return hay.includes(needle);
        });
    }, [q, items]);

    // group items
    const grouped = useMemo(() => {
        const groups = new Map<string, CommandItem[]>();
        filtered.forEach((it) => {
            const g = it.group ?? "";
            if (!groups.has(g)) groups.set(g, []);
            groups.get(g)!.push(it);
        });
        return Array.from(groups.entries());
    }, [filtered]);

    const flatIndex = useCallback(
        (gi: number, ii: number) => {
            let n = 0;
            for (let i = 0; i < gi; i++) n += grouped[i][1].length;
            return n + ii;
        },
        [grouped],
    );

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            const item = filtered[active];
            if (item) {
                item.onSelect();
                setOpen(false);
            }
        }
    };

    // ensure active item is in view
    useEffect(() => {
        const el = listRef.current?.querySelector<HTMLElement>(`[data-cmd-idx="${active}"]`);
        el?.scrollIntoView({ block: "nearest" });
    }, [active]);

    return (
        <>
            {showTrigger ? (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className={cn(
                        "press inline-flex items-center gap-2 rounded-md border border-border bg-bg-alt px-3 py-1.5",
                        "font-mono text-[12px] text-fg-muted",
                        "[transition:transform_160ms_var(--ease-out),background-color_180ms_var(--ease-out)]",
                        "hover:bg-bg",
                        className,
                    )}
                >
                    <Search className="h-3.5 w-3.5" aria-hidden />
                    <span>{placeholder}</span>
                    <span className="ml-3 inline-flex items-center gap-0.5 rounded border border-border bg-bg px-1 text-[10px] tracking-wider text-fg-soft">
                        ⌘K
                    </span>
                </button>
            ) : null}

            {open && typeof document !== "undefined"
                ? createPortal(
                      <div
                          role="dialog"
                          aria-modal="true"
                          aria-label="Command palette"
                          className="cmd-backdrop fixed inset-0 z-[1000] flex items-start justify-center px-4 pt-[14vh] backdrop-blur-sm"
                          onClick={(e) => {
                              if (e.target === e.currentTarget) setOpen(false);
                          }}
                          style={{ background: "color-mix(in oklch, var(--bg) 70%, black)" }}
                      >
                          <style>{`
                              .cmd-backdrop { opacity: 1; transition: opacity 180ms var(--ease-out); }
                              .cmd-backdrop[data-starting-style] { opacity: 0; }
                              .cmd-panel {
                                  opacity: 1;
                                  transform: scale(1);
                                  transform-origin: center;
                                  transition: opacity 200ms var(--ease-out), transform 200ms var(--ease-out);
                              }
                              .cmd-panel[data-starting-style] { opacity: 0; transform: scale(0.96); }
                              @starting-style {
                                  .cmd-backdrop { opacity: 0; }
                                  .cmd-panel { opacity: 0; transform: scale(0.96); }
                              }
                          `}</style>
                          <div
                              className="cmd-panel w-full max-w-[560px] overflow-hidden rounded-[12px] border border-border bg-bg shadow-[0_30px_80px_-20px_rgba(0,0,0,.55)]"
                              onKeyDown={onKeyDown}
                          >
                              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                                  <Search className="h-4 w-4 text-fg-soft" aria-hidden />
                                  <input
                                      ref={inputRef}
                                      value={q}
                                      onChange={(e) => {
                                          setQ(e.target.value);
                                          setActive(0);
                                      }}
                                      placeholder={placeholder}
                                      className="flex-1 bg-transparent text-[14.5px] text-fg outline-none placeholder:text-fg-soft"
                                  />
                                  <kbd className="rounded border border-border bg-bg-alt px-1 font-mono text-[10px] text-fg-soft">
                                      Esc
                                  </kbd>
                              </div>
                              <div
                                  ref={listRef}
                                  className="max-h-[60vh] overflow-y-auto"
                                  role="listbox"
                              >
                                  {filtered.length === 0 ? (
                                      <p className="px-4 py-8 text-center text-[13px] text-fg-muted">
                                          Nessun risultato per “{q}”.
                                      </p>
                                  ) : (
                                      grouped.map(([g, list], gi) => (
                                          <div key={g || "_"}>
                                              {g ? (
                                                  <div className="sticky top-0 bg-bg/95 px-4 pt-3 pb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-soft backdrop-blur">
                                                      {g}
                                                  </div>
                                              ) : null}
                                              {list.map((it, ii) => {
                                                  const idx = flatIndex(gi, ii);
                                                  const isActive = idx === active;
                                                  return (
                                                      <button
                                                          key={it.id}
                                                          type="button"
                                                          data-cmd-idx={idx}
                                                          role="option"
                                                          aria-selected={isActive}
                                                          onMouseEnter={() => setActive(idx)}
                                                          onClick={() => {
                                                              it.onSelect();
                                                              setOpen(false);
                                                          }}
                                                          className={cn(
                                                              "flex min-h-11 w-full items-center justify-between gap-3 px-4 py-2 text-left text-[13.5px]",
                                                              "[transition:background-color_140ms_var(--ease-out),color_140ms_var(--ease-out)]",
                                                              "active:bg-bg",
                                                              isActive
                                                                  ? "bg-bg-alt text-fg"
                                                                  : "text-fg-muted",
                                                          )}
                                                      >
                                                          <span className="flex min-w-0 items-center gap-3">
                                                              {it.icon ? (
                                                                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border bg-bg text-fg">
                                                                      {it.icon}
                                                                  </span>
                                                              ) : (
                                                                  <ArrowRight
                                                                      className="h-3.5 w-3.5 shrink-0 text-fg-soft"
                                                                      aria-hidden
                                                                  />
                                                              )}
                                                              <span className="truncate">{it.label}</span>
                                                          </span>
                                                          <span className="flex shrink-0 items-center gap-2">
                                                              {it.hint ? (
                                                                  <span className="font-mono text-[10.5px] text-fg-soft">
                                                                      {it.hint}
                                                                  </span>
                                                              ) : null}
                                                              {isActive ? (
                                                                  <CornerDownLeft
                                                                      className="h-3.5 w-3.5 text-fg-soft"
                                                                      aria-hidden
                                                                  />
                                                              ) : null}
                                                          </span>
                                                      </button>
                                                  );
                                              })}
                                          </div>
                                      ))
                                  )}
                              </div>
                              <footer className="flex items-center justify-between gap-2 border-t border-border bg-bg-alt px-3 py-2 font-mono text-[10px] text-fg-soft">
                                  <span>
                                      <kbd className="rounded border border-border bg-bg px-1">↑↓</kbd> nav ·{" "}
                                      <kbd className="rounded border border-border bg-bg px-1">↵</kbd> apri
                                  </span>
                                  <span>{filtered.length} risultati</span>
                              </footer>
                          </div>
                      </div>,
                      document.body,
                  )
                : null}
        </>
    );
}
