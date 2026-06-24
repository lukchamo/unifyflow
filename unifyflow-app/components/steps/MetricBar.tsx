"use client";

/**
 * MetricBar.tsx — Horizontal metric bar with label and numeric value.
 * Renders a label, a bar track with a colored fill, and a small mono number.
 */

import React from "react";

export interface MetricBarProps {
  label: string;
  value: number; // 0–100
}

export function MetricBar({ label, value }: MetricBarProps) {
  const displayNumber = Math.round(value / 10);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "12px",
        color: "var(--accent-dk, #3C7D6E)",
      }}
    >
      <span style={{ width: "72px", flexShrink: 0 }}>{label}</span>
      <div
        style={{
          flex: 1,
          height: "6px",
          backgroundColor: "var(--accent-tint, #E8F0EE)",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            backgroundColor: "var(--accent, #3C7D6E)",
            borderRadius: "3px",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "12px",
          width: "16px",
          textAlign: "right",
          color: "var(--accent-dk, #3C7D6E)",
        }}
      >
        {displayNumber}
      </span>
    </div>
  );
}
