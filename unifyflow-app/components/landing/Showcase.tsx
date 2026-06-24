"use client";
/**
 * Showcase.tsx — Animated version (client component).
 *
 * Adds GSAP scroll-driven animations to the three showcase rows:
 *   Row 1: chat bubbles fade + slide-up staggered on scroll.
 *   Row 2: map nodes draw themselves (opacity+scale, staggered), then
 *           connector badges fade in after — "el mapa se dibuja solo".
 *   Row 3: Borrador chip fades out, ✓ Validado chip fades in on scroll.
 *
 * Visible-by-default: all content is rendered in HTML at opacity:1.
 * GSAP only sets opacity:0 inside the (prefers-reduced-motion: no-preference)
 * matchMedia branch. Reduced-motion users and no-JS users see the final
 * (validated/complete) state immediately.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SHOWCASE } from "@/lib/data/content";
import { AREA_COLORS } from "@/lib/data/mockData";

// Register plugins only in browser (not during SSR / jsdom test runs)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

function getAreaColor(area: string): string {
  return (AREA_COLORS as Record<string, string>)[area] ?? "#A8773C";
}

export default function Showcase() {
  const { row1, row2, row3 } = SHOWCASE;

  // Refs for scoped GSAP targets
  const bubblesRef = useRef<HTMLDivElement>(null);
  const mapCardRef = useRef<HTMLDivElement>(null);
  const row3CardRef = useRef<HTMLDivElement>(null);

  // ── Row 1: chat bubbles stagger ────────────────────────────────────────────
  useGSAP(
    () => {
      const container = bubblesRef.current;
      if (!container) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const bubbles = container.querySelectorAll<HTMLElement>("[data-bubble]");

        // Hide initially
        gsap.set(bubbles, { opacity: 0, y: 16 });

        ScrollTrigger.create({
          trigger: container,
          start: "top 85%",
          onEnter: () => {
            gsap.to(bubbles, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.15,
              clearProps: "transform",
            });
          },
          once: true,
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const bubbles = container.querySelectorAll<HTMLElement>("[data-bubble]");
        gsap.set(bubbles, { opacity: 1, y: 0, clearProps: "transform" });
      });
    },
    { scope: bubblesRef, dependencies: [] }
  );

  // ── Row 2: map draws itself — nodes → badges ───────────────────────────────
  useGSAP(
    () => {
      const container = mapCardRef.current;
      if (!container) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const nodes = container.querySelectorAll<HTMLElement>("[data-map-node]");
        const edges = container.querySelectorAll<HTMLElement>("[data-map-edge]");
        const badges = container.querySelectorAll<HTMLElement>("[data-map-badge]");

        // Hide initially (edges are visible by CSS default; hide here for animation)
        gsap.set(nodes, { opacity: 0, y: 12, scale: 0.95 });
        gsap.set(edges, { opacity: 0, scaleY: 0, transformOrigin: "top center" });
        gsap.set(badges, { opacity: 0, scale: 0.8 });

        ScrollTrigger.create({
          trigger: container,
          start: "top 85%",
          onEnter: () => {
            const tl = gsap.timeline();
            // Phase 1: nodes draw in staggered
            tl.to(nodes, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.45,
              ease: "power2.out",
              stagger: 0.1,
              clearProps: "transform",
            });
            // Phase 2: edges draw down (connector lines between nodes)
            tl.to(
              edges,
              {
                opacity: 1,
                scaleY: 1,
                duration: 0.25,
                ease: "power1.out",
                stagger: 0.06,
                clearProps: "transform",
              },
              "-=0.1"
            );
            // Phase 3: badges fade in after edges
            tl.to(
              badges,
              {
                opacity: 1,
                scale: 1,
                duration: 0.35,
                ease: "back.out(1.4)",
                stagger: 0.08,
                clearProps: "transform",
              },
              "-=0.05"
            );
          },
          once: true,
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const nodes = container.querySelectorAll<HTMLElement>("[data-map-node]");
        const edges = container.querySelectorAll<HTMLElement>("[data-map-edge]");
        const badges = container.querySelectorAll<HTMLElement>("[data-map-badge]");
        // edges are visible by default via CSS; ensure all are shown instantly
        gsap.set([nodes, edges, badges], { opacity: 1, scale: 1, y: 0, clearProps: "all" });
      });
    },
    { scope: mapCardRef, dependencies: [] }
  );

  // ── Row 3: Borrador → ✓ Validado crossfade ────────────────────────────────
  useGSAP(
    () => {
      const container = row3CardRef.current;
      if (!container) return;

      const mm = gsap.matchMedia();

      // Full motion: Borrador is the animation-only element (starts at opacity:1 in
      // JS, fades out), Validado is real content (starts hidden in JS, fades in).
      // CSS default has Borrador opacity:0 (set via inline style in JSX) and
      // Validado visible — so no-JS / SSR users always see the final state.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const borrador = container.querySelector<HTMLElement>("[data-chip-from]");
        const validado = container.querySelector<HTMLElement>("[data-chip-to]");
        if (!borrador || !validado) return;

        // Override CSS defaults for the animation: show Borrador, hide Validado
        gsap.set(borrador, { opacity: 1 });
        gsap.set(validado, { opacity: 0, scale: 0.85 });

        ScrollTrigger.create({
          trigger: container,
          start: "top 85%",
          onEnter: () => {
            const tl = gsap.timeline({ delay: 0.4 });
            // Borrador fades out
            tl.to(borrador, {
              opacity: 0,
              scale: 0.85,
              duration: 0.3,
              ease: "power2.in",
            });
            // Validado fades in — ends matching the CSS default state
            tl.to(
              validado,
              {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: "back.out(1.2)",
                clearProps: "transform",
              },
              "-=0.1"
            );
          },
          once: true,
        });
      });

      // Reduced motion: CSS defaults already correct (Validado visible, Borrador
      // hidden via inline style). No gsap.set needed — do nothing.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        // no-op: CSS inline style on [data-chip-from] (opacity:0) and
        // default visibility on [data-chip-to] handle the correct final state.
      });
    },
    { scope: row3CardRef, dependencies: [] }
  );

  return (
    <section className="py-20 px-4 sm:px-6 bg-background">
      <div className="mx-auto max-w-[1120px]">
        {/* Section header */}
        <div className="text-center mb-16" data-reveal>
          <p
            className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest mb-3"
            style={{ color: "var(--accent)" }}
          >
            {SHOWCASE.eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-newsreader)] text-3xl sm:text-4xl text-foreground">
            {SHOWCASE.h2}
          </h2>
        </div>

        {/* Row 1: Chat card + text */}
        <div className="flex flex-col lg:flex-row gap-10 items-center mb-20">
          {/* Chat card — animated bubbles */}
          <div
            ref={bubblesRef}
            className="flex-1 rounded-2xl border border-black/8 bg-white p-5 shadow-sm max-w-sm w-full"
          >
            <div className="flex justify-between mb-4 text-xs text-foreground/40 font-[family-name:var(--font-mono)]">
              <span>{row1.label}</span>
              <span>{row1.stepper}</span>
            </div>
            <div className="flex flex-col gap-3">
              {row1.bubbles.map((b, i) => (
                <div
                  key={i}
                  data-bubble
                  className={`flex ${b.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <p
                    className={`text-sm px-4 py-2 rounded-2xl max-w-[80%] leading-relaxed ${
                      b.from === "ia" ? "bg-foreground/5 text-foreground" : "text-white"
                    }`}
                    style={b.from === "user" ? { backgroundColor: "var(--accent)" } : {}}
                  >
                    {b.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Row 1 text side */}
          <div className="flex-1 max-w-lg" data-reveal>
            <p
              className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest mb-3"
              style={{ color: "var(--accent)" }}
            >
              {row1.eyebrow}
            </p>
            <h3 className="font-[family-name:var(--font-newsreader)] text-2xl sm:text-3xl text-foreground mb-4">
              {row1.h3}
            </h3>
            <p className="text-foreground/60 leading-relaxed">{row1.text}</p>
          </div>
        </div>

        {/* Row 2: text + map card */}
        <div className="flex flex-col lg:flex-row-reverse gap-10 items-center mb-20">
          {/* Map card — nodes draw themselves */}
          <div
            ref={mapCardRef}
            className="flex-1 rounded-2xl border border-black/8 bg-white p-5 shadow-sm max-w-sm w-full"
          >
            <div className="flex flex-col gap-0">
              {row2.mapNodes.map((node, i) => (
                <>
                  <div
                    key={i}
                    data-map-node
                    className="flex items-center justify-between rounded-lg px-3 py-2"
                    style={{ backgroundColor: `${getAreaColor(node.area)}14` }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getAreaColor(node.area) }}
                      />
                      <span className="text-sm font-medium">{node.label}</span>
                    </div>
                    {"badge" in node && node.badge && (
                      <span
                        data-map-badge
                        className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full"
                      >
                        {node.badge}
                      </span>
                    )}
                  </div>
                  {/* Connector edge between nodes — visible by default, animated in full-motion */}
                  {i < row2.mapNodes.length - 1 && (
                    <div
                      data-map-edge
                      className="mx-4 h-2 w-px self-center"
                      style={{ backgroundColor: "#CBD3CF", opacity: 0.5 }}
                      aria-hidden="true"
                    />
                  )}
                </>
              ))}
            </div>
          </div>

          {/* Row 2 text side */}
          <div className="flex-1 max-w-lg" data-reveal>
            <p
              className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest mb-3"
              style={{ color: "var(--accent)" }}
            >
              {row2.eyebrow}
            </p>
            <h3 className="font-[family-name:var(--font-newsreader)] text-2xl sm:text-3xl text-foreground mb-4">
              {row2.h3}
            </h3>
            <p className="text-foreground/60 leading-relaxed">{row2.text}</p>
          </div>
        </div>

        {/* Row 3: card + text — Borrador → ✓ Validado crossfade */}
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          <div
            ref={row3CardRef}
            className="flex-1 rounded-2xl border border-black/8 bg-white p-5 shadow-sm max-w-sm w-full space-y-3"
          >
            <p className="text-xs font-[family-name:var(--font-mono)] text-foreground/40 uppercase">
              {row3.label}
            </p>
            <div className="rounded-xl border border-black/8 p-3">
              <p className="font-medium text-sm text-foreground">{row3.item.label}</p>
              <p className="text-xs text-foreground/40 mt-0.5">{row3.item.meta}</p>
              {/* Status chips: both rendered, crossfade driven by GSAP */}
              <div className="flex items-center gap-2 mt-2">
                {/* "from" chip — Borrador: animation-only element.
                    Hidden by default (CSS) so no-JS / SSR / reduced-motion users
                    never see it. GSAP reveals it in the full-motion branch only. */}
                <span
                  data-chip-from
                  className="text-xs text-foreground/40"
                  style={{ opacity: 0 }}
                >
                  {row3.item.from}
                </span>
                <span className="text-xs">→</span>
                {/* "to" chip — ✓ Validado */}
                <span
                  data-chip-to
                  className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  {row3.item.to}
                </span>
              </div>
            </div>
            <div className="rounded-xl border border-black/8 p-3">
              <p className="text-xs text-foreground/70">{row3.notif.text}</p>
              <p className="text-xs text-foreground/30 mt-1">{row3.notif.time}</p>
            </div>
          </div>

          {/* Row 3 text side */}
          <div className="flex-1 max-w-lg" data-reveal>
            <p
              className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest mb-3"
              style={{ color: "var(--accent)" }}
            >
              {row3.eyebrow}
            </p>
            <h3 className="font-[family-name:var(--font-newsreader)] text-2xl sm:text-3xl text-foreground mb-4">
              {row3.h3}
            </h3>
            <p className="text-foreground/60 leading-relaxed">{row3.text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
