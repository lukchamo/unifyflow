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
import { useReveal } from "@/lib/animation/useReveal";

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

  // Delegate all GSAP / ScrollTrigger logic to the shared hook
  useReveal(containerRef, { stagger, start, delay });

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
