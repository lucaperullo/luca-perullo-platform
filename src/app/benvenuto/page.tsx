import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/auth/onboarding-form";
import { SectionRule } from "@/components/section-rule";
import { SideLines } from "@/components/side-lines";
import { createServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
    title: "Benvenuto · Luca Perullo",
    robots: { index: false, follow: false },
};

export default async function BenvenutoPage({
    searchParams,
}: {
    searchParams: Promise<{ next?: string }>;
}) {
    const { next } = await searchParams;
    const safeNext =
        next && next.startsWith("/") && !next.startsWith("//")
            ? next
            : "/play";

    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Devi essere loggato per fare l'onboarding
    if (!user) {
        redirect(`/accedi?next=${encodeURIComponent(safeNext)}`);
    }

    const { data: profileRow } = await supabase
        .from("profiles")
        .select("full_name, onboarding_completed_at, interests, experience_level")
        .eq("id", user.id)
        .maybeSingle();
    const profile = profileRow as
        | { full_name?: string | null; onboarding_completed_at?: string | null }
        | null;

    // Già onboardato → vai diretto a destinazione
    if (profile?.onboarding_completed_at) {
        redirect(safeNext);
    }

    // Default name dall'email se non già impostato
    const defaultName =
        profile?.full_name ?? user.email?.split("@")[0] ?? "";

    return (
        <>
            <SideLines side="left" />
            <SideLines side="right" />

            <div className="mx-auto w-full max-w-[var(--container-prose)] px-4 sm:px-6">
                <header className="pt-14 pb-6">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">
                        Benvenuto · 1 minuto di setup
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                        Tre domande veloci.
                    </h1>
                    <p className="mt-4 max-w-[60ch] text-[15px] leading-[1.7] text-fg-muted">
                        Niente sondaggio infinito. Mi serve solo capire chi
                        sei e cosa cerchi qui, così ti mostro le cose
                        giuste. Tutte le risposte si possono cambiare dopo.
                    </p>
                </header>

                <SectionRule />

                <section className="py-8">
                    <OnboardingForm
                        userId={user.id}
                        defaultName={defaultName}
                        next={safeNext}
                    />
                </section>
            </div>
        </>
    );
}
