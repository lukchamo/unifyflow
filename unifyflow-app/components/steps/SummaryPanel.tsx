"use client";

/**
 * SummaryPanel.tsx — Dark sticky summary panel for the opportunities step.
 * Shows total hours saved, key stats, and a CTA to proceed to radiografia.
 */

import React from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { selectTotalHours } from "@/lib/store/selectors";
import { Button } from "@/components/ui/Button";

export function SummaryPanel() {
  const totalHours = useAppStore(selectTotalHours);
  const setStep = useAppStore((s) => s.setStep);

  return (
    <div
      style={{
        backgroundColor: "#15201C",
        width: "268px",
        borderRadius: "12px",
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        position: "sticky",
        top: "24px",
        alignSelf: "flex-start",
        flexShrink: 0,
      }}
    >
      {/* Kicker */}
      <p
        style={{
          margin: 0,
          fontFamily: "monospace",
          fontSize: "11px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#7F938C",
        }}
      >
        Si actúas hoy
      </p>

      {/* Big number */}
      <div>
        <p
          style={{
            margin: 0,
            fontFamily: "Newsreader, Georgia, serif",
            fontSize: "46px",
            fontWeight: 400,
            color: "#ffffff",
            lineHeight: 1,
          }}
        >
          {totalHours}
        </p>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: "13px",
            color: "#A9B5B0",
            lineHeight: 1.5,
          }}
        >
          recuperadas por semana, en todo el equipo.
        </p>
      </div>

      {/* Stats list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {[
          { label: "Oportunidades priorizadas", value: "3" },
          { label: "Cada una, justificada", value: "✓" },
          { label: "Decisión del agente", value: "logueada" },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "13px",
            }}
          >
            <span style={{ color: "#7F938C" }}>{label}</span>
            <span style={{ color: "#ffffff", fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button
        onClick={() => setStep("radiografia")}
        style={{
          backgroundColor: "#ffffff",
          color: "#15201C",
          border: "none",
          fontWeight: 600,
          width: "100%",
        }}
      >
        Generar la radiografía →
      </Button>
    </div>
  );
}
