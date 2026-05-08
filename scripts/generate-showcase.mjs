#!/usr/bin/env node
/**
 * Generate visual-craft showcase assets — magnificent graphic elements
 * that sit *next to* the minimal page chrome to demonstrate the level
 * of polish Luca delivers. These are NOT product screenshots and NOT
 * concept apps — they are pure design studies (typography, 3D, data viz,
 * mobile craft, brand identity, motion).
 *
 * Usage:  OPENROUTER_API_KEY=sk-or-... node scripts/generate-showcase.mjs
 *
 * Output: public/showcase/<slug>.jpg — referenced from src/data/showcase.ts.
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../public/showcase");
const KEY = process.env.OPENROUTER_API_KEY;
if (!KEY) throw new Error("Set OPENROUTER_API_KEY before running.");
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const MODEL = "google/gemini-2.5-flash-image";

const ASSETS = [
    {
        slug: "typography-poster",
        sips: "Z 1600",
        prompt:
            "Museum-quality editorial typographic poster. Off-white #fafafa background, generous " +
            "margins. Centered: a single large display word 'Architettura' set in a clean modern " +
            "sans-serif (Geist-style), zinc-950. Above the word, a small monospaced subtitle line " +
            "'studio · sistema · scelta · sostanza' in zinc-500. Below the word, a thin 1px " +
            "horizontal hairline rule and a small filled square dot (•) centered. Faint vertical " +
            "1px grid lines crossing the canvas at the eighth columns, nearly invisible. Pristine " +
            "Swiss-style typography. 16:10 horizontal. NO photographs, NO illustrations — pure " +
            "type and one geometric mark. Spell EVERY word exactly as given.",
    },
    {
        slug: "render-3d",
        sips: "Z 1600",
        prompt:
            "Premium product 3D render. Three interlocking abstract objects floating in a " +
            "minimalist studio: a frosted glass cylinder, a polished obsidian cube, and a brushed " +
            "aluminum sphere. Soft studio lighting from the upper-left, subtle volumetric haze, " +
            "realistic PBR materials, accurate contact shadows on a warm off-white surface. " +
            "Editorial composition (rule-of-thirds), calm and precious. Limited palette: " +
            "off-white background, charcoal cube, frosted-grey cylinder, warm-amber rim light on " +
            "the sphere. 16:10 horizontal. NO text, NO logos.",
    },
    {
        slug: "data-viz",
        sips: "Z 1600",
        prompt:
            "Editorial data visualization composition on an off-white card. Three precise charts " +
            "side by side: (1) a thin horizontal bar chart with 7 weekly bars in zinc tones and " +
            "one accent amber bar; (2) a small line chart with two smooth interpolated curves " +
            "intersecting; (3) a thin-stroke donut chart filled to 38% in zinc-950 on a zinc-200 " +
            "track, with the number '38%' centered inside in mono. Hairline 1px borders around " +
            "each chart card, axis ticks labelled with abstract mono codes ('q1 q2 q3 q4'). " +
            "Geist Mono labels. Restraint, balance, breathing room. 16:10 horizontal. NO real " +
            "data labels — only abstract axis ticks and the '38%' label, spelled exactly.",
    },
    {
        slug: "mobile-craft",
        sips: "Z 1600",
        prompt:
            "Three pristine mobile phone screen mockups floating at slight 6-degree angles on a " +
            "warm off-white background. Phone 1 (left): a minimal task list with hairline " +
            "checkboxes, subtle accent dots in amber. Phone 2 (center, slightly larger): a music " +
            "player UI with a pristine dark gradient album cover, a circular thin-stroke progress " +
            "ring, and abstract waveform lines. Phone 3 (right): a calendar week view with " +
            "hairline grid, three subtle event dots in different muted colors. Soft realistic " +
            "shadows under each device. Limited zinc palette + amber accent. 16:10 horizontal. " +
            "NO logos, NO real text inside screens — only abstract content blocks and standard " +
            "icons (play, plus, dots).",
    },
    {
        slug: "brand-sheet",
        sips: "Z 1600",
        prompt:
            "Designer's brand identity specimen sheet, viewed flat from above on an off-white " +
            "background. Top row: three abstract wordmark variations rendered as solid black " +
            "geometric shapes (one rectangle-based, one circle-based, one triangle-based) — no " +
            "real letters, just abstract glyph shapes. Middle row: a 6-swatch color palette as " +
            "small filled rounded squares (charcoal, off-white, zinc-300, zinc-500, warm amber, " +
            "soft sage), each with a tiny mono hex code label below in Geist Mono. Bottom row: " +
            "three typography specimens, each just the letters 'Aa' at a different weight, with " +
            "small mono labels 'regular', 'medium', 'bold' beneath. Hairline 1px borders, lots " +
            "of whitespace. 16:10 horizontal. Spell 'regular', 'medium', 'bold' exactly. NO " +
            "other real text.",
    },
    {
        slug: "motion-frame",
        sips: "Z 1600",
        prompt:
            "Frozen frame of an interface in motion. A clean sans-serif word 'Movimento' centered " +
            "on an off-white #fafafa background, the word duplicated three times with subtle " +
            "horizontal motion-blur trails behind it (each trail progressively lighter zinc " +
            "opacity). A small mono caption 'frame 0024 / 0060' in the lower-left corner. A " +
            "single accent amber dot to the right of the word as a focus marker. Calm, precise, " +
            "Swiss-poster aesthetic. 16:10 horizontal. Spell 'Movimento' and 'frame 0024 / 0060' " +
            "exactly. NO other text.",
    },
];

async function generateOne(asset) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${KEY}`,
            "HTTP-Referer": "https://lucaperullo.it",
            "X-Title": "Luca Perullo Platform - showcase generation",
        },
        body: JSON.stringify({
            model: MODEL,
            modalities: ["image", "text"],
            messages: [{ role: "user", content: asset.prompt }],
        }),
    });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    }
    const json = await res.json();
    const dataUri = json?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const m = dataUri?.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!m) throw new Error(`No image: ${JSON.stringify(json).slice(0, 300)}`);
    const raw = `${OUT}/${asset.slug}.${m[1]}`;
    const final = `${OUT}/${asset.slug}.jpg`;
    writeFileSync(raw, Buffer.from(m[2], "base64"));
    execSync(
        `sips -${asset.sips} -s format jpeg -s formatOptions 88 "${raw}" --out "${final}" >/dev/null`,
    );
    if (raw !== final) execSync(`rm -f "${raw}"`);
    console.log(`✓ ${asset.slug}`);
}

const failures = [];
for (const a of ASSETS) {
    try {
        await generateOne(a);
    } catch (e) {
        failures.push({ slug: a.slug, error: e.message });
        console.log(`✗ ${a.slug}: ${e.message}`);
    }
}
if (failures.length) {
    console.log(`\nFinished with ${failures.length} failure(s).`);
    process.exit(1);
}
console.log(`\nGenerated ${ASSETS.length} showcase asset(s).`);
