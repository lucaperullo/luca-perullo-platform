"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type ParticlesProps = {
    /** Total particles. Default 100. */
    quantity?: number;
    /** Higher = less drift. Default 50. */
    staticity?: number;
    /** Mouse repulsion easing. Default 50 (lower = snappier). */
    ease?: number;
    /** Base radius in px. Default 0.4. */
    size?: number;
    /** Particle color. Default reads `var(--fg-soft)`. */
    color?: string;
    vx?: number;
    vy?: number;
    className?: string;
};

type Particle = {
    x: number;
    y: number;
    tx: number;
    ty: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    dx: number;
    dy: number;
    magnetism: number;
};

/**
 * <Particles/> — canvas of slowly drifting dots that gently repel from the
 * cursor. ResizeObserver + DPR-aware. Skips animation when the user has
 * `prefers-reduced-motion: reduce` set.
 */
export function Particles({
    quantity = 100,
    staticity = 50,
    ease = 50,
    size = 0.4,
    color,
    vx = 0,
    vy = 0,
    className,
}: ParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reduced =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        let rafId = 0;
        let dpr = window.devicePixelRatio || 1;
        let w = 0;
        let h = 0;

        const resolveColor = () => {
            if (color) return color;
            const probe = document.createElement("div");
            probe.style.color = "var(--fg-soft)";
            document.body.appendChild(probe);
            const rgb = getComputedStyle(probe).color;
            document.body.removeChild(probe);
            return rgb;
        };
        const fillColor = resolveColor();

        const resize = () => {
            const rect = container.getBoundingClientRect();
            w = rect.width;
            h = rect.height;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
            seed();
        };

        const seed = () => {
            particlesRef.current = Array.from({ length: quantity }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                tx: 0,
                ty: 0,
                size: size + Math.random() * 1.6,
                alpha: 0,
                targetAlpha: 0.2 + Math.random() * 0.6,
                dx: (Math.random() - 0.5) * 0.2,
                dy: (Math.random() - 0.5) * 0.2,
                magnetism: 0.1 + Math.random() * 4,
            }));
        };

        const onMove = (event: PointerEvent) => {
            const rect = container.getBoundingClientRect();
            mouseRef.current = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            };
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            const particles = particlesRef.current;
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.alpha += (p.targetAlpha - p.alpha) * 0.04;
                p.x += p.dx + vx;
                p.y += p.dy + vy;

                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                const dx = mouseRef.current.x - p.x;
                const dy = mouseRef.current.y - p.y;
                const dist = Math.hypot(dx, dy);
                if (dist > 0 && dist < staticity * 2) {
                    const force = (staticity - dist) / staticity;
                    p.tx -= (dx / dist) * force * p.magnetism;
                    p.ty -= (dy / dist) * force * p.magnetism;
                }
                p.tx *= 1 - 1 / ease;
                p.ty *= 1 - 1 / ease;

                ctx.fillStyle = fillColor.startsWith("rgb")
                    ? fillColor.replace(")", `, ${p.alpha})`).replace("rgb", "rgba")
                    : fillColor;
                ctx.globalAlpha = p.alpha;
                ctx.beginPath();
                ctx.arc(p.x + p.tx, p.y + p.ty, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            if (!reduced) rafId = requestAnimationFrame(draw);
        };

        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(container);
        container.addEventListener("pointermove", onMove);
        draw();

        return () => {
            cancelAnimationFrame(rafId);
            ro.disconnect();
            container.removeEventListener("pointermove", onMove);
        };
    }, [quantity, staticity, ease, size, color, vx, vy]);

    return (
        <div
            ref={containerRef}
            aria-hidden
            className={cn("pointer-events-none absolute inset-0", className)}
        >
            <canvas ref={canvasRef} className="block" />
        </div>
    );
}
