/**
 * useMapReveal.ts — Hook + pure timing helper for the map reveal animation.
 *
 * Sequence:
 *   0ms        → reset (revealed=false, edgesVisible=false)
 *   nodesStartAt → set revealed=true  (nodes start cascading in via React Flow)
 *   edgesAt      → set edgesVisible=true
 *   doneAt       → mark done (no-op flag — useful for downstream)
 *
 * Honors prefers-reduced-motion.
 */

import { useEffect, useRef, useCallback } from "react";
import { useAppStore } from "@/lib/store/useAppStore";

// ── Pure timing helper ────────────────────────────────────────────────────────

export interface RevealTiming {
  nodesStartAt: number;
  edgesAt: number;
  doneAt: number;
}

/**
 * Returns reveal timing values (all in ms).
 * Full motion:   nodesStartAt=90, edgesAt = 90 + n*55 + 260, doneAt = 90 + n*55 + 650
 * Reduced motion: always {0, 160, 240} regardless of n.
 */
export function revealTiming(n: number, reduced = false): RevealTiming {
  if (reduced) {
    return { nodesStartAt: 0, edgesAt: 160, doneAt: 240 };
  }
  const nodesStartAt = 90;
  const edgesAt = nodesStartAt + n * 55 + 260;
  const doneAt = nodesStartAt + n * 55 + 650;
  return { nodesStartAt, edgesAt, doneAt };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * useMapReveal — wires reveal animation to the Zustand store.
 * Returns `runReveal()` to kick off the sequence.
 */
export function useMapReveal() {
  const setRevealed = useAppStore((s) => s.setRevealed);
  const setEdgesVisible = useAppStore((s) => s.setEdgesVisible);
  const nodeCount = useAppStore((s) => s.nodes.length);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const runReveal = useCallback(() => {
    // Clear any pending timers from a previous run
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    // Check prefers-reduced-motion
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const { nodesStartAt, edgesAt, doneAt } = revealTiming(nodeCount, reduced);

    // t=0: reset state
    setRevealed(false);
    setEdgesVisible(false);

    // t=nodesStartAt: reveal nodes
    const t1 = setTimeout(() => {
      setRevealed(true);
    }, nodesStartAt);

    // t=edgesAt: show edges
    const t2 = setTimeout(() => {
      setEdgesVisible(true);
    }, edgesAt);

    // t=doneAt: done marker (no store action needed; could emit event here)
    const t3 = setTimeout(() => {
      // Reveal sequence complete — downstream consumers can hook here.
    }, doneAt);

    timersRef.current = [t1, t2, t3];
  }, [nodeCount, setRevealed, setEdgesVisible]);

  return { runReveal };
}
