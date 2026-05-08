"use client";

import {
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type KeyboardEvent,
    type ReactNode,
} from "react";
import { ArrowUp, Paperclip, Sparkles, Square, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type AiPromptInputAttachment = { id: string; name: string; size?: number };

export type AiSlashCommand = {
    id: string;
    label: string;
    /** Replaces the input value when picked. */
    insert: string;
    hint?: string;
};

export type AiPromptInputProps = {
    /** Placeholder text. */
    placeholder?: string;
    /** Initial value (controlled-ish — the component owns state internally). */
    initialValue?: string;
    /** Disabled while a request is in flight. */
    busy?: boolean;
    /** Called when the user hits the send button or Enter (without Shift). */
    onSubmit: (value: string, attachments: AiPromptInputAttachment[]) => void;
    /** Called when the user hits the stop button (only shown when busy=true). */
    onStop?: () => void;
    /** Slash commands surfaced when the input starts with "/". */
    slashCommands?: AiSlashCommand[];
    /** Allow file attach. Default true. */
    allowAttach?: boolean;
    /** Auxiliary toolbar slot (left side, right of attach). */
    leftToolbar?: ReactNode;
    /** Max textarea height in px before scroll. Default 220. */
    maxHeight?: number;
    className?: string;
};

/**
 * <AiPromptInput/> — modern Claude/ChatGPT-style chat input.
 *
 *  - Multi-line auto-grow textarea (capped at maxHeight)
 *  - Enter to send · Shift+Enter for newline
 *  - Optional attachments row (file picker)
 *  - Slash command picker that pops above the input when value starts with "/"
 *  - Send/stop button morphs based on `busy` state
 *
 * No dependencies beyond lucide. State is fully internal except the
 * `onSubmit` / `onStop` callbacks.
 */
export function AiPromptInput({
    placeholder = "Scrivi un messaggio…",
    initialValue = "",
    busy = false,
    onSubmit,
    onStop,
    slashCommands,
    allowAttach = true,
    leftToolbar,
    maxHeight = 220,
    className,
}: AiPromptInputProps) {
    const [value, setValue] = useState(initialValue);
    const [attachments, setAttachments] = useState<AiPromptInputAttachment[]>([]);
    const [slashOpen, setSlashOpen] = useState(false);
    const [slashIdx, setSlashIdx] = useState(0);
    const taRef = useRef<HTMLTextAreaElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const filteredSlash = (slashCommands ?? []).filter((c) =>
        c.label.toLowerCase().includes(value.slice(1).trim().toLowerCase()),
    );

    // auto-grow
    useEffect(() => {
        const el = taRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    }, [value, maxHeight]);

    // slash menu visibility
    useEffect(() => {
        setSlashOpen(value.startsWith("/") && (slashCommands?.length ?? 0) > 0);
        setSlashIdx(0);
    }, [value, slashCommands]);

    function send() {
        const v = value.trim();
        if (!v && attachments.length === 0) return;
        onSubmit(v, attachments);
        setValue("");
        setAttachments([]);
    }

    function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (slashOpen) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSlashIdx((i) => Math.min(i + 1, filteredSlash.length - 1));
                return;
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setSlashIdx((i) => Math.max(i - 1, 0));
                return;
            }
            if (e.key === "Tab" || (e.key === "Enter" && !e.shiftKey)) {
                e.preventDefault();
                const c = filteredSlash[slashIdx];
                if (c) setValue(c.insert + " ");
                setSlashOpen(false);
                return;
            }
            if (e.key === "Escape") {
                e.preventDefault();
                setSlashOpen(false);
                return;
            }
        }
        if (e.key === "Enter" && !e.shiftKey && !busy) {
            e.preventDefault();
            send();
        }
    }

    function onFile(e: ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        const next = files.map((f) => ({
            id: crypto.randomUUID?.() ?? `${f.name}-${f.size}-${Math.random()}`,
            name: f.name,
            size: f.size,
        }));
        setAttachments((a) => [...a, ...next]);
        if (fileRef.current) fileRef.current.value = "";
    }

    return (
        <div
            className={cn(
                "relative w-full overflow-visible rounded-[14px] border border-border bg-bg shadow-[0_4px_24px_-12px_rgba(0,0,0,.25)]",
                "focus-within:border-fg/50",
                className,
            )}
        >
            {slashOpen && filteredSlash.length > 0 ? (
                <div
                    className={cn(
                        "slash-menu absolute bottom-full left-0 right-0 mb-2 max-h-60 overflow-y-auto rounded-[10px] border border-border bg-bg p-1 shadow-lg",
                    )}
                    style={{
                        opacity: 1,
                        transform: "translateY(0)",
                        transformOrigin: "bottom center",
                        transition: "opacity 180ms var(--ease-out), transform 180ms var(--ease-out)",
                    }}
                >
                    <style>{`
                        @starting-style {
                            .slash-menu { opacity: 0; transform: translateY(4px); }
                        }
                    `}</style>
                    {filteredSlash.map((c, i) => (
                        <button
                            key={c.id}
                            type="button"
                            onMouseEnter={() => setSlashIdx(i)}
                            onClick={() => {
                                setValue(c.insert + " ");
                                setSlashOpen(false);
                                taRef.current?.focus();
                            }}
                            className={cn(
                                "flex min-h-9 w-full items-center justify-between gap-3 rounded-md px-3 py-1.5 text-left text-[13px]",
                                "[transition:background-color_140ms_var(--ease-out),color_140ms_var(--ease-out)]",
                                i === slashIdx ? "bg-bg-alt text-fg" : "text-fg-muted",
                            )}
                        >
                            <span className="flex items-center gap-2">
                                <Sparkles className="h-3.5 w-3.5 text-fg-soft" aria-hidden />
                                <span className="font-mono text-[12px]">{c.label}</span>
                            </span>
                            {c.hint ? (
                                <span className="font-mono text-[10.5px] text-fg-soft">{c.hint}</span>
                            ) : null}
                        </button>
                    ))}
                </div>
            ) : null}

            {attachments.length > 0 ? (
                <ul className="flex flex-wrap gap-1.5 border-b border-border px-3 py-2">
                    {attachments.map((a) => (
                        <li
                            key={a.id}
                            className="flex items-center gap-1.5 rounded-md border border-border bg-bg-alt px-2 py-1 font-mono text-[11px] text-fg"
                        >
                            <Paperclip className="h-3 w-3 text-fg-soft" aria-hidden />
                            <span className="max-w-[160px] truncate">{a.name}</span>
                            <button
                                type="button"
                                aria-label={`Rimuovi ${a.name}`}
                                onClick={() =>
                                    setAttachments((arr) => arr.filter((x) => x.id !== a.id))
                                }
                                className="text-fg-soft hover:text-fg"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : null}

            <textarea
                ref={taRef}
                rows={1}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                disabled={busy && !onStop}
                className={cn(
                    "block w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-[14.5px] leading-[1.5] text-fg outline-none placeholder:text-fg-soft",
                    "scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]",
                )}
                style={{ maxHeight }}
            />

            <div className="flex items-center justify-between gap-2 px-3 pb-2.5">
                <div className="flex items-center gap-1">
                    {allowAttach ? (
                        <>
                            <input
                                ref={fileRef}
                                type="file"
                                multiple
                                onChange={onFile}
                                className="hidden"
                            />
                            <button
                                type="button"
                                aria-label="Allega file"
                                onClick={() => fileRef.current?.click()}
                                className={cn(
                                    "press grid h-9 w-9 place-items-center rounded-md text-fg-soft",
                                    "[transition:transform_160ms_var(--ease-out),background-color_160ms_var(--ease-out),color_160ms_var(--ease-out)]",
                                    "hover:bg-bg-alt hover:text-fg",
                                )}
                            >
                                <Paperclip className="h-3.5 w-3.5" />
                            </button>
                        </>
                    ) : null}
                    {leftToolbar}
                </div>

                <div className="flex items-center gap-2">
                    <span className="hidden font-mono text-[10px] text-fg-soft sm:inline">
                        <kbd className="rounded border border-border bg-bg-alt px-1">↵</kbd> invia ·{" "}
                        <kbd className="rounded border border-border bg-bg-alt px-1">⇧↵</kbd> a capo
                    </span>
                    {busy ? (
                        <button
                            type="button"
                            onClick={onStop}
                            aria-label="Interrompi"
                            className={cn(
                                "press grid h-9 w-9 place-items-center rounded-full bg-fg-muted text-bg",
                                "[transition:transform_160ms_var(--ease-out),background-color_160ms_var(--ease-out)]",
                                "hover:bg-fg",
                            )}
                        >
                            <Square className="h-3.5 w-3.5" fill="currentColor" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={send}
                            disabled={!value.trim() && attachments.length === 0}
                            aria-label="Invia"
                            className={cn(
                                "press grid h-9 w-9 place-items-center rounded-full bg-fg text-bg",
                                "[transition:transform_160ms_var(--ease-out),background-color_160ms_var(--ease-out)]",
                                "hover:bg-fg/90",
                                "disabled:cursor-not-allowed disabled:bg-border-strong disabled:text-fg-soft disabled:active:scale-100",
                            )}
                        >
                            <ArrowUp className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
