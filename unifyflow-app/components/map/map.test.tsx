/**
 * map.test.tsx — Tests for the React Flow map components.
 *
 * Strategy: unit-test useMapData (renderHook) for reliability, as React Flow
 * internals can be flaky in jsdom without a properly sized DOM container.
 */

import { describe, it, expect, beforeAll, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMapData } from "./useMapData";
import { useAppStore } from "@/lib/store/useAppStore";

// ── Mock ResizeObserver (required by React Flow internals) ────────────────────
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

// ── Seed the store before each test ──────────────────────────────────────────
function seedStore() {
  const store = useAppStore.getState();
  store.resetDemo();
}

describe("useMapData", () => {
  it("returns 9 nodes and 10 edges from mock data", () => {
    seedStore();
    const { result } = renderHook(() => useMapData());
    expect(result.current.nodes).toHaveLength(9);
    expect(result.current.edges).toHaveLength(10);
  });

  it("node n2 uses posA when not organized", () => {
    seedStore();
    // ensure not organized
    const store = useAppStore.getState();
    act(() => {
      store.resetDemo(); // sets organized = false
    });

    const { result } = renderHook(() => useMapData());
    const n2 = result.current.nodes.find((n) => n.id === "n2");
    expect(n2).toBeDefined();
    // posA for n2 is { x: 180, y: 236 }
    expect(n2!.position.x).toBe(180);
    expect(n2!.position.y).toBe(236);
  });

  it("node n2 uses posB when organized", () => {
    seedStore();
    const store = useAppStore.getState();
    act(() => {
      store.reorganize(); // sets organized = true
    });

    const { result } = renderHook(() => useMapData());
    const n2 = result.current.nodes.find((n) => n.id === "n2");
    expect(n2).toBeDefined();
    // posB for n2 is { x: 16, y: 206 }
    expect(n2!.position.x).toBe(16);
    expect(n2!.position.y).toBe(206);
  });

  it("edge e10 (n9→n2) has dashed=true", () => {
    seedStore();
    const { result } = renderHook(() => useMapData());
    const dashedEdge = result.current.edges.find(
      (e) => e.source === "n9" && e.target === "n2"
    );
    expect(dashedEdge).toBeDefined();
    expect(dashedEdge!.data?.dashed).toBe(true);
  });

  it("nodes have type 'process'", () => {
    seedStore();
    const { result } = renderHook(() => useMapData());
    result.current.nodes.forEach((n) => {
      expect(n.type).toBe("process");
    });
  });

  it("node labels include 'Elaborar presupuesto' and 'Captar lead'", () => {
    seedStore();
    const { result } = renderHook(() => useMapData());
    const labels = result.current.nodes.map((n) => n.data.label);
    expect(labels).toContain("Elaborar presupuesto");
    expect(labels).toContain("Captar lead");
  });
});
