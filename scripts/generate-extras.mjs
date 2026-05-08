#!/usr/bin/env node
/**
 * Generate the supporting brand assets — avatar, hero monogram, OG image,
 * and blog post cover illustrations — via OpenRouter (Gemini 2.5 Flash Image).
 *
 * Usage:  OPENROUTER_API_KEY=sk-or-... node scripts/generate-extras.mjs
 *
 * Outputs land in /public/brand/ (avatar, monogram, og), /public/blog/ (covers).
 * Already-existing files are overwritten.
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, "../public");
const KEY = process.env.OPENROUTER_API_KEY;
if (!KEY) throw new Error("Set OPENROUTER_API_KEY before running.");

for (const dir of ["brand", "blog"]) {
    if (!existsSync(`${PUBLIC}/${dir}`)) mkdirSync(`${PUBLIC}/${dir}`, { recursive: true });
}

const MODEL = "google/gemini-2.5-flash-image";

/**
 * Each entry is { folder, slug, prompt, sips: "Z<size>" }.
 * sips "Z" is the long-edge target after generation. Avatars stay square,
 * OG cards stay 16:9-ish at ~1200, blog covers at 1600.
 */
const ASSETS = [
    {
        folder: "brand",
        slug: "avatar",
        sips: "Z 720",
        prompt:
            "Editorial vector portrait of a thoughtful European software architect in his late " +
            "twenties. Side-3/4 view, looking off-frame. Short dark hair, simple round wire-frame " +
            "glasses, charcoal turtleneck. Limited zinc palette (off-white background, charcoal " +
            "subject, single hint of warm amber from off-frame light). Hairline outline, flat color " +
            "blocks, no gradients on skin. Subtle dotted-grid pattern in the background. Clearly " +
            "an illustration, NOT photoreal — feels like an editorial column avatar. Centered, " +
            "square 1:1 aspect. NO logo, NO text, NO captions.",
    },
    {
        folder: "brand",
        slug: "monogram",
        sips: "Z 800",
        prompt:
            "A simple geometric monogram of the letters 'L' and 'P' interlocked. Solid black on a " +
            "soft off-white background (#fafafa). The letters are formed by clean rectilinear " +
            "blocks with a slight pixelated step on the inner corners — reminiscent of a retro " +
            "8-bit logo but refined. Very subtle drop shadow at the base. Generous padding around " +
            "the mark. Centered, square 1:1 aspect. NO additional text, NO outline frame, NO " +
            "extra decoration.",
    },
    {
        folder: "brand",
        slug: "og",
        sips: "Z 1200",
        prompt:
            "Open Graph social-share card for a personal portfolio. Light off-white background " +
            "(#fafafa) with a subtle dotted-grid pattern fading toward the edges. Top-left: a " +
            "small black geometric 'LP' monogram on a soft square tile. Centered: large clean " +
            "sans-serif name 'Luca Perullo' in zinc-950 (Geist-style typography). Below it: the " +
            "role 'Software Architect & AI Engineer' in monospaced zinc-500. Bottom-right corner: " +
            "the URL 'lucaperullo.it' in mono. Hairline 1px borders zinc-200 around the canvas. " +
            "Generous whitespace. Photographic crisp 1200x630 social-card aspect. NO illegible or " +
            "fake text — only the labels named here, spelled exactly.",
    },
    {
        folder: "blog",
        slug: "tempo-sito-professionale",
        sips: "Z 1600",
        prompt:
            "Editorial flat illustration for a blog post about how long it takes to build a " +
            "professional website. Subject: a stylized browser window in light theme, partially " +
            "drawn / partially built — left half showing finished UI cards, right half showing " +
            "wireframe placeholder boxes. A small calendar icon and a clock hover near the top, " +
            "minimal. Soft warm amber accent indicating progress. Limited zinc palette. Clean " +
            "vector style, no photorealism. 16:9 horizontal. NO captions, NO real text inside the " +
            "browser — just abstract content blocks.",
    },
    {
        folder: "blog",
        slug: "agenzie-spariscono-preventivo",
        sips: "Z 1600",
        prompt:
            "Editorial flat illustration for a blog post about web agencies that disappear after " +
            "sending a quote. Subject: an empty office desk with an unanswered email envelope " +
            "icon glowing on a laptop screen, an empty chair pulled away, soft morning light from " +
            "a window. A subtle dust mote or two. Limited zinc palette with a single warm amber " +
            "accent from the window light. Editorial vector style, no photorealism, calm rather " +
            "than dramatic. 16:9 horizontal. NO real text on the screen — just an envelope " +
            "silhouette.",
    },
    {
        folder: "blog",
        slug: "preventivi-ecommerce-costi-nascosti",
        sips: "Z 1600",
        prompt:
            "Editorial flat illustration for a blog post about hidden costs in e-commerce quotes. " +
            "Subject: a long printed receipt scrolling out of a smartphone screen, with a " +
            "magnifying glass hovering over the lower portion, revealing rows where the line-item " +
            "labels are masked with rows of asterisks (*****). Light theme. Limited zinc palette " +
            "with a single subtle red dot indicating a warning. Editorial vector style, calm not " +
            "alarmist, no photorealism. 16:9 horizontal. NO real Italian or English line-item text " +
            "— only abstract asterisks and number-like glyphs.",
    },
];

async function generateOne(asset) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${KEY}`,
            "HTTP-Referer": "https://lucaperullo.it",
            "X-Title": "Luca Perullo Platform - extras generation",
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
    if (!m) throw new Error(`No image in response: ${JSON.stringify(json).slice(0, 300)}`);

    const rawPath = `${PUBLIC}/${asset.folder}/${asset.slug}.${m[1]}`;
    const finalPath = `${PUBLIC}/${asset.folder}/${asset.slug}.jpg`;
    writeFileSync(rawPath, Buffer.from(m[2], "base64"));
    execSync(
        `sips -${asset.sips} -s format jpeg -s formatOptions 88 "${rawPath}" --out "${finalPath}" >/dev/null`,
    );
    if (rawPath !== finalPath) execSync(`rm -f "${rawPath}"`);
    console.log(`✓ ${asset.folder}/${asset.slug} → ${finalPath}`);
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
console.log(`\nGenerated ${ASSETS.length} extra(s).`);
