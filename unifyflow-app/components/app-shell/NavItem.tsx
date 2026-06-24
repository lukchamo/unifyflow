"use client";

import * as React from "react";
import type { NavStep } from "@/lib/store/useAppStore";

export interface NavItemProps {
  step: NavStep;
  n: number;
  label: string;
  active: boolean;
  onClick: (step: NavStep) => void;
}

export function NavItem({ step, n, label, active, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(step)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        width: "100%",
        padding: "7px 10px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        background: active ? "var(--accent-tint)" : "transparent",
        color: active ? "var(--accent-dk)" : "#5A615D",
        fontWeight: active ? 600 : 500,
        fontSize: "13.5px",
        textAlign: "left",
        transition: "background 0.15s",
      }}
    >
      {/* Number chip */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "22px",
          height: "22px",
          borderRadius: "7px",
          fontFamily: "var(--font-mono), monospace",
          fontSize: "11px",
          fontWeight: 600,
          flexShrink: 0,
          background: active ? "var(--accent)" : "#EEF1EF",
          color: active ? "#ffffff" : "#9CA29E",
        }}
      >
        {n}
      </span>
      <span>{label}</span>
    </button>
  );
}
