"use client";
/**
 * app/app/page.tsx — Dashboard orchestrator page.
 *
 * Renders the full AppShell + step switcher.
 *
 * Deep-linking:
 *   ?step=equipo|entrevista|mapa|oportunidades|radiografia  — initializes step
 *   ?role=admin|validador|entrevistado                      — initializes role
 *
 * useSearchParams must be wrapped in <Suspense> in Next 16.
 */

import React, { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-shell/AppShell";
import { DashboardSteps } from "@/components/steps/DashboardSteps";
import { useAppStore } from "@/lib/store/useAppStore";
import type { NavStep } from "@/lib/store/useAppStore";
import type { Role } from "@/lib/schemas";

// ── Valid values ──────────────────────────────────────────────────────────────

const VALID_STEPS = new Set<NavStep>([
  "equipo",
  "entrevista",
  "mapa",
  "oportunidades",
  "radiografia",
]);

const VALID_ROLES = new Set<Role>(["admin", "validador", "entrevistado"]);

// ── Deep-link initializer (inner client component that reads search params) ───

function DeepLinkInit() {
  const searchParams = useSearchParams();
  const setStep = useAppStore((s) => s.setStep);
  const setRole = useAppStore((s) => s.setRole);

  useEffect(() => {
    const stepParam = searchParams.get("step") as NavStep | null;
    const roleParam = searchParams.get("role") as Role | null;

    if (roleParam && VALID_ROLES.has(roleParam)) {
      setRole(roleParam);
    }
    if (stepParam && VALID_STEPS.has(stepParam)) {
      setStep(stepParam);
    }
    // Only run on mount — intentionally omitting deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AppPage() {
  return (
    <AppShell>
      {/* Deep-link initializer — reads ?step= and ?role= on mount */}
      <Suspense fallback={null}>
        <DeepLinkInit />
      </Suspense>
      <DashboardSteps />
    </AppShell>
  );
}
