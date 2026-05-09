/**
 * GET /api/cal/availability?eventSlug=15min&days=10&limit=6
 *
 * Restituisce i prossimi N slot disponibili per un event type Cal.com.
 *
 * Default:
 *   - eventSlug = "15min"
 *   - days = 14
 *   - limit = 6
 *
 * Risposta:
 *   {
 *     eventSlug, eventTypeId,
 *     slots: [{ time: "ISO" }],
 *     bookHref: "https://cal.com/<user>/<event>"
 *   }
 *
 * Errori:
 *   - 503: CAL_API_KEY mancante.
 *   - 404: event type non trovato.
 *   - 502: Cal API risposta non valida.
 */
import { NextResponse } from "next/server";
import { fetchSlots, findEventTypeBySlug } from "@/lib/cal";
import { CAL_USERNAME, calBookHref } from "@/data/services";

export const runtime = "nodejs";
export const revalidate = 60;

const DEFAULTS = {
    eventSlug: "15min",
    days: 14,
    limit: 6,
};

export async function GET(req: Request) {
    if (!process.env.CAL_API_KEY) {
        return NextResponse.json(
            {
                error: "cal-not-configured",
                message: "CAL_API_KEY non impostata.",
            },
            { status: 503 },
        );
    }

    const { searchParams } = new URL(req.url);
    const eventSlug = searchParams.get("eventSlug") ?? DEFAULTS.eventSlug;
    const days = clampInt(
        Number(searchParams.get("days") ?? DEFAULTS.days),
        1,
        60,
        DEFAULTS.days,
    );
    const limit = clampInt(
        Number(searchParams.get("limit") ?? DEFAULTS.limit),
        1,
        24,
        DEFAULTS.limit,
    );

    try {
        const event = await findEventTypeBySlug(eventSlug);
        if (!event) {
            return NextResponse.json(
                {
                    error: "event-not-found",
                    eventSlug,
                    message: `Event type "${eventSlug}" non trovato per @${CAL_USERNAME}.`,
                },
                { status: 404 },
            );
        }

        const startTime = new Date().toISOString();
        const endTime = new Date(
            Date.now() + days * 24 * 60 * 60 * 1000,
        ).toISOString();

        const slots = await fetchSlots({
            eventTypeId: event.id,
            startTime,
            endTime,
        });

        return NextResponse.json({
            eventSlug,
            eventTypeId: event.id,
            length: event.length,
            slots: slots.slice(0, limit),
            bookHref: calBookHref(eventSlug),
        });
    } catch (err) {
        console.error("[cal/availability]", err);
        return NextResponse.json(
            {
                error: "cal-api-failed",
                message:
                    err instanceof Error
                        ? err.message
                        : "errore sconosciuto",
            },
            { status: 502 },
        );
    }
}

function clampInt(n: number, min: number, max: number, def: number): number {
    if (!Number.isFinite(n)) return def;
    return Math.max(min, Math.min(max, Math.trunc(n)));
}
