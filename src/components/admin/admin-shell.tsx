import { AdminNav } from "./admin-nav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 sm:grid-cols-[200px_1fr]">
      <aside className="border-b border-border bg-bg-alt px-3 py-3 sm:border-b-0 sm:border-r sm:py-6">
        <p className="hidden font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft sm:block">
          Admin
        </p>
        <div className="sm:mt-4">
          <AdminNav />
        </div>
      </aside>
      <main className="px-4 py-6 sm:px-8 sm:py-10">{children}</main>
    </div>
  );
}
