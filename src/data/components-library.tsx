import type { ComponentType, ReactNode, SVGProps } from "react";
import {
    AlertTriangle,
    ArrowUpRight,
    BadgeCheck,
    Calculator,
    CircleDot,
    Code2,
    Component as ComponentIcon,
    Frame,
    Gauge,
    Heading1,
    Hash as HashIcon,
    Keyboard,
    LayoutPanelTop,
    Mail,
    Columns3,
    LayoutGrid,
    Film,
    GalleryHorizontal,
    Layers,
    Maximize2,
    Megaphone,
    MoveVertical,
    PenLine,
    Quote,
    Rows3,
    SeparatorHorizontal,
    Sparkles,
    SunMoon,
    Wand2,
    Wind,
    Type,
    MousePointer2,
    Bot,
    MessageSquare,
    Wrench,
    Command,
    GitBranch,
    Zap,
    Box,
    Activity,
    AppWindow,
    BookOpen,
    Cloud,
    Compass,
    Disc,
    File as FileLucide,
    Files,
    Folder as FolderLucide,
    FolderOpen as FolderOpenLucide,
    Globe,
    Grid3X3,
    Hand,
    Monitor,
    Moon,
    Orbit,
    Pointer,
    Power,
    RefreshCw,
    RotateCcw,
    ScrollText,
    Shuffle,
    Smartphone,
    Snowflake,
    Star,
    Sun,
    Target,
    Terminal as TerminalLucide,
    Tornado,
    Users,
    UsersRound,
} from "lucide-react";
import { Github, Linkedin } from "@/components/brand-icons";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;
import { SectionLabel } from "@/components/section-label";
import { StripeRule } from "@/components/stripe-rule";
import { SocialTile } from "@/components/social-tile";
import { VerifiedBadge } from "@/components/verified-badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { StatusPill } from "@/components/status-pill";
import { PullQuote } from "@/components/pull-quote";
import { StatCard } from "@/components/stat-card";
import { Kbd } from "@/components/kbd";
import { Callout } from "@/components/callout";
import { CopyButton } from "@/components/copy-button";
import { CodeBlock } from "@/components/code-block";
import { PreviewFrame } from "@/components/preview-frame";
import { Marquee } from "@/components/marquee";
import { NumberFlow } from "@/components/number-flow";
import { BentoTile } from "@/components/bento-tile";
import { ParallaxLane } from "@/components/parallax-lane";
import { BlobMixerScene } from "@/components/blob-mixer";
import { BlurText } from "@/components/blur-text";
import { SplitText } from "@/components/split-text";
import { ShinyText } from "@/components/shiny-text";
import { SpotlightCard } from "@/components/spotlight-card";
import { BorderBeam } from "@/components/border-beam";
import { TiltCard } from "@/components/tilt-card";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { CommandPalettePreview } from "@/components/command-palette-preview";
import { AiChatBubble } from "@/components/ai-chat-bubble";
import { AiPromptInputPreview } from "@/components/ai-prompt-input-preview";
import { AiToolCallCard } from "@/components/ai-tool-call-card";
import { AnimatedBeamPreview } from "@/components/animated-beam-preview";
// ScrollVideo is intentionally NOT imported — it's a heavy client component
// that mounts a sticky scroll-driven canvas; we render a static representation
// in the library preview instead of the live behaviour.
import {
    RainbowButtonShowcase,
    ShimmerButtonShowcase,
    RippleButtonShowcase,
    ShinyButtonShowcase,
    PulsatingButtonShowcase,
    InteractiveHoverButtonShowcase,
} from "@/components/_showcase/buttons-showcase";
import {
    AuroraTextShowcase,
    TypingAnimationShowcase,
    HyperTextShowcase,
    WordRotateShowcase,
    SparklesTextShowcase,
    MorphingTextShowcase,
    LineShadowTextShowcase,
    TextRevealShowcase,
} from "@/components/_showcase/text-effects-showcase";
import {
    ShineBorderShowcase,
    MagicCardShowcase,
    GlareHoverShowcase,
    MeteorsShowcase,
    ParticlesShowcase,
    AnimatedThemeTogglerShowcase,
} from "@/components/_showcase/special-effects-showcase";
import {
    DotPatternShowcase,
    GridPatternShowcase,
    AnimatedGridPatternShowcase,
    RetroGridShowcase,
    FlickeringGridShowcase,
    RippleShowcase,
    LightRaysShowcase,
    WarpBackgroundShowcase,
} from "@/components/_showcase/backgrounds-showcase";
import {
    SafariMockShowcase,
    IphoneMockShowcase,
    AndroidMockShowcase,
    TerminalShowcase,
    DockShowcase,
    AvatarCirclesShowcase,
    OrbitingCirclesShowcase,
    FileTreeShowcase,
} from "@/components/_showcase/mocks-showcase";
import { AuroraText } from "@/components/aurora-text";
import { TypingAnimation } from "@/components/typing-animation";
import { HyperText } from "@/components/hyper-text";
import { WordRotate } from "@/components/word-rotate";
import { SparklesText } from "@/components/sparkles-text";
import { MorphingText } from "@/components/morphing-text";
import { LineShadowText } from "@/components/line-shadow-text";
import { TextReveal } from "@/components/text-reveal";
import { DotPattern } from "@/components/dot-pattern";
import { GridPattern } from "@/components/grid-pattern";
import { AnimatedGridPattern } from "@/components/animated-grid-pattern";
import { RetroGrid } from "@/components/retro-grid";
import { FlickeringGrid } from "@/components/flickering-grid";
import { Ripple } from "@/components/ripple";
import { LightRays } from "@/components/light-rays";
import { WarpBackground } from "@/components/warp-background";
import { ShineBorder } from "@/components/shine-border";
import { MagicCard } from "@/components/magic-card";
import { GlareHover } from "@/components/glare-hover";
import { Meteors } from "@/components/meteors";
import { Particles } from "@/components/particles";
import { AnimatedThemeToggler } from "@/components/animated-theme-toggler";
import { SafariMock } from "@/components/safari-mock";
import { IphoneMock } from "@/components/iphone-mock";
import { AndroidMock } from "@/components/android-mock";
import {
    Terminal,
    TerminalCommand,
    TerminalOutput,
    TerminalTyping,
} from "@/components/terminal";
import { Dock, DockIcon } from "@/components/dock";
import { AvatarCircles } from "@/components/avatar-circles";
import { OrbitingCircles } from "@/components/orbiting-circles";
import { Tree, Folder, File } from "@/components/file-tree";
import {
    RELEASE_STATUS_DOT,
    RELEASE_STATUS_ORDER,
    type ReleaseStatus,
} from "@/lib/release-status";

export type LibStatus = ReleaseStatus;

export type LibComponent = {
    slug: string;
    name: string;
    summary: string;
    /** Longer one-liner for the detail hero. */
    tagline?: string;
    status: LibStatus;
    /** Lucide icon used in the catalog row + detail hero. */
    icon?: IconType;
    /** Surface a "new" dot badge in the catalog. */
    isNew?: boolean;
    tags: string[];
    /** External npm packages required to drop the file in. */
    dependencies?: string[];
    /** Internal helpers / primitives used (e.g. cn, brand tokens). */
    requires?: string[];
    /** Path from project root, used for the "View source" link and to read the file at request-time. */
    sourcePath?: string;
    /** Inline preview JSX. Server-rendered. Wrap interactive demos in their own client component if needed. */
    preview?: () => ReactNode;
    /** When true, the preview escapes the standard 480px max-width cap. Use for components that need a wider canvas (PCB diagrams, wide hero showcases, etc.). */
    bleed?: boolean;
    /** A small inline usage snippet that demonstrates the component in context. */
    usage?: string;
    /** Notes shown under the preview: caveats, accessibility, copy guidance. */
    notes?: string;
    /** Prompt to copy. Designed to be pasted into Claude/ChatGPT to regenerate or adapt the component. */
    prompt: string;
};

const BRAND_PROMPT_PREFIX = `Sei un senior frontend engineer. Stai lavorando su un sito Next.js 16 + React 19 + Tailwind v4 in italiano, look chanhdai-inspired: colonna stretta 672px, Geist Sans + Geist Mono, hairline 1px, divisori a stripe diagonale, palette zinc.

Token CSS disponibili: --bg, --bg-alt, --fg, --fg-muted, --fg-soft, --border, --border-strong, --accent. Usa SEMPRE queste variabili tramite le utility tailwind generate (bg-bg, text-fg-muted, border-border, ecc.). Helper "cn" da "@/lib/utils". Niente librerie UI extra: solo lucide-react e tailwind-merge.`;

export const components: LibComponent[] = [
    {
        slug: "section-label",
        name: "Section Label",
        summary: "Heading di sezione con indice mono in apice — il marker editoriale del sito.",
        tagline:
            "L'etichetta di sezione che apre ogni blocco: titolo serif-friendly + indice numerico mono allineato in apice. Server component, prop opzionale per rendere l'elemento h2 o p.",
        status: "live",
        icon: Heading1,
        isNew: true,
        tags: ["Heading", "Editorial", "Server"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/section-label.tsx",
        preview: () => (
            <div className="space-y-2">
                <SectionLabel index={1}>About</SectionLabel>
                <SectionLabel index={2} asHeading={false}>
                    Caption variant
                </SectionLabel>
            </div>
        ),
        usage: `<SectionLabel index={1}>About</SectionLabel>`,
        notes:
            "L'indice viene paddato a 2 cifre (01, 02 …). Usa asHeading={false} per un caption mono dentro una card senza spezzare la gerarchia semantica.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <SectionLabel> che apra le sezioni del sito.
Props:
- index?: number — mostrato come <sup> mono paddato a 2 cifre (01, 02…), tracking lieve.
- children: ReactNode — titolo della sezione.
- asHeading?: boolean (default true) — se true rende un <h2> grande (text-2xl sm:text-3xl, font-semibold tracking-tight). Se false rende un <p> piccolo come caption mono.
- className?: string, id?: string (per anchor link).

Constraints: server component, scroll-mt-20 sull'elemento per ancore stabili, indice in font-mono color text-fg-muted, taglia 11px, ml-1 align-super.

Output: file completo .tsx pronto da incollare in src/components/section-label.tsx.`,
    },
    {
        slug: "stripe-rule",
        name: "Stripe Rule",
        summary: "Divisore diagonale a hatch: il separatore visivo fra sezioni.",
        tagline:
            "Un separatore decorativo che usa un repeating-linear-gradient a 45° per creare un pattern editoriale, non una semplice linea. Adatta automaticamente colore e contrasto al tema.",
        status: "live",
        icon: SeparatorHorizontal,
        tags: ["Layout", "Decorativo", "Server"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn", "globals.css#stripe-rule utility"],
        sourcePath: "src/components/stripe-rule.tsx",
        preview: () => (
            <div className="space-y-3">
                <StripeRule />
                <StripeRule height={10} />
            </div>
        ),
        usage: `<StripeRule className="mt-10" />`,
        notes:
            "L'utility CSS @utility stripe-rule è in globals.css. Per cambiare il pattern, modifica il repeating-linear-gradient e gli step (1px / 6px) lì, non qui.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <StripeRule>: un divisore decorativo orizzontale.
Props:
- className?: string
- height?: number (default 6) — altezza in px.

Implementazione:
- Il pattern hatch a 45° viene da un'utility Tailwind v4 chiamata "stripe-rule" definita in globals.css con @utility, basata su repeating-linear-gradient con var(--stripe).
- Il componente è un <div role="separator" aria-hidden> con className "stripe-rule w-full" e style={{ height }}.

Constraints: server component, niente animazioni, accessibilità: solo decorativo (aria-hidden).

Output: il componente .tsx + lo snippet @utility da aggiungere a globals.css.`,
    },
    {
        slug: "social-tile",
        name: "Social Tile",
        summary: "Riga social con icona dentro chip dark, label e handle, freccia hover.",
        tagline:
            "Tile usato nella griglia 'Connect' della home: icona contenuta in un chip fg-on-bg, label + handle sotto, freccia esterna che si anima all'hover. Apre in nuova tab con noopener.",
        status: "live",
        icon: Mail,
        isNew: true,
        tags: ["Link", "Connect", "Server"],
        dependencies: ["lucide-react", "tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/social-tile.tsx",
        preview: () => (
            <div className="overflow-hidden rounded-md border border-border bg-bg">
                <SocialTile icon={Github} label="GitHub" href="https://github.com/lucaperullo" handle="lucaperullo" />
                <div className="border-t border-border">
                    <SocialTile
                        icon={Linkedin}
                        label="LinkedIn"
                        href="https://linkedin.com/in/lucaperullo"
                        handle="in/lucaperullo"
                    />
                </div>
                <div className="border-t border-border">
                    <SocialTile icon={Mail} label="Email" href="mailto:hello@example.com" handle="hello@example.com" />
                </div>
            </div>
        ),
        usage: `<SocialTile icon={Github} label="GitHub" href="https://github.com/you" handle="@you" />`,
        notes:
            "Il chip dell'icona è invertito (bg-fg text-bg) per dare presenza. La freccia ArrowUpRight ruota sottilmente all'hover. Wrappalo in un container con border-border per la griglia stile home.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <SocialTile>: una riga cliccabile per un link social.
Props:
- icon: ComponentType<SVGProps<SVGSVGElement>> (es. da lucide-react)
- label: string — nome del canale (es. "GitHub")
- href: string
- handle?: string — username/contatto mostrato sotto il label
- className?: string

Layout: <a target="_blank" rel="noopener noreferrer"> con padding px-4 py-3, gap-3, hover:bg-bg-alt. Icona dentro un chip 32px bg-fg text-bg rounded-md grid place-items-center. A destra, una freccia ArrowUpRight da lucide-react color text-fg-soft che diventa text-fg in hover (transition-transform translate-x-0.5 -translate-y-0.5 sul gruppo).

Constraints: server component, semantica corretta, accessibile (label visibile, target blank documentato).

Output: file completo .tsx.`,
    },
    {
        slug: "verified-badge",
        name: "Verified Badge",
        summary: "Spunta blu stile X/Twitter, pura SVG, eredita il colore accent.",
        tagline:
            "Il badge 'verificato' che appare accanto al nome nell'hero. SVG inline, scala via prop size, colore preso da var(--accent) così segue il tema light/dark.",
        status: "live",
        icon: BadgeCheck,
        tags: ["Badge", "Identità", "SVG"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn", "--accent token"],
        sourcePath: "src/components/verified-badge.tsx",
        preview: () => (
            <div className="flex items-center gap-3">
                <VerifiedBadge />
                <VerifiedBadge size={28} />
                <span className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-fg">
                    Luca Perullo
                    <VerifiedBadge size={16} />
                </span>
            </div>
        ),
        usage: `<VerifiedBadge size={18} />`,
        notes:
            "Il colore arriva da text-accent (var(--accent)). In dark mode usa blue-400 invece di blue-500 — è già configurato nei token di globals.css.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <VerifiedBadge>: una spunta blu stile X/Twitter.
Props:
- size?: number (default 18)
- className?: string

Implementazione: SVG inline 24x24 viewBox, fill currentColor, className "inline-block text-accent" così eredita il var(--accent) dai token. Il path deve disegnare uno scallop a 8 punte tipo Twitter Verified con un check bianco interno.

Constraints: server component, aria-hidden (decorativo, il significato lo dà il contesto), nessuna dipendenza extra.

Output: file completo .tsx.`,
    },
    {
        slug: "theme-toggle",
        name: "Theme Toggle",
        summary: "Toggle light/dark senza flicker, persistito su localStorage, due bottoni segmented.",
        tagline:
            "Toggle tema con due bottoni segmentati (Sole / Luna). Persiste la scelta in localStorage, rispetta prefers-color-scheme al primo load, ed evita il flash applicando la classe .dark sul <html> in mount.",
        status: "live",
        icon: SunMoon,
        tags: ["Tema", "Client", "Persistenza"],
        dependencies: ["lucide-react", "tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn", "html.dark class"],
        sourcePath: "src/components/theme-toggle.tsx",
        preview: () => (
            <div className="flex items-center gap-3">
                <ThemeToggle />
                <span className="font-mono text-[11px] text-fg-soft">interattivo · prova a cliccare</span>
            </div>
        ),
        usage: `<ThemeToggle />`,
        notes:
            "Per evitare il flash al primo paint, aggiungi nel <head> uno script inline che applichi la classe .dark prima dell'idratazione, leggendo da localStorage o da matchMedia.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente client <ThemeToggle>: un segmented control con due bottoni icona Sole/Luna che switcha .dark sul <html>.
Props:
- className?: string

Comportamento:
- "use client".
- All'init legge da localStorage["lp-theme"] altrimenti da window.matchMedia("(prefers-color-scheme: dark)"). Setta lo state e applica la classe sul documentElement.
- Click su un bottone => imposta lo state, scrive in localStorage, aggiorna la classe .dark.
- Pre-mount: evita flash rendendo placeholder con la stessa larghezza ma senza icone attive.

Layout: container rounded-full border border-border bg-bg-alt p-0.5, due <button> 28px square con icone Sun/Moon (lucide-react), il bottone attivo ha bg-bg + ring-1 ring-border-strong. aria-pressed correttamente impostato.

Output: file completo .tsx + suggerimento per lo script anti-flicker da inserire in layout.tsx.`,
    },
    {
        slug: "status-pill",
        name: "Status Pill",
        summary: "Pill mono con dot colorato per stato (Live, WIP, Soon, Note). Coerente fra Tools e Components.",
        tagline:
            "Una pill compatta con dot prefisso colorato (emerald / amber / soft) e label mono uppercase. Pensata per indicare lo stato di un tool, di un componente o di una feature.",
        status: "live",
        icon: CircleDot,
        isNew: true,
        tags: ["Badge", "Stato", "Server"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/status-pill.tsx",
        preview: () => (
            <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone="live" />
                <StatusPill tone="wip" />
                <StatusPill tone="soon" />
                <StatusPill tone="neutral" label="Beta" />
            </div>
        ),
        usage: `<StatusPill tone="live" />`,
        notes:
            "Quattro toni: live (emerald), wip (amber), soon e neutral (entrambi soft). Override del label disponibile via prop label per casi come 'Beta', 'Alpha', 'Internal'.",
        prompt: `${BRAND_PROMPT_PREFIX}

Estrai un componente riutilizzabile <StatusPill> da inline che già esiste in src/app/tools/page.tsx.
Props:
- status: "live" | "wip" | "soon"
- className?: string

Layout: span inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-alt px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-fg-muted. Dot 1.5x1.5 rounded-full prefisso, colore: emerald-500 / amber-500 / fg-soft.

Esporta anche STATUS_META già esistente (label, tone, group, groupHint) da un singolo modulo condiviso, in modo che /tools e /components consumino la stessa fonte di verità. Aggiorna i due file consumer dopo aver creato il componente.

Output: src/components/status-pill.tsx + diff dei due consumer.`,
    },
    {
        slug: "pull-quote",
        name: "Pull Quote",
        summary: "Citazione editoriale con rail verticale, kicker mono e attribuzione.",
        tagline:
            "Una citazione editoriale con rail verticale a 1px sulla sinistra, kicker mono opzionale con indice paddato, virgolette caporali « » e attribuzione su due token (autore · ruolo). Pensata per rompere la lunghezza di un articolo.",
        status: "live",
        icon: Quote,
        isNew: true,
        tags: ["Editoriale", "Tipografia", "Server"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/pull-quote.tsx",
        preview: () => (
            <PullQuote by="Steve Jobs" role="Stanford 2005" index={3}>
                Il design non è solo come appare. Il design è come funziona.
            </PullQuote>
        ),
        usage: `<PullQuote by="Steve Jobs" role="Stanford 2005" index={3}>
  Il design non è solo come appare. Il design è come funziona.
</PullQuote>`,
        notes:
            "Le caporali « » sono scelta italiana: per inglese sostituiscile con \" \" o virgolette curly. Il rail è un grid track da 1px così resta perfettamente allineato a qualsiasi lunghezza del testo.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <PullQuote>: una citazione editoriale.
Props:
- children: ReactNode — il testo della citazione
- by?: string, role?: string — riga di attribuzione (es. "Steve Jobs · Stanford 2005")
- kicker?: string (default "Quote") — etichetta mono in alto
- index?: number — indice paddato a 02 mostrato dopo il kicker
- className?: string

Layout: <figure> con CSS grid grid-cols-[1px_1fr], colonna sinistra è un rail verticale 1px con bg-border. Header mono uppercase tracking-[0.1em] text-fg-soft con kicker · index. Quote in text-[18px] sm:text-[20px] font-medium leading-[1.45] text-balance, racchiusa fra « e » in text-fg-soft. Figcaption mono small con autore (font-medium text-fg) · ruolo (text-fg-muted).

Constraints: server component, balance del testo via text-balance, accessibile (figure/blockquote/figcaption corretti).

Output: file completo .tsx.`,
    },
    {
        slug: "stat-card",
        name: "Stat Card",
        summary: "KPI card minimale con kicker mono, valore tabular-nums e delta direzionale.",
        tagline:
            "Card KPI con kicker mono, valore numerico in tabular-nums, unità opzionale, e delta direzionale (▲ +12% / ▼ −3%) con colore semantico. Composabile in griglie.",
        status: "live",
        icon: Gauge,
        isNew: true,
        tags: ["Dashboard", "KPI", "Server"],
        dependencies: ["lucide-react", "tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/stat-card.tsx",
        preview: () => (
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
                <StatCard label="Visite" value="12.4k" delta="+18%" caption="vs. mese scorso" />
                <StatCard label="Conversioni" value="3.2" unit="%" delta="-0.4%" />
                <StatCard label="Sessioni" value="982" delta="0%" />
            </div>
        ),
        usage: `<StatCard label="Visite" value="12.4k" delta="+18%" caption="vs. mese scorso" />`,
        notes:
            "Il delta accetta sia una stringa ('+18%') che un oggetto { value, trend }. Il segno determina automaticamente il trend (su/giù/piatto) e il colore semantico associato.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <StatCard>: una KPI card minimale per dashboard.
Props:
- label: string — kicker mono in alto, uppercase tracking
- value: ReactNode — valore principale (es. "12.4k", 982, ecc.)
- unit?: string — unità mostrata in piccolo a destra del valore (es. "%")
- delta?: string | { value: string; trend: "up" | "down" | "flat" } — variazione opzionale
- caption?: string — caption sotto il valore
- dense?: boolean — variante più compatta per griglie strette
- className?: string

Layout: card rounded-md border bg-bg con padding px-4 py-3.5 (px-3 py-2.5 in dense). Kicker mono text-[10px] uppercase tracking-[0.08em] text-fg-soft. Valore text-2xl sm:text-[28px] font-medium tabular-nums tracking-tight. Delta inline a destra (ml-auto) con icona ArrowUpRight/ArrowDownRight/Minus, color emerald-600 / rose-600 / fg-muted.

Constraints: server component, tabular-nums per allineare in griglia, supporto dark mode automatico.

Output: file completo .tsx.`,
    },
    {
        slug: "kbd",
        name: "Kbd",
        summary: "Chip tastiera con glifi sistema (⌘ ⇧ ⌥ ↵) e shadow tattile.",
        tagline:
            "Una chip <kbd> con glifi sistema (⌘ ⇧ ⌥ ⌃ ↵ ⎋), separatore '+' configurabile e shadow tattile da 1px. Riconosce sia chiavi singole che combinazioni.",
        status: "live",
        icon: Keyboard,
        isNew: true,
        tags: ["Tastiera", "Inline", "Server"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/kbd.tsx",
        preview: () => (
            <div className="flex flex-col items-center gap-3 text-[14px] text-fg-muted">
                <div className="flex items-center gap-2">
                    Per cercare premi <Kbd keys={["cmd", "k"]} />
                </div>
                <div className="flex items-center gap-2">
                    Annulla con <Kbd keys="esc" /> o <Kbd keys={["cmd", "shift", "z"]} />
                </div>
            </div>
        ),
        usage: `<Kbd keys={["cmd", "k"]} />`,
        notes:
            "Il dizionario interno mappa cmd/shift/alt/ctrl/enter/esc/tab/space/backspace/delete sui glifi sistema con un alias screen-reader-friendly. Tasti single-letter vengono uppercased.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <Kbd>: chip tastiera per documentare shortcut.
Props:
- keys: string | string[] — singolo tasto o array
- separator?: string (default "+")
- size?: "sm" | "md"
- className?: string

Mappa interna: cmd/meta → ⌘, shift → ⇧, alt/option → ⌥, ctrl/control → ⌃, enter/return → ↵, esc/escape → ⎋, tab → ⇥, space → ␣, up/down/left/right → ↑↓←→, backspace → ⌫, delete → ⌦. Per i glifi, mostra il symbol + uno <span class="sr-only">{nomeChiave}</span> per gli screen reader. Tasti single-letter vanno uppercased.

Layout: <kbd> inline-flex items-center justify-center rounded-[5px] border border-border bg-bg-alt font-mono uppercase tracking-[0.05em], min-h 22px (md) o 20px (sm), px-1.5 (md) px-1 (sm), shadow [0_1px_0_0_var(--border-strong)] per il feeling tattile.

Constraints: server component, semantica corretta (<kbd>), separatori non interattivi (aria-hidden).

Output: file completo .tsx.`,
    },
    {
        slug: "callout",
        name: "Callout",
        summary: "Avviso inline con rail accent, kicker mono, icona toned, action opzionale.",
        tagline:
            "Avviso inline (info / warning / success / note) con rail verticale colorato, icona accent, kicker mono e CTA opzionale. Layout grid 2px+1fr per un rail nitido a 1px senza box-shadow trick.",
        status: "live",
        icon: AlertTriangle,
        isNew: true,
        tags: ["Inline", "Avviso", "Server"],
        dependencies: ["lucide-react", "tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/callout.tsx",
        preview: () => (
            <div className="flex flex-col gap-3">
                <Callout tone="info" title="Come funziona">
                    Ogni componente è server-side per default, niente JS sul client se non serve.
                </Callout>
                <Callout tone="warning" title="Heads up">
                    L&apos;API potrebbe cambiare prima della v1. Controlla questa pagina ogni tanto.
                </Callout>
                <Callout tone="success" title="Spedito">
                    Il componente è in produzione su questa stessa pagina.
                </Callout>
            </div>
        ),
        usage: `<Callout tone="warning" title="Heads up">
  L'API potrebbe cambiare prima della v1.
</Callout>`,
        notes:
            "Quattro toni preconfezionati con icona, kicker e bar color. Per varianti custom, passa una prop icon e una label. Il bar è una colonna del grid (non border-l), così resta solido a 2px e si arrotonda con il rounded-md.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <Callout>: avviso inline.
Props:
- tone?: "info" | "warning" | "success" | "note" (default "info")
- label?: string — kicker mono override (default Tone.toUpperCase italianizzato)
- title?: string
- children: ReactNode — body
- icon?: ComponentType — override icona
- action?: ReactNode — slot CTA a destra
- className?: string

Layout: <aside> con CSS grid grid-cols-[2px_1fr], colonna sinistra è un rail verticale 2px con colore tone (accent / amber-500 / emerald-500 / fg-soft). Contenuto: padding px-4 py-3, gap-3, icona (Info / AlertTriangle / CheckCircle2 / Lightbulb) shrink-0, kicker mono uppercase tracking-[0.1em] text-fg-soft, title font-medium, body text-fg-muted leading-[1.6]. Slot action shrink-0 a destra.

Constraints: server component, semantica <aside>, dark-mode-aware, niente animazioni.

Output: file completo .tsx.`,
    },
    {
        slug: "copy-button",
        name: "Copy Button",
        summary: "Bottone copy con feedback 'Copiato', tre toni (primary / secondary / ghost), modalità icon-only.",
        tagline:
            "Il bottone che alimenta tutti i 'Copy code' e 'Copy prompt' di questa libreria. Tre toni, modalità icon-only, fallback per browser senza navigator.clipboard, feedback 'Copiato' per ~1.6s.",
        status: "live",
        icon: Sparkles,
        isNew: true,
        tags: ["Client", "Clipboard", "Action"],
        dependencies: ["lucide-react", "tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/copy-button.tsx",
        preview: () => (
            <div className="flex flex-wrap items-center gap-2">
                <CopyButton value="Hello, mondo." label="Copy text" tone="primary" />
                <CopyButton value="Hello, mondo." label="Copy" tone="secondary" />
                <CopyButton value="Hello, mondo." label="Copy" tone="ghost" />
                <CopyButton value="Hello, mondo." label="Prompt" icon="prompt" tone="secondary" />
            </div>
        ),
        usage: `<CopyButton value="Hello" label="Copy" tone="primary" />`,
        notes:
            "Lo stato 'Copiato' dura 1.6s e si auto-resetta. In iconOnly il label viene reso come sr-only. L'icona prompt è Sparkles (LLM-flavored), quella default è Copy.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un client component <CopyButton>: copia testo negli appunti con feedback.
Props:
- value: string — testo da copiare
- label?: string (default "Copy")
- copiedLabel?: string (default "Copiato")
- tone?: "primary" | "secondary" | "ghost"
- icon?: "copy" | "prompt"
- iconOnly?: boolean
- ariaLabel?: string
- className?: string

Comportamento: usa navigator.clipboard.writeText con fallback a un <textarea> + execCommand. Stato 'copied' che resetta dopo 1.6s. Pulisce il timeout su unmount. Aria-live polite. Variante iconOnly con sr-only label.

Layout: rounded-md, transition-colors, focus-visible ring, primary = bg-fg text-bg, secondary = border bg-bg, ghost = no-bg hover:bg-bg-alt. Icon Copy default, Sparkles per prompt, Check (text-emerald-500) quando copiato.

Output: file completo .tsx (con "use client").`,
    },
    {
        slug: "code-block",
        name: "Code Block",
        summary: "<pre> framato con toolbar lingua/file e Copy button, scroll capped, opzione hover-only.",
        tagline:
            "Code block stile editoriale: rounded-[9px], toolbar con chip lingua + file path, scroll cap a 480px e CopyButton (ghost). Modalità floatingCopy per nascondere il toolbar e mostrare il copy solo in hover.",
        status: "live",
        icon: Code2,
        isNew: true,
        tags: ["Code", "Editorial", "Server"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/components/copy-button#CopyButton", "@/lib/utils#cn"],
        sourcePath: "src/components/code-block.tsx",
        preview: () => (
            <CodeBlock
                code={`export function hello() {\n  return "Ciao, mondo!";\n}`}
                filename="src/lib/hello.ts"
                language="ts"
                maxHeight={160}
            />
        ),
        usage: `<CodeBlock code={code} filename="src/components/x.tsx" language="tsx" />`,
        notes:
            "Per blocchi long-form usa il toolbar (default). Per blocchi inline-prosa usa floatingCopy: il pulsante appare solo in hover/focus-within e il <pre> respira di più.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <CodeBlock>: <pre> framato per documentazione.
Props:
- code: string
- filename?: string
- language?: string (default "tsx")
- maxHeight?: number (default 480)
- floatingCopy?: boolean

Layout: contenitore group/pre rounded-[9px] border bg-bg. Se filename o non floating: toolbar 32px in alto con chip lingua mono uppercase + file path text-fg-muted truncate. Pulsante Copy ghost in toolbar. Se floatingCopy: niente toolbar, copy in absolute top-2 right-2 con opacity-0 group-hover/pre:opacity-100. Pre m-0 px-4 py-4 font-mono text-[12.5px] leading-[1.65]. Container scrollabile con maxHeight CSS.

Constraints: server component, niente highlight (Plain pre), CopyButton client innestato, accessibile.

Output: file completo .tsx.`,
    },
    {
        slug: "preview-frame",
        name: "Preview Frame",
        summary: "Cornice live-preview con label rail e backdrop opzionale (flat / grid / hatch).",
        tagline:
            "La cornice usata per gli esempi di questa libreria: header con label + aside mono, area centrale flexbox per renderizzare qualsiasi componente, e tre backdrop (flat / dotted-grid / 45° hatch).",
        status: "live",
        icon: Frame,
        isNew: true,
        tags: ["Layout", "Preview", "Server"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn", "globals.css#grid-dots", "globals.css#stripe-rule"],
        sourcePath: "src/components/preview-frame.tsx",
        preview: () => (
            <PreviewFrame label="Anteprima" aside="grid" grid minHeight={120}>
                <p className="text-center text-[13px] text-fg-muted">
                    Qui dentro renderizzi qualsiasi componente.
                </p>
            </PreviewFrame>
        ),
        usage: `<PreviewFrame label="Anteprima" grid>
  <MyComponent />
</PreviewFrame>`,
        notes:
            "Tre varianti di backdrop: default (bg-bg-alt piatto), grid (dotted radial-gradient via @utility grid-dots), hatch (45° via stripe-rule). bare nasconde il toolbar per inserimenti compatti.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <PreviewFrame>: cornice per anteprime live.
Props:
- children: ReactNode
- label?: string (default "Anteprima")
- aside?: string (default "live · server") — caption mono a destra
- grid?: boolean — pattern dotted-grid (utility grid-dots)
- hatch?: boolean — pattern 45° (utility stripe-rule)
- minHeight?: number (default 160)
- bare?: boolean — nasconde il toolbar
- className?: string

Layout: container rounded-[9px] border bg-bg. Toolbar: bg-bg-alt, label mono uppercase, aside mono soft. Body: flex items-center justify-center px-5 py-8 sm:px-8, contenitore interno max-w-[480px], minHeight applicato via style.

Constraints: server component, grid e hatch mutuamente esclusivi (grid vince).

Output: file completo .tsx.`,
    },
    {
        slug: "preview-tabs",
        name: "Preview Tabs",
        summary: "Tabs Preview/Code con underline animato, accessibili (role tablist), zero dipendenze radix.",
        tagline:
            "Tabs minimali per alternare anteprima e codice. Underline animato, switch tastiera-friendly, zero deps radix. Server-fallback: se code è omesso, mostra solo Anteprima.",
        status: "live",
        icon: LayoutPanelTop,
        isNew: true,
        tags: ["Tabs", "Client", "A11y"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/preview-tabs.tsx",
        usage: `<PreviewTabs preview={<MyComp />} code={<CodeBlock code={src} />} />`,
        notes:
            "Niente radix-ui, niente headless deps. role=tablist, aria-selected, aria-controls, useId per stabilità SSR. L'underline è uno span absolute -bottom-px h-0.5 bg-fg.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un client component <PreviewTabs>: tabs Preview/Code, zero dipendenze radix.
Props:
- preview: ReactNode
- code?: ReactNode — quando assente, render solo "Anteprima"
- defaultTab?: "preview" | "code"
- aside?: ReactNode — slot a destra del tablist
- className?: string

Comportamento: useState per active tab, useId per stabilità id, role=tablist, role=tab, aria-selected, aria-controls. Switch via click; se vuoi va bene anche senza arrow-key navigation in v1.

Layout: container rounded-[9px] border. Header: bg-bg-alt, due button mono uppercase tracking. Tab attivo: text-fg + underline (span absolute -bottom-px h-0.5 bg-fg). Inattivo: text-fg-muted hover:text-fg. Pannello preview: grid-dots backdrop, min-h-[180px], padding generoso. Pannello code: nessun padding extra (lo gestisce CodeBlock).

Constraints: "use client", accessibilità minima ma corretta (tablist + role=tab), niente animazioni FLIP.

Output: file completo .tsx.`,
    },
    {
        slug: "marquee",
        name: "Marquee",
        summary: "Striscia infinita CSS, hardware-accelerated, fade ai bordi, pausa su hover.",
        tagline:
            "Marquee CSS-only: nessun JS, solo transform e mask-image. Loop continuo (linear), pausa elegante su hover, reverse opzionale, durata e gap configurabili. Rispetta prefers-reduced-motion.",
        status: "live",
        icon: Wind,
        isNew: true,
        tags: ["Motion", "CSS-only", "Server"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn", "globals.css#@keyframes marquee-x"],
        sourcePath: "src/components/marquee.tsx",
        preview: () => (
            <div className="w-full">
                <Marquee durationSec={28} gap="0.75rem" className="py-1">
                    {["React", "Next 16", "Tailwind v4", "Geist", "TypeScript", "Lucide", "MDX"].map(
                        (t) => (
                            <span
                                key={t}
                                className="inline-flex items-center rounded-full border border-border bg-bg-alt px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.06em] text-fg-muted"
                            >
                                {t}
                            </span>
                        ),
                    )}
                </Marquee>
            </div>
        ),
        usage: `<Marquee durationSec={28} gap="0.75rem">
  {tags.map((t) => <Tag key={t}>{t}</Tag>)}
</Marquee>`,
        notes:
            "Proprietà animate: solo transform (GPU). I children vengono duplicati una volta dentro il componente per il loop seamless — non duplicarli a monte. Per stop & resume usa pauseOnHover (default).",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <Marquee>: striscia infinita CSS-only, hardware-accelerated.
Props:
- children: ReactNode
- direction?: "left" | "right" (default "left")
- durationSec?: number (default 36)
- gap?: string (default "1.5rem")
- pauseOnHover?: boolean (default true)
- fade?: boolean (default true)
- fadeWidth?: string (default "8%")
- className?: string

Implementazione:
- Container overflow-hidden con mask-image linear-gradient su entrambi i lati per fade-out (se fade=true).
- Renderizza i children DUE volte in due tracker affiancati con animation: marquee-x var(--marquee-duration) linear infinite.
- Keyframe in globals.css: from { translate3d(0,0,0) } to { translate3d(calc(-50% - var(--marquee-gap)/2), 0, 0) }.
- pauseOnHover via [animation-play-state:paused] in group-hover.
- prefers-reduced-motion: il media query globale collassa le durate, quindi resta statico.

Constraints: server component, niente JS, animazioni solo su transform, will-change-transform sui due tracker.

Output: file completo .tsx + lo snippet @keyframes da aggiungere a globals.css.`,
    },
    {
        slug: "number-flow",
        name: "Number Flow",
        summary: "Counter morph: parte da 0, raggiunge il valore con ease-out e blur-rise.",
        tagline:
            "Counter animato: rAF interpola dal valore di partenza al target con ease-out forte, mentre l'intero blocco fa un blur-rise di 600ms. Si attiva al primo intersect. Locale-aware via formatter.",
        status: "live",
        icon: HashIcon,
        isNew: true,
        tags: ["Motion", "Stat", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn", "globals.css#@keyframes count-rise", "globals.css#--ease-out"],
        sourcePath: "src/components/number-flow.tsx",
        preview: () => (
            <div className="grid w-full grid-cols-3 gap-3 text-center">
                <div className="rounded-md border border-border bg-bg-alt px-3 py-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-soft">
                        Visite
                    </div>
                    <div className="mt-1 text-2xl font-medium tabular-nums text-fg">
                        <NumberFlow value={12480} />
                    </div>
                </div>
                <div className="rounded-md border border-border bg-bg-alt px-3 py-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-soft">
                        Stelle
                    </div>
                    <div className="mt-1 text-2xl font-medium tabular-nums text-fg">
                        <NumberFlow value={342} />
                    </div>
                </div>
                <div className="rounded-md border border-border bg-bg-alt px-3 py-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-soft">
                        Repo
                    </div>
                    <div className="mt-1 text-2xl font-medium tabular-nums text-fg">
                        <NumberFlow value={87} />
                    </div>
                </div>
            </div>
        ),
        usage: `<NumberFlow value={12480} />`,
        notes:
            "Combina due meccanismi: (1) rAF interpola il numero con ease-out custom, (2) il container ha animation count-rise (translateY + blur) di 600ms. prefers-reduced-motion: il global CSS collassa entrambi e il valore appare istantaneo.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un client component <NumberFlow>: counter animato che parte da from e raggiunge value.
Props:
- value: number
- from?: number (default 0)
- durationMs?: number (default 1100)
- format?: (n: number) => string (default Intl it-IT)
- eager?: boolean (default false)
- className?: string

Implementazione:
- Stato display interpolato. Trigger via IntersectionObserver (threshold 0.4) salvo eager=true.
- All'avvio, controllare matchMedia("(prefers-reduced-motion: reduce)") → se true, set display=value e return.
- requestAnimationFrame loop: t=clamp((now-start)/duration, 0, 1), eased=1-(1-t)^4, display=from+(value-from)*eased.
- Cancel rAF su cleanup.
- className "inline-block tabular-nums" + animation count-rise 600ms var(--ease-out) both al primo trigger.
- Display via format(display); default Math.round(n).toLocaleString("it-IT").

Constraints: "use client", animazione una volta sola, niente reflow del layout (no width animation).

Output: file completo .tsx + il keyframe count-rise per globals.css se manca.`,
    },
    {
        slug: "bento-tile",
        name: "Bento Tile",
        summary: "Card decorativa: due render path — solo preview frozen, oppure icon+kicker+name etichettato.",
        tagline:
            "Bento card a doppia identità. Con `preview` set: la preview riempie la tile, frozen (animation off), niente overlay — la preview È la tile. Senza preview: layout etichettato classico (icon top-left, kicker + name bottom). Due fit per la preview: scale (centrata) o cover (fill edge-to-edge).",
        status: "live",
        icon: LayoutGrid,
        isNew: true,
        tags: ["Bento", "Decorativo", "Server"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/bento-tile.tsx",
        preview: () => (
            <div className="grid w-full grid-cols-3 gap-2">
                <BentoTile
                    icon={Heading1}
                    name="Section Label"
                    group="Heading"
                    variant="minimal"
                    size="md"
                    preview={
                        <div className="flex flex-col gap-1 px-3">
                            <span className="text-2xl font-semibold text-fg">About</span>
                            <span className="text-2xl font-semibold text-fg">Connect</span>
                        </div>
                    }
                />
                <BentoTile
                    icon={Wind}
                    name="Marquee"
                    group="Motion"
                    variant="accent"
                    size="md"
                    isNew
                    preview={
                        <div className="flex gap-1 px-2">
                            {["A", "B", "C", "D"].map((t) => (
                                <span key={t} className="rounded-full border border-border bg-bg-alt px-2 py-1 text-[11px] text-fg-muted">
                                    {t}
                                </span>
                            ))}
                        </div>
                    }
                />
                <BentoTile
                    icon={Calculator}
                    name="Calculator"
                    group="Form"
                    variant="mono"
                    size="md"
                    preview={
                        <div className="flex flex-col gap-1 px-3 text-bg">
                            <span className="font-mono text-[11px]">€ 4 800</span>
                            <span className="font-mono text-[11px]">€ 9 200</span>
                        </div>
                    }
                />
            </div>
        ),
        usage: `// Preview path — preview fills the tile, no labels.
<BentoTile size="lg" isNew preview={<MyComponentPreview />} />

// Image-fill variant.
<BentoTile size="lg" previewFit="cover" preview={<img src={src} className="h-full w-full object-cover" />} />

// Label path — icon + kicker + name, no preview.
<BentoTile icon={Wind} name="Marquee" group="Motion" variant="accent" />`,
        notes:
            "Quando preview è settato il render path diventa solo-preview: niente icon, niente name, niente fog. Il subtree riceve [&_*]:!animate-none [&_*]:!transition-none [&_*]:!will-change-auto così 24+ tile nei gutter restano economiche. previewFit='cover' bypassa la scala e fa riempire alla preview tutta la tile (caso tipico: <img object-cover/>).",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <BentoTile>: card decorativa con due render path.
Props:
- icon?: ComponentType — lucide
- name: string
- group?: string — kicker mono uppercase
- variant?: "minimal" | "accent" | "mono" (default "minimal")
- size?: "sm" | "md" | "lg" (default "md") — heights 80/128/176px
- isNew?: boolean
- preview?: ReactNode — preview live, frozen
- previewFit?: "scale" | "cover" (default "scale")
- previewInnerWidth?: number (default 320) — width pre-scale del wrapper
- previewScale?: number (default 0.5)
- className?: string

Render path 1 — con preview:
- div rounded-md border, h size, overflow-hidden
- absolute inset-0 con [&_*]:!animate-none [&_*]:!transition-none [&_*]:!will-change-auto
- Se previewFit "cover": absolute inset-0 con il preview dentro
- Altrimenti: wrapper assoluto centrato (left-1/2 top-1/2, transform: translate(-50%,-50%) scale(N), width: previewInnerWidth) con il preview dentro
- Optional accent dot top-right per isNew (con ring)
- Niente icon, niente name, niente fog overlay

Render path 2 — senza preview:
- div rounded-md border + p-3 + h size, flex-col justify-between
- Top: icon chip 28x28 (border + bg) + accent dot top-right se isNew
- Bottom: kicker mono small + name 12.5px font-medium

Varianti:
- minimal: border-border bg-bg, label text-fg
- accent: border-accent/40 bg-accent/[0.04], kicker text-accent
- mono: border-fg bg-fg text-bg

Esporta bentoSizeForSlug(slug), bentoVariantForSlug(slug, isNew?) per pick deterministici da char-code-sum.

Constraints: server component, aria-hidden default.

Output: file completo .tsx.`,
    },
    {
        slug: "parallax-lane",
        name: "Parallax Lane",
        summary: "Wrapper client che traduce il contenuto al ritmo dello scroll con curva tanh asintotica.",
        tagline:
            "Wrapper client component: ascolta lo scroll passive, applica un translate3d Y al figlio = tanh(scrollY × multiplier / max) × max. rAF-throttled, asintotico (no snap ai bordi), slack 22% sopra/sotto così non si vedono mai bordi vuoti. Pensato per parallax molto leggera sui marquee delle side columns.",
        status: "live",
        icon: Layers,
        isNew: true,
        tags: ["Motion", "Client", "Scroll"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/parallax-lane.tsx",
        usage: `<ParallaxLane multiplier={0.04} slackPct={22}>
  <MarqueeVertical ...>{children}</MarqueeVertical>
</ParallaxLane>`,
        notes:
            "Curva tanh asintotica: lineare per scrollY piccoli, tende ad ±maxOffsetPx senza mai raggiungerlo. Niente snap al boundary. Il transform viene scritto direttamente sull'elemento (no CSS variable) così i siblings non rifanno style-recalc. prefers-reduced-motion: skip totale.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un client component <ParallaxLane>: wrapper che applica un piccolo translateY scroll-tied al figlio.
Props:
- multiplier?: number (default 0.04) — scrollY * multiplier = offset raw. Negativo = direzione opposta allo scroll.
- maxOffsetPx?: number (default 110) — asintoto del tanh.
- slackPct?: number (default 20) — slack verticale sopra/sotto, in percentuale dell'altezza outer.
- children: ReactNode
- className?: string

Comportamento:
- "use client".
- useEffect: registra scroll listener passive con rAF throttle (un solo frame in volo). Apply iniziale per cogliere reload con scroll già non-zero.
- Skip se matchMedia "(prefers-reduced-motion: reduce)" matches.
- Cleanup: removeEventListener + cancelAnimationFrame.
- offset = Math.tanh(scrollY * multiplier / maxOffsetPx) * maxOffsetPx (asintoto, no snap).
- Scrivi il transform direttamente sull'elemento (innerRef.style.transform = "translate3d(0, Ypx, 0)") — niente CSS variable per evitare recalc inheritati.

Layout: container outer "relative h-full overflow-hidden". Inner absolute inset-x-0 con top: -slackPct% bottom: -slackPct% (slack equa sopra/sotto), will-change-transform. Il children dentro l'inner.

Constraints: zero dipendenze JS extra, transform-only, accessibile (decorativo, aria-hidden gestito dal parent), funziona dentro <MarqueeVertical>.

Output: file completo .tsx (con "use client").`,
    },
    {
        slug: "scroll-video",
        name: "Scroll Video",
        summary: "Image-sequence player scroll-driven (alla Apple): WebP frames + canvas + sticky pin per effetto premium.",
        tagline:
            "La tecnica dell'iPhone product page: una sezione tall (250vh+) con un canvas pinned sticky-top. Mentre l'utente scrolla, la progress dello scroll mappa l'indice del frame da disegnare. Frames WebP precaricati in batch (eager + deferred via requestIdleCallback), drawImage GPU-friendly, fallback completo per prefers-reduced-motion (mostra solo il primo frame, niente pin).",
        status: "live",
        icon: Film,
        isNew: true,
        tags: ["Premium", "Scroll", "Client"],
        dependencies: ["clsx", "tailwind-merge"],
        requires: [
            "@/lib/utils#cn",
            "WebP frames in /public/scroll-video/ (or any baseUrl)",
        ],
        sourcePath: "src/components/scroll-video.tsx",
        preview: () => (
            <div className="relative w-full overflow-hidden rounded-md border border-border bg-bg-alt">
                <div
                    className="grid-dots flex w-full items-center justify-center"
                    style={{ aspectRatio: "16 / 9" }}
                >
                    <div className="flex flex-col items-center gap-2 px-4 text-center">
                        <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-fg-soft">
                            Frame 042 · 150
                        </span>
                        <span className="text-[14px] font-medium text-fg">
                            Scroll-driven sequence
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 border-t border-border bg-bg px-2 py-1">
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-fg-soft">0%</span>
                    <span aria-hidden className="relative h-px flex-1 bg-border">
                        <span
                            aria-hidden
                            className="absolute inset-y-0 left-0 bg-fg"
                            style={{ width: "28%" }}
                        />
                    </span>
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-fg-soft">100%</span>
                </div>
            </div>
        ),
        usage: `<ScrollVideo
  baseUrl="/scroll-video/frame-"
  frameCount={150}
  framePadding={4}
  extension="webp"
  scrollHeight="250vh"
  aspectRatio="16 / 9"
/>`,
        notes:
            "Asset prep con ffmpeg (esempio per 150 frames a 1280x720 da un mp4):\n\nffmpeg -i source.mp4 -vf 'fps=30,scale=1280:-2' -frames:v 150 -c:v libwebp -q:v 80 -loop 1 -an public/scroll-video/frame-%04d.webp\n\nLinee guida peso: 1280x720 WebP q=80 ≈ 30-80 KB/frame → 150 frames ≈ 5-12 MB totali. Sotto 10 MB è sicuro su 4G; sopra, considera frame stride (1 frame ogni 2 di scroll) o riduci la risoluzione. Eager batch default 12 frames per readiness rapida; il resto in requestIdleCallback con timeout 1500ms così non blocca il main thread durante l'idratazione.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un client component <ScrollVideo>: image-sequence player scroll-driven, stile Apple product page.

Props:
- baseUrl: string — URL fino al numero del frame (es. "/scroll-video/frame-")
- frameCount: number
- framePadding?: number (default 4) — zero-pad dell'indice (0001..0150)
- extension?: string (default "webp")
- scrollHeight?: string (default "250vh") — quanto è tall la sezione (più scroll = scrub più lento)
- aspectRatio?: string (default "16 / 9")
- maxWidth?: string (default "1200px")
- eagerFrameCount?: number (default 12) — frames caricati prioritariamente prima di mostrare
- loadingFallback?: ReactNode — content mentre carica
- showProgressBar?: boolean (default true) — barra di progress in basso
- className?, frameClassName?: string

Comportamento:
- "use client". Tutto via useEffect/useRef — niente state per ogni frame (sarebbe re-render storm).
- Preload eager batch parallelo con fetchpriority="high"; resto via requestIdleCallback con timeout 1500ms (fallback setTimeout 250ms).
- Refs: sectionRef, canvasRef, framesRef (HTMLImageElement[]), lastDrawnRef (numero ultimo frame disegnato).
- Scroll handler rAF-throttled. Scroll progress = clamp(-rect.top / max(1, sectionHeight - viewportHeight), 0, 1). targetIndex = floor(progress * frameCount).
- Se il targetIndex non è ancora caricato, walk indietro al frame loaded più vicino (no canvas vuoto).
- drawImage: aggiorna canvas.width/height alla naturalSize del frame solo al primo paint; CSS gestisce lo scaling.
- prefers-reduced-motion: niente sticky, niente scroll listener, niente progress bar — solo il primo frame statico.

Layout:
- <section> tall (scrollHeight) con sticky inner div top-0 h-screen flex items-center justify-center.
- Inner: <canvas> con aspect-ratio, maxWidth, transition-opacity per fade-in quando ready.
- Loading state: count "X / Y" mono, opzionale loadingFallback.
- Progress bar 1px in basso scaleX(eagerProgress) con transition-opacity → 0 a load completo.

Constraints: zero deps extra, transform-only sul layout, server-prerender safe (window guards in useEffect), accessibile (aria-hidden sul canvas).

Output: file completo .tsx (con "use client").`,
    },
    {
        slug: "blob-mixer",
        name: "Blob Mixer",
        summary:
            "Sculpture WebGL: icosfera ad alta risoluzione deformata da simplex-noise, 12 preset materiali (chrome, vetro, plasma, lava, perla…) che si crossfadano live.",
        tagline:
            "Una versione full-R3F del demo blobmixer.14islands cucita addosso a Next 16 + drei + postprocessing. La superficie è un'icosfera 128-suddivisioni dispostata in vertex shader; le normali sono ricalcolate analiticamente per frame, così trasmissione, iridescenza, clearcoat e sheen restano coerenti. Switching dei preset = lerp simultaneo di ogni proprietà PBR + shape uniform + bloom intensity.",
        status: "live",
        icon: Wand2,
        isNew: true,
        tags: ["3D", "Shader", "WebGL", "R3F", "Postprocessing"],
        dependencies: [
            "@react-three/fiber",
            "@react-three/drei",
            "@react-three/postprocessing",
            "three",
        ],
        requires: [
            "@/lib/utils#cn",
            "src/components/blob-mixer/{shaders,presets,blob,env,background,scene.client}.{ts,tsx}",
        ],
        sourcePath: "src/components/blob-mixer/scene.client.tsx",
        preview: () => (
            <div className="overflow-hidden rounded-[10px] border border-white/10 bg-black">
                <BlobMixerScene compact className="h-[300px]" />
            </div>
        ),
        usage: `import { BlobMixerScene } from "@/components/blob-mixer";\n\n<BlobMixerScene className="h-[70vh]" initialPreset="plasma" />`,
        notes:
            "Pesante ma stabile — sull'integrato Apple M-class regge 60fps anche a detail=128. In compact (catalog tile) detail scende a 64 e il post-processing è disattivato. La rail di swatch è interna alla scena: cliccare un swatch innesca il lerp di tutte le proprietà del materiale in ~250ms (half-life), stesso easing del sito originale.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <BlobMixerScene> in React Three Fiber, replica del demo blobmixer.14islands.com adattata al portfolio.

Architettura (file separati in src/components/blob-mixer/):
- shaders.ts → 3D simplex noise (Ashima/Gustavson) + funzione blobField (3 ottave + breathe pulse + chaos detail) + displacePosition con pointer dent. Esporta noiseGLSL e vertexInjection (chunk da iniettare in #include <begin_vertex>).
- presets.ts → 12 preset (Chrome, Gold, Glass, Soap Bubble, Pearl, Plasma, Lava, Jelly, Wax, Hologram, Ink, Candy). Ogni preset ha: material{color, metalness, roughness, envMapIntensity, clearcoat, clearcoatRoughness, iridescence, iridescenceIOR, iridescenceThicknessRange, sheen, sheenColor, sheenRoughness, transmission, thickness, ior, attenuationColor, attenuationDistance, specularIntensity, opacity, transparent}, shape{noiseScale, noiseSpeed, displace, roundness, pulse, chaos}, core{visible, intensity, colorA, colorB}, bloom, swatch (CSS gradient), bg, accent.
- blob.tsx → "use client", componente <Blob presetId detail/>. useMemo crea MeshPhysicalMaterial UNA volta + setta onBeforeCompile prima del primo render: Object.assign(shader.uniforms, customUniforms); injetta noiseGLSL prima di "void main() {" e vertexInjection dopo "#include <begin_vertex>". useFrame ogni frame: lerpa tutte le NUMERIC_MAT_KEYS, COLOR_MAT_KEYS via THREE.Color.lerp, iridescenceThicknessRange come tupla, e tutte le shape uniforms; k = 1 - exp(-dt * 4.5) per ottenere ~250ms half-life framerate-independent. Mesh secondaria additive-blended (core glow) per plasma/lava. Pointer pickup via raycaster su un piano facing-camera attraverso l'origine.
- env.tsx → DarkStudioEnv: bake PMREM custom con 3 area lights (warm key, cool fill, magenta rim, top stripe) + backdrop sphere a gradient. Niente HDR esterno.
- background.tsx → sfera back-side con gradient radiale che lerpa il colore del preset attivo.
- scene.client.tsx → "use client", <BlobMixerScene compact?> wrapper: Canvas (dpr [1,2], ACES, exposure 0.85, fov 32, camera Z=4.2). Bambini: <DarkStudioEnv/>, <Background/>, 3 directionalLight (warm/cool/rim), <Blob/>, <EffectComposer> con <Bloom> (intensity tweenata via useFrame), ChromaticAberration, Vignette, ToneMapping ACES. Compact mode: detail=64, no postproc, fov 28, camera Z=4.6. Overlay: rail floating verticale di swatch a sinistra (o destra in compact), HUD bottom-center con preset name.

Vincoli:
- Usa SOLO le librerie già installate: three, @react-three/fiber, @react-three/drei (PerspectiveCamera), @react-three/postprocessing (EffectComposer, Bloom, ChromaticAberration, Vignette, ToneMapping), postprocessing (BlendFunction, ToneMappingMode).
- Token CSS del progetto per la chrome (rail, HUD): bg/45 black + border-white/10 + backdrop-blur-md.
- Niente GSAP, niente zustand: lerp ogni frame con dt-aware easing, stato React solo per presetId.
- onBeforeCompile assegnato dentro useMemo che crea il materiale (non in useEffect): garantisce sia attivo prima della prima compile.
- frustumCulled={false} sul mesh: il displacement lo allarga oltre il bounding di base.

Output: 6 file completi nella struttura sopra, pronti da incollare.`,
    },
    {
        slug: "blur-text",
        name: "Blur Text",
        summary: "Reveal editoriale: ogni parola sfuma da blur a fuoco quando entra nel viewport.",
        tagline:
            "Il pattern di reveal text più richiesto del 2026 (react-bits #1). IntersectionObserver + transition CSS pure, niente Framer Motion. Granularità per parola o per carattere, durata e stagger configurabili. Honoura prefers-reduced-motion (statico).",
        status: "live",
        icon: Type,
        isNew: true,
        tags: ["Text", "Animation", "Editorial", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/blur-text.tsx",
        preview: () => (
            <div className="flex flex-col items-start gap-3">
                <BlurText
                    text="Pixel-perfect, fatti per essere usati."
                    as="h3"
                    className="text-[22px] font-semibold tracking-tight text-fg"
                    trigger="mount"
                />
                <BlurText
                    text="Con stagger leggero leggi naturale."
                    as="p"
                    stagger={45}
                    className="text-[14px] text-fg-muted"
                    trigger="mount"
                />
            </div>
        ),
        usage: `<BlurText text="Pixel-perfect" as="h1" stagger={60} duration={700} />`,
        notes:
            "trigger=\"mount\" lo fa partire subito (utile in card sopra il fold). trigger=\"view\" usa IntersectionObserver con threshold 0.2. Per testo lungo conviene split=\"word\" per leggibilità — \"char\" diventa rumoroso oltre 5-6 parole.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <BlurText> per reveal editoriale di testo on-scroll.
Props:
- text: string — il testo.
- split?: "word" | "char" (default "word").
- stagger?: number ms (default 60).
- duration?: number ms (default 700).
- trigger?: "view" | "mount" (default "view") — IntersectionObserver vs. immediato.
- as?: "h1"|"h2"|"h3"|"h4"|"p"|"span" (default "p").
- className?: string.

Implementazione:
- "use client".
- Tokenizza preservando spazi (split su /(\\s+)/) per layout corretto.
- Ogni token in <span inline-block> con transition: filter, transform, opacity.
- Stato hidden: filter blur(10px), translateY(0.4em), opacity 0. Stato shown: tutti reset.
- transitionDelay = i * stagger.
- IntersectionObserver con threshold 0.2 → setState(true) → disconnect.
- prefers-reduced-motion: setState(true) immediato.
- aria-label={text} sul wrapper, aria-hidden sui token.

Output: file completo src/components/blur-text.tsx.`,
    },
    {
        slug: "split-text",
        name: "Split Text",
        summary: "Reveal teatrale: ogni carattere o parola scivola verso l'alto da un wrapper overflow-hidden.",
        tagline:
            "react-bits #2. Transform translateY su ogni token mascherato da overflow-clip — l'effetto \"wipe in\" classico delle hero sotto il fold. Direzione configurabile (up/down/left/right). Pure CSS.",
        status: "live",
        icon: PenLine,
        isNew: true,
        tags: ["Text", "Animation", "Hero", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/split-text.tsx",
        preview: () => (
            <div className="space-y-2">
                <SplitText
                    text="Build memorable web."
                    as="h3"
                    className="text-[26px] font-semibold tracking-tight text-fg"
                    trigger="mount"
                />
                <SplitText
                    text="Per character, eased, trustable."
                    split="word"
                    direction="up"
                    stagger={70}
                    as="p"
                    className="text-[13px] text-fg-muted"
                    trigger="mount"
                />
            </div>
        ),
        usage: `<SplitText text="Build memorable web." as="h1" split="char" direction="up" />`,
        notes:
            "Wrapping span overflow-hidden + figlio translateY(0.6em) → translate(0). Va dato un line-height almeno 1.05 sul Tag esterno: in caso contrario i discendenti delle lettere (g, p, y) vengono tagliati.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <SplitText> per il classico reveal teatrale per-carattere.
Props identiche a <BlurText> più:
- direction?: "up" | "down" | "left" | "right" (default "up").

Implementazione:
- "use client", IntersectionObserver con threshold 0.25.
- Tokenizza preservando spazi.
- Ogni token: outer <span inline-block overflow-hidden align-bottom>, inner <span inline-block> con transition transform + opacity.
- Hidden: outer ha overflow-hidden, inner translate (Y o X di 0.6em a seconda di direction), opacity 0.
- Shown: inner translate(0,0), opacity 1.
- transitionDelay = i * stagger.
- prefers-reduced-motion → setState(true) immediato.
- line-height del Tag wrapper esterno minimo 1.05 per non tagliare i discendenti.

Output: file completo src/components/split-text.tsx.`,
    },
    {
        slug: "shiny-text",
        name: "Shiny Text",
        summary: "Riflesso metallico in loop su una stringa — il \"premium SaaS CTA\" sweep.",
        tagline:
            "Una sola riga di CSS animata con background-clip: text. Loop infinito di un gradiente diagonale che attraversa il testo. Lightweight, niente JS.",
        status: "live",
        icon: Sparkles,
        isNew: true,
        tags: ["Text", "Animation", "CTA", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/shiny-text.tsx",
        preview: () => (
            <div className="flex flex-col items-start gap-3">
                <ShinyText className="font-mono text-[12px] uppercase tracking-[0.18em]" speed={3.5}>
                    Start free →
                </ShinyText>
                <ShinyText className="text-[18px] font-semibold tracking-tight" speed={4}>
                    Premium signal sweep
                </ShinyText>
            </div>
        ),
        usage: `<ShinyText speed={3} baseColor="var(--fg-muted)" shineColor="var(--fg)">Start free →</ShinyText>`,
        notes:
            "background-clip: text richiede color: transparent + WebkitTextFillColor: transparent. Speed bassa (2-3s) = aggressivo, alta (5-6s) = soft. prefers-reduced-motion blocca l'animazione.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <ShinyText> con riflesso metallico in loop.
Props:
- children: ReactNode.
- speed?: number sec (default 3).
- baseColor?: string (default "var(--fg-muted)").
- shineColor?: string (default "var(--fg)").
- className?: string.

Implementazione:
- "use client".
- Inline <style> con keyframes shiny-sweep: background-position from 200% center → -200% center.
- Inline style sul <span>: backgroundImage linear-gradient(110deg, base, base 40%, shine 50%, base 60%, base), backgroundSize 200% auto, backgroundClip text + WebkitBackgroundClip text, color transparent + WebkitTextFillColor transparent, animation shiny-sweep speed linear infinite.
- Media (prefers-reduced-motion: reduce) blocca animation.

Output: file completo src/components/shiny-text.tsx.`,
    },
    {
        slug: "spotlight-card",
        name: "Spotlight Card",
        summary: "Card con riflettore radiale che segue il puntatore — il pattern più screenshottato di Aceternity.",
        tagline:
            "Mouse-tracked CSS variables (--mx, --my) aggiornate su pointermove. Due overlay: spotlight tinto + bordo che si illumina. Niente re-render React per frame, gradient via radial-gradient + color-mix oklch.",
        status: "live",
        icon: MousePointer2,
        isNew: true,
        tags: ["Card", "Hover", "Premium", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/spotlight-card.tsx",
        preview: () => (
            <div className="grid gap-3 sm:grid-cols-2">
                <SpotlightCard color="var(--accent)">
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-soft">
                        Hover
                    </p>
                    <p className="mt-1 text-[14px] font-medium text-fg">
                        Spotlight follows your cursor.
                    </p>
                </SpotlightCard>
                <SpotlightCard color="#ff7ad9" intensity={0.25}>
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-soft">
                        Tint magenta
                    </p>
                    <p className="mt-1 text-[14px] font-medium text-fg">Radius + intensity custom.</p>
                </SpotlightCard>
            </div>
        ),
        usage: `<SpotlightCard radius={320} color="var(--accent)" intensity={0.18}>...</SpotlightCard>`,
        notes:
            "Aggiorna CSS vars via setProperty in pointermove → zero re-render React. color può essere qualsiasi formato CSS valido per color-mix. Su touch (no hover) la card resta neutra (--mx/--my a -9999px).",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <SpotlightCard> con radial-gradient mouse-tracked.
Props:
- children: ReactNode.
- radius?: number px (default 320).
- color?: string (default "var(--accent)").
- intensity?: number 0–1 (default 0.18).
- className?: string.

Implementazione:
- "use client", useRef sulla card.
- onPointerMove: leggi getBoundingClientRect, setProperty("--mx") + "--my" relativi al rect.
- onPointerLeave: setProperty a -9999px.
- Wrapper: relative overflow-hidden rounded-[10px] border bg-bg-alt.
- Overlay 1 (spotlight): pointer-events-none, opacity 0 → 100 su group-hover, background radial-gradient(radius circle at var(--mx) var(--my), color-mix(in oklch, color intensity*100%, transparent), transparent 60%).
- Overlay 2 (border glow): mask trick — radial-gradient più ampio, mask con padding-box xor per creare un anello bordo.
- Children dentro <div className="relative">.

Output: file completo src/components/spotlight-card.tsx.`,
    },
    {
        slug: "border-beam",
        name: "Border Beam",
        summary: "Un cometa luminosa percorre il bordo della card su un loop — Magic UI signature.",
        tagline:
            "Un singolo elemento posizionato via CSS offset-path lungo il rettangolo del bordo, con animazione offset-distance 0 → 100%. Aggiungi una seconda <BorderBeam delay={0.5}/> per il dual-beam premium.",
        status: "live",
        icon: Frame,
        isNew: true,
        tags: ["Card", "Border", "Animation", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn", "browser: Chrome 116+ / Safari 16+ / Firefox 122+ for offset-path on rect()"],
        sourcePath: "src/components/border-beam.tsx",
        preview: () => (
            <div className="grid gap-3 sm:grid-cols-2">
                <div className="relative overflow-hidden rounded-[10px] border border-border bg-bg-alt p-5">
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-soft">
                        Single beam
                    </p>
                    <p className="mt-1 text-[14px] font-medium text-fg">8s loop, accent.</p>
                    <BorderBeam />
                </div>
                <div className="relative overflow-hidden rounded-[10px] border border-border bg-bg-alt p-5">
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-soft">
                        Dual beam
                    </p>
                    <p className="mt-1 text-[14px] font-medium text-fg">Two comets, 180° apart.</p>
                    <BorderBeam />
                    <BorderBeam delay={0.5} colorFrom="#ff7ad9" />
                </div>
            </div>
        ),
        usage: `<div className="relative overflow-hidden rounded-[10px] border ...">\n  ...\n  <BorderBeam />\n  <BorderBeam delay={0.5} colorFrom="#ff7ad9" />\n</div>`,
        notes:
            "Il parent DEVE avere overflow-hidden + position-relative + border-radius matchato a borderRadius prop. Su browser senza offset-path support, il beam non appare ma il layout regge.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <BorderBeam>: cometa luminosa che percorre il bordo del parent.
Props:
- size?: number % perimetro (default 18).
- duration?: number sec (default 8).
- delay?: number 0–1 frazione del loop (default 0).
- colorFrom?: string (default "var(--accent)").
- colorTo?: string (default "transparent").
- borderRadius?: number (default 10).
- className?: string.

Implementazione:
- "use client".
- Inline <style> con keyframe border-beam: offset-distance to 100%.
- Render: div con offsetPath rect(0 100% 100% 0 round border-radius), offsetDistance 0%, animation border-beam duration linear infinite, animationDelay -delay*duration.
- Width = size%, aspectRatio 1, background linear-gradient(90deg colorTo, colorFrom, colorTo), filter blur(6px).
- Media (prefers-reduced-motion: reduce) blocca animation.

Output: file completo src/components/border-beam.tsx.`,
    },
    {
        slug: "tilt-card",
        name: "Tilt Card",
        summary: "Parallax 3D che insegue il puntatore — il pattern Apple/Perplexity.",
        tagline:
            "perspective + rotateX/rotateY calcolati in pointermove via CSS variables. Glare overlay con mix-blend-mode opzionale. Restraint: 8° max di tilt, scale 1.02. Mai \"cartoon\".",
        status: "live",
        icon: Box,
        isNew: true,
        tags: ["Card", "3D", "Hover", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/tilt-card.tsx",
        preview: () => (
            <div className="grid gap-3 sm:grid-cols-2">
                <TiltCard className="h-[140px]">
                    <div className="relative h-full rounded-[10px] border border-border bg-bg-alt p-5">
                        <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-soft">Hover</p>
                        <p className="mt-1 text-[14px] font-medium text-fg">3D parallax + glare</p>
                    </div>
                </TiltCard>
                <TiltCard maxTilt={12} glare={false} className="h-[140px]">
                    <div className="relative h-full rounded-[10px] border border-border bg-fg p-5 text-bg">
                        <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-bg/60">More tilt</p>
                        <p className="mt-1 text-[14px] font-medium">No glare, dramatic</p>
                    </div>
                </TiltCard>
            </div>
        ),
        usage: `<TiltCard maxTilt={8} scale={1.02} glare>\n  <div className="rounded-[10px] border ...">card content</div>\n</TiltCard>`,
        notes:
            "Tilt > 12° fa stare male l'occhio. Su touch il tilt è inerte (no pointermove) ma lo scale-on-press funziona via :active. Il figlio dovrebbe avere rounded-[inherit] se vuoi che il glare segua i corners.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <TiltCard> per parallax 3D pointer-tracked.
Props:
- children: ReactNode.
- maxTilt?: number deg (default 8).
- scale?: number (default 1.02).
- glare?: boolean (default true).
- className?: string.

Implementazione:
- "use client".
- Wrapper con perspective: 1000px (Tailwind: [perspective:1000px]).
- Figlio inner: transform-style preserve-3d, transform rotateX(var(--rx)) rotateY(var(--ry)) scale(var(--s)), transition transform 300ms cubic-bezier(.16,1,.3,1).
- onPointerMove sulla wrapper: calcola px/py 0-1, --rx = (0.5-py)*maxTilt*2, --ry = (px-0.5)*maxTilt*2, --gx/gy in % per il glare.
- onPointerLeave: --rx 0, --ry 0.
- Glare overlay: pointer-events-none, mix-blend-overlay, opacity 0 → 100 group-hover, background radial-gradient(280px circle at var(--gx) var(--gy), rgba(255,255,255,0.55), transparent 60%).

Output: file completo src/components/tilt-card.tsx.`,
    },
    {
        slug: "animated-beam",
        name: "Animated Beam",
        summary: "Cometa SVG che viaggia su una curva tra due nodi — il pattern Magic UI \"X works with Y\".",
        tagline:
            "Calcola il path SVG tra due ref, traccia una curva quadratica, poi anima un overlay div via CSS offset-path lungo lo stesso d. ResizeObserver mantiene il beam attaccato se i nodi si muovono.",
        status: "live",
        icon: GitBranch,
        isNew: true,
        tags: ["Diagram", "SVG", "Animation", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/animated-beam.tsx",
        preview: () => <AnimatedBeamPreview />,
        usage: `<div ref={containerRef} className="relative">\n  <Node ref={fromRef}/>\n  <Node ref={toRef}/>\n  <AnimatedBeam containerRef={containerRef} fromRef={fromRef} toRef={toRef} />\n</div>`,
        notes:
            "Il container DEVE essere position-relative; le coordinate sono relative al suo bounding box. ResizeObserver ricomputa il path quando cambia la viewport o i nodi si rimisurano. Per più beam usa delay diversi.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <AnimatedBeam> che disegna una curva animata tra due nodi (containerRef + fromRef + toRef).
Props (vedi BlobMixer per stile prompt):
- containerRef: RefObject<HTMLElement | null>.
- fromRef: RefObject<HTMLElement | null>.
- toRef: RefObject<HTMLElement | null>.
- duration?: number sec (default 2.6).
- strokeWidth?: number (default 2).
- pathColor?: string (default "var(--border-strong)").
- gradientStartColor?: string (default "var(--accent)").
- gradientStopColor?: string (default "transparent").
- curvature?: number 0-1 (default 0.45).
- reverse?: boolean.
- delay?: number sec.

Implementazione:
- "use client", useEffect con ResizeObserver sul container + window resize.
- Calcola midpoint + perpendicular offset per la curva quadratica: M ax ay Q (mx+ox) (my+oy) bx by.
- Render: <svg> con <path d=...> idle (stroke pathColor opacity 0.35) + <linearGradient>.
- Cometa: <div className="absolute"> con offsetPath path("..."), offsetRotate auto, animation sweep duration linear infinite, background linear-gradient.
- Keyframes uniche per id (Math.random) per evitare conflitti.
- prefers-reduced-motion blocca l'animazione.

Output: file completo src/components/animated-beam.tsx.`,
    },
    {
        slug: "testimonial-carousel",
        name: "Testimonial Carousel",
        summary: "Slider di testimonial con auto-advance, pause-on-hover, dot indicators e tastiera.",
        tagline:
            "Cross-fade puro CSS (opacity transition), pause su hover/focus, frecce ←/→ da tastiera, indicatore dot animato. Zero dipendenze, niente carousel library.",
        status: "live",
        icon: Quote,
        isNew: true,
        tags: ["Conversion", "Carousel", "Social Proof", "Client"],
        dependencies: ["tailwind-merge", "clsx", "lucide-react"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/testimonial-carousel.tsx",
        preview: () => (
            <TestimonialCarousel
                items={[
                    {
                        quote: "Luca ha rifatto il nostro sito in 3 settimane: bounce rate -38%.",
                        name: "Sara R.",
                        role: "CEO, Studio Krono",
                    },
                    {
                        quote: "Il sistema di componenti che ci ha consegnato lo riusiamo in tre brand diversi.",
                        name: "Marco V.",
                        role: "Lead Designer",
                    },
                    {
                        quote: "Discovery, design, dev, deploy. Una sola persona — meno friction di un'agenzia.",
                        name: "Elena B.",
                        role: "PM, NoviaLabs",
                    },
                ]}
            />
        ),
        usage: `<TestimonialCarousel items={[{ quote, name, role, avatar? }, ...]} intervalMs={5500} />`,
        notes:
            "intervalMs={0} disabilita l'auto-advance. La regione è focusabile (tabIndex 0) e si pausa quando ha focus. Il min-height 140px evita layout shift quando il quote varia.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <TestimonialCarousel> con auto-advance + pause-on-hover.
Type:
- Testimonial = { quote: string; name: string; role?: string; avatar?: string }
Props:
- items: Testimonial[].
- intervalMs?: number (default 5500, 0 = disabilita).
- className?: string.

Implementazione:
- "use client".
- useState per idx + paused. setInterval(idx → (idx+1) % len), clearInterval su unmount/paused.
- onMouseEnter/Leave + onFocus/Blur per togglare paused.
- Keyboard: ArrowLeft/Right su window, attivi solo se focus interno.
- Render: stack di <article> absolute inset-0 con opacity 0/100 transition 500ms ease-out. min-height 140px sul wrapper per non far saltare.
- Dot indicators: barre 1.5px (active = 6px wide bg-fg, others 1.5px wide bg-border-strong).
- Quote icon Lucide a header, footer con avatar (img o iniziale).

Output: file completo src/components/testimonial-carousel.tsx.`,
    },
    {
        slug: "command-palette",
        name: "Command Palette",
        summary: "Cmd+K launcher con fuzzy filter, gruppi, navigazione tastiera e portal.",
        tagline:
            "Modal portal-rendered, hotkey Cmd/Ctrl+K, ↑/↓/Enter/Esc, raggruppamento per `group`, filtro fuzzy su label/hint/keywords/group. Zero dipendenze (no @radix dialog). Power-user signal.",
        status: "live",
        icon: Command,
        isNew: true,
        tags: ["Power User", "Search", "Modal", "Client"],
        dependencies: ["tailwind-merge", "clsx", "lucide-react"],
        requires: ["@/lib/utils#cn", "react-dom (portal)"],
        sourcePath: "src/components/command-palette.tsx",
        preview: () => <CommandPalettePreview />,
        usage: `<CommandPalette\n  items={[{ id, label, group?, hint?, icon?, onSelect }]}\n  triggerKey="k"\n/>`,
        notes:
            "Il portal renderizza solo client-side (controllo typeof document !== \"undefined\"). triggerKey è case-insensitive. Per nascondere il trigger e aprire programmaticamente, usa showTrigger={false} e gestisci open via ref/parent state.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <CommandPalette> Cmd+K.
Type:
- CommandItem = { id, label, hint?, icon?, group?, keywords?, onSelect: () => void }
Props:
- items: CommandItem[].
- triggerKey?: string (default "k").
- placeholder?: string.
- showTrigger?: boolean (default true).
- className?: string.

Implementazione:
- "use client".
- useEffect window keydown: meta+triggerKey → toggle open, Esc → close.
- Modal via createPortal(document.body), backdrop con backdrop-blur-sm + bg color-mix.
- Input di ricerca focused on open. Filtro fuzzy: includes su label+hint+group+keywords.
- Gruppi: Map<string, CommandItem[]>, sticky header per ogni gruppo.
- Keyboard: ArrowUp/Down su flat index, Enter chiama onSelect + close.
- Active item highlighted, scrollIntoView({ block: "nearest" }).
- Footer con kbd hint (↑↓ nav · ↵ apri) e count risultati.

Output: file completo src/components/command-palette.tsx.`,
    },
    {
        slug: "ai-chat-bubble",
        name: "AI Chat Bubble",
        summary: "Bolla messaggio production-grade per app AI: streaming-aware, markdown safe, copia su hover.",
        tagline:
            "Render Markdown via react-markdown + remark-gfm con safe-fence per stream incompleti (chiude automaticamente ``` lasciate aperte mid-stream). Caret blinkante quando streaming=true. Tre varianti: user (right, dense), assistant (border + bg-alt), system (pill).",
        status: "live",
        icon: MessageSquare,
        isNew: true,
        tags: ["AI", "Chat", "Streaming", "Markdown", "Client"],
        dependencies: ["react-markdown", "remark-gfm", "lucide-react", "tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn", "@/components/copy-button"],
        sourcePath: "src/components/ai-chat-bubble.tsx",
        preview: () => (
            <div className="flex flex-col gap-3">
                <AiChatBubble role="user">Come gestisco il caching di Next.js 16?</AiChatBubble>
                <AiChatBubble role="assistant">{`Ottima domanda. **Next 16** abbandona il caching aggressivo by-default. Le opzioni:\n\n- \`fetch(url, { cache: "force-cache" })\` per opt-in\n- \`unstable_cache()\` per dati custom`}</AiChatBubble>
                <AiChatBubble role="assistant" streaming>
                    {"Sto pensando alla risposta su React 19 actions"}
                </AiChatBubble>
            </div>
        ),
        usage: `<AiChatBubble role="assistant" streaming={isStreaming}>\n  {assistantText}\n</AiChatBubble>`,
        notes:
            "Durante lo streaming il caret blinka e i code-block restano in classe pre default (zero highlighting per evitare flashing mentre il linguaggio viene rilevato). Dopo lo stream, lo stesso contenuto re-renderizza normale. useTypewriter è esportato come helper per simulare streaming da una stringa.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <AiChatBubble> production-grade per chat con LLM.
Type:
- AiChatBubbleRole = "user" | "assistant" | "system"
Props:
- role: AiChatBubbleRole.
- children: string | ReactNode (string = markdown).
- streaming?: boolean.
- avatar?: ReactNode.
- timestamp?: string.
- showCopy?: boolean (default true).
- className?: string.

Implementazione:
- "use client", react-markdown + remark-gfm.
- system → pill centrato, niente avatar.
- user → flex-row-reverse, bubble bg-fg text-bg, rounded-br-[4px].
- assistant → bubble border-border bg-bg-alt, rounded-bl-[4px], CopyButton on hover (se !streaming && string).
- Streaming caret: span animato con keyframe ai-caret-blink (50% opacity 0).
- Markdown safe-fence: se streaming && (count("\`\`\`")) % 2 === 1 → append "\\n\`\`\`" per chiudere il fence rotto.
- prose styling per markdown via classi prose prose-sm + tweaks code/pre.
- Esporta useTypewriter(target, charsPerSec) per simulare streaming.

Output: file completo src/components/ai-chat-bubble.tsx.`,
    },
    {
        slug: "ai-prompt-input",
        name: "AI Prompt Input",
        summary: "Input chat moderno: textarea auto-grow, attachments, slash commands, send/stop morphing.",
        tagline:
            "La forma Claude/ChatGPT 2026 — multi-line auto-grow, Enter invia / Shift+Enter va a capo, slash menu sopra l'input quando inizi con \"/\", file picker, send button che diventa stop quando busy.",
        status: "live",
        icon: PenLine,
        isNew: true,
        tags: ["AI", "Chat", "Input", "Form", "Client"],
        dependencies: ["lucide-react", "tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/ai-prompt-input.tsx",
        preview: () => <AiPromptInputPreview />,
        usage: `<AiPromptInput\n  busy={isStreaming}\n  onSubmit={(value, attachments) => sendToAgent(value, attachments)}\n  onStop={() => abort()}\n  slashCommands={[{ id, label: "/help", insert: "/help", hint }]}\n/>`,
        notes:
            "Auto-grow è cap-pato a maxHeight (default 220px) e poi diventa scroll interno. Le slash commands accettano qualsiasi stringa di insert (non deve iniziare con /). Send è disabilitato finché value e attachments sono vuoti.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <AiPromptInput> per chat AI moderna (forma Claude/ChatGPT).
Type:
- AiPromptInputAttachment = { id; name; size? }
- AiSlashCommand = { id; label; insert; hint? }
Props:
- placeholder?: string.
- initialValue?: string.
- busy?: boolean.
- onSubmit: (value: string, attachments: AiPromptInputAttachment[]) => void.
- onStop?: () => void.
- slashCommands?: AiSlashCommand[].
- allowAttach?: boolean (default true).
- leftToolbar?: ReactNode.
- maxHeight?: number (default 220).
- className?: string.

Implementazione:
- "use client", textarea auto-grow (height auto → scrollHeight cap maxHeight).
- Enter (no shift) invia, Shift+Enter newline.
- Slash menu: visibile se value.startsWith("/") && commands.length > 0; ArrowUp/Down nav, Tab/Enter inserisce, Esc chiude.
- Attachments row sopra il textarea quando ci sono, ognuna con button X.
- File picker hidden + button Paperclip.
- Footer con kbd hint (↵ invia · ⇧↵ a capo).
- Send button: ArrowUp icon. Quando busy && onStop: button morph a Square fill (interrompi).

Output: file completo src/components/ai-prompt-input.tsx.`,
    },
    {
        slug: "ai-tool-call-card",
        name: "AI Tool Call Card",
        summary: "La card \"Searching the web…\" che ChatGPT/Claude/Cursor mostrano durante un tool call.",
        tagline:
            "Tre stati: running (loader spin), success (check verde), error (alert rosso + tinta). Header sempre visibile, input/output expandable, auto-collapse on success. Pure CSS animations.",
        status: "live",
        icon: Wrench,
        isNew: true,
        tags: ["AI", "Status", "Card", "Client"],
        dependencies: ["lucide-react", "tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/ai-tool-call-card.tsx",
        preview: () => (
            <div className="flex flex-col gap-3">
                <AiToolCallCard
                    tool="search_web"
                    status="running"
                    label={'Sto cercando "Next.js 16 caching"'}
                    input={{ query: "Next.js 16 caching" }}
                />
                <AiToolCallCard
                    tool="read_file"
                    status="success"
                    label="Letto src/app/page.tsx"
                    input={{ path: "src/app/page.tsx" }}
                    output={"// 320 righe lette\nexport default function Page() {…}"}
                />
                <AiToolCallCard
                    tool="run_tests"
                    status="error"
                    label="2 test falliti su 14"
                    input={{ pattern: "tests/**" }}
                    output={"FAIL  tests/login.test.ts\n  · invalid credentials\n  · session timeout"}
                />
            </div>
        ),
        usage: `<AiToolCallCard\n  tool="search_web"\n  status="running"\n  label="Sto cercando…"\n  input={{ query }}\n  output={result}\n/>`,
        notes:
            "collapseOnSuccess=true (default) chiude automaticamente l'expandable quando lo status passa da running → success. L'output renderizza JSON.stringify per oggetti, verbatim per stringhe. Su error la card prende un tinta rossa.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <AiToolCallCard> per visualizzare un tool call di un agent.
Type:
- AiToolCallStatus = "running" | "success" | "error"
Props:
- tool: string (es. "search_web").
- status: AiToolCallStatus.
- label?: string (verbo descrittivo).
- input?: unknown.
- output?: unknown.
- icon?: ReactNode (default Wrench).
- collapseOnSuccess?: boolean (default true).
- className?: string.

Implementazione:
- "use client", useState(open) inizializzato a status !== "success" || !collapseOnSuccess.
- Wrapper con border + bg-bg-alt; tinta rossa per error (border red-500/40, bg red-500/5).
- Header button toggle: icon (Wrench/custom), tool name (mono 12px), status verb (mono 10.5px), spinner Loader2 (animate-spin) per running, Check verde per success, AlertCircle red per error.
- Body expandable: 2 pane (input, output) con label mono 10px + <pre> testo formattato (JSON.stringify per oggetti, verbatim per stringhe), max-h 44 con scroll.
- Output dim quando status === "running" (placeholder "(in attesa…)").

Output: file completo src/components/ai-tool-call-card.tsx.`,
    },
    {
        slug: "rainbow-button",
        name: "Rainbow Button",
        summary: "Bottone neutro su un alone arcobaleno animato. Buono per CTA prima visita, niente di più.",
        tagline:
            "Faccia sobria sopra un conic-gradient ruotante a 6s. L'effetto vive su un layer blurred dietro il pulsante, niente JS per frame.",
        status: "live",
        icon: Wand2,
        isNew: true,
        tags: ["Button", "Effect", "Client"],
        dependencies: ["lucide-react", "tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/rainbow-button.tsx",
        preview: () => <RainbowButtonShowcase />,
        usage: `<RainbowButton onClick={...}>Inizia ora</RainbowButton>`,
        notes:
            "Min-height 44px per touch. Press utility per il feedback. La rotazione è pura CSS — il global guard di prefers-reduced-motion la collassa automaticamente.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <RainbowButton> CTA.
Type:
- RainbowButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; className?: string }

Implementazione:
- "use client" non necessario (pure CSS).
- Bottone rounded-full, min-h-[44px] px-5 py-2, border border-border-strong bg-bg-alt text-fg, classe press.
- Pseudo-layer in absolute -inset-[2px] -z-10 con conic-gradient di 5 stop (red-500, amber-500, emerald-500, blue-500, violet-500), filter blur(10px), opacity 0.55, animation rainbow-rotate 6s linear infinite (@keyframes da definire inline via <style>).
- Sotto al gradient un secondo span absolute inset-0 -z-10 rounded-full bg-bg-alt che fa da maschera per dare l'effetto "alone esterno".

Output: file completo src/components/rainbow-button.tsx.`,
    },
    {
        slug: "shimmer-button",
        name: "Shimmer Button",
        summary: "Pillola scura con cometa che corre sul bordo. La versione bottone della BorderBeam.",
        tagline:
            "Single shimmer su offset-path attorno al perimetro a 4s. Background invertito (text-bg su bg-fg), il bordo è il ring del comet.",
        status: "live",
        icon: Sparkles,
        isNew: true,
        tags: ["Button", "Effect", "Client"],
        dependencies: ["lucide-react", "tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/shimmer-button.tsx",
        preview: () => <ShimmerButtonShowcase />,
        usage: `<ShimmerButton shimmerColor="var(--accent)" shimmerDuration="4s">Get Started</ShimmerButton>`,
        notes:
            "Il comet vive su offset-path: rect(...) e quindi rispetta esattamente il border-radius. Usa CSS Motion Path (Chrome 116+, Safari 16+, Firefox 122+).",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <ShimmerButton>: pillola con cometa shimmer sul bordo.
Props:
- children: ReactNode.
- shimmerColor?: string (default "var(--accent)").
- shimmerDuration?: string (default "4s").
- background?: string (default "var(--fg)").
- borderRadius?: number (default 999).
- className?: string + ...rest button props.

Implementazione:
- "use client" + classe press, min-h-[44px], px-5 py-2.
- Pseudo-layer absolute -z-10 con offset-path rect(0 100% 100% 0 round Npx), aspect-ratio 1, width 22%, linear-gradient transparent → shimmerColor → transparent, blur 6px.
- Inset bg per nascondere il riempimento e tenere solo il ring effect.

Output: file completo src/components/shimmer-button.tsx.`,
    },
    {
        slug: "ripple-button",
        name: "Ripple Button",
        summary: "Onde Material-style al click. Nessuna libreria, solo span injettati con animazione CSS.",
        tagline:
            "Calcola posizione click → injetta span scale 0→4 + opacity 0.4→0 in 600ms, rimuove on animationEnd. Lista ripples in stato React.",
        status: "live",
        icon: MousePointer2,
        isNew: true,
        tags: ["Button", "Interaction", "Client"],
        dependencies: ["lucide-react", "tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/ripple-button.tsx",
        preview: () => <RippleButtonShowcase />,
        usage: `<RippleButton onClick={handler}>Cliccami</RippleButton>`,
        notes:
            "rippleColor di default usa currentColor: si fonde col text del bottone. Cleanup automatico dopo onAnimationEnd, niente leak di nodi.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <RippleButton> con ripples Material-style.
Type:
- Ripple = { id; x; y; size }
Props:
- children: ReactNode.
- rippleColor?: string (default currentColor).
- className?: string + ...rest button props.

Implementazione:
- "use client". useState<Ripple[]>, useRef<number> per id incrementale.
- onClick: leggi getBoundingClientRect, size = max(width, height) * 2, x/y in coordinate locali, push nello state.
- Per ogni ripple, render span absolute rounded-full con keyframe ripple-button-fade (scale 0 → 4, opacity 0.4 → 0) in 600ms var(--ease-out) forwards.
- onAnimationEnd su ogni span rimuove dallo state.

Output: file completo src/components/ripple-button.tsx.`,
    },
    {
        slug: "shiny-button",
        name: "Shiny Button",
        summary: "CTA solido invertito con sweep diagonale glossy on hover. Solo CSS.",
        tagline:
            "::before (span absolute) con linear-gradient diagonale, translateX -100% → 150% on hover. Gated a hover:hover and pointer:fine.",
        status: "live",
        icon: Zap,
        isNew: true,
        tags: ["Button", "Hover", "CSS"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/shiny-button.tsx",
        preview: () => <ShinyButtonShowcase />,
        usage: `<ShinyButton>Vedi Demo</ShinyButton>`,
        notes:
            "Niente JS, niente state. Lo sweep è gated a fine pointer per non rimanere appiccicato sui touch device.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <ShinyButton>: bottone solid con sweep diagonale on hover.
Props:
- children: ReactNode.
- className?: string + ...rest button props.

Implementazione:
- Server component (no "use client"). Classe press, min-h-[44px], rounded-md, bg-fg text-bg, border border-border-strong.
- Span ::before (assoluto) -left-[60%] w-[60%] inset-y-0 con linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%).
- @media (hover: hover) and (pointer: fine) → on hover translateX(150%), transition 1200ms var(--ease-in-out).

Output: file completo src/components/shiny-button.tsx.`,
    },
    {
        slug: "pulsating-button",
        name: "Pulsating Button",
        summary: "CTA solido con due ring concentrici che pulsano fuori. Beacon sobrio per l'azione primaria.",
        tagline:
            "Due pseudo-layer scale 1→1.6 + opacity 0.55→0 in 1.6s, sfasati di metà ciclo. Tutto CSS.",
        status: "live",
        icon: CircleDot,
        isNew: true,
        tags: ["Button", "Animation", "CSS"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/pulsating-button.tsx",
        preview: () => <PulsatingButtonShowcase />,
        usage: `<PulsatingButton pulseColor="var(--accent)" duration="1.6s">Iscriviti</PulsatingButton>`,
        notes:
            "I due ring sono sfasati con animationDelay calc(duration/-2). Il global reduced-motion guard collassa il pulse a 0 frame.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <PulsatingButton>: CTA con doppio ring pulsante.
Props:
- children: ReactNode.
- pulseColor?: string (default "var(--accent)").
- duration?: string (default "1.6s").
- className?: string + ...rest.

Implementazione:
- Server component, classe press, rounded-full, min-h-[44px], px-6, bg-accent text-accent-fg.
- Due span absolute inset-0 -z-10 rounded-full bg pulseColor con keyframe pulsating-button-ring (scale 1→1.6, opacity 0.55→0) duration var(--ease-out) infinite.
- Secondo span: animationDelay calc(\${duration} / -2) per sfasarli.

Output: file completo src/components/pulsating-button.tsx.`,
    },
    {
        slug: "interactive-hover-button",
        name: "Interactive Hover Button",
        summary: "Due stati: a riposo dot + label, on hover il dot riempie e una nuova label appare con freccia.",
        tagline:
            "Hover-only, gated a fine pointer. Niente JS, solo transform + opacity sui due layer di label.",
        status: "live",
        icon: Pointer,
        isNew: true,
        tags: ["Button", "Hover", "CSS"],
        dependencies: ["lucide-react", "tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/interactive-hover-button.tsx",
        preview: () => <InteractiveHoverButtonShowcase />,
        usage: `<InteractiveHoverButton hoverText="Avvia">Get Started</InteractiveHoverButton>`,
        notes:
            "Sui touch device l'effetto è gated, quindi vedrai solo lo stato a riposo. Il bottone resta accessibile (label fissa, aria-label opzionale).",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <InteractiveHoverButton>: bottone two-state con dot che si espande on hover.
Props:
- children: ReactNode (label a riposo).
- hoverText?: ReactNode (default = children).
- className?: string + ...rest.

Implementazione:
- Server component. Classe press, rounded-full, min-h-[44px], px-5 py-2, border border-border-strong bg-bg-alt text-fg.
- Span dot absolute left-3 top-1/2 size-1.5 rounded-full bg-accent.
- Span "rest" label, span "hover" label absolute con freccia ArrowRight.
- @media (hover: hover) and (pointer: fine): on hover scale(120) sul dot, translateX rest → 140%, hover → 0, opacity swap. Transition 380ms var(--ease-out).

Output: file completo src/components/interactive-hover-button.tsx.`,
    },
    {
        slug: "aurora-text",
        name: "Aurora Text",
        summary: "Gradient aurora iridescente sul testo. background-clip: text + animazione background-position.",
        tagline:
            "4 stop personalizzabili, ciclo di 6s default. Pure CSS, zero JS, peso ~0kb runtime.",
        status: "live",
        icon: Sparkles,
        isNew: true,
        tags: ["Text", "Animation", "CSS"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/aurora-text.tsx",
        preview: () => <AuroraTextShowcase />,
        usage: `<AuroraText speed={6}>Esempio</AuroraText>`,
        notes:
            "Il colore viene applicato via gradient + WebkitTextFillColor transparent. Eredita font-size dal genitore.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <AuroraText> con gradient aurora animato.
Props:
- children: ReactNode.
- colors?: string[] (default 4 stop iridescenti).
- speed?: number (secondi, default 6).
- className?: string.

Implementazione:
- Server component (no "use client").
- Style inline con backgroundImage linear-gradient(110deg, ...colors), backgroundSize "200% auto", backgroundClip text, color transparent, animation aurora-text-shift {speed}s linear infinite.
- @keyframes aurora-text-shift definito inline via <style>.

Output: file completo src/components/aurora-text.tsx.`,
    },
    {
        slug: "typing-animation",
        name: "Typing Animation",
        summary: "Typewriter classico con caret blinking. Quando finisce, il caret resta fermo.",
        tagline:
            "useEffect + setInterval. Tag personalizzabile (h1/h2/h3/p/span). Caret 1px su animation steps(2).",
        status: "live",
        icon: Type,
        isNew: true,
        tags: ["Text", "Typewriter", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/typing-animation.tsx",
        preview: () => <TypingAnimationShowcase />,
        usage: `<TypingAnimation text="Hello, world." duration={50} />`,
        notes:
            "Cleanup completo su unmount (clearTimeout + clearInterval). Il blinking si ferma quando shown.length === text.length.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <TypingAnimation> typewriter.
Props:
- text: string.
- duration?: number (ms per char, default 50).
- delay?: number (ms prima di iniziare, default 0).
- as?: "h1"|"h2"|"h3"|"p"|"span" (default "p").
- className?: string.

Implementazione:
- "use client". useState shown + done. useEffect: setTimeout(delay) → setInterval(duration) che incrementa l'indice e fa setShown(text.slice(0, i)).
- Caret span animato con keyframe typing-caret-blink (50% opacity 0). Disabilita animation quando done.
- Cleanup: clearTimeout + clearInterval.

Output: file completo src/components/typing-animation.tsx.`,
    },
    {
        slug: "hyper-text",
        name: "Hyper Text",
        summary: "Caratteri scramble in glifi random prima di sistemarsi sulla parola finale, da sinistra a destra.",
        tagline:
            "Mr Robot–style. requestAnimationFrame + progress 0→1, settled = floor(progress * length). Re-trigger on hover.",
        status: "live",
        icon: Shuffle,
        isNew: true,
        tags: ["Text", "Scramble", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/hyper-text.tsx",
        preview: () => <HyperTextShowcase />,
        usage: `<HyperText animateOnHover duration={800}>HELLO WORLD</HyperText>`,
        notes:
            "Glifi presi da [A-Z]. Spazi non vengono scrambled. Re-runna ad ogni pointerEnter se animateOnHover (default true).",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <HyperText> Mr Robot–style scramble.
Props:
- children: string.
- duration?: number (ms totali, default 800).
- as?: "h1"|"h2"|"h3"|"p"|"span" (default "p").
- animateOnHover?: boolean (default true).
- className?: string.

Implementazione:
- "use client". useState<string[]> per il display, useRef<number | null> per l'rAF id.
- run(): cancelAnimationFrame, performance.now() come start, tick(now) calcola progress 0→1, settled = floor(progress * length). Per ogni char: se i < settled o ch === " " → final, altrimenti random uppercase.
- Trigger su mount + onPointerEnter se animateOnHover.

Output: file completo src/components/hyper-text.tsx.`,
    },
    {
        slug: "word-rotate",
        name: "Word Rotate",
        summary: "Cicla un array di parole con translateY + opacity + blur. Inherit del font dal parent.",
        tagline:
            "useState + useEffect setInterval. Pure CSS keyframe per l'enter, niente exit (sostituzione diretta).",
        status: "live",
        icon: RotateCcw,
        isNew: true,
        tags: ["Text", "Rotate", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/word-rotate.tsx",
        preview: () => <WordRotateShowcase />,
        usage: `<WordRotate words={["a", "b", "c"]} duration={2500} />`,
        notes:
            "Wrapper inline-block con overflow-hidden per evitare reflow durante l'enter. Min duration 800ms per evitare flicker.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <WordRotate> per ciclare parole.
Props:
- words: string[].
- duration?: number (ms per parola, default 2500).
- className?: string.

Implementazione:
- "use client". useState<number> index. useEffect: setInterval che fa setIndex(i => (i+1) % words.length).
- Wrapper inline-block overflow-hidden align-baseline.
- Span chiave key={index} con animation word-rotate-in 380ms var(--ease-out) both. Keyframe da 0% (translateY 0.6em, opacity 0, blur 2px) a 100% normale.

Output: file completo src/components/word-rotate.tsx.`,
    },
    {
        slug: "sparkles-text",
        name: "Sparkles Text",
        summary: "Testo con sparkle SVG (stelle a 4 punte) che spawn-ano e si dissolvono attorno.",
        tagline:
            "Pool fisso di sparkle attivi (default 8) con position random. Pure CSS scale + opacity, JS solo per spawn.",
        status: "live",
        icon: Sparkles,
        isNew: true,
        tags: ["Text", "Effect", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/sparkles-text.tsx",
        preview: () => <SparklesTextShowcase />,
        usage: `<SparklesText sparklesCount={8}>Magic</SparklesText>`,
        notes:
            "Sparkle pool refresh ogni 600ms con un solo update random — niente flash sincronizzati. Posizioni in % per essere responsive.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <SparklesText> con stelline a 4 punte.
Type:
- Sparkle = { id; x; y; size; color; delay; lifetime }
Props:
- children: ReactNode.
- sparklesCount?: number (default 8).
- colors?: { first?: string; second?: string }.
- className?: string.

Implementazione:
- "use client". useState<Sparkle[]>, useRef<number> per id.
- useEffect mount: crea N sparkles random (x/y in 0–100%, size 6–16, lifetime 1100–1700ms).
- setInterval(600ms): re-create UNO sparkle random nel pool.
- Render: span relative inline-block, span absolute pointer-events-none con SVG path stella su animation sparkles-text-pop (scale 0→1→0, rotate 0→180deg).

Output: file completo src/components/sparkles-text.tsx.`,
    },
    {
        slug: "morphing-text",
        name: "Morphing Text",
        summary: "Due layer di testo si morfano (blur + opacity + translate) tra una stringa e l'altra.",
        tagline:
            "Riserva spazio col più lungo (invisible spacer), absolute layer animato sopra. useState index + setInterval.",
        status: "live",
        icon: BookOpen,
        isNew: true,
        tags: ["Text", "Morph", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/morphing-text.tsx",
        preview: () => <MorphingTextShowcase />,
        usage: `<MorphingText texts={["a", "b", "c"]} duration={2500} />`,
        notes:
            "Lo spacer invisibile garantisce che il box non collassi quando un testo è più corto. Min duration 900ms.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <MorphingText> per cross-fade morph tra stringhe.
Props:
- texts: string[].
- duration?: number (ms per ciclo, default 2500).
- className?: string.

Implementazione:
- "use client". useState<number> index, useEffect setInterval.
- Wrapper relative inline-block. Span invisibile col testo più lungo come spacer.
- Span absolute inset-0 chiave key={index} con keyframe morphing-text-in (opacity 0→1, blur 8px→0, translateY 6px→0, scale 0.98→1) 700ms var(--ease-in-out) both.

Output: file completo src/components/morphing-text.tsx.`,
    },
    {
        slug: "line-shadow-text",
        name: "Line Shadow Text",
        summary: "Headline con ombra fatta di striscioline diagonali, in stile editorial poster.",
        tagline:
            "data-text + ::before con attr(data-text), background-image repeating-linear-gradient(-45deg) clip-path text. Zero JS.",
        status: "live",
        icon: Heading1,
        isNew: true,
        tags: ["Text", "Shadow", "CSS"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/line-shadow-text.tsx",
        preview: () => <LineShadowTextShowcase />,
        usage: `<LineShadowText shadowColor="var(--fg-muted)">Hello</LineShadowText>`,
        notes:
            "Lo shadow è translate(2px, 4px) e usa background-clip: text + WebkitTextFillColor transparent per vedere solo la trama tra le lettere.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <LineShadowText> headline con ombra a strisce diagonali.
Props:
- children: string.
- as?: "h1"|"h2"|"h3"|"span" (default "h1").
- shadowColor?: string (default "var(--fg-muted)").
- className?: string.

Implementazione:
- Server component. Tag con data-text={children}, classe line-shadow-text + className utente.
- <style> inline: .line-shadow-text { position: relative; isolation: isolate; }, ::before { content: attr(data-text); inset: 0; transform: translate(2px, 4px); background-image: repeating-linear-gradient(-45deg, var(--lst-shadow) 0 1px, transparent 1px 4px); background-clip: text; color: transparent; z-index: -1; }
- CSS var --lst-shadow impostata via inline style.

Output: file completo src/components/line-shadow-text.tsx.`,
    },
    {
        slug: "text-reveal",
        name: "Text Reveal",
        summary: "Testo lungo si illumina parola-per-parola mentre scrolli sul container. fg-soft → fg.",
        tagline:
            "Listener scroll passive. Calcola progress in base alla posizione del rect rispetto al viewport. Niente IntersectionObserver.",
        status: "live",
        icon: ScrollText,
        isNew: true,
        tags: ["Text", "Scroll", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/text-reveal.tsx",
        preview: () => <TextRevealShowcase />,
        usage: `<TextReveal>Long form text che si illumina con lo scroll della pagina.</TextReveal>`,
        notes:
            "Funziona meglio in un blocco di testo lungo (almeno 30+ parole) e richiede che il container abbia altezza maggiore del viewport perché il progress si veda.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <TextReveal> word-by-word reveal su scroll.
Props:
- children: string.
- className?: string.

Implementazione:
- "use client". useRef<HTMLParagraphElement>, useState<number> progress 0–1.
- useEffect: handler scroll passive che legge getBoundingClientRect → calcola t = (rect.top - end) / (start - end), progress = clamp(0, 1, 1 - t). Anche listener resize.
- words = children.split(/\\s+/). reachedIndex = floor(progress * words.length).
- Render <p ref={ref}>: per ogni word, span con color = lit ? var(--fg) : var(--fg-soft), transition-colors duration-300 var(--ease-out).

Output: file completo src/components/text-reveal.tsx.`,
    },
    {
        slug: "dot-pattern",
        name: "Dot Pattern",
        summary: "Background a griglia di pallini, SVG pattern crisp a qualsiasi zoom.",
        tagline:
            "Pure SVG <pattern> + <rect>. Server component con useId() di React 19. Opzionale glow mask radiale.",
        status: "live",
        icon: Grid3X3,
        isNew: true,
        tags: ["Background", "Pattern"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/dot-pattern.tsx",
        preview: () => <DotPatternShowcase />,
        usage: `<div className="relative">\n  <DotPattern glow />\n</div>`,
        notes:
            "useId() garantisce stable ID server/client. Con glow=true applica mask-image radial gradient per fade verso i bordi.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <DotPattern> SVG dotted-grid.
Props:
- width?: number (default 16), height?: number (default 16).
- cx?: number (default 1), cy?: number (default 1), cr?: number (default 1).
- glow?: boolean (default false).
- className?: string.

Implementazione:
- Server component. import { useId } from "react".
- <svg aria-hidden absolute inset-0 h-full w-full text-fg-soft/40>: <defs><pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse"><circle cx cy r fill="currentColor"/></pattern></defs><rect 100% fill={url(#id)}/>.
- Se glow → classe [mask-image:radial-gradient(closest-side_at_center,black,transparent)].

Output: file completo src/components/dot-pattern.tsx.`,
    },
    {
        slug: "grid-pattern",
        name: "Grid Pattern",
        summary: "Background a griglia di linee, SVG pattern. Opzionalmente accende celle specifiche.",
        tagline:
            "Pattern <path d='M.5 H V.5'/>. Prop squares: [col, row][] tinge le celle scelte con currentColor opacity 0.12.",
        status: "live",
        icon: LayoutGrid,
        isNew: true,
        tags: ["Background", "Pattern"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/grid-pattern.tsx",
        preview: () => <GridPatternShowcase />,
        usage: `<GridPattern squares={[[1,2],[3,4]]} strokeDasharray="4 2" />`,
        notes:
            "Le celle highlightate sono rect renderizzati DOPO il pattern, quindi sopra la griglia ma sotto il content. strokeDasharray utile per pattern punteggiati.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <GridPattern> SVG line-grid.
Props:
- width?: number, height?: number, x?, y?.
- strokeDasharray?: string.
- squares?: [number, number][] (cells da accendere).
- className?: string.

Implementazione:
- Server component, useId().
- <svg absolute inset-0 text-border> con <pattern id={id}><path d="M.5 {height}V.5H{width}" stroke="currentColor" fill="none" strokeDasharray={strokeDasharray}/></pattern> + <rect fill="url(#id)"/>.
- squares?.map(([col, row], i) → <rect x={col*width+1} y={row*height+1} width={width-1} height={height-1} fill="currentColor" opacity={0.12}/>).

Output: file completo src/components/grid-pattern.tsx.`,
    },
    {
        slug: "animated-grid-pattern",
        name: "Animated Grid Pattern",
        summary: "Stessa griglia di GridPattern, ma celle random si accendono e dissolvono in loop.",
        tagline:
            "ResizeObserver per cols/rows. Pool di N celle, ognuna con animation fade infinita. Refresh casuale ogni duration secondi.",
        status: "live",
        icon: Sparkles,
        isNew: true,
        tags: ["Background", "Pattern", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/animated-grid-pattern.tsx",
        preview: () => <AnimatedGridPatternShowcase />,
        usage: `<AnimatedGridPattern numSquares={50} maxOpacity={0.3} duration={4} />`,
        notes:
            "Solo JS è il calcolo dei cols/rows — l'animazione è pura CSS infinite, quindi nessun overhead per frame.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <AnimatedGridPattern> con celle random che si accendono.
Type:
- Square = { id; pos:[col,row]; delay }
Props:
- width?, height?, numSquares?: number (default 50), maxOpacity?: number (default 0.3), duration?: number (default 4), className?.

Implementazione:
- "use client". useId(), useRef<number> id counter, useState<{w,h}> via ResizeObserver, useState<Square[]>.
- Quando dimensioni cambiano: cols/rows da Math.ceil(size/cell), riempi pool numSquares con pos random, delay random 0..duration.
- setInterval(duration*1000): per ogni square 30% chance di rigenerare.
- @keyframes animated-grid-pattern-fade: 0%/100% opacity 0, 50% opacity var(--agp-max).
- Render <svg> + <rect> animati.

Output: file completo src/components/animated-grid-pattern.tsx.`,
    },
    {
        slug: "retro-grid",
        name: "Retro Grid",
        summary: "Griglia synthwave anni 80 in prospettiva verso l'orizzonte. CSS perspective + rotateX.",
        tagline:
            "Server component, animazione background-position infinita. Linee chiare/scure separate, gradient overlay verso bg.",
        status: "live",
        icon: Activity,
        isNew: true,
        tags: ["Background", "Retro"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/retro-grid.tsx",
        preview: () => <RetroGridShowcase />,
        usage: `<RetroGrid angle={65} cellSize={60} />`,
        notes:
            "L'illusione della profondità nasce dalle perspective:200px + rotateX(65deg). Il gradient bottom→bg sfuma la base.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <RetroGrid> synthwave perspective grid.
Props:
- angle?: number (deg, default 65).
- cellSize?: number (px, default 60).
- opacity?: number (default 0.5).
- lightLineColor?: string (default "var(--border-strong)").
- darkLineColor?: string (default "var(--border)").
- className?: string.

Implementazione:
- Server component. Wrapper absolute inset-0 [perspective:200px]. Inner [transform-style:preserve-3d] [transform:rotateX(var(--retro-angle))].
- Inset -y-[100%] con background-image linear-gradient orizzontale + verticale, backgroundSize var(--retro-cell), animation retro-grid-scroll 20s linear infinite.
- Gradient bottom: 0 → bg per fade.

Output: file completo src/components/retro-grid.tsx.`,
    },
    {
        slug: "flickering-grid",
        name: "Flickering Grid",
        summary: "Canvas di celle che lampeggiano random. ResizeObserver, devicePixelRatio, prefers-reduced-motion.",
        tagline:
            "Single canvas, requestAnimationFrame loop. Ogni frame ~30% delle celle ha la chance di cambiare opacity.",
        status: "live",
        icon: RefreshCw,
        isNew: true,
        tags: ["Background", "Canvas", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/flickering-grid.tsx",
        preview: () => <FlickeringGridShowcase />,
        usage: `<FlickeringGrid squareSize={4} gridGap={6} flickerChance={0.3} />`,
        notes:
            "Legge prefers-reduced-motion una volta via matchMedia. Se reduced, salta il loop dopo il primo render statico.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <FlickeringGrid> canvas-based.
Props:
- squareSize?: number (default 4), gridGap?: number (default 6).
- flickerChance?: number (default 0.3), color?: string (default "var(--fg-soft)").
- maxOpacity?: number (default 0.5), width?, height?, className?.

Implementazione:
- "use client". useRef<HTMLCanvasElement>, useRef<HTMLDivElement>.
- useEffect: leggi prefers-reduced-motion via matchMedia. Resolve color in rgb leggendo da un probe div.
- ResizeObserver: dpr-aware setup canvas, calcola cols/rows, alloca opacities array.
- Loop draw: per ogni cella, chance flicker → nuova opacity, fillRect.
- Cleanup: cancelAnimationFrame, ro.disconnect.

Output: file completo src/components/flickering-grid.tsx.`,
    },
    {
        slug: "ripple",
        name: "Ripple",
        summary: "Onde concentriche che si espandono dal centro come un sonar. Solo CSS, nessun JS.",
        tagline:
            "N cerchi assoluti centrati con scale 0.5→3 + opacity 0→max→0, sfasati di 0.4s.",
        status: "live",
        icon: Disc,
        isNew: true,
        tags: ["Background", "Sonar"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/ripple.tsx",
        preview: () => <RippleShowcase />,
        usage: `<Ripple mainCircleSize={210} numCircles={8} />`,
        notes:
            "Più cerchi = pulse più morbido. Il border-color è fg/20 quindi adatta automaticamente al tema.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <Ripple> sonar pulse.
Props:
- mainCircleSize?: number (px, default 210).
- mainCircleOpacity?: number (default 0.24).
- numCircles?: number (default 8).
- className?: string.

Implementazione:
- Server component. Wrapper absolute inset-0 overflow-hidden.
- Per ogni i in 0..numCircles-1: span absolute left-1/2 top-1/2 rounded-full border border-fg/20, size = mainCircleSize + i*60, opacity = mainCircleOpacity - i * decay.
- @keyframes ripple-expand: 0% scale 0.5 opacity 0, 20% opacity peak, 100% scale 3 opacity 0. Animation 4s var(--ease-out) infinite, delay i*0.4s.

Output: file completo src/components/ripple.tsx.`,
    },
    {
        slug: "light-rays",
        name: "Light Rays",
        summary: "Fasci di luce sottili attraversano la superficie da un'origine in alto al centro.",
        tagline:
            "Strisce con linear-gradient verso il basso, transform-origin top center. Drift ±5° su loop 9–12s.",
        status: "live",
        icon: Sun,
        isNew: true,
        tags: ["Background", "Light"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/light-rays.tsx",
        preview: () => <LightRaysShowcase />,
        usage: `<LightRays rayCount={6} rayColor="var(--accent)" />`,
        notes:
            "Filter blur 8px + opacity ridotta = fasci morbidi. Le animazioni sono sfasate via durations 9/10/11/12 alternate.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <LightRays>.
Props:
- rayCount?: number (default 6).
- rayColor?: string (default "var(--accent)").
- intensity?: number (default 0.4).
- className?: string.

Implementazione:
- Server component. Wrapper absolute inset-0 overflow-hidden.
- Per ogni ray: span absolute left-1/2 top-0 h-[150%] w-[2px], transform-origin top center, background linear-gradient to bottom rayColor → transparent, opacity intensity, blur 8px.
- baseAngle distribuito da -30° a +30°, amp ±5°, durations 9–12s alternate.
- @keyframes light-rays-drift: 0%/100% rotate(var(--lr-base)), 50% rotate(calc(var(--lr-base) + var(--lr-amp))).

Output: file completo src/components/light-rays.tsx.`,
    },
    {
        slug: "warp-background",
        name: "Warp Background",
        summary: "Effetto iperspazio: striscioline radiali che corrono dal centro verso i bordi.",
        tagline:
            "N beam ruotati 360° attorno al centro, ognuno con un gradient che scorre verso l'esterno. Pure CSS, niente perspective hack.",
        status: "live",
        icon: Tornado,
        isNew: true,
        tags: ["Background", "Effect"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/warp-background.tsx",
        preview: () => <WarpBackgroundShowcase />,
        usage: `<WarpBackground beamCount={18} beamDuration={2.4} />`,
        notes:
            "Tutto CSS — l'illusione dipende dalla perspective + transform 3D delle facce. Niente WebGL, niente canvas.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <WarpBackground> hyperspace style.
Props:
- beamCount?: number (default 18), beamLength?: number (% del raggio, default 70).
- beamSize?: number (px, default 2), beamDuration?: number (sec, default 2.4).
- beamColor?: string (default "var(--fg)"), gridColor?: string (default "var(--border)").
- showGrid?: boolean (default true), className?.

Implementazione:
- Server component. Wrapper absolute inset-0 overflow-hidden.
- Floor grid opzionale: div absolute inset-0 con backgroundImage di linear-gradient gridColor 1px e backgroundSize 40x40, opacity 0.18, mask radiale per fade verso i bordi.
- Hub al centro: div absolute left-1/2 top-1/2 h-0 w-0.
- Per ogni i in 0..beamCount-1: span absolute origin-top con rotate(360/beamCount * i deg), w {beamSize}px h {beamLength}%. Inner span con linear-gradient(to top, transparent 0%, beamColor 50%, transparent 100%), animation warp-beam-travel duration linear infinite, delay scalato.
- @keyframes warp-beam-travel: 0% translateY(0) opacity 0, 25% opacity 0.9, 100% translateY(-110%) opacity 0.

Output: file completo src/components/warp-background.tsx.`,
    },
    {
        slug: "shine-border",
        name: "Shine Border",
        summary: "Wrapper card con bordo conic-gradient che ruota lentamente attorno al contenuto.",
        tagline:
            "Layer rotante + inset bg-bg-alt che maschera tutto tranne il ring. Pure CSS, niente mask-composite.",
        status: "live",
        icon: Star,
        isNew: true,
        tags: ["Effect", "Border", "Card"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/shine-border.tsx",
        preview: () => <ShineBorderShowcase />,
        usage: `<ShineBorder borderRadius={12} duration={14}>\n  <Card>...</Card>\n</ShineBorder>`,
        notes:
            "Il color può essere singolo o array di stop. Il duration più alto = movimento più calmo, default 14s.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <ShineBorder> wrapper con bordo conic-gradient ruotante.
Props:
- borderRadius?: number (default 8), borderWidth?: number (default 1).
- duration?: number (sec, default 14).
- color?: string | string[] (default ["var(--accent)", "transparent"]).
- className?, children: ReactNode.

Implementazione:
- Server component. Wrapper relative isolate con CSS vars --shine-radius/width/duration.
- Layer rotante: span absolute inset-0 -z-10 overflow-hidden borderRadius radius. Inner span aspect-square w-200% con conic-gradient, animation shine-border-spin duration linear infinite.
- Inset mask: span absolute inset-0 -z-10 bg-bg-alt borderRadius (radius - width), margin width.

Output: file completo src/components/shine-border.tsx.`,
    },
    {
        slug: "magic-card",
        name: "Magic Card",
        summary: "Card che si illumina sotto il cursore con un radial spotlight morbido. Hover gated.",
        tagline:
            "useRef + pointermove imposta CSS vars --mx/--my. Spotlight via radial-gradient at var(--mx) var(--my). Solo fine pointer.",
        status: "live",
        icon: MousePointer2,
        isNew: true,
        tags: ["Effect", "Hover", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/magic-card.tsx",
        preview: () => <MagicCardShowcase />,
        usage: `<MagicCard gradientSize={200} gradientColor="var(--accent)">...</MagicCard>`,
        notes:
            "L'opacity peak viene applicata via @media (hover: hover) and (pointer: fine), per non rimanere visibile su mobile.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <MagicCard> spotlight follower.
Props:
- children: ReactNode.
- gradientSize?: number (default 200).
- gradientColor?: string (default "var(--accent)").
- gradientOpacity?: number (default 0.18).
- gradientFrom?, gradientTo?, className?.

Implementazione:
- "use client". useRef<HTMLDivElement>, onPointerMove imposta --mx/--my via setProperty (coordinate locali da getBoundingClientRect).
- onPointerLeave: --mx/--my = -9999px.
- Span overlay con radial-gradient(\${size}px circle at var(--mx) var(--my), var(--mc-inner)).
- @media (hover: hover) and (pointer: fine) → .magic-card-glow opacity var(--mc-opacity).

Output: file completo src/components/magic-card.tsx.`,
    },
    {
        slug: "glare-hover",
        name: "Glare Hover",
        summary: "Riflesso glossy che segue il cursore sulla card. Hover-only, gated a fine pointer.",
        tagline:
            "Span absolute con radial-gradient bianco at var(--gx) var(--gy), mix-blend-mode overlay. playOnce: sweep one-shot al ri-entry.",
        status: "live",
        icon: Sparkles,
        isNew: true,
        tags: ["Effect", "Hover", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/glare-hover.tsx",
        preview: () => <GlareHoverShowcase />,
        usage: `<GlareHover glareSize={250} glareOpacity={0.18}>...</GlareHover>`,
        notes:
            "Mix-blend-mode overlay rende l'highlight gradevole su qualsiasi sfondo. Per il sweep one-shot, classe glare-once-played con keyframe glare-sweep.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <GlareHover> con highlight follower.
Props:
- children: ReactNode.
- glareOpacity?: number (default 0.18), glareColor?: string (default "rgba(255,255,255,1)").
- glareSize?: number (default 250).
- playOnce?: boolean (default false).
- className?.

Implementazione:
- "use client". useRef + onPointerMove imposta --gx/--gy.
- onPointerEnter: se playOnce, toggle classe glare-once-played per ri-eseguire keyframe glare-sweep.
- Span overlay radial-gradient at var(--gx) var(--gy), mix-blend-mode overlay.
- @media (hover: hover) and (pointer: fine): on hover opacity → var(--glare-opacity).

Output: file completo src/components/glare-hover.tsx.`,
    },
    {
        slug: "meteors",
        name: "Meteors",
        summary: "Strisce diagonali tipo meteora che cadono dal lato superiore. Pure CSS keyframes.",
        tagline:
            "useMemo per N meteore con position/delay/duration random. ::before fa la coda gradient.",
        status: "live",
        icon: Snowflake,
        isNew: true,
        tags: ["Effect", "Background", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/meteors.tsx",
        preview: () => <MeteorsShowcase />,
        usage: `<Meteors number={20} />`,
        notes:
            "Le posizioni sono memoizzate per non rishufflate ad ogni render. La rotation 215deg dà l'angolazione classica top-right → bottom-left.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <Meteors>.
Props:
- number?: number (default 20).
- className?: string.

Implementazione:
- "use client". useMemo<{id, top, left, duration, delay}[]> di N meteore con valori random.
- Wrapper absolute inset-0 overflow-hidden.
- Per ogni meteora: span h-[2px] w-[2px] rounded-full bg-fg, ::before assoluto right-full h-[1px] w-[80px] linear-gradient-to-l from-fg to-transparent (coda).
- @keyframes meteors-fall: from translate(0,0) rotate(215deg) opacity 1 to translate(-450px, 450px) rotate(215deg) opacity 0.
- Animation 5–8s linear delay 0–4s infinite.

Output: file completo src/components/meteors.tsx.`,
    },
    {
        slug: "particles",
        name: "Particles",
        summary: "Canvas con particelle che vagano e si scostano dal cursore. ResizeObserver + DPR-aware.",
        tagline:
            "Soft repulsion con magnetism per particella. Skip animation se prefers-reduced-motion: reduce.",
        status: "live",
        icon: Cloud,
        isNew: true,
        tags: ["Background", "Canvas", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/particles.tsx",
        preview: () => <ParticlesShowcase />,
        usage: `<Particles quantity={100} staticity={50} ease={50} />`,
        notes:
            "staticity più alto = particelle più ferme. ease più alto = ritorno più lento alla posizione di origine. Color resolve via probe div per leggere il valore di --fg-soft.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <Particles> canvas drift + repulsion.
Type:
- Particle = { x, y, tx, ty, size, alpha, targetAlpha, dx, dy, magnetism }
Props:
- quantity?: number (default 100), staticity?: number (default 50), ease?: number (default 50).
- size?: number (default 0.4), color?: string (default reads --fg-soft).
- vx?: number, vy?: number, className?.

Implementazione:
- "use client". useRef<HTMLCanvasElement>, useRef<HTMLDivElement> wrapper, useRef<Particle[]>, useRef<{x,y}> mouse.
- useEffect: leggi prefers-reduced-motion. Probe div per resolve color in rgb. ResizeObserver.
- seed(): N particelle random.
- onMove: imposta mouse coords locali.
- draw loop: per ogni particella, lerp alpha, drift dx/dy + vx/vy, wrap su bordi, repulsion da mouse se dist < staticity*2, applica tx/ty con damping ease, fillRect/circle.
- Cleanup: cancelAnimationFrame, ro.disconnect.

Output: file completo src/components/particles.tsx.`,
    },
    {
        slug: "animated-theme-toggler",
        name: "Animated Theme Toggler",
        summary: "Toggle tema con wipe circolare dal punto di click. View Transitions API + fallback.",
        tagline:
            "document.startViewTransition + animate clipPath sul ::view-transition-new(root). Fallback a class swap diretto se l'API non c'è.",
        status: "live",
        icon: SunMoon,
        isNew: true,
        tags: ["Theme", "Transition", "Client"],
        dependencies: ["lucide-react", "tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/animated-theme-toggler.tsx",
        preview: () => <AnimatedThemeTogglerShowcase />,
        usage: `<AnimatedThemeToggler />`,
        notes:
            "L'API View Transitions è supportata su Chrome 111+ e Safari 18+. Sul resto fa toggle senza wipe (zero glitch visivi).",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <AnimatedThemeToggler> con wipe circolare via View Transitions API.
Props:
- className?: string + ...rest button props.

Implementazione:
- "use client". useState<boolean> isDark, useEffect mount: leggi html.dark.
- onClick: calcola click coords + radius max distanza dai 4 angoli viewport. apply = toggle + setIsDark.
- Se document.startViewTransition mancante → apply, return.
- Altrimenti: tx = startViewTransition(apply); await tx.ready; root.animate({ clipPath: [circle(0px), circle(radius)] }, { duration: 600, easing: cubic-bezier(0.23,1,0.32,1), pseudoElement: "::view-transition-new(root)" }).
- Render <button class="press"> con Lucide Sun/Moon, h-11 w-11.

Output: file completo src/components/animated-theme-toggler.tsx.`,
    },
    {
        slug: "safari-mock",
        name: "Safari Mock",
        summary: "Mock finestra Safari div-based: traffic-lights + URL pill + content slot. Niente SVG da modificare.",
        tagline:
            "Aspect ratio 1203:753 default. Slot per imageSrc, videoSrc o children custom. Token bg-bg-alt + border-border.",
        status: "live",
        icon: AppWindow,
        isNew: true,
        tags: ["Mock", "Device", "Showcase"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/safari-mock.tsx",
        preview: () => <SafariMockShowcase />,
        usage: `<SafariMock url="esempio.com" imageSrc="/preview.png" />`,
        notes:
            "Top bar 36px h-9. URL pill mono 11px text-fg-muted, max-width 60% del bar. videoSrc autoplay muted loop playsInline.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <SafariMock> div-based.
Props:
- url?: string.
- imageSrc?, videoSrc?, children?: ReactNode.
- width?: number (default 1203), height?: number (default 753).
- className?.

Implementazione:
- Server component. Wrapper relative overflow-hidden rounded-lg border border-border bg-bg-alt aspect-ratio width/height.
- Top bar h-9 border-b border-border bg-bg-alt: 3 traffic-light dots (red-500, amber-400, emerald-500), URL pill h-6 max-w-[60%] mx-auto rounded-md bg-bg font-mono 11px text-fg-muted.
- Content area absolute inset-0 top-9: video autoplay muted loop playsInline | img | children.

Output: file completo src/components/safari-mock.tsx.`,
    },
    {
        slug: "iphone-mock",
        name: "iPhone Mock",
        summary: "Frame iPhone 15 Pro: dynamic island (v2) o notch (v1) + tasti laterali volume/azione/power.",
        tagline:
            "Rounded-[3rem] outer + p-[6px] frame + bg-fg. Inner screen rounded-[2.6rem] bg-black. Tasti come thin div absolute.",
        status: "live",
        icon: Smartphone,
        isNew: true,
        tags: ["Mock", "Device", "iOS"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/iphone-mock.tsx",
        preview: () => <IphoneMockShowcase />,
        usage: `<IphoneMock variant="v2" imageSrc="/screen.png" />`,
        notes:
            "Variant v1 = notch top, v2 = dynamic island. Il frame bg-fg si inverte automaticamente in dark mode (frame chiaro su sfondo nero).",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <IphoneMock>.
Props:
- imageSrc?, videoSrc?, children?: ReactNode.
- width?: number (default 433), height?: number (default 882).
- variant?: "v1" | "v2" (default "v2").
- className?.

Implementazione:
- Server component. Wrapper relative aspect-ratio width/height.
- Frame absolute inset-0 rounded-[3rem] bg-fg p-[6px] shadow-md.
- 4 tasti laterali absolute -left-[3px] e -right-[3px]: volume up/down, action, power.
- Inner screen relative h-full overflow-hidden rounded-[2.6rem] bg-black.
- Dynamic island (v2): absolute left-1/2 top-2 h-[26px] w-[100px] -translate-x-1/2 rounded-full bg-black z-20.
- Notch (v1): absolute left-1/2 top-0 h-6 w-40 -translate-x-1/2 rounded-b-2xl bg-black z-20.
- Content: video | img | children.

Output: file completo src/components/iphone-mock.tsx.`,
    },
    {
        slug: "android-mock",
        name: "Android Mock",
        summary: "Frame Pixel-style: corner radius più stretto, punch-hole per fotocamera frontale, niente island.",
        tagline:
            "Rounded-[2rem] outer + p-[5px] + bg-fg. Tasti su -right-[3px]. Punch-hole assoluto top center bg-zinc-900.",
        status: "live",
        icon: Monitor,
        isNew: true,
        tags: ["Mock", "Device", "Android"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/android-mock.tsx",
        preview: () => <AndroidMockShowcase />,
        usage: `<AndroidMock imageSrc="/screen.png" />`,
        notes:
            "Punch-hole è un cerchietto di 12px (h-3 w-3) bg-zinc-900 ring-1 ring-zinc-800. Tasti volume e power solo sul lato destro.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <AndroidMock> Pixel-style.
Props:
- imageSrc?, videoSrc?, children?: ReactNode.
- width?: number (default 433), height?: number (default 882), className?.

Implementazione:
- Server component. Wrapper relative aspect-ratio width/height.
- Frame absolute inset-0 rounded-[2rem] bg-fg p-[5px] shadow-md.
- 2 tasti laterali absolute -right-[3px]: power + volume.
- Inner screen relative h-full overflow-hidden rounded-[1.7rem] bg-black.
- Punch-hole: absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-zinc-900 ring-1 ring-zinc-800 z-20.
- Content: video | img | children.

Output: file completo src/components/android-mock.tsx.`,
    },
    {
        slug: "terminal",
        name: "Terminal",
        summary: "Mock di una sessione zsh con traffic-lights, font mono, righe Command/Output/Typing componibili.",
        tagline:
            "Shell server component + sub-component Command/Output/Typing. Typing è un mini-typewriter dedicato.",
        status: "live",
        icon: TerminalLucide,
        isNew: true,
        tags: ["Mock", "Code", "Showcase"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/terminal.tsx",
        preview: () => <TerminalShowcase />,
        usage: `<Terminal title="zsh">\n  <TerminalCommand>npm run dev</TerminalCommand>\n  <TerminalOutput>Ready in 1.2s</TerminalOutput>\n  <TerminalTyping text="git status" />\n</Terminal>`,
        notes:
            "Bg fissato a zinc-950 per lookalike di un terminale reale, indipendente dal tema globale del sito.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera un componente <Terminal> + <TerminalCommand> / <TerminalOutput> / <TerminalTyping>.
Props Terminal:
- children: ReactNode.
- title?: string (default "zsh").
- className?: string.

Sub-components:
- TerminalCommand: <p font-mono text-emerald-400> con prefisso "$ " text-zinc-500.
- TerminalOutput: <p whitespace-pre-wrap font-mono text-zinc-400>.
- TerminalTyping ("use client"): props text, delay?, speed?. Typewriter mono con caret keyframe blink.

Implementazione:
- Terminal: shell rounded-md border border-border bg-zinc-950 text-zinc-100. Top bar h-8 border-b border-zinc-800 con 3 traffic-light dots e title mono 11px text-zinc-500.
- Body p-4 font-mono 12px space-y-1.

Output: file completo src/components/terminal.tsx con tutti i sub-component esportati.`,
    },
    {
        slug: "dock",
        name: "Dock",
        summary: "Dock macOS-style con magnification per prossimità del cursore. Componibile via DockIcon.",
        tagline:
            "Context con pointer position. Ogni DockIcon calcola distanza al cursore e lerp tra iconSize e iconMagnification.",
        status: "live",
        icon: AppWindow,
        isNew: true,
        tags: ["Navigation", "macOS", "Client"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/dock.tsx",
        preview: () => <DockShowcase />,
        usage: `<Dock iconMagnification={60} iconDistance={140}>\n  <DockIcon><Globe className="size-5"/></DockIcon>\n</Dock>`,
        notes:
            "Direction \"vertical\" allinea le icon in colonna, perfetto per side-bar mobile-first. Press utility integrata.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera <Dock> + <DockIcon> macOS-style con magnification per prossimità.
Type:
- DockContextValue = { iconSize; iconMagnification; iconDistance; pointer; direction }
Props Dock:
- children: ReactNode.
- iconSize?: number (default 40), iconMagnification?: number (default 60), iconDistance?: number (default 140).
- direction?: "horizontal"|"vertical" (default horizontal), className?.

Implementazione:
- "use client". createContext<DockContextValue>. Dock useRef + listener pointermove/pointerleave per pointer state.
- Container: bg-bg-alt/80 backdrop-blur border border-border rounded-2xl px-3 py-2 flex items-end gap-2.
- DockIcon: button "use client" press + transition w/h. Legge ctx, calcola distanza centro al pointer, lerp size.

Output: file completo src/components/dock.tsx con Dock e DockIcon esportati.`,
    },
    {
        slug: "avatar-circles",
        name: "Avatar Circles",
        summary: "Riga di avatar circolari sovrapposti + pillola \"+N\" per overflow. Server component.",
        tagline:
            "Accept urls come stringhe o {src, alt}. Ring-2 ring-bg per gap automatico chiaro/scuro.",
        status: "live",
        icon: Users,
        isNew: true,
        tags: ["Social", "List"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/avatar-circles.tsx",
        preview: () => <AvatarCirclesShowcase />,
        usage: `<AvatarCircles numPeople={42} avatarUrls={["/a.jpg", "/b.jpg"]} max={4} />`,
        notes:
            "max controlla quanti avatar prima del fallback +N. Niente next/image per restare framework-agnostic dentro il libreria.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera <AvatarCircles> riga di avatar overlap + pill +N.
Props:
- numPeople?: number (totale rappresentato).
- avatarUrls: (string | { src; alt? })[].
- max?: number (default 4).
- className?.

Implementazione:
- Server component. Helper normalize per accettare entrambe le shape.
- Visible = avatarUrls.slice(0, max).map(normalize).
- Avatar: <img> 40x40 rounded-full border-2 border-bg bg-bg-alt object-cover. Da i>0 → -ml-2.5.
- Pill +N (se overflow > 0): -ml-2.5 inline-flex h-10 w-10 rounded-full border-2 border-bg bg-bg-alt font-mono 12px text-fg-muted.

Output: file completo src/components/avatar-circles.tsx.`,
    },
    {
        slug: "orbiting-circles",
        name: "Orbiting Circles",
        summary: "Children orbitano un centro su un percorso circolare. Anello SVG opzionale come visual reference.",
        tagline:
            "Pure CSS. Outer rotate + inner counter-rotate per tenere il child verticale. Reverse opzionale.",
        status: "live",
        icon: Orbit,
        isNew: true,
        tags: ["Layout", "Animation"],
        dependencies: ["tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/orbiting-circles.tsx",
        preview: () => <OrbitingCirclesShowcase />,
        usage: `<div className="relative h-44 w-44">\n  <OrbitingCircles radius={70} duration={20}><Icon/></OrbitingCircles>\n</div>`,
        notes:
            "Il container parent deve essere relative + dimensionato. SVG path opzionale (default true) renderizza un cerchio dasharray come riferimento visivo.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera <OrbitingCircles> per orbitare children attorno al centro.
Props:
- children: ReactNode.
- className?, iconClassName?.
- radius?: number (default 80).
- duration?: number (sec, default 20).
- delay?: number (sec).
- reverse?: boolean.
- path?: boolean (default true).

Implementazione:
- Server component. CSS vars --orbit-radius/duration/delay.
- Wrapper absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center.
- Animation orbit-rotate (or reverse) duration linear delay infinite.
- @keyframes orbit-rotate: from rotate(0) translateY(-radius) rotate(0), to rotate(360) translateY(-radius) rotate(-360) (reverse rotate(-360)/rotate(360)).
- Optional SVG circle dasharray come orbit ring.

Output: file completo src/components/orbiting-circles.tsx.`,
    },
    {
        slug: "file-tree",
        name: "File Tree",
        summary: "Sidebar gerarchica file/cartelle con folder collapsable. Mono font, Lucide icons.",
        tagline:
            "Compose con <Tree>, <Folder>, <File>. Stato expanded in Set<string>, selected separato. Indent 18px per livello.",
        status: "live",
        icon: FolderLucide,
        isNew: true,
        tags: ["Code", "Sidebar", "Client"],
        dependencies: ["lucide-react", "tailwind-merge", "clsx"],
        requires: ["@/lib/utils#cn"],
        sourcePath: "src/components/file-tree.tsx",
        preview: () => <FileTreeShowcase />,
        usage: `<Tree initialExpandedItems={["src"]} initialSelectedId="page.tsx">\n  <Folder value="src" element="src">\n    <File value="page.tsx">page.tsx</File>\n  </Folder>\n</Tree>`,
        notes:
            "Per evitare collisioni: Folder e File qui sono i sub-component del file-tree, non i Lucide icon. Importa Lucide aliasati se servono nello stesso scope.",
        prompt: `${BRAND_PROMPT_PREFIX}

Genera <Tree> + <Folder> + <File> per file-tree gerarchico.
Type:
- TreeContextValue = { expanded: Set<string>; toggle; selected; select; depth }
Props Tree:
- children: ReactNode.
- initialExpandedItems?: string[].
- initialSelectedId?: string.
- className?.

Implementazione:
- "use client". createContext + useTree() hook che throw se manca.
- Tree: useState<Set<string>> expanded, useState<string|undefined> selected, toggle aggiunge/rimuove. role="tree".
- Folder props: value, element, children, className. Toggle on click. Indent depth*18px. ChevronRight rotate-90 quando open. FolderOpenIcon/FolderIcon Lucide aliasate.
- File props: value, children, className?, onClick?. Selezione = bg-accent/10 text-fg.
- Indent helper component.

Output: file completo src/components/file-tree.tsx, esporta Tree, Folder, File.`,
    },
];

export const LIB_STATUS_META: Record<
    LibStatus,
    { label: string; group: string; groupHint: string }
> = {
    live: {
        label: "Live",
        group: "Pronti da usare",
        groupHint: "Codice pubblicato, copy & paste sicuro.",
    },
    wip: {
        label: "WIP",
        group: "In sviluppo",
        groupHint: "Anteprime parziali, API ancora in assestamento.",
    },
    soon: {
        label: "Soon",
        group: "In arrivo",
        groupHint: "Pianificati: il prompt è pronto, il codice arriva dopo.",
    },
};

export const LIB_STATUS_DOT = RELEASE_STATUS_DOT;

export const LIB_STATUS_ORDER = RELEASE_STATUS_ORDER;

export function getComponent(slug: string): LibComponent | undefined {
    return components.find((c) => c.slug === slug);
}
