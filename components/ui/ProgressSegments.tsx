"use client";

import * as React from "react";

export interface ProgressSegmentsProps {
  total: number;
  active: number;
  className?: string;
}

export function ProgressSegments({
  total,
  active,
  className = "",
}: ProgressSegmentsProps) {
  return (
    <div
      className={`flex gap-1 items-center ${className}`}
      role="progressbar"
      aria-valuenow={active}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      {Array.from({ length: total }, (_, i) => {
        const isActive = i < active;
        return (
          <div
            key={i}
            data-segment
            data-active={isActive}
            className="h-1.5 flex-1 rounded-full transition-colors"
            style={{
              backgroundColor: isActive ? "var(--accent)" : "#E2E6E4",
            }}
          />
        );
      })}
    </div>
  );
}
