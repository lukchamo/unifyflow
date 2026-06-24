"use client";
/**
 * MapStep.tsx — Composes the full live-map UI for the "Momento espejo" step.
 *
 * Layout (column, fills available height):
 *   1. MapHeader  — top bar with controls
 *   2. FilterBar  — filter chips + legend
 *   3. ProcessFlowDynamic — React Flow canvas (flex-1, explicit height)
 *   4. NodeDetailPanel — overlaid panel (rendered via Radix Dialog portal)
 *
 * Wiring:
 *   - On mount: runs the reveal animation cascade via useMapReveal().runReveal()
 *   - "Reorganizar con IA" → useReorganize().runReorganize() (animated path)
 *   - "↺ Repetir" → store replay() then runReveal() (re-runs the cascade)
 *   - Realtime "interview:completed" → re-runs runReveal() so new nodes appear
 */

import React, { useEffect, useRef } from "react";
import { MapHeader } from "@/components/map/MapHeader";
import { FilterBar } from "@/components/map/FilterBar";
import { ProcessFlowDynamic } from "@/components/map/ProcessFlowDynamic";
import { NodeDetailPanel } from "@/components/map/NodeDetailPanel";
import { useMapReveal } from "@/lib/animation/useMapReveal";
import { useReorganize } from "@/lib/animation/useReorganize";
import { useAppStore } from "@/lib/store/useAppStore";
import { realtime } from "@/lib/services/realtime";

export function MapStep() {
  const { runReveal } = useMapReveal();
  const { runReorganize } = useReorganize();
  const storeReplay = useAppStore((s) => s.replay);

  // Track whether we've run the initial reveal to avoid double-firing in strict mode
  const revealedOnce = useRef(false);

  // On mount: run the reveal animation cascade
  useEffect(() => {
    if (!revealedOnce.current) {
      revealedOnce.current = true;
      runReveal();
    }
    // runReveal is stable (useCallback); only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Realtime: subscribe to interview:completed — re-run reveal so new node is visible
  useEffect(() => {
    function handleInterviewCompleted() {
      runReveal();
    }

    realtime.on("interview:completed", handleInterviewCompleted);
    return () => {
      realtime.off("interview:completed", handleInterviewCompleted);
    };
  }, [runReveal]);

  // "↺ Repetir" handler: reset store reveal state then re-run cascade
  function handleReplay() {
    storeReplay();
    runReveal();
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
      }}
    >
      <MapHeader
        onReorganize={runReorganize}
        onReplay={handleReplay}
      />
      <FilterBar />
      {/* flex-1 container with explicit height so React Flow sizes correctly */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          height: "100%",
        }}
      >
        <ProcessFlowDynamic />
        {/* NodeDetailPanel uses Radix Dialog portal — it overlays automatically */}
        <NodeDetailPanel />
      </div>
    </div>
  );
}

export default MapStep;
