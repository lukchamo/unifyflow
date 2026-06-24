"use client";
/**
 * FilterBar.tsx — Filter chips + legend for the map view.
 *
 * Layout: bg #FBFCFB, bottom border #EEF1EF, padding ~11px 34px.
 * Left: Radix ToggleGroup chips (Todos / Borrador / Validado / Oportunidad IA).
 * Right: legend dots.
 */

import React from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useAppStore } from "@/lib/store/useAppStore";

// ── Filter chip config ────────────────────────────────────────────────────────

interface FilterChip {
  value: string;
  label: string;
}

const CHIPS: FilterChip[] = [
  { value: "all", label: "Todos" },
  { value: "draft", label: "Borrador" },
  { value: "validated", label: "Validado" },
  { value: "opportunity", label: "Oportunidad IA" },
];

// ── Legend dot ────────────────────────────────────────────────────────────────

interface LegendDotProps {
  /** solid color fill */
  color?: string;
  /** if set, renders as a ring instead of solid dot */
  ring?: string;
}

function LegendDot({ color, ring }: LegendDotProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 9,
        height: 9,
        borderRadius: "50%",
        flexShrink: 0,
        ...(ring
          ? { border: `1.5px solid ${ring}`, backgroundColor: "transparent" }
          : { backgroundColor: color }),
      }}
    />
  );
}

// ── FilterBar ─────────────────────────────────────────────────────────────────

export function FilterBar() {
  const filter = useAppStore((s) => s.mapState.filter);
  const setFilter = useAppStore((s) => s.setFilter);

  return (
    <div
      style={{
        backgroundColor: "#FBFCFB",
        borderBottom: "1px solid #EEF1EF",
        padding: "11px 34px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      {/* ── Chips ── */}
      <ToggleGroup.Root
        type="single"
        value={filter}
        onValueChange={(val) => {
          // Radix returns "" when deselecting; keep current filter
          if (val) setFilter(val);
        }}
        style={{ display: "flex", alignItems: "center", gap: 6 }}
      >
        {CHIPS.map((chip) => {
          const isActive = filter === chip.value;
          return (
            <ToggleGroup.Item
              key={chip.value}
              value={chip.value}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "4px 11px",
                borderRadius: 999,
                border: isActive
                  ? "1px solid var(--accent)"
                  : "1px solid #E2E6E4",
                backgroundColor: isActive ? "var(--accent-tint)" : "#ffffff",
                color: isActive ? "var(--accent-dk)" : "#5A615D",
                fontSize: 12.5,
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                transition: "background 100ms, border-color 100ms",
                userSelect: "none",
              }}
            >
              {chip.label}
            </ToggleGroup.Item>
          );
        })}
      </ToggleGroup.Root>

      {/* ── Legend ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontSize: 11.5,
          color: "#8A908D",
          userSelect: "none",
        }}
      >
        {/* Validado */}
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <LegendDot color="var(--accent)" />
          Validado
        </span>

        {/* Borrador */}
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <LegendDot ring="#BBC0BC" />
          Borrador
        </span>

        {/* Oportunidad IA */}
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <LegendDot color="#B58238" />
          Oportunidad IA
        </span>
      </div>
    </div>
  );
}
