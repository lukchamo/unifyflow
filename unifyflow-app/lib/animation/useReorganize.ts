/**
 * useReorganize.ts — Hook + pure timing helper for the reorganize animation.
 *
 * Sequence:
 *   edgesOffAt  → hide edges (setEdgesVisible(false))
 *   organizeAt  → set organized=true  (nodes animate posA→posB)
 *   edgesOnAt   → show edges again    (setEdgesVisible(true))
 *
 * Honors prefers-reduced-motion.
 */

import { useRef, useCallback, useEffect } from "react";
import { useAppStore } from "@/lib/store/useAppStore";

// ── Pure timing helper ────────────────────────────────────────────────────────

export interface ReorganizeTiming {
  edgesOffAt: number;
  organizeAt: number;
  edgesOnAt: number;
}

/**
 * Returns reorganize timing values (all in ms).
 * Full motion:    {edgesOffAt:0, organizeAt:70, edgesOnAt:1020}
 * Reduced motion: {edgesOffAt:0, organizeAt:70, edgesOnAt:170}
 */
export function reorganizeTiming(reduced = false): ReorganizeTiming {
  return {
    edgesOffAt: 0,
    organizeAt: 70,
    edgesOnAt: reduced ? 170 : 1020,
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * useReorganize — wires reorganize animation to the Zustand store.
 * Returns `runReorganize()` to kick off the sequence.
 */
export function useReorganize() {
  const reorganize = useAppStore((s) => s.reorganize);
  const setEdgesVisible = useAppStore((s) => s.setEdgesVisible);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const runReorganize = useCallback(() => {
    // Clear any pending timers from a previous run
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    // Check prefers-reduced-motion
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const { edgesOffAt, organizeAt, edgesOnAt } = reorganizeTiming(reduced);

    // t=edgesOffAt (0): hide edges immediately
    if (edgesOffAt === 0) {
      setEdgesVisible(false);
    } else {
      const t0 = setTimeout(() => {
        setEdgesVisible(false);
      }, edgesOffAt);
      timersRef.current.push(t0);
    }

    // t=organizeAt: set organized → nodes transition posA→posB
    const t1 = setTimeout(() => {
      reorganize();
    }, organizeAt);

    // t=edgesOnAt: show edges again
    const t2 = setTimeout(() => {
      setEdgesVisible(true);
    }, edgesOnAt);

    timersRef.current.push(t1, t2);
  }, [reorganize, setEdgesVisible]);

  return { runReorganize };
}
