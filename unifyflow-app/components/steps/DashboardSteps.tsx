"use client";
/**
 * DashboardSteps.tsx — Orchestrates the 5 dashboard steps.
 *
 * Reads currentStep and role from the store.
 * For role 'validador', if currentStep is 'equipo' or 'entrevista', renders
 * MapStep instead (mirrors AppShell's coercion so the two never disagree).
 */

import React from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import type { NavStep } from "@/lib/store/useAppStore";
import { TeamStep } from "./TeamStep";
import { InterviewStep } from "./InterviewStep";
import { MapStep } from "./MapStep";
import { OpportunitiesStep } from "./OpportunitiesStep";
import { RadiographyStep } from "./RadiographyStep";

export function DashboardSteps() {
  const rawStep = useAppStore((s) => s.currentStep);
  const role = useAppStore((s) => s.role);

  // Mirror AppShell's coercion: validador cannot access equipo or entrevista
  const currentStep: NavStep =
    role === "validador" && (rawStep === "equipo" || rawStep === "entrevista")
      ? "mapa"
      : rawStep;

  switch (currentStep) {
    case "equipo":
      return <TeamStep />;
    case "entrevista":
      return <InterviewStep />;
    case "mapa":
      return <MapStep />;
    case "oportunidades":
      return <OpportunitiesStep />;
    case "radiografia":
      return <RadiographyStep />;
    default:
      // Exhaustive fallback — should never hit in practice
      return <MapStep />;
  }
}
