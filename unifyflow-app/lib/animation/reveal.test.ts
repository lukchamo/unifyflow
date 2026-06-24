/**
 * reveal.test.ts — Pure timing helper tests for map reveal & reorganize animations.
 * TDD: write tests first, implement after.
 */

import { describe, it, expect } from "vitest";
import { revealTiming } from "./useMapReveal";
import { reorganizeTiming } from "./useReorganize";

// ── revealTiming ──────────────────────────────────────────────────────────────

describe("revealTiming", () => {
  it("n=9, full motion: nodesStartAt=90, edgesAt=845, doneAt=1235", () => {
    const t = revealTiming(9);
    expect(t.nodesStartAt).toBe(90);
    expect(t.edgesAt).toBe(845); // 90 + 9*55 + 260 = 90 + 495 + 260 = 845
    expect(t.doneAt).toBe(1235); // 90 + 9*55 + 650 = 90 + 495 + 650 = 1235
  });

  it("n=9, reduced motion: nodesStartAt=0, edgesAt=160, doneAt=240", () => {
    const t = revealTiming(9, true);
    expect(t.nodesStartAt).toBe(0);
    expect(t.edgesAt).toBe(160);
    expect(t.doneAt).toBe(240);
  });

  it("n=0, full motion: edgesAt=350, doneAt=740", () => {
    const t = revealTiming(0);
    expect(t.nodesStartAt).toBe(90);
    expect(t.edgesAt).toBe(350); // 90 + 0*55 + 260 = 350
    expect(t.doneAt).toBe(740);  // 90 + 0*55 + 650 = 740
  });

  it("n=5, full motion: edgesAt=625, doneAt=1015", () => {
    const t = revealTiming(5);
    expect(t.edgesAt).toBe(625); // 90 + 5*55 + 260 = 90 + 275 + 260 = 625
    expect(t.doneAt).toBe(1015); // 90 + 5*55 + 650 = 90 + 275 + 650 = 1015
  });

  it("reduced motion always returns same values regardless of n", () => {
    const t0 = revealTiming(0, true);
    const t9 = revealTiming(9, true);
    expect(t0).toEqual(t9);
  });
});

// ── reorganizeTiming ──────────────────────────────────────────────────────────

describe("reorganizeTiming", () => {
  it("full motion: edgesOffAt=0, organizeAt=70, edgesOnAt=1020", () => {
    const t = reorganizeTiming();
    expect(t.edgesOffAt).toBe(0);
    expect(t.organizeAt).toBe(70);
    expect(t.edgesOnAt).toBe(1020);
  });

  it("reduced motion: edgesOffAt=0, organizeAt=70, edgesOnAt=170", () => {
    const t = reorganizeTiming(true);
    expect(t.edgesOffAt).toBe(0);
    expect(t.organizeAt).toBe(70);
    expect(t.edgesOnAt).toBe(170);
  });
});
