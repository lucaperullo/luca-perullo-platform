import Link from "next/link";
import { LayoutDashboard, Users, FileText, Receipt, Settings } from "lucide-react";

const ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/clienti", label: "Clienti", icon: Users },
  { href: "/admin/preventivi", label: "Preventivi", icon: FileText },
  { href: "/admin/fatture", label: "Fatture", icon: Receipt },
  { href: "/admin/impostazioni", label: "Impostazioni", icon: Settings },
];

export function AdminNav() {
  return (
    <nav aria-label="Admin">
      <ul className="flex flex-row gap-1 overflow-x-auto sm:flex-col sm:gap-0.5">
        {ITEMS.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="press flex items-center gap-2.5 rounded-md px-3 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-fg-muted hover:bg-bg-alt hover:text-fg"
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              <span className="whitespace-nowrap">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
