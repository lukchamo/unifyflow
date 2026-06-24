"use client";

import * as React from "react";

export interface BrowserFrameProps {
  url?: string;
  children?: React.ReactNode;
  className?: string;
}

export function BrowserFrame({
  url = "app.unifyflow.io",
  children,
  className = "",
}: BrowserFrameProps) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border ${className}`}
      style={{
        borderColor: "#D1D5D3",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}
    >
      {/* Chrome bar */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ backgroundColor: "#F4F6F5", borderBottom: "1px solid #E2E6E4" }}
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#E0867E" }}
          />
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#E8C57E" }}
          />
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#9CC79A" }}
          />
        </div>

        {/* URL bar */}
        <div
          className="flex-1 flex items-center px-3 py-1 rounded-md text-xs font-mono"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #D1D5D3",
            color: "#7A807C",
            maxWidth: "280px",
          }}
        >
          <span className="truncate">{url}</span>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto bg-white">{children}</div>
    </div>
  );
}
