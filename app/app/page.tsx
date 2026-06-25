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

import React, { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-shell/AppShell";
import { DashboardSteps } from "@/components/steps/DashboardSteps";
import { GuidedTour } from "@/components/demo/GuidedTour";
import { TourButton } from "@/components/demo/TourButton";
import { AuthGate } from "@/components/auth/AuthGate";
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

// ── Step ↔ URL sync (deep-link in, browser history out) ───────────────────────
//
// Keeps the store's `currentStep` and the `?step=` query param in sync so the
// browser back/forward buttons walk the step history:
//   1. On mount, read ?step=/?role= and seed the store (deep-linking).
//   2. When `currentStep` changes (sidebar, drawer, in-step buttons), reflect it
//      in the URL — replaceState on the first sync (no spurious history entry),
//      pushState afterwards so each navigation is its own back-stack entry.
//      pushState/replaceState integrate with Next's router (per the App Router
//      "Native History API" guide), keeping useSearchParams in sync.
//   3. On popstate (back/forward), read ?step= and push it back into the store.

function StepUrlSync() {
  const searchParams = useSearchParams();
  const currentStep = useAppStore((s) => s.currentStep);
  const setStep = useAppStore((s) => s.setStep);
  const setRole = useAppStore((s) => s.setRole);
  const didInitUrl = useRef(false);

  // 1. Deep-link: seed store from URL on mount.
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

  // 2. Reflect step changes into the URL.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("step") === currentStep) {
      didInitUrl.current = true;
      return;
    }
    params.set("step", currentStep);
    const url = `?${params.toString()}`;
    if (didInitUrl.current) {
      window.history.pushState(null, "", url);
    } else {
      // First sync (e.g. persisted step, no ?step= in URL): don't add a history
      // entry — just correct the current one.
      window.history.replaceState(null, "", url);
      didInitUrl.current = true;
    }
  }, [currentStep]);

  // 3. Browser back/forward → store.
  useEffect(() => {
    function handlePopState() {
      const stepParam = new URLSearchParams(window.location.search).get(
        "step",
      ) as NavStep | null;
      if (stepParam && VALID_STEPS.has(stepParam)) {
        setStep(stepParam);
      }
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [setStep]);

  return null;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AppPage() {
  return (
    <AuthGate>
      <AppShell>
        {/* Step ↔ URL sync — deep-link in, browser history out */}
        <Suspense fallback={null}>
          <StepUrlSync />
        </Suspense>
        <DashboardSteps />
        {/* Guided tour overlay + trigger */}
        <GuidedTour />
        <TourButton />
      </AppShell>
    </AuthGate>
  );
}
