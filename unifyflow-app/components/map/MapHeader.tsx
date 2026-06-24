"use client";
/**
 * MapHeader.tsx — Top header bar for the map view.
 *
 * Layout: white bg, bottom border #E7EAE8, padding ~18px 34px.
 * Left: kicker "Momento espejo · paso 3", title, subtitle.
 * Right: "En vivo" pill, "↺ Repetir" button, "✦ Reorganizar con IA" / "✓ Reorganizado por IA" button.
 */

import React from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { selectStatusText } from "@/lib/store/selectors";

export interface MapHeaderProps {
  /** Override for the "Reorganizar con IA" button handler. Defaults to store reorganize(). */
  onReorganize?: () => void;
  /** Override for the "↺ Repetir" button handler. Defaults to store replay(). */
  onReplay?: () => void;
}

export function MapHeader({ onReorganize, onReplay }: MapHeaderProps = {}) {
  const org = useAppStore((s) => s.org);
  const mapState = useAppStore((s) => s.mapState);
  const storeReplay = useAppStore((s) => s.replay);
  const storeReorganize = useAppStore((s) => s.reorganize);
  const statusText = useAppStore(selectStatusText);

  const { organized } = mapState;

  const handleReplay = onReplay ?? storeReplay;
  const handleReorganize = onReorganize ?? storeReorganize;

  return (
    <header
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #E7EAE8",
        padding: "18px 34px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      {/* ── Left: text content ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Kicker */}
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 10.5,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.09em",
            color: "var(--accent-dk)",
            marginBottom: 4,
          }}
        >
          Momento espejo · paso 3
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-newsreader), Georgia, serif",
            fontSize: 24,
            fontWeight: 500,
            color: "#1C201E",
            margin: 0,
            lineHeight: 1.25,
          }}
        >
          Así trabaja {org.nombre} hoy.
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 13,
            color: "#5A615D",
            margin: "4px 0 0 0",
            lineHeight: 1.5,
          }}
        >
          Se dibujó solo a partir de 7 entrevistas. {statusText}.
        </p>
      </div>

      {/* ── Right: controls ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}
      >
        {/* En vivo pill */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px",
            borderRadius: 999,
            backgroundColor: "var(--accent-tint)",
            color: "var(--accent-dk)",
            fontFamily: "monospace",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.04em",
            userSelect: "none",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: "var(--accent)",
              animation: "uf-pulse 1.6s infinite",
            }}
          />
          En vivo
        </span>

        {/* Repetir button */}
        <button
          type="button"
          onClick={handleReplay}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "6px 13px",
            borderRadius: 8,
            border: "1px solid #E2E6E4",
            backgroundColor: "#ffffff",
            color: "#1C201E",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            transition: "opacity 150ms",
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.75";
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "1";
          }}
        >
          ↺ Repetir
        </button>

        {/* Reorganize button */}
        {organized ? (
          <button
            type="button"
            disabled
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 13px",
              borderRadius: 8,
              border: "1px solid var(--accent)",
              backgroundColor: "var(--accent-tint)",
              color: "var(--accent-dk)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "default",
              userSelect: "none",
            }}
          >
            ✓ Reorganizado por IA
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReorganize}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 14px",
              borderRadius: 8,
              border: "none",
              backgroundColor: "var(--accent)",
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(60,125,110,0.28)",
              transition: "filter 150ms",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.filter =
                "brightness(0.9)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.filter = "none";
            }}
          >
            ✦ Reorganizar con IA
          </button>
        )}
      </div>
    </header>
  );
}
