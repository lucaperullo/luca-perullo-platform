/**
 * POST /api/checkout
 *
 * Body: { slug: string }
 * Trova il servizio nel catalogo, crea una Stripe Checkout Session, e
 * restituisce l'URL di redirect.
 *
 * Errori comuni:
 *  - 503: STRIPE_SECRET_KEY non configurata.
 *  - 404: slug non esiste.
 *  - 400: il servizio non ha stripePriceId (placeholder non sostituito).
 *  - 422: bookOnly = true (questo servizio non passa da Stripe).
 */
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServiceBySlug } from "@/data/services";

export const runtime = "nodejs";

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://lucaperullo.it";

export async function POST(req: Request) {
    if (!stripe) {
        return NextResponse.json(
            {
                error: "stripe-not-configured",
                message:
                    "STRIPE_SECRET_KEY non impostata. Aggiungere in .env.local.",
            },
            { status: 503 },
        );
    }

    let body: { slug?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { error: "invalid-json" },
            { status: 400 },
        );
    }

    const slug = typeof body.slug === "string" ? body.slug : null;
    if (!slug) {
        return NextResponse.json(
            { error: "missing-slug" },
            { status: 400 },
        );
    }

    const service = getServiceBySlug(slug);
    if (!service) {
        return NextResponse.json(
            { error: "service-not-found", slug },
            { status: 404 },
        );
    }

    if (service.bookOnly) {
        return NextResponse.json(
            {
                error: "service-not-purchasable",
                message:
                    "Questo servizio si prenota tramite calendario, non passa da Stripe.",
                bookHref: service.bookHref,
            },
            { status: 422 },
        );
    }

    if (!service.stripePriceId) {
        return NextResponse.json(
            {
                error: "missing-stripe-price",
                message:
                    "stripePriceId non configurato per questo servizio. Crearlo su Stripe Dashboard e aggiornare src/data/services.ts.",
                slug,
            },
            { status: 400 },
        );
    }

    try {
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: service.stripePriceId,
                    quantity: 1,
                },
            ],
            allow_promotion_codes: true,
            billing_address_collection: "required",
            // Il cliente PMI italiano spesso vuole la fattura: raccogliamo
            // i dati fiscali in checkout per generarla a valle.
            tax_id_collection: { enabled: true },
            customer_creation: "always",
            metadata: {
                serviceSlug: service.slug,
                serviceName: service.name,
                serviceFamily: service.family,
            },
            success_url: `${SITE_URL}/servizi/success?session_id={CHECKOUT_SESSION_ID}&slug=${service.slug}`,
            cancel_url: `${SITE_URL}/servizi/${service.slug}?canceled=1`,
            locale: "it",
        });

        if (!session.url) {
            throw new Error("Stripe non ha restituito un URL di checkout");
        }

        return NextResponse.json({ url: session.url });
    } catch (err) {
        console.error("[checkout] errore stripe", err);
        return NextResponse.json(
            {
                error: "stripe-create-session-failed",
                message:
                    err instanceof Error ? err.message : "errore sconosciuto",
            },
            { status: 500 },
        );
    }
}
