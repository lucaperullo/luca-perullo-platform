#!/usr/bin/env node
/**
 * Generate portfolio asset images via OpenRouter (Gemini 2.5 Flash Image — "nano banana").
 *
 * Usage (key is read from env, never hardcoded):
 *   OPENROUTER_API_KEY="sk-or-..." node scripts/generate-assets.mjs
 *
 * Output: public/projects/<slug>.jpg (resized via sips after generation).
 * To add a new asset, append to ASSETS and re-run; existing files are overwritten.
 *
 * Why: the live portfolio mixes 2 real shipped products (NBT, Habitz) with
 * concept/lab pieces — chanhdai-style "selected work" without faking
 * real client engagements. Each asset is clearly marked "Concept" in
 * src/data/projects.ts so visitors know what's shipped vs. exploration.
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(__dirname, "../public/projects");
const KEY = process.env.OPENROUTER_API_KEY;

if (!KEY) {
    console.error(
        "[error] Set OPENROUTER_API_KEY in your environment before running.\n" +
        "  e.g.  read -s OPENROUTER_API_KEY  # paste, hidden\n" +
        "         export OPENROUTER_API_KEY\n" +
        "         node scripts/generate-assets.mjs"
    );
    process.exit(1);
}

if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true });

const MODEL = "google/gemini-2.5-flash-image"; // "nano banana"

/**
 * Each prompt is engineered to produce a 16:10-friendly product mockup
 * suitable for a chanhdai-style portfolio thumbnail. We ask for clean,
 * believable UI screenshots, not artistic illustrations.
 */
const ASSETS = [
    {
        slug: "pulse-studio",
        prompt:
            "A clean product screenshot of a modern AI-assisted music production app called " +
            "'Pulse Studio'. Dark UI, deep charcoal background. Center: a multi-track waveform " +
            "timeline with subtle blue and purple accents, playhead visible. Right sidebar: an " +
            "AI-suggestion panel with three short message bubbles in monospace, suggesting chord " +
            "changes. Top-left: small Pulse Studio wordmark + transport controls. Bottom: status " +
            "bar with BPM, key (C minor), and time signature. Sleek typography (Geist-style sans). " +
            "Soft inner shadows, no glow effects. Photorealistic 16:10 macOS-style window screenshot, " +
            "cropped flush to the chrome. No people, no logos other than the wordmark.",
    },
    {
        slug: "drift",
        prompt:
            "Minimalist productivity app screenshot for a focus tool called 'Drift'. Light mode, " +
            "off-white background (#fafafa). Centered large circular focus timer showing 28:34 " +
            "remaining, thin progress ring in zinc-950. Left side: a tidy list of three task names " +
            "with checkbox circles. Right side: a small bar chart showing 6 daily focus sessions, " +
            "each labeled with a weekday abbreviation. Top: tiny 'Drift' wordmark in the upper-left, " +
            "muted icon row in the upper-right. Lots of whitespace, hairline 1px borders zinc-200. " +
            "Geist-style sans typography. 16:10 desktop window screenshot, no glow effects, no people.",
    },
    {
        slug: "verba",
        prompt:
            "Product screenshot of a writing app called 'Verba'. Dark mode editor with a serif body " +
            "typeface for the manuscript and a monospaced sidebar. Left pane: a markdown document in " +
            "progress titled 'Chapter 3 — On Restraint', several paragraphs visible. Right pane: an " +
            "AI co-author panel showing 3 alternative phrasings for the highlighted sentence, each " +
            "in a small monospace card. Top toolbar: minimal icons (bold, italic, link, AI), word " +
            "count in the right corner. Subtle warm tint to the dark background. Cinematic, calm, " +
            "Apple-style polish. Photorealistic 16:10 window screenshot, no people, no other logos.",
    },
    {
        slug: "aura-academy",
        prompt:
            "Product screenshot of an e-learning platform called 'AURA Academy' for software " +
            "developers. Light mode, generous whitespace. Centered course card showing a video " +
            "thumbnail (abstract dark gradient with 'Building AI Products with Next.js' overlay), " +
            "an instructor name 'Luca Perullo' in mono small, a progress bar at 42%, and a row of " +
            "three lesson chips below. Left rail: minimal sidebar nav with course icons. Top: tiny " +
            "AURA wordmark in the upper-left. Hairline borders, zinc-anchored palette. Geist-style " +
            "sans typography. Photorealistic 16:10 desktop screenshot, no people, no other logos.",
    },
];

async function generateOne(asset) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${KEY}`,
            "HTTP-Referer": "https://lucaperullo.it",
            "X-Title": "Luca Perullo Platform - asset generation",
        },
        body: JSON.stringify({
            model: MODEL,
            modalities: ["image", "text"],
            messages: [{ role: "user", content: asset.prompt }],
        }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} for ${asset.slug}: ${text.slice(0, 400)}`);
    }
    const json = await res.json();
    const message = json?.choices?.[0]?.message;
    const images =
        message?.images ??
        (Array.isArray(message?.content)
            ? message.content.filter((p) => p.type === "image_url")
            : null);

    const dataUri = images?.[0]?.image_url?.url ?? images?.[0]?.url;
    if (!dataUri || !dataUri.startsWith("data:image/")) {
        throw new Error(
            `No image in response for ${asset.slug}: ${JSON.stringify(json).slice(0, 300)}`,
        );
    }

    const [, mime, b64] = dataUri.match(/^data:([^;]+);base64,(.+)$/) ?? [];
    if (!b64) throw new Error(`Bad data URI for ${asset.slug}`);
    const ext = mime.split("/")[1] ?? "png";
    const rawPath = `${PUBLIC_DIR}/${asset.slug}.${ext}`;
    const finalPath = `${PUBLIC_DIR}/${asset.slug}.jpg`;
    writeFileSync(rawPath, Buffer.from(b64, "base64"));

    // Down-scale + JPEG-compress via macOS sips (already present locally,
    // no extra dependency vs adding sharp/jimp).
    execSync(
        `sips -Z 1600 -s format jpeg -s formatOptions 85 "${rawPath}" --out "${finalPath}" >/dev/null`,
    );
    if (rawPath !== finalPath) execSync(`rm -f "${rawPath}"`);
    console.log(`✓ ${asset.slug} → ${finalPath}`);
}

const failures = [];
for (const asset of ASSETS) {
    try {
        await generateOne(asset);
    } catch (e) {
        failures.push({ slug: asset.slug, error: e.message });
        console.log(`✗ ${asset.slug}: ${e.message}`);
    }
}

if (failures.length) {
    console.log(`\nFinished with ${failures.length} failure(s).`);
    process.exit(1);
}
console.log(`\nGenerated ${ASSETS.length} asset(s).`);
