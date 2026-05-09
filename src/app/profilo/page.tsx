import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, LogOut } from "lucide-react";
import { ProfileForm } from "@/components/auth/profile-form";
import { SectionLabel } from "@/components/section-label";
import { SectionRule } from "@/components/section-rule";
import { SideLines } from "@/components/side-lines";
import { createServerClient } from "@/lib/supabase/server";
import { formatItalianDate } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Il mio profilo · Luca Perullo",
    description: "Le tue informazioni e i tuoi progressi.",
    robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const INTEREST_LABELS: Record<string, string> = {
    "imparare-codice": "Imparare a programmare",
    "costruire-sito": "Voglio un sito per la mia attività",
    "consulenza-ai": "Consulenza AI / automazioni",
    "info-corsi": "Info sui corsi",
    curiosare: "Sono qui di passaggio",
};

const EXPERIENCE_LABELS: Record<string, string> = {
    mai: "Principiante completo",
    poco: "Un po' di HTML/CSS",
    abbastanza: "Sa scrivere codice",
    dev: "Sviluppatore",
};

const TIMELINE_LABELS: Record<string, string> = {
    subito: "Subito (1-2 settimane)",
    breve: "Nel breve (1-2 mesi)",
    flessibile: "Flessibile",
    esplorando: "Sta esplorando",
};

type ProfileRow = {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    role: string | null;
    interests: string[] | null;
    experience_level: string | null;
    client_timeline: string | null;
    onboarding_completed_at: string | null;
    created_at: string | null;
};

type PlayProgressRow = {
    course_slug: string;
    current_lesson_order: number;
    completed_lessons: string[] | null;
    updated_at: string;
};

export default async function ProfiloPage() {
    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/accedi?next=/profilo");

    const { data: profileRow } = await supabase
        .from("profiles")
        .select(
            "id, full_name, avatar_url, role, interests, experience_level, client_timeline, onboarding_completed_at, created_at",
        )
        .eq("id", user.id)
        .maybeSingle();
    const profile = (profileRow as ProfileRow | null) ?? null;

    if (!profile?.onboarding_completed_at) {
        redirect("/benvenuto?next=/profilo");
    }

    const { data: progressRows } = await supabase
        .from("play_progress")
        .select("course_slug, current_lesson_order, completed_lessons, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
    const progress = (progressRows as PlayProgressRow[] | null) ?? [];

    return (
        <>
            <SideLines side="left" />
            <SideLines side="right" />

            <div className="mx-auto w-full max-w-[var(--container-prose)] px-4 sm:px-6">
                <header className="pt-12 pb-6 sm:pt-14">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">
                        Il mio profilo
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                        {profile.full_name ?? user.email?.split("@")[0]}
                    </h1>
                    <p className="mt-2 font-mono text-[11.5px] text-fg-soft">
                        {user.email}
                        {profile.created_at ? (
                            <>
                                {" · iscritto il "}
                                {formatItalianDate(profile.created_at)}
                            </>
                        ) : null}
                    </p>
                </header>

                <SectionRule />

                <section className="py-10">
                    <SectionLabel index={1}>Le tue informazioni</SectionLabel>
                    <p className="mt-3 max-w-[60ch] text-[14px] text-fg-muted">
                        Cambiale quando vuoi, vengono salvate al click su
                        Salva.
                    </p>
                    <div className="mt-6">
                        <ProfileForm
                            userId={user.id}
                            initialName={profile.full_name ?? ""}
                            initialInterests={profile.interests ?? []}
                            initialExperience={profile.experience_level ?? null}
                            initialTimeline={profile.client_timeline ?? null}
                        />
                    </div>
                </section>

                <SectionRule />

                <section className="py-10">
                    <SectionLabel index={2}>I tuoi corsi</SectionLabel>
                    {progress.length === 0 ? (
                        <p className="mt-4 max-w-[60ch] text-[14px] text-fg-muted">
                            Non hai ancora iniziato il corso interattivo.{" "}
                            <Link
                                href="/play"
                                className="text-fg underline decoration-fg-soft underline-offset-4 hover:decoration-fg"
                            >
                                Comincia da qui
                            </Link>
                            .
                        </p>
                    ) : (
                        <ul className="-mx-4 mt-6 sm:-mx-6">
                            {progress.map((p, i) => (
                                <li
                                    key={p.course_slug}
                                    className={`row-rule${i === 0 ? " row-rule-top" : ""}`}
                                >
                                    <Link
                                        href={`/play/${p.current_lesson_order}`}
                                        className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-bg-alt sm:px-6"
                                    >
                                        <span className="flex flex-1 flex-col gap-1">
                                            <span className="text-[14.5px] font-medium text-fg">
                                                Crea il tuo primo sito in 30 minuti
                                            </span>
                                            <span className="font-mono text-[11px] text-fg-soft">
                                                Lezione {p.current_lesson_order} ·{" "}
                                                {(p.completed_lessons ?? []).length} completate ·
                                                aggiornato il {formatItalianDate(p.updated_at)}
                                            </span>
                                        </span>
                                        <span className="press inline-flex items-center gap-1.5 rounded-md border border-fg-soft px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-fg group-hover:border-fg">
                                            Continua
                                            <ArrowUpRight
                                                className="h-3 w-3"
                                                aria-hidden
                                            />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <SectionRule />

                <section className="py-10">
                    <SectionLabel index={3}>Riepilogo onboarding</SectionLabel>
                    <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-md border border-border bg-bg-alt p-4">
                            <dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                                Cosa ti porta qui
                            </dt>
                            <dd className="mt-2 flex flex-wrap gap-1.5">
                                {(profile.interests ?? []).length === 0 ? (
                                    <span className="font-mono text-[12px] text-fg-muted">
                                        nessun interesse selezionato
                                    </span>
                                ) : (
                                    (profile.interests ?? []).map((i) => (
                                        <span
                                            key={i}
                                            className="rounded-full border border-border bg-bg px-2 py-0.5 font-mono text-[11px] text-fg-muted"
                                        >
                                            {INTEREST_LABELS[i] ?? i}
                                        </span>
                                    ))
                                )}
                            </dd>
                        </div>
                        {profile.experience_level ? (
                            <div className="rounded-md border border-border bg-bg-alt p-4">
                                <dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                                    Esperienza con il codice
                                </dt>
                                <dd className="mt-2 font-mono text-[12.5px] text-fg">
                                    {EXPERIENCE_LABELS[profile.experience_level] ??
                                        profile.experience_level}
                                </dd>
                            </div>
                        ) : null}
                        {profile.client_timeline ? (
                            <div className="rounded-md border border-border bg-bg-alt p-4">
                                <dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-soft">
                                    Quando ti serve
                                </dt>
                                <dd className="mt-2 font-mono text-[12.5px] text-fg">
                                    {TIMELINE_LABELS[profile.client_timeline] ??
                                        profile.client_timeline}
                                </dd>
                            </div>
                        ) : null}
                    </dl>
                </section>

                <SectionRule />

                <section className="py-10">
                    <SectionLabel index={4}>Account</SectionLabel>
                    <div className="mt-6 flex flex-col gap-3">
                        <form action="/auth/logout" method="post">
                            <button
                                type="submit"
                                className="press inline-flex items-center gap-2 rounded-md border border-border-strong bg-bg px-3.5 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-fg hover:bg-bg-alt"
                            >
                                <LogOut className="h-3.5 w-3.5" aria-hidden />
                                Esci dall&apos;account
                            </button>
                        </form>
                        <p className="font-mono text-[11px] text-fg-soft">
                            Per cancellare il tuo account scrivimi a{" "}
                            <a
                                href="mailto:lucaperullo@outlook.it?subject=Cancellazione%20account"
                                className="underline decoration-fg-soft underline-offset-3 hover:decoration-fg"
                            >
                                lucaperullo@outlook.it
                            </a>
                            : risponderò entro 48 ore con la conferma di
                            avvenuta cancellazione (GDPR).
                        </p>
                    </div>
                </section>
            </div>
        </>
    );
}
