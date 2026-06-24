"use client";

import * as React from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { Sidebar } from "./Sidebar";
import { MobileDrawer } from "./MobileDrawer";
import type { NavStep } from "@/lib/store/useAppStore";

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const role = useAppStore((s) => s.role);
  const org = useAppStore((s) => s.org);
  const rawStep = useAppStore((s) => s.currentStep);
  const setStep = useAppStore((s) => s.setStep);

  // If validador and current step is equipo/entrevista, default to mapa
  const currentStep: NavStep =
    role === "validador" && (rawStep === "equipo" || rawStep === "entrevista")
      ? "mapa"
      : rawStep;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F4F6F5",
      }}
    >
      {/* Desktop sidebar — hidden on mobile (md breakpoint via media query) */}
      <div
        className="hidden md:flex"
        style={{ position: "sticky", top: 0, height: "100vh", flexShrink: 0 }}
      >
        <Sidebar
          currentStep={currentStep}
          role={role}
          orgNombre={org.nombre}
          orgSector={org.sector}
          onStepChange={setStep}
        />
      </div>

      {/* Mobile top bar + drawer — visible only on mobile */}
      <div
        className="flex md:hidden"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          height: "52px",
          background: "#FFFFFF",
          borderBottom: "1px solid #E7EAE8",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: "12px",
        }}
      >
        <MobileDrawer
          currentStep={currentStep}
          role={role}
          orgNombre={org.nombre}
          orgSector={org.sector}
          onStepChange={setStep}
        />
        <span
          style={{
            fontFamily: "var(--font-newsreader), serif",
            fontSize: "18px",
            fontWeight: 600,
            color: "var(--fg, #1C201E)",
          }}
        >
          UnifyFlow
        </span>
      </div>

      {/* Main content area */}
      <main
        style={{
          flex: 1,
          // On mobile, add top padding to account for fixed top bar
          paddingTop: "0",
        }}
        className="md:pt-0 pt-[52px]"
      >
        {children}
      </main>
    </div>
  );
}
