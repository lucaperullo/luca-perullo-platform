import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Admin · Luca Perullo",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <div className="mx-auto w-full max-w-[var(--container-frame)] px-4 sm:px-6">
      {children}
    </div>
  );
}
