"use client";

/**
 * DocumentSheet.tsx — Branded one-page process radiography document.
 * White "sheet" with radius 6px, big shadow, padding ~46px 48px.
 * Contains: kicker, H1, subtitle, mini-map chain, two-column inventory +
 * opportunities, and a footer.
 */

import React from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { selectTotalHours } from "@/lib/store/selectors";

// ── Dot color by estado ───────────────────────────────────────────────────────

function StatusDot({ estado }: { estado: string }) {
  let bg = "transparent";
  let border = "none";

  if (estado === "validated") {
    bg = "var(--accent, #3C7D6E)";
  } else if (estado === "opportunity") {
    bg = "#B58238";
  } else {
    // draft
    bg = "transparent";
    border = "1.5px solid #BBC0BC";
  }

  return (
    <span
      style={{
        display: "inline-block",
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: bg,
        border,
        flexShrink: 0,
        marginTop: "2px",
      }}
    />
  );
}

// ── Mini-map chain pills ──────────────────────────────────────────────────────

function MiniMapChain() {
  const areas = [
    { label: "Comercial", highlighted: false },
    { label: "Presupuesto · IA", highlighted: true },
    { label: "Operaciones", highlighted: false },
    { label: "Finanzas", highlighted: false },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "monospace",
          fontSize: "10px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#A8AEAA",
        }}
      >
        El mapa validado
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {areas.map((area, i) => (
          <React.Fragment key={area.label}>
            {i > 0 && (
              <span
                style={{
                  fontSize: "11px",
                  color: "#A8AEAA",
                  flexShrink: 0,
                }}
              >
                →
              </span>
            )}
            <span
              style={{
                fontSize: "12px",
                padding: "3px 8px",
                borderRadius: "4px",
                backgroundColor: area.highlighted ? "#FCF8EE" : "#F4F6F5",
                border: area.highlighted
                  ? "1px solid #E9D8B2"
                  : "1px solid #E3E6E4",
                color: area.highlighted ? "#7A5C1E" : "#4A5E58",
                fontWeight: area.highlighted ? 500 : 400,
                whiteSpace: "nowrap",
              }}
            >
              {area.label}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ── DocumentSheet ─────────────────────────────────────────────────────────────

export function DocumentSheet() {
  const org = useAppStore((s) => s.org);
  const nodes = useAppStore((s) => s.nodes);
  const opps = useAppStore((s) => s.opps);
  const interviews = useAppStore((s) => s.interviews);
  const totalHours = useAppStore(selectTotalHours);

  const sortedOpps = [...opps].sort((a, b) => a.rank - b.rank);

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "6px",
        boxShadow:
          "0 4px 6px -1px rgba(0,0,0,0.07), 0 10px 30px -5px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)",
        padding: "46px 48px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative accent rombo top-right */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "24px",
          right: "24px",
          width: "18px",
          height: "18px",
          backgroundColor: "var(--accent, #3C7D6E)",
          transform: "rotate(45deg)",
          opacity: 0.7,
        }}
      />

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        {/* Kicker */}
        <p
          style={{
            margin: "0 0 12px",
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--accent-dk, #2C6457)",
          }}
        >
          Radiografía de procesos + IA
        </p>

        {/* H1 */}
        <h1
          style={{
            margin: "0 0 8px",
            fontFamily: "Newsreader, Georgia, serif",
            fontSize: "30px",
            fontWeight: 400,
            color: "#1C201E",
            lineHeight: 1.2,
          }}
        >
          {org.nombre}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#6B7775",
            lineHeight: 1.5,
          }}
        >
          {org.sector} · 24 jun 2026
        </p>
      </div>

      {/* Mini-map chain */}
      <div
        style={{
          marginBottom: "32px",
          paddingBottom: "24px",
          borderBottom: "1px solid #EEF0EF",
        }}
      >
        <MiniMapChain />
      </div>

      {/* Two columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          marginBottom: "32px",
        }}
      >
        {/* Left: Inventario de procesos */}
        <div>
          <p
            style={{
              margin: "0 0 14px",
              fontFamily: "monospace",
              fontSize: "10px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#A8AEAA",
            }}
          >
            Inventario de procesos
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {nodes.map((node) => (
              <div
                key={node.id}
                data-testid="inventory-row"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <StatusDot estado={node.estado} />
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#1C201E",
                      lineHeight: 1.4,
                    }}
                  >
                    {node.label}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "monospace",
                      fontSize: "10px",
                      color: "#A8AEAA",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {node.area}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Oportunidades priorizadas */}
        <div>
          <p
            style={{
              margin: "0 0 14px",
              fontFamily: "monospace",
              fontSize: "10px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#A8AEAA",
            }}
          >
            Oportunidades priorizadas
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {sortedOpps.map((opp) => (
              <div key={opp.id}>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontSize: "13px",
                    color: "#1C201E",
                    lineHeight: 1.4,
                  }}
                >
                  {opp.rank} · {opp.titulo}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "monospace",
                    fontSize: "11px",
                    color: "var(--accent-dk, #2C6457)",
                  }}
                >
                  {opp.horas}
                </p>
              </div>
            ))}
          </div>

          {/* Summary box: Potencial total */}
          <div
            style={{
              marginTop: "20px",
              backgroundColor: "var(--accent-tint, #E7F0ED)",
              borderRadius: "6px",
              padding: "14px 16px",
            }}
          >
            <p
              style={{
                margin: "0 0 4px",
                fontFamily: "monospace",
                fontSize: "10px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--accent-dk, #2C6457)",
              }}
            >
              Potencial total
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "Newsreader, Georgia, serif",
                fontSize: "24px",
                fontWeight: 400,
                color: "var(--accent-dk, #2C6457)",
                lineHeight: 1.2,
              }}
            >
              {`${totalHours}/semana`}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          paddingTop: "20px",
          borderTop: "1px solid #EEF0EF",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "11px",
            color: "#A8AEAA",
          }}
        >
          Validado por {interviews.length} personas · cada nodo es trazable a su
          entrevista
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.06em",
            color: "#A8AEAA",
          }}
        >
          UnifyFlow
        </p>
      </div>
    </div>
  );
}
