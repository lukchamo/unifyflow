"use client";

import * as React from "react";

export interface AgentBubbleProps {
  text: string;
}

/**
 * AgentBubble — chat bubble for agent/AI messages.
 * Left-aligned, asymmetric radius (top-right corner square).
 */
export function AgentBubble({ text }: AgentBubbleProps) {
  return (
    <div className="flex items-start gap-2 max-w-[85%]">
      <div
        className="px-4 py-3 text-sm leading-relaxed"
        style={{
          backgroundColor: "var(--accent-tint)",
          color: "#234A41",
          borderRadius: "16px 16px 16px 5px",
        }}
      >
        {text}
      </div>
    </div>
  );
}
