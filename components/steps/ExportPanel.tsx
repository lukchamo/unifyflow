"use client";

/**
 * ExportPanel.tsx — Sticky 264px panel with PDF export and next-step CTAs.
 * "El entregable" card + "Próximo paso" card.
 */

import React from "react";
import { Button } from "@/components/ui/Button";

export interface ExportPanelProps {
  onExport?: () => void;
}

export function ExportPanel({ onExport = () => window.print() }: ExportPanelProps) {
  function handleShareableLink() {
    // no-op / toast ok
  }

  return (
    <div
      className="no-print"
      style={{
        width: "264px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        position: "sticky",
        top: "24px",
        alignSelf: "flex-start",
      }}
    >
      {/* Card: El entregable */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #E3E6E4",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 6px",
              fontFamily: "monospace",
              fontSize: "10px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--accent-dk, #2C6457)",
            }}
          >
            El entregable
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#6B7775",
              lineHeight: 1.5,
            }}
          >
            Presentable a tu dirección sin tocar el diseño.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Button
            onClick={onExport}
            style={{ width: "100%", justifyContent: "center" }}
          >
            Exportar PDF
          </Button>
          <Button
            variant="secondary"
            onClick={handleShareableLink}
            style={{ width: "100%", justifyContent: "center" }}
          >
            Enlace compartible
          </Button>
        </div>
      </div>

      {/* Card: Próximo paso */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #E3E6E4",
          padding: "20px",
        }}
      >
        <p
          style={{
            margin: "0 0 10px",
            fontFamily: "monospace",
            fontSize: "10px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--accent-dk, #2C6457)",
          }}
        >
          Próximo paso
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "#4A5E58",
            lineHeight: 1.6,
          }}
        >
          Las 3 oportunidades son la puerta a{" "}
          <strong>&ldquo;y te lo construimos&rdquo;</strong>. El mapa es el imán;
          la ejecución, la conversión.
        </p>
      </div>
    </div>
  );
}
