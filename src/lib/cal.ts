/**
 * Server-only client per Cal.com API v1.
 *
 * Endpoint base: https://api.cal.com/v1
 * Auth: query param `apiKey` (Cal v1 usa key in querystring, non header).
 *
 * Cache: usiamo `next: { revalidate }` per evitare di martellare l'API
 * — gli slot non cambiano in tempo reale e una latenza di 60s è
 * accettabile per UX.
 */
import "server-only";

const BASE = "https://api.cal.com/v1";

const apiKey = () => {
    const k = process.env.CAL_API_KEY;
    if (!k) {
        throw new Error(
            "[cal] CAL_API_KEY non configurata. Aggiungere in .env.local.",
        );
    }
    return k;
};

export type CalEventType = {
    id: number;
    title: string;
    slug: string;
    length: number;
    hidden: boolean;
};

export type CalSlot = {
    /** ISO 8601 — l'ora di inizio dello slot. */
    time: string;
};

/** Lista degli event type configurati nell'account Cal.com. */
export async function fetchEventTypes(): Promise<CalEventType[]> {
    const url = `${BASE}/event-types?apiKey=${apiKey()}`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) {
        throw new Error(
            `[cal] event-types ${res.status} ${res.statusText}`,
        );
    }
    const data = (await res.json()) as { event_types?: CalEventType[] };
    return data.event_types ?? [];
}

export async function findEventTypeBySlug(
    slug: string,
): Promise<CalEventType | undefined> {
    const all = await fetchEventTypes();
    return all.find((e) => e.slug === slug);
}

/**
 * Ritorna gli slot disponibili tra startTime ed endTime per un event type.
 * Cal v1 risponde con `{ slots: { "YYYY-MM-DD": [{ time: "ISO" }, ...] } }`.
 */
export async function fetchSlots(params: {
    eventTypeId: number;
    startTime: string; // ISO
    endTime: string; // ISO
    timeZone?: string;
}): Promise<CalSlot[]> {
    const tz = params.timeZone ?? "Europe/Rome";
    const url = new URL(`${BASE}/slots`);
    url.searchParams.set("apiKey", apiKey());
    url.searchParams.set("eventTypeId", String(params.eventTypeId));
    url.searchParams.set("startTime", params.startTime);
    url.searchParams.set("endTime", params.endTime);
    url.searchParams.set("timeZone", tz);

    const res = await fetch(url.toString(), {
        next: { revalidate: 60 },
    });
    if (!res.ok) {
        throw new Error(`[cal] slots ${res.status} ${res.statusText}`);
    }
    const data = (await res.json()) as {
        slots?: Record<string, { time: string }[]>;
    };

    const flat: CalSlot[] = [];
    for (const day of Object.values(data.slots ?? {})) {
        if (Array.isArray(day)) {
            for (const s of day) flat.push({ time: s.time });
        }
    }
    // Ordine cronologico crescente — Cal di solito già lo restituisce così,
    // ma normalizziamo per sicurezza.
    flat.sort((a, b) => a.time.localeCompare(b.time));
    return flat;
}
