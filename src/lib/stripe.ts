/**
 * Server-only Stripe client.
 *
 * Mai importato da componenti client. Usato esclusivamente in API routes
 * (es. /api/checkout/route.ts) e server actions.
 */
import "server-only";
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

if (!key) {
    // Non lanciamo: il sito deve buildare anche senza chiavi (es. anteprima
    // statica). L'errore viene segnalato solo quando si chiama un endpoint
    // che richiede davvero Stripe.
    console.warn(
        "[stripe] STRIPE_SECRET_KEY non impostata. /api/checkout risponderà 503.",
    );
}

export const stripe = key
    ? new Stripe(key, {
          // Pin esplicito di una versione API stabile.
          // Rev: aggiornare periodicamente seguendo il changelog Stripe.
          apiVersion: "2025-01-27.acacia" as Stripe.LatestApiVersion,
          typescript: true,
      })
    : null;

export const isStripeReady = () => stripe !== null;
