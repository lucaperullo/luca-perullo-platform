"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type MouseEvent,
    type ReactNode,
} from "react";
import {
    ChevronRight,
    File as FileIcon,
    Folder as FolderIcon,
    FolderOpen as FolderOpenIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TreeContextValue = {
    expanded: Set<string>;
    toggle: (id: string) => void;
    selected: string | undefined;
    select: (id: string) => void;
    depth: number;
};

const TreeContext = createContext<TreeContextValue | null>(null);

const useTree = (): TreeContextValue => {
    const ctx = useContext(TreeContext);
    if (!ctx) throw new Error("FileTree subcomponents must be inside <Tree>");
    return ctx;
};

export type TreeProps = {
    children: ReactNode;
    initialExpandedItems?: string[];
    initialSelectedId?: string;
    className?: string;
};

/**
 * <Tree/> — file/folder hierarchy. Compose with `<Folder/>` and
 * `<File/>`. State for expanded/selected lives in a shared context so
 * deeply-nested folders work without prop drilling.
 */
export function Tree({
    children,
    initialExpandedItems,
    initialSelectedId,
    className,
}: TreeProps) {
    const [expanded, setExpanded] = useState<Set<string>>(
        () => new Set(initialExpandedItems ?? []),
    );
    const [selected, setSelected] = useState<string | undefined>(initialSelectedId);

    const toggle = useCallback((id: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const value = useMemo<TreeContextValue>(
        () => ({ expanded, toggle, selected, select: setSelected, depth: 0 }),
        [expanded, toggle, selected],
    );

    return (
        <TreeContext.Provider value={value}>
            <ul role="tree" className={cn("font-mono text-[13px]", className)}>
                {children}
            </ul>
        </TreeContext.Provider>
    );
}

const Indent = ({ depth }: { depth: number }) => (
    <span aria-hidden style={{ width: depth * 18 }} className="inline-block shrink-0" />
);

export type FolderProps = {
    /** Stable id for this folder. */
    value: string;
    /** Folder label (typically the directory name). */
    element: ReactNode;
    children: ReactNode;
    className?: string;
};

export function Folder({ value, element, children, className }: FolderProps) {
    const ctx = useTree();
    const open = ctx.expanded.has(value);
    return (
        <li role="treeitem" aria-expanded={open} className="select-none">
            <button
                type="button"
                onClick={() => ctx.toggle(value)}
                className={cn(
                    "press flex w-full items-center gap-1 rounded-sm px-1 py-1 text-left",
                    "text-fg hover:bg-bg-alt",
                    className,
                )}
            >
                <Indent depth={ctx.depth} />
                <ChevronRight
                    className={cn(
                        "size-3.5 shrink-0 text-fg-muted transition-transform duration-150 [transition-timing-function:var(--ease-out)]",
                        open && "rotate-90",
                    )}
                />
                {open ? (
                    <FolderOpenIcon className="size-4 shrink-0 text-fg-muted" />
                ) : (
                    <FolderIcon className="size-4 shrink-0 text-fg-muted" />
                )}
                <span className="truncate">{element}</span>
            </button>
            {open && (
                <TreeContext.Provider value={{ ...ctx, depth: ctx.depth + 1 }}>
                    <ul role="group" className="block">
                        {children}
                    </ul>
                </TreeContext.Provider>
            )}
        </li>
    );
}

export type FileProps = {
    /** Stable id for this file. */
    value: string;
    children: ReactNode;
    className?: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

export function File({ value, children, className, onClick }: FileProps) {
    const ctx = useTree();
    const isSelected = ctx.selected === value;
    return (
        <li role="treeitem" aria-selected={isSelected}>
            <button
                type="button"
                onClick={(event) => {
                    ctx.select(value);
                    onClick?.(event);
                }}
                className={cn(
                    "press flex w-full items-center gap-1 rounded-sm px-1 py-1 text-left",
                    isSelected ? "bg-accent/10 text-fg" : "text-fg hover:bg-bg-alt",
                    className,
                )}
            >
                <Indent depth={ctx.depth} />
                <span className="size-3.5 shrink-0" />
                <FileIcon className="size-4 shrink-0 text-fg-muted" />
                <span className="truncate">{children}</span>
            </button>
        </li>
    );
}
