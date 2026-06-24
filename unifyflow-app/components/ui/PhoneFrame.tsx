"use client";

import * as React from "react";

export interface PhoneFrameProps {
  time?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PhoneFrame({
  time = "9:41",
  children,
  className = "",
}: PhoneFrameProps) {
  return (
    <div
      className={`relative flex flex-col overflow-hidden ${className}`}
      style={{
        backgroundColor: "#15201C",
        borderRadius: "46px",
        padding: "12px",
        width: "280px",
        minHeight: "560px",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.08), 0 24px 64px rgba(0,0,0,0.5)",
      }}
    >
      {/* Notch */}
      <div
        className="mx-auto mb-2 flex-shrink-0"
        style={{
          width: "80px",
          height: "26px",
          backgroundColor: "#15201C",
          borderRadius: "0 0 18px 18px",
          zIndex: 10,
        }}
      />

      {/* Screen */}
      <div
        className="flex flex-col flex-1 overflow-hidden"
        style={{
          backgroundColor: "#FBFCFB",
          borderRadius: "36px",
          overflow: "hidden",
        }}
      >
        {/* Status bar */}
        <div
          className="flex items-center justify-between px-4 py-2 flex-shrink-0"
          style={{
            backgroundColor: "#FBFCFB",
          }}
        >
          <span className="text-[11px] font-mono font-medium text-[#1C201E]">
            {time}
          </span>
          <span className="text-[11px] font-mono text-[#1C201E]">
            ●●● ▮
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
