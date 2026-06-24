"use client";
/**
 * app/app/page.tsx — Temporary demo page that renders the map step.
 *
 * Shows MapStep when currentStep === "mapa" (or always, as a dev shortcut).
 * The full step-switching orchestrator is a later task; this keeps it minimal.
 */

import { AppShell } from "@/components/app-shell/AppShell";
import { MapStep } from "@/components/steps/MapStep";
import { useAppStore } from "@/lib/store/useAppStore";

export default function AppPage() {
  const currentStep = useAppStore((s) => s.currentStep);

  return (
    <AppShell>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        {currentStep === "mapa" ? (
          <MapStep />
        ) : (
          // Minimal placeholder for other steps — full orchestrator is a later task
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9CA29E",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 13,
            }}
          >
            Paso: {currentStep} — próximamente
          </div>
        )}
      </div>
    </AppShell>
  );
}
