/**
 * POST /api/onboarding/complete
 *
 * Server-side completion dell'onboarding. Bypassa eventuali estensioni
 * browser che bloccano richieste PATCH/POST cross-origin verso Supabase
 * (es. anti-tracker tipo Bitdefender). La chiamata da client a questo
 * endpoint è same-origin → niente CORS, niente preflight, niente blocchi.
 *
 * Body: { fullName, interests[], experienceLevel, clientTimeline }
 */
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const VALID_EXPERIENCE = ["mai", "poco", "abbastanza", "dev"] as const;
const VALID_TIMELINE = [
    "subito",
    "breve",
    "flessibile",
    "esplorando",
] as const;

type Body = {
    fullName?: unknown;
    interests?: unknown;
    experienceLevel?: unknown;
    clientTimeline?: unknown;
};

export async function POST(req: Request) {
    let body: Body;
    try {
        body = (await req.json()) as Body;
    } catch {
        return NextResponse.json(
            { error: "invalid-json" },
            { status: 400 },
        );
    }

    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json(
            { error: "unauthenticated" },
            { status: 401 },
        );
    }

    // Validazione e sanitizzazione del payload.
    const fullName =
        typeof body.fullName === "string" && body.fullName.trim()
            ? body.fullName.trim().slice(0, 100)
            : null;
    const interests = Array.isArray(body.interests)
        ? body.interests.filter((x): x is string => typeof x === "string").slice(0, 10)
        : [];
    const experienceLevel =
        typeof body.experienceLevel === "string" &&
        (VALID_EXPERIENCE as readonly string[]).includes(body.experienceLevel)
            ? body.experienceLevel
            : null;
    const clientTimeline =
        typeof body.clientTimeline === "string" &&
        (VALID_TIMELINE as readonly string[]).includes(body.clientTimeline)
            ? body.clientTimeline
            : null;

    const { error } = await supabase
        .from("profiles")
        .update({
            full_name: fullName,
            interests,
            experience_level: experienceLevel,
            client_timeline: clientTimeline,
            onboarding_completed_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (error) {
        console.error("[onboarding/complete] update error", error);
        const msg = error instanceof Error ? error.message : "update-failed";
        return NextResponse.json({ error: msg }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}
