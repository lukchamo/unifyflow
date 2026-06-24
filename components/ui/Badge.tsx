"use client";

import * as React from "react";

export type BadgeTone = "accent" | "neutral" | "warning" | "success";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: React.ReactNode;
}

const toneStyles: Record<BadgeTone, React.CSSProperties> = {
  accent: {
    backgroundColor: "var(--accent-tint)",
    color: "var(--accent-dk)",
  },
  neutral: {
    backgroundColor: "#EEF1EF",
    color: "#7A807C",
  },
  warning: {
    backgroundColor: "#F4E8CE",
    color: "#8A6420",
  },
  success: {
    backgroundColor: "var(--accent-tint)",
    color: "var(--accent)",
  },
};

export function Badge({
  tone = "accent",
  children,
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-medium leading-none ${className}`}
      style={toneStyles[tone]}
      {...props}
    >
      {children}
    </span>
  );
}
