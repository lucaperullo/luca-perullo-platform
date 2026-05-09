import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { SectionRule } from "@/components/section-rule";
import { SideLines } from "@/components/side-lines";
import { createServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
    title: "Accedi · Luca Perullo",
    description:
        "Accedi col solo magic-link via email per salvare i tuoi progressi del corso.",
    robots: { index: false, follow: false },
};

export default async function AccediPage({
    searchParams,
}: {
    searchParams: Promise<{ next?: string }>;
}) {
    const { next } = await searchParams;
    const safeNext =
        next && next.startsWith("/") && !next.startsWith("//")
            ? next
            : "/play";

    // Se già loggato → redirect a destinazione (o onboarding se non fatto)
    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("onboarding_completed_at")
            .eq("id", user.id)
            .maybeSingle();
        if (!profile?.onboarding_completed_at) {
            redirect(`/benvenuto?next=${encodeURIComponent(safeNext)}`);
        }
        redirect(safeNext);
    }

    return (
        <>
            <SideLines side="left" />
            <SideLines side="right" />

            <div className="mx-auto w-full max-w-[var(--container-prose)] px-4 sm:px-6">
                <header className="pt-14 pb-6">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">
                        Accedi · niente password
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                        Salva i tuoi progressi.
                    </h1>
                    <p className="mt-4 max-w-[60ch] text-[15px] leading-[1.7] text-fg-muted">
                        Inserisci la tua email: ti mando un link che ti fa
                        accedere con un click. Il link scade dopo 1 ora. Se
                        è la prima volta, l&apos;account si crea da solo.
                    </p>
                </header>

                <SectionRule />

                <section className="py-8">
                    <LoginForm next={safeNext} />
                </section>

                <SectionRule />

                <section className="py-8">
                    <p className="font-mono text-[11.5px] text-fg-soft">
                        Non vuoi registrarti? Va benissimo. Tutto il corso
                        interattivo (
                        <Link
                            href="/play"
                            className="text-fg underline decoration-fg-soft underline-offset-4 hover:decoration-fg"
                        >
                            /play
                        </Link>
                        ) funziona anche senza account: i progressi vengono
                        salvati nel tuo browser. Registrarti serve solo per
                        salvarli sul cloud e accedere da più dispositivi.
                    </p>
                </section>
            </div>
        </>
    );
}
