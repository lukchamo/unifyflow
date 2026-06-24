"use client";

/**
 * OppCard.tsx — Card displaying a single AI opportunity.
 * Renders rank, title, area chips, hours recovered, metric bars, evidence, and CTA.
 * The parent component is responsible for wrapping with Paywall when locked.
 */

import React from "react";
import { MetricBar } from "./MetricBar";
import { Button } from "@/components/ui/Button";
import { AREA_COLORS } from "@/lib/data/mockData";

export interface OppCardProps {
  rank: number;
  titulo: string;
  areas: string[];
  horas: string;
  impacto: number;
  frecuencia: number;
  viabilidad: number;
  nodeId: string;
  evidencia: string;
  locked: boolean;
}

export function OppCard({
  rank,
  titulo,
  areas,
  horas,
  impacto,
  frecuencia,
  viabilidad,
  nodeId,
  evidencia,
}: OppCardProps) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #E2EAE7",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Rank + Title */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <span
          style={{
            fontFamily: "Newsreader, Georgia, serif",
            fontSize: "26px",
            lineHeight: 1,
            color: "#D2D7D4",
            flexShrink: 0,
          }}
        >
          {rank}
        </span>
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: 600,
            color: "#1A2420",
            lineHeight: 1.3,
          }}
        >
          {titulo}
        </h3>
      </div>

      {/* Area chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {areas.map((area) => (
          <span
            key={area}
            style={{
              display: "inline-block",
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: 500,
              backgroundColor: AREA_COLORS[area]
                ? `${AREA_COLORS[area]}22`
                : "#E8F0EE",
              color: AREA_COLORS[area] ?? "#3C7D6E",
              border: `1px solid ${AREA_COLORS[area] ?? "#3C7D6E"}44`,
            }}
          >
            {area}
          </span>
        ))}
      </div>

      {/* Hours recovered */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
        <span
          style={{
            fontFamily: "Newsreader, Georgia, serif",
            fontSize: "24px",
            color: "var(--accent-dk, #2C6D5E)",
            fontWeight: 400,
          }}
        >
          {horas}
        </span>
        <span style={{ fontSize: "12px", color: "#7F938C" }}>recuperadas</span>
      </div>

      {/* Metric bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <MetricBar label="Impacto" value={impacto} />
        <MetricBar label="Frecuencia" value={frecuencia} />
        <MetricBar label="Viabilidad" value={viabilidad} />
      </div>

      {/* Evidence block */}
      <div
        style={{
          borderLeft: "2px solid var(--accent, #3C7D6E)",
          paddingLeft: "12px",
          fontSize: "13px",
          color: "#4A5E58",
          lineHeight: 1.5,
        }}
      >
        {evidencia}
      </div>

      {/* Node reference */}
      <p
        style={{
          margin: 0,
          fontSize: "11px",
          color: "#9EADA8",
          fontFamily: "monospace",
        }}
      >
        Nodo: {nodeId}
      </p>

      {/* CTA button */}
      <Button
        variant="secondary"
        size="sm"
        style={{
          backgroundColor: "var(--accent-tint)",
          border: "1px solid var(--accent)",
          alignSelf: "flex-start",
        }}
      >
        Construir esto →
      </Button>
    </div>
  );
}
