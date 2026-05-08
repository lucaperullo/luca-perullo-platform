"use client";

import { useRef, type ComponentType, type RefObject, type SVGProps } from "react";
import {
    Activity,
    Calendar,
    Database,
    FileCode,
    GitBranch,
    Globe,
    Hammer,
    HardDrive,
    Mail,
    MessageSquare,
    Radar,
    Rocket,
    Server,
    TestTube,
    Workflow,
    Zap,
} from "lucide-react";
import { AnimatedBeam } from "./animated-beam";

/**
 * Catalog showcase for <AnimatedBeam/>. Three stacked examples in the
 * chanhdai editorial register, each demonstrating a different topology
 * the new waypoints API supports.
 *
 *   001 — HTTP Round-Trip   four beams across two lanes (waypoints + rounded)
 *   002 — Integration Hub   one source, four satellites (smooth curves)
 *   003 — Build Pipeline    sequential A → B → C → D (linear)
 */

/* ────────────────────────── shared primitives ────────────────────── */

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

const Marker = ({
    refObj,
    leftPct,
    topPct,
}: {
    refObj: RefObject<HTMLDivElement | null>;
    leftPct: number;
    topPct: number;
}) => (
    <div
        ref={refObj}
        aria-hidden
        className="absolute"
        style={{ left: `${leftPct}%`, top: `${topPct}%`, width: 1, height: 1 }}
    />
);

type NodeProps = {
    refObj: RefObject<HTMLDivElement | null>;
    icon: IconType;
    label: string;
    caption?: string;
    leftPct: number;
    topPct: number;
    /** Width clamp; defaults to a 96–160px responsive size. */
    widthClamp?: string;
};

const Node = ({
    refObj,
    icon: Icon,
    label,
    caption,
    leftPct,
    topPct,
    widthClamp = "clamp(92px,18%,150px)",
}: NodeProps) => (
    <div
        ref={refObj}
        className="absolute z-10 flex flex-col items-center gap-1.5 rounded-sm border border-border bg-bg px-3 py-3"
        style={{
            left: `${leftPct}%`,
            top: `${topPct}%`,
            transform: "translate(-50%, -50%)",
            width: widthClamp,
        }}
    >
        <Icon
            className="size-4 text-fg-muted sm:size-5"
            aria-hidden
            strokeWidth={1.5}
        />
        <div className="caption-mono text-[10.5px] text-fg sm:text-[11px]">
            {label}
        </div>
        {caption ? (
            <div className="font-mono text-[9.5px] text-fg-soft sm:text-[10px]">
                {caption}
            </div>
        ) : null}
    </div>
);

const ExampleFrame = ({
    number,
    title,
    children,
}: {
    number: string;
    title: string;
    children: React.ReactNode;
}) => (
    <figure className="m-0 flex flex-col gap-2">
        <figcaption className="flex items-baseline gap-3 caption-mono text-[10px] uppercase tracking-[0.18em] text-fg-soft">
            <span className="text-fg">{number}</span>
            <span className="h-px flex-1 bg-border" aria-hidden />
            <span>{title}</span>
        </figcaption>
        {children}
    </figure>
);

/* ─────────────────────── 001 · HTTP Round-Trip ──────────────────── */

function ExampleRoundTrip() {
    const containerRef = useRef<HTMLDivElement>(null);
    const browserRef = useRef<HTMLDivElement>(null);
    const serverRef = useRef<HTMLDivElement>(null);
    const dbRef = useRef<HTMLDivElement>(null);
    const reqWp0 = useRef<HTMLDivElement>(null);
    const reqWp1 = useRef<HTMLDivElement>(null);
    const reqWp2 = useRef<HTMLDivElement>(null);
    const resWp0 = useRef<HTMLDivElement>(null);
    const resWp1 = useRef<HTMLDivElement>(null);
    const resWp2 = useRef<HTMLDivElement>(null);

    const NODE_Y = 44;
    const REQ_Y = 18;
    const RES_Y = 70;
    const X = [16, 50, 84];

    return (
        <ExampleFrame number="001" title="HTTP round-trip · waypoints">
            <div
                ref={containerRef}
                className="relative w-full overflow-hidden rounded-sm border border-border bg-bg-alt text-border-strong"
                style={{ aspectRatio: "16 / 9", minHeight: 260 }}
            >
                <span
                    aria-hidden
                    className="stripe-rule pointer-events-none absolute inset-x-0 opacity-50"
                    style={{ top: `${NODE_Y}%`, height: 1 }}
                />
                <div
                    className="absolute left-1/2 -translate-x-1/2 caption-mono text-[9.5px] uppercase tracking-[0.22em] text-fg-soft"
                    style={{ top: `${REQ_Y - 8}%` }}
                >
                    request →
                </div>
                <div
                    className="absolute left-1/2 -translate-x-1/2 caption-mono text-[9.5px] uppercase tracking-[0.22em] text-fg-soft"
                    style={{ top: `${RES_Y + 4}%` }}
                >
                    ← response
                </div>

                <Node refObj={browserRef} icon={Globe} label="Browser" caption="client" leftPct={X[0]} topPct={NODE_Y} />
                <Node refObj={serverRef} icon={Server} label="Server" caption="edge" leftPct={X[1]} topPct={NODE_Y} />
                <Node refObj={dbRef} icon={Database} label="Database" caption="postgres" leftPct={X[2]} topPct={NODE_Y} />

                <Marker refObj={reqWp0} leftPct={X[0]} topPct={REQ_Y} />
                <Marker refObj={reqWp1} leftPct={X[1]} topPct={REQ_Y} />
                <Marker refObj={reqWp2} leftPct={X[2]} topPct={REQ_Y} />
                <Marker refObj={resWp0} leftPct={X[2]} topPct={RES_Y} />
                <Marker refObj={resWp1} leftPct={X[1]} topPct={RES_Y} />
                <Marker refObj={resWp2} leftPct={X[0]} topPct={RES_Y} />

                <AnimatedBeam
                    containerRef={containerRef as RefObject<HTMLElement>}
                    fromRef={browserRef as RefObject<HTMLElement>}
                    toRef={serverRef as RefObject<HTMLElement>}
                    waypoints={[reqWp0 as RefObject<HTMLElement>, reqWp1 as RefObject<HTMLElement>]}
                    routing="rounded"
                    cornerRadius={14}
                    duration={2.0}
                    delay={0}
                    strokeWidth={1.4}
                    accentColor="var(--accent)"
                    pathColor="currentColor"
                    glow={2.5}
                />
                <AnimatedBeam
                    containerRef={containerRef as RefObject<HTMLElement>}
                    fromRef={serverRef as RefObject<HTMLElement>}
                    toRef={dbRef as RefObject<HTMLElement>}
                    waypoints={[reqWp1 as RefObject<HTMLElement>, reqWp2 as RefObject<HTMLElement>]}
                    routing="rounded"
                    cornerRadius={14}
                    duration={2.0}
                    delay={0.5}
                    strokeWidth={1.4}
                    accentColor="var(--accent)"
                    pathColor="currentColor"
                    glow={2.5}
                />
                <AnimatedBeam
                    containerRef={containerRef as RefObject<HTMLElement>}
                    fromRef={dbRef as RefObject<HTMLElement>}
                    toRef={serverRef as RefObject<HTMLElement>}
                    waypoints={[resWp0 as RefObject<HTMLElement>, resWp1 as RefObject<HTMLElement>]}
                    routing="rounded"
                    cornerRadius={14}
                    duration={2.0}
                    delay={1.2}
                    strokeWidth={1.4}
                    accentColor="var(--accent)"
                    pathColor="currentColor"
                    glow={2.5}
                />
                <AnimatedBeam
                    containerRef={containerRef as RefObject<HTMLElement>}
                    fromRef={serverRef as RefObject<HTMLElement>}
                    toRef={browserRef as RefObject<HTMLElement>}
                    waypoints={[resWp1 as RefObject<HTMLElement>, resWp2 as RefObject<HTMLElement>]}
                    routing="rounded"
                    cornerRadius={14}
                    duration={2.0}
                    delay={1.7}
                    strokeWidth={1.4}
                    accentColor="var(--accent)"
                    pathColor="currentColor"
                    glow={2.5}
                />

                <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 caption-mono text-[9.5px] uppercase tracking-[0.18em] text-fg-soft sm:bottom-4">
                    <span>fetch</span>
                    <span aria-hidden>→</span>
                    <span>query</span>
                    <span aria-hidden>→</span>
                    <span>result</span>
                    <span aria-hidden>→</span>
                    <span>render</span>
                </div>
            </div>
        </ExampleFrame>
    );
}

/* ─────────────────────── 002 · Integration Hub ──────────────────── */

function ExampleHub() {
    const containerRef = useRef<HTMLDivElement>(null);
    const hubRef = useRef<HTMLDivElement>(null);
    const slackRef = useRef<HTMLDivElement>(null);
    const githubRef = useRef<HTMLDivElement>(null);
    const mailRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);

    const SAT: Array<{
        ref: RefObject<HTMLDivElement | null>;
        icon: IconType;
        label: string;
        caption: string;
        leftPct: number;
        topPct: number;
        delay: number;
    }> = [
        { ref: slackRef, icon: MessageSquare, label: "Slack", caption: "channel", leftPct: 16, topPct: 22, delay: 0 },
        { ref: githubRef, icon: GitBranch, label: "Github", caption: "repo", leftPct: 84, topPct: 22, delay: 0.4 },
        { ref: mailRef, icon: Mail, label: "Email", caption: "transactional", leftPct: 16, topPct: 78, delay: 0.8 },
        { ref: calendarRef, icon: Calendar, label: "Calendar", caption: "events", leftPct: 84, topPct: 78, delay: 1.2 },
    ];

    return (
        <ExampleFrame number="002" title="Integration hub · smooth curves">
            <div
                ref={containerRef}
                className="relative w-full overflow-hidden rounded-sm border border-border bg-bg-alt text-border-strong"
                style={{ aspectRatio: "16 / 9", minHeight: 280 }}
            >
                <Node
                    refObj={hubRef}
                    icon={Workflow}
                    label="Workflow"
                    caption="hub"
                    leftPct={50}
                    topPct={50}
                    widthClamp="clamp(96px,18%,160px)"
                />
                {SAT.map((s) => (
                    <Node
                        key={s.label}
                        refObj={s.ref}
                        icon={s.icon}
                        label={s.label}
                        caption={s.caption}
                        leftPct={s.leftPct}
                        topPct={s.topPct}
                        widthClamp="clamp(86px,16%,138px)"
                    />
                ))}

                {SAT.map((s) => (
                    <AnimatedBeam
                        key={`beam-${s.label}`}
                        containerRef={containerRef as RefObject<HTMLElement>}
                        fromRef={hubRef as RefObject<HTMLElement>}
                        toRef={s.ref as RefObject<HTMLElement>}
                        routing="smooth"
                        curvature={0.35}
                        duration={2.0}
                        delay={s.delay}
                        strokeWidth={1.4}
                        accentColor="var(--accent)"
                        pathColor="currentColor"
                        glow={2.5}
                    />
                ))}

                <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 caption-mono text-[9.5px] uppercase tracking-[0.18em] text-fg-soft sm:bottom-4">
                    <span>webhook</span>
                    <span aria-hidden>→</span>
                    <span>fan-out</span>
                    <span aria-hidden>→</span>
                    <span>4 destinations</span>
                </div>
            </div>
        </ExampleFrame>
    );
}

/* ─────────────────────── 003 · Build Pipeline ───────────────────── */

function ExamplePipeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const sourceRef = useRef<HTMLDivElement>(null);
    const buildRef = useRef<HTMLDivElement>(null);
    const testRef = useRef<HTMLDivElement>(null);
    const deployRef = useRef<HTMLDivElement>(null);

    const NODE_Y = 50;

    return (
        <ExampleFrame number="003" title="Build pipeline · linear">
            <div
                ref={containerRef}
                className="relative w-full overflow-hidden rounded-sm border border-border bg-bg-alt text-border-strong"
                style={{ aspectRatio: "16 / 7", minHeight: 220 }}
            >
                <span
                    aria-hidden
                    className="stripe-rule pointer-events-none absolute inset-x-0 opacity-50"
                    style={{ top: `${NODE_Y}%`, height: 1 }}
                />

                <Node
                    refObj={sourceRef}
                    icon={FileCode}
                    label="Source"
                    caption="git"
                    leftPct={11}
                    topPct={NODE_Y}
                    widthClamp="clamp(82px,15%,128px)"
                />
                <Node
                    refObj={buildRef}
                    icon={Hammer}
                    label="Build"
                    caption="rust + swc"
                    leftPct={37}
                    topPct={NODE_Y}
                    widthClamp="clamp(82px,15%,128px)"
                />
                <Node
                    refObj={testRef}
                    icon={TestTube}
                    label="Test"
                    caption="vitest"
                    leftPct={63}
                    topPct={NODE_Y}
                    widthClamp="clamp(82px,15%,128px)"
                />
                <Node
                    refObj={deployRef}
                    icon={Rocket}
                    label="Deploy"
                    caption="edge"
                    leftPct={89}
                    topPct={NODE_Y}
                    widthClamp="clamp(82px,15%,128px)"
                />

                <AnimatedBeam
                    containerRef={containerRef as RefObject<HTMLElement>}
                    fromRef={sourceRef as RefObject<HTMLElement>}
                    toRef={buildRef as RefObject<HTMLElement>}
                    routing="smooth"
                    curvature={0}
                    duration={1.6}
                    delay={0}
                    strokeWidth={1.4}
                    accentColor="var(--accent)"
                    pathColor="currentColor"
                    glow={2.5}
                />
                <AnimatedBeam
                    containerRef={containerRef as RefObject<HTMLElement>}
                    fromRef={buildRef as RefObject<HTMLElement>}
                    toRef={testRef as RefObject<HTMLElement>}
                    routing="smooth"
                    curvature={0}
                    duration={1.6}
                    delay={0.55}
                    strokeWidth={1.4}
                    accentColor="var(--accent)"
                    pathColor="currentColor"
                    glow={2.5}
                />
                <AnimatedBeam
                    containerRef={containerRef as RefObject<HTMLElement>}
                    fromRef={testRef as RefObject<HTMLElement>}
                    toRef={deployRef as RefObject<HTMLElement>}
                    routing="smooth"
                    curvature={0}
                    duration={1.6}
                    delay={1.1}
                    strokeWidth={1.4}
                    accentColor="var(--accent)"
                    pathColor="currentColor"
                    glow={2.5}
                />

                <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 caption-mono text-[9.5px] uppercase tracking-[0.18em] text-fg-soft sm:bottom-4">
                    <span>commit</span>
                    <span aria-hidden>→</span>
                    <span>compile</span>
                    <span aria-hidden>→</span>
                    <span>verify</span>
                    <span aria-hidden>→</span>
                    <span>ship</span>
                </div>
            </div>
        </ExampleFrame>
    );
}

/* ─────────────────────── 004 · Health · pulse ───────────────────── */

function ExampleHealthCheck() {
    const containerRef = useRef<HTMLDivElement>(null);
    const probeRef = useRef<HTMLDivElement>(null);
    const apiRef = useRef<HTMLDivElement>(null);
    const dbRef = useRef<HTMLDivElement>(null);
    const cacheRef = useRef<HTMLDivElement>(null);

    const TARGETS = [
        { ref: apiRef, icon: Server, label: "API", caption: "200 OK", topPct: 24, delay: 0 },
        { ref: dbRef, icon: Database, label: "Database", caption: "12ms", topPct: 50, delay: 0.45 },
        { ref: cacheRef, icon: HardDrive, label: "Cache", caption: "redis", topPct: 76, delay: 0.9 },
    ] as const;

    return (
        <ExampleFrame number="004" title="Health probe · pulse">
            <div
                ref={containerRef}
                className="relative w-full overflow-hidden rounded-sm border border-border bg-bg-alt text-border-strong"
                style={{ aspectRatio: "16 / 9", minHeight: 280 }}
            >
                <Node
                    refObj={probeRef}
                    icon={Radar}
                    label="Probe"
                    caption="every 30s"
                    leftPct={16}
                    topPct={50}
                    widthClamp="clamp(96px,18%,150px)"
                />
                {TARGETS.map((t) => (
                    <Node
                        key={t.label}
                        refObj={t.ref}
                        icon={t.icon}
                        label={t.label}
                        caption={t.caption}
                        leftPct={84}
                        topPct={t.topPct}
                        widthClamp="clamp(96px,18%,150px)"
                    />
                ))}

                {TARGETS.map((t) => (
                    <AnimatedBeam
                        key={`beam-${t.label}`}
                        containerRef={containerRef as RefObject<HTMLElement>}
                        fromRef={probeRef as RefObject<HTMLElement>}
                        toRef={t.ref as RefObject<HTMLElement>}
                        animation="pulse"
                        routing="smooth"
                        curvature={0.2}
                        duration={2.4}
                        delay={t.delay}
                        strokeWidth={1.4}
                        accentColor="var(--accent)"
                        pathColor="currentColor"
                        glow={2.5}
                    />
                ))}

                <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 caption-mono text-[9.5px] uppercase tracking-[0.18em] text-fg-soft sm:bottom-4">
                    <span>ping</span>
                    <span aria-hidden>→</span>
                    <span>3 endpoints</span>
                    <span aria-hidden>·</span>
                    <span>alive</span>
                </div>
            </div>
        </ExampleFrame>
    );
}

/* ─────────────────────── 005 · Stream · flow ────────────────────── */

function ExampleStream() {
    const containerRef = useRef<HTMLDivElement>(null);
    const sourceRef = useRef<HTMLDivElement>(null);
    const procRef = useRef<HTMLDivElement>(null);
    const sinkRef = useRef<HTMLDivElement>(null);

    const NODE_Y = 50;

    return (
        <ExampleFrame number="005" title="Continuous stream · flow">
            <div
                ref={containerRef}
                className="relative w-full overflow-hidden rounded-sm border border-border bg-bg-alt text-border-strong"
                style={{ aspectRatio: "16 / 7", minHeight: 220 }}
            >
                <span
                    aria-hidden
                    className="stripe-rule pointer-events-none absolute inset-x-0 opacity-50"
                    style={{ top: `${NODE_Y}%`, height: 1 }}
                />

                <Node
                    refObj={sourceRef}
                    icon={Activity}
                    label="Source"
                    caption="kafka"
                    leftPct={14}
                    topPct={NODE_Y}
                    widthClamp="clamp(86px,16%,138px)"
                />
                <Node
                    refObj={procRef}
                    icon={Workflow}
                    label="Processor"
                    caption="map · filter"
                    leftPct={50}
                    topPct={NODE_Y}
                    widthClamp="clamp(96px,18%,150px)"
                />
                <Node
                    refObj={sinkRef}
                    icon={Database}
                    label="Sink"
                    caption="warehouse"
                    leftPct={86}
                    topPct={NODE_Y}
                    widthClamp="clamp(86px,16%,138px)"
                />

                <AnimatedBeam
                    containerRef={containerRef as RefObject<HTMLElement>}
                    fromRef={sourceRef as RefObject<HTMLElement>}
                    toRef={procRef as RefObject<HTMLElement>}
                    animation="flow"
                    routing="smooth"
                    curvature={0}
                    duration={1.4}
                    dashSize={12}
                    strokeWidth={1.4}
                    accentColor="var(--accent)"
                    pathColor="currentColor"
                    glow={2}
                />
                <AnimatedBeam
                    containerRef={containerRef as RefObject<HTMLElement>}
                    fromRef={procRef as RefObject<HTMLElement>}
                    toRef={sinkRef as RefObject<HTMLElement>}
                    animation="flow"
                    routing="smooth"
                    curvature={0}
                    duration={1.4}
                    dashSize={12}
                    strokeWidth={1.4}
                    accentColor="var(--accent)"
                    pathColor="currentColor"
                    glow={2}
                />

                <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 caption-mono text-[9.5px] uppercase tracking-[0.18em] text-fg-soft sm:bottom-4">
                    <span>ingest</span>
                    <span aria-hidden>→</span>
                    <span>transform</span>
                    <span aria-hidden>→</span>
                    <span>persist</span>
                </div>
            </div>
        </ExampleFrame>
    );
}

/* ─────────────────────── 006 · Packets · particles ──────────────── */

function ExamplePackets() {
    const containerRef = useRef<HTMLDivElement>(null);
    const clientRef = useRef<HTMLDivElement>(null);
    const edgeRef = useRef<HTMLDivElement>(null);
    const originRef = useRef<HTMLDivElement>(null);

    const NODE_Y = 50;

    return (
        <ExampleFrame number="006" title="Packet stream · particles">
            <div
                ref={containerRef}
                className="relative w-full overflow-hidden rounded-sm border border-border bg-bg-alt text-border-strong"
                style={{ aspectRatio: "16 / 7", minHeight: 220 }}
            >
                <span
                    aria-hidden
                    className="stripe-rule pointer-events-none absolute inset-x-0 opacity-50"
                    style={{ top: `${NODE_Y}%`, height: 1 }}
                />

                <Node
                    refObj={clientRef}
                    icon={Globe}
                    label="Client"
                    caption="browser"
                    leftPct={14}
                    topPct={NODE_Y}
                    widthClamp="clamp(86px,16%,138px)"
                />
                <Node
                    refObj={edgeRef}
                    icon={Zap}
                    label="Edge"
                    caption="cdn pop"
                    leftPct={50}
                    topPct={NODE_Y}
                    widthClamp="clamp(86px,16%,138px)"
                />
                <Node
                    refObj={originRef}
                    icon={Server}
                    label="Origin"
                    caption="us-east-1"
                    leftPct={86}
                    topPct={NODE_Y}
                    widthClamp="clamp(86px,16%,138px)"
                />

                <AnimatedBeam
                    containerRef={containerRef as RefObject<HTMLElement>}
                    fromRef={clientRef as RefObject<HTMLElement>}
                    toRef={edgeRef as RefObject<HTMLElement>}
                    animation="particles"
                    particleCount={5}
                    routing="smooth"
                    curvature={0}
                    duration={2.4}
                    strokeWidth={1.4}
                    accentColor="var(--accent)"
                    pathColor="currentColor"
                    glow={2}
                />
                <AnimatedBeam
                    containerRef={containerRef as RefObject<HTMLElement>}
                    fromRef={edgeRef as RefObject<HTMLElement>}
                    toRef={originRef as RefObject<HTMLElement>}
                    animation="particles"
                    particleCount={5}
                    routing="smooth"
                    curvature={0}
                    duration={2.4}
                    delay={0.3}
                    strokeWidth={1.4}
                    accentColor="var(--accent)"
                    pathColor="currentColor"
                    glow={2}
                />

                <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 caption-mono text-[9.5px] uppercase tracking-[0.18em] text-fg-soft sm:bottom-4">
                    <span>request</span>
                    <span aria-hidden>·</span>
                    <span>5 packets / segment</span>
                </div>
            </div>
        </ExampleFrame>
    );
}

/* ────────────────────────── public preview ──────────────────────── */

export function AnimatedBeamPreview() {
    return (
        <div className="flex flex-col gap-6">
            <ExampleRoundTrip />
            <ExampleHub />
            <ExamplePipeline />
            <ExampleHealthCheck />
            <ExampleStream />
            <ExamplePackets />
        </div>
    );
}
