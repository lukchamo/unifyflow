"use client";

import * as React from "react";

/**
 * TypingIndicator — 3 animated dots indicating the agent is "typing".
 * Each dot uses uf-pulse animation with a staggered delay.
 */
export function TypingIndicator() {
  return (
    <div
      className="flex items-start gap-2 max-w-[85%]"
      aria-label="El agente está escribiendo"
    >
      <div
        className="flex items-center gap-1 px-4 py-3"
        style={{
          backgroundColor: "var(--accent-tint)",
          borderRadius: "16px 16px 16px 5px",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-2 h-2 rounded-full"
            style={{
              backgroundColor: "#B4C7C0",
              animation: "uf-pulse 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
