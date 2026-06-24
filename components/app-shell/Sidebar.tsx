"use client";

import * as React from "react";
import { NavItem } from "./NavItem";
import { OrgFooter } from "./OrgFooter";
import type { NavStep } from "@/lib/store/useAppStore";

export interface NavStepDef {
  step: NavStep;
  n: number;
  label: string;
}

export const ALL_NAV_STEPS: NavStepDef[] = [
  { step: "equipo",        n: 1, label: "Equipo" },
  { step: "entrevista",    n: 2, label: "Entrevista" },
  { step: "mapa",          n: 3, label: "Mapa vivo" },
  { step: "oportunidades", n: 4, label: "Oportunidades" },
  { step: "radiografia",   n: 5, label: "Radiografía" },
];

export interface SidebarProps {
  currentStep: NavStep;
  role: string | null;
  orgNombre: string;
  orgSector: string;
  onStepChange: (step: NavStep) => void;
  /** Called when a nav item is clicked (used in mobile drawer to close) */
  onNavClick?: () => void;
}

export function Sidebar({
  currentStep,
  role,
  orgNombre,
  orgSector,
  onStepChange,
  onNavClick,
}: SidebarProps) {
  const isValidador = role === "validador";
  const visibleSteps = isValidador
    ? ALL_NAV_STEPS.filter((s) => s.n >= 3)
    : ALL_NAV_STEPS;

  function handleStepClick(step: NavStep) {
    onStepChange(step);
    onNavClick?.();
  }

  return (
    <div
      style={{
        width: "236px",
        minWidth: "236px",
        background: "#FFFFFF",
        borderRight: "1px solid #E7EAE8",
        display: "flex",
        flexDirection: "column",
        padding: "26px 18px",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      {/* ── Logo block ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "32px" }}>
        {/* Rombo icon */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "19px",
              height: "19px",
              borderRadius: "5px",
              background: "var(--accent)",
              boxShadow: "0 0 0 4px var(--accent-tint)",
              transform: "rotate(45deg)",
              flexShrink: 0,
            }}
          />
          {/* Wordmark */}
          <span
            style={{
              fontFamily: "var(--font-newsreader), serif",
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--fg, #1C201E)",
              letterSpacing: "-0.01em",
            }}
          >
            UnifyFlow
          </span>
        </div>
        {/* Subline */}
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "10px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#A8AEAA",
            paddingLeft: "29px",
          }}
        >
          Radiografía de procesos
        </span>
      </div>

      {/* ── Nav section ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
        {/* Section header */}
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "9.5px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.09em",
            color: "#B4B9B5",
            marginBottom: "8px",
            display: "block",
          }}
        >
          El recorrido
        </span>

        {/* Nav items */}
        {visibleSteps.map((def) => (
          <NavItem
            key={def.step}
            step={def.step}
            n={def.n}
            label={def.label}
            active={currentStep === def.step}
            onClick={handleStepClick}
          />
        ))}
      </div>

      {/* ── Footer ── */}
      <div style={{ marginTop: "24px" }}>
        <OrgFooter nombre={orgNombre} sector={orgSector} />
      </div>
    </div>
  );
}
