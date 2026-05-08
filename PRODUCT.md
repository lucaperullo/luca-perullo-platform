# PRODUCT.md

> Synthesized from existing project signals: `AGENTS.md`, the `BRAND_PROMPT_PREFIX`
> in `src/data/components-library.tsx`, the design tokens in `src/app/globals.css`,
> and the existing component vocabulary. Treat as a working baseline; refine via
> `/impeccable teach` when ready.

## Register

**Brand.** This is a personal portfolio + components library where design IS the
product. The visual craft of every page sells the freelance offer.

## Users

- **Primary**: technical hiring managers, engineering leads, and creative
  directors evaluating an Italian senior frontend engineer for contract work.
- **Secondary**: peer developers using the components catalog as a copy-paste
  resource (the "Open in Claude" prompt makes each component re-generatable
  to their own brand).
- **Tertiary**: design-curious devs who arrive via shared links to specific
  components or the live blob-mixer demo.

## Product purpose

Demonstrate, in one site, that the owner can:

1. Ship pixel-perfect editorial UI under tight budgets.
2. Build interactive 3D / WebGL pieces (the Blob Mixer module).
3. Codify a coherent design system that scales to dozens of components without
   visual drift.

Every component in `/components` doubles as a portfolio piece and a
copy-paste resource. The catalog itself is the proof of work.

## Brand & Tone

- **Visual reference**: chanhdai.com — narrow content column (672px), Geist
  Sans for body and headings, Geist Mono for labels, code, metadata, and
  numerical indices. Hairline 1px borders. Diagonal stripe-pattern dividers.
  No drop shadows beyond what `icon-ring` provides. Stripe rule, not soft
  fade, separates conceptual sections.
- **Voice**: Italian, sober, peer-to-peer ("peer-of-peer"). No marketing
  superlatives. Each component blurb is two sentences max.
- **Anti-references**: SaaS hero-metric template; gradient-text headers;
  modal-as-default; rounded-2xl pillows over soft shadows; cliché AI-stock
  imagery; orange-pink gradient hero blobs; bento grids of identical cards.

## Strategic principles

1. **Design tokens, not magic numbers.** Every colour, easing, and spacing
   value lives in `globals.css` (`--bg`, `--ease-out`, `--container-prose`,
   …). New code must use these tokens.
2. **CSS-first motion.** Animations belong in CSS (transitions, keyframes,
   `@starting-style`). Use JS only for interruptible / pointer-driven motion.
   Never animate layout properties (`width`, `height`, `top`, `padding`).
3. **No new heavy deps.** lucide-react + tailwind-merge are the only UI
   libraries. R3F + drei + postprocessing for 3D. react-markdown for AI chat
   surfaces. Anything else needs explicit justification.
4. **One marquee, one rule.** Resist near-duplicate primitives — better to
   ship one well-tuned component than four overlapping ones.
5. **Reduced motion is global.** `globals.css` already collapses every
   animation under `prefers-reduced-motion: reduce`. Components must NOT
   re-declare per-component reduced-motion blocks.
6. **Press feedback.** Every clickable element either uses the `press`
   utility or applies `transform: scale(0.97)` on `:active`.
7. **Touch first, hover gated.** Hover-only effects (parallax tilt,
   spotlight follow) belong inside
   `@media (hover: hover) and (pointer: fine)` so they don't get stuck on
   touch devices.

## Design tokens (from `src/app/globals.css`)

### Colour
| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#ffffff` | `#000000` | Page surface |
| `--bg-alt` | `#fafafa` | `#18181b` | Cards, chips, code |
| `--fg` | `#09090b` | `#fafafa` | Body text |
| `--fg-muted` | `#71717a` | `#a1a1aa` | Secondary copy |
| `--fg-soft` | `#a1a1aa` | `#52525b` | Tertiary, captions |
| `--border` | `#e4e4e7` | `#27272a` | Hairlines |
| `--border-strong` | `#d4d4d8` | `#3f3f46` | Emphasised hairlines |
| `--accent` | `#2b7fff` (blue-500) | `#60a5fa` (blue-400) | Verified badge, single accent |

### Motion
| Token | Curve | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Element enters / responds (default) |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | On-screen morph / movement |
| `--ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | Sheet / overlay transitions |

### Layout
- `--container-prose: 672px`
- `--container-frame: 800px`

### Typography
- `--font-sans: var(--font-geist-sans)` — Geist Sans
- `--font-mono: var(--font-geist-mono)` — Geist Mono (labels, code, numerics)

### Utilities
- `@utility press` — adds `transition: transform 160ms var(--ease-out)` and
  `transform: scale(0.97)` on `:active`. Apply to every clickable button.
- `@utility stripe-rule` — diagonal hatch divider.
- `@utility row-rule` / `row-rule-top` — full-bleed list separators.
- `@utility caption-mono` — section labels and metadata.
- `@utility icon-ring` — disc-with-ring treatment used in the catalog.

## Anti-patterns (immediate reject)

- Hard-coded `cubic-bezier(...)` values instead of the `--ease-*` tokens.
- Per-component `@media (prefers-reduced-motion: reduce)` blocks (use the
  global guard).
- `transition: all` (Emil rule: specify the exact properties).
- Buttons with no `:active` feedback.
- Hover-only effects without `@media (hover: hover) and (pointer: fine)`
  gating.
- Modals with `transform-origin` other than `center` (Emil exception:
  popovers point to their trigger; modals stay centered).
- `scale(0)` entry animations (use `scale(0.95) + opacity: 0`).
- Touch targets under 44×44 px on `pointer: coarse`.
