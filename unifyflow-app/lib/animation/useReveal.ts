/**
 * useReveal.ts — Scroll-driven fade + slide-up reveal helpers.
 *
 * Exports:
 *   revealVars(reduced)  — pure tween-vars helper (unit-testable, no DOM needed).
 *   useReveal(scopeRef)  — React hook that wires ScrollTrigger reveals to all
 *                          [data-reveal] elements inside a ref scope.
 *
 * Pattern: visible-by-default.
 *   Elements start visible in CSS (no opacity:0 in markup).
 *   GSAP sets opacity:0 / y:18 only inside the (prefers-reduced-motion: no-preference)
 *   matchMedia branch, then animates to final state on scroll.
 *   The reduce branch instantly sets every [data-reveal] to opacity:1 / y:0.
 *   Content is always readable without JS, during SSR, and for reduced-motion users.
 */

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ── Pure timing helper ─────────────────────────────────────────────────────────

export interface RevealVarsFull {
  opacity: number;
  y: number;
  duration: number;
  ease: string;
  stagger: number;
}

export interface RevealVarsReduced {
  opacity: number;
  y: number;
  duration: number;
}

/**
 * Returns tween-vars for a fade+slide-up reveal.
 *
 * Full motion:    {opacity:1, y:0, duration:0.6, ease:"power2.out", stagger:0.12}
 * Reduced motion: {opacity:1, y:0, duration:0}
 */
export function revealVars(reduced: false): RevealVarsFull;
export function revealVars(reduced: true): RevealVarsReduced;
export function revealVars(reduced: boolean): RevealVarsFull | RevealVarsReduced;
export function revealVars(reduced: boolean): RevealVarsFull | RevealVarsReduced {
  if (reduced) {
    return { opacity: 1, y: 0, duration: 0 };
  }
  return {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.12,
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * useReveal — Attaches ScrollTrigger-driven fade+slide-up animations to all
 * [data-reveal] children inside the given scope ref.
 *
 * Must be called inside a "use client" component.
 * Returns nothing; side-effect only.
 */
export function useReveal(scopeRef: RefObject<HTMLElement | null>): void {
  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const mm = gsap.matchMedia();

      // ── Full motion: hide then reveal on scroll ────────────────────────────
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const elements = scope.querySelectorAll<HTMLElement>("[data-reveal]");
        elements.forEach((el) => {
          // Hide initially only inside this branch — visible without motion
          gsap.set(el, { opacity: 0, y: 18 });

          ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            onEnter: () => {
              gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                clearProps: "transform",
              });
            },
            once: true,
          });
        });
      });

      // ── Reduced motion: show immediately ──────────────────────────────────
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const elements = scope.querySelectorAll<HTMLElement>("[data-reveal]");
        elements.forEach((el) => {
          gsap.set(el, { opacity: 1, y: 0, clearProps: "transform" });
        });
      });
    },
    { scope: scopeRef, dependencies: [] }
  );
}
