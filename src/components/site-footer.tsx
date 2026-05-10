import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="mt-24 border-t border-border bg-bg-alt">
            <div className="mx-auto flex max-w-[var(--container-frame)] flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-1 text-[12.5px]">
                    <span className="font-medium text-fg">Luca Perullo</span>
                    <span className="font-mono text-fg-muted">
                        Software Architect · AI Engineer · Made in Italy
                    </span>
                </div>
                <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-fg-muted">
                    <Link href="/play" className="hover:text-fg">Corsi</Link>
                    <Link href="/tools" className="hover:text-fg">Tools</Link>
                    <Link href="/components" className="hover:text-fg">Components</Link>
                    <Link href="/blog" className="hover:text-fg">Blog</Link>
                    <a href="mailto:lucaperullo@outlook.it" className="hover:text-fg">
                        Contatti
                    </a>
                    <a
                        href="https://github.com/lucaperullo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-fg"
                    >
                        GitHub
                    </a>
                </nav>
            </div>
            <div className="mx-auto flex max-w-[var(--container-frame)] items-center justify-between border-t border-border px-4 py-4 text-[11.5px] font-mono text-fg-soft sm:px-6">
                <span>© {new Date().getFullYear()} Luca Perullo</span>
                <span>v0.1 · platform</span>
            </div>
        </footer>
    );
}
