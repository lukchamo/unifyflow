"use client";
/**
 * Reveal.tsx — Scroll-driven fade + slide-up wrapper component.
 *
 * Visible-by-default: children render at full opacity in HTML.
 * GSAP sets opacity:0 / y:18 only inside the (prefers-reduced-motion: no-preference)
 * matchMedia branch, then animates to final state when the element enters the viewport.
 * The reduced-motion branch instantly sets opacity:1 / y:0.
 * If JS fails or during SSR, elements stay fully visible (no hidden content).
 *
 * Usage:
 *   <Reveal>
 *     <h2>Section heading</h2>
 *   </Reveal>
 *
 *   Or with stagger on multiple siblings:
 *   <Reveal stagger>
 *     <div data-reveal>Card 1</div>
 *     <div data-reveal>Card 2</div>
 *   </Reveal>
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins only in browser (not during SSR / jsdom test runs)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** If true, each direct child with [data-reveal] staggers independently. */
  stagger?: boolean;
  /** ScrollTrigger start position (default "top 85%") */
  start?: string;
  /** Delay before the tween fires (seconds, default 0) */
  delay?: number;
}

export default function Reveal({
  children,
  className,
  stagger = false,
  start = "top 85%",
  delay = 0,
}: RevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const mm = gsap.matchMedia();

      // ── Full motion ────────────────────────────────────────────────────────
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = stagger
          ? container.querySelectorAll<HTMLElement>("[data-reveal]")
          : [container];

        targets.forEach((el) => {
          // Hide initially only inside the no-preference branch
          gsap.set(el, { opacity: 0, y: 18 });

          ScrollTrigger.create({
            trigger: el,
            start,
            onEnter: () => {
              gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                delay,
                clearProps: "transform",
              });
            },
            once: true,
          });
        });
      });

      // ── Reduced motion: show immediately ──────────────────────────────────
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const targets = stagger
          ? container.querySelectorAll<HTMLElement>("[data-reveal]")
          : [container];

        targets.forEach((el) => {
          gsap.set(el, { opacity: 1, y: 0, clearProps: "transform" });
        });
      });
    },
    { scope: containerRef, dependencies: [stagger, start, delay] }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
