"use client";

import * as React from "react";

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function Pill({ children, className = "", ...props }: PillProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono tracking-wide ${className}`}
      style={{
        backgroundColor: "var(--accent-tint)",
        color: "var(--accent-dk)",
      }}
      {...props}
    >
      {children}
    </span>
  );
}
