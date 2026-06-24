"use client";

import * as React from "react";

export type EstadoType = "draft" | "validated" | "opportunity";

export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  estado: EstadoType;
}

interface StatusConfig {
  label: string;
  containerStyle: React.CSSProperties;
  textStyle: React.CSSProperties;
  dot: React.ReactNode;
}

const STATUS_CONFIG: Record<EstadoType, StatusConfig> = {
  validated: {
    label: "Validado",
    containerStyle: { backgroundColor: "var(--accent-tint)" },
    textStyle: { color: "var(--accent-dk)" },
    dot: (
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: "var(--accent)" }}
        aria-hidden="true"
      />
    ),
  },
  draft: {
    label: "Borrador",
    containerStyle: { backgroundColor: "#EEF1EF" },
    textStyle: { color: "#7A807C" },
    dot: (
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{
          boxShadow: "0 0 0 1.5px #BBC0BC",
          backgroundColor: "transparent",
        }}
        aria-hidden="true"
      />
    ),
  },
  opportunity: {
    label: "Oportunidad IA",
    containerStyle: { backgroundColor: "#F4E8CE" },
    textStyle: { color: "#8A6420" },
    dot: (
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: "#B58238" }}
        aria-hidden="true"
      />
    ),
  },
};

export function StatusPill({ estado, className = "", ...props }: StatusPillProps) {
  const config = STATUS_CONFIG[estado];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
      style={{ ...config.containerStyle, ...config.textStyle }}
      {...props}
    >
      {config.dot}
      {config.label}
    </span>
  );
}
