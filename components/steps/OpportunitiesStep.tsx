"use client";

/**
 * OpportunitiesStep.tsx — "Dónde aplicar IA primero." step.
 * Two-column layout: left column shows 3 AI opportunity cards (with paywall
 * for locked opps when not paid), right column shows sticky SummaryPanel.
 */

import React from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { OppCard } from "./OppCard";
import { Paywall } from "./Paywall";
import { SummaryPanel } from "./SummaryPanel";

export function OpportunitiesStep() {
  const opps = useAppStore((s) => s.opps);
  const subscription = useAppStore((s) => s.subscription);

  const sortedOpps = [...opps].sort((a, b) => a.rank - b.rank);

  return (
    <>
      <style>{`
        .opportunities-step {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 268px;
          gap: 32px;
          align-items: flex-start;
          min-height: 100%;
          padding: 40px 32px;
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
          .opportunities-step {
            grid-template-columns: 1fr;
            padding: 24px 16px;
          }
        }
      `}</style>
    <div className="opportunities-step">
      {/* Left column */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Kicker */}
        <p
          style={{
            margin: 0,
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--accent-dk, #2C6D5E)",
          }}
        >
          Paso 4 · el gancho
        </p>

        {/* H1 */}
        <h1
          style={{
            margin: 0,
            fontFamily: "Newsreader, Georgia, serif",
            fontSize: "32px",
            fontWeight: 400,
            color: "#1A2420",
            lineHeight: 1.2,
          }}
        >
          Dónde aplicar IA primero.
        </h1>

        {/* Description */}
        <p
          style={{
            margin: 0,
            fontSize: "15px",
            color: "#4A5E58",
            lineHeight: 1.6,
            maxWidth: "640px",
          }}
        >
          El agente leyó el mapa validado y priorizó por{" "}
          <strong>impacto × frecuencia × viabilidad</strong>. Cada propuesta
          cita la evidencia: qué nodos, dichas por quién.
        </p>

        {/* Opportunity cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Always render opp 1 (unlocked) */}
          {sortedOpps
            .filter((opp) => !opp.locked)
            .map((opp) => (
              <OppCard
                key={opp.id}
                rank={opp.rank}
                titulo={opp.titulo}
                areas={opp.areas}
                horas={opp.horas}
                impacto={opp.impacto}
                frecuencia={opp.frecuencia}
                viabilidad={opp.viabilidad}
                nodeId={opp.nodeId}
                evidencia={opp.evidencia}
                locked={opp.locked}
              />
            ))}

          {/* Locked opps: wrap all together in one Paywall when not paid */}
          {sortedOpps.filter((opp) => opp.locked).length > 0 &&
            (!subscription.paid ? (
              <Paywall>
                {sortedOpps
                  .filter((opp) => opp.locked)
                  .map((opp) => (
                    <OppCard
                      key={opp.id}
                      rank={opp.rank}
                      titulo={opp.titulo}
                      areas={opp.areas}
                      horas={opp.horas}
                      impacto={opp.impacto}
                      frecuencia={opp.frecuencia}
                      viabilidad={opp.viabilidad}
                      nodeId={opp.nodeId}
                      evidencia={opp.evidencia}
                      locked={opp.locked}
                    />
                  ))}
              </Paywall>
            ) : (
              sortedOpps
                .filter((opp) => opp.locked)
                .map((opp) => (
                  <OppCard
                    key={opp.id}
                    rank={opp.rank}
                    titulo={opp.titulo}
                    areas={opp.areas}
                    horas={opp.horas}
                    impacto={opp.impacto}
                    frecuencia={opp.frecuencia}
                    viabilidad={opp.viabilidad}
                    nodeId={opp.nodeId}
                    evidencia={opp.evidencia}
                    locked={opp.locked}
                  />
                ))
            ))}
        </div>
      </div>

      {/* Right column — sticky summary panel */}
      <SummaryPanel />
    </div>
    </>
  );
}
