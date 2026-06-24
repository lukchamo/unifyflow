"use client";

import * as React from "react";

export interface OrgFooterProps {
  nombre: string;
  sector: string;
}

export function OrgFooter({ nombre, sector }: OrgFooterProps) {
  return (
    <div
      style={{
        borderTop: "1px solid #EEF1EF",
        paddingTop: "14px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {/* Avatar + org info row */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* 30×30 rounded avatar */}
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "8px",
            background: "var(--accent-tint)",
            color: "var(--accent-dk)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-newsreader), serif",
            fontSize: "14px",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          DR
        </div>
        {/* Org details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", minWidth: 0 }}>
          <span
            style={{
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--fg, #1C201E)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {nombre}
          </span>
          <span
            style={{
              fontSize: "10.5px",
              color: "#9CA29E",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {sector}
          </span>
        </div>
      </div>

      {/* GDPR row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontFamily: "var(--font-mono), monospace",
          fontSize: "10px",
          color: "#8A908D",
        }}
      >
        {/* Dot */}
        <span
          style={{
            display: "inline-block",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "var(--accent)",
            flexShrink: 0,
          }}
        />
        <span>Datos en la UE · GDPR</span>
      </div>
    </div>
  );
}
