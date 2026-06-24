"use client";

import * as React from "react";
import { StatusPill } from "@/components/ui/StatusPill";
import type { EstadoType } from "@/components/ui/StatusPill";

export interface ProcessRowProps {
  label: string;
  source: string;
  area: string;
  estado: EstadoType;
}

export function ProcessRow({ label, source, area, estado }: ProcessRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-[#EEF1EF] last:border-0">
      <div className="flex-1 min-w-0">
        <p
          className="truncate"
          style={{ fontSize: "15px", fontWeight: 600, color: "var(--fg)" }}
        >
          {label}
        </p>
        <p
          className="mt-0.5"
          style={{
            fontSize: "12px",
            color: "#9CA29E",
            fontFamily: "var(--font-mono)",
          }}
        >
          {source}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className="px-2 py-0.5 rounded text-xs font-medium"
          style={{ backgroundColor: "#EEF1EF", color: "#5A6B61" }}
        >
          {area}
        </span>
        <StatusPill estado={estado} />
      </div>
    </div>
  );
}
