"use client";

import Link from "next/link";
import type { ProcessNode } from "@/lib/schemas";
import { StatusPill } from "@/components/ui/StatusPill";

// Static node-graph motif — echoes the live process map. Hoisted so it isn't
// re-created per render (rendering-hoist-jsx).
function GraphMotif({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 220 56"
      className="w-full"
      style={{ height: 56 }}
      fill="none"
      aria-hidden
    >
      <path
        d="M14 40h36c8 0 8-24 16-24h44c8 0 8 24 16 24h40"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path d="M126 16h34c8 0 8 24 16 24h30" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.28" strokeDasharray="3 4" />
      <circle cx="14" cy="40" r="4" fill={color} opacity="0.9" />
      <circle cx="70" cy="16" r="5.5" fill="#fff" stroke={color} strokeWidth="1.6" />
      <circle cx="126" cy="16" r="4" fill={color} opacity="0.55" />
      <circle cx="160" cy="40" r="5.5" fill="#fff" stroke={color} strokeWidth="1.6" />
      <circle cx="206" cy="40" r="4" fill={color} opacity="0.85" />
    </svg>
  );
}

export interface ProcessCardProps {
  node: ProcessNode;
  ownerName: string;
  areaColor: string;
  index: number;
}

export function ProcessCard({ node, ownerName, areaColor, index }: ProcessCardProps) {
  const ownerInitial = ownerName?.[0]?.toUpperCase() ?? "·";

  return (
    <Link
      href={`/procesos/${node.id}`}
      className="panel-card panel-up group flex flex-col rounded-2xl bg-white p-5"
      style={{
        border: "1px solid #ECE8DC",
        animationDelay: `${Math.min(index, 8) * 55}ms`,
      }}
    >
      {/* Area + status */}
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em]"
          style={{ fontFamily: "var(--font-mono), monospace", color: "#8A8E86" }}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: areaColor }} />
          {node.area}
        </span>
        <StatusPill estado={node.estado} />
      </div>

      {/* Title */}
      <h3
        className="mt-3 text-[21px] leading-[1.18]"
        style={{
          fontFamily: "var(--font-newsreader), serif",
          color: "var(--fg)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {node.label}
      </h3>

      {/* Description */}
      <p
        className="mt-1.5 text-[13.5px] leading-relaxed"
        style={{
          color: "#6B6F69",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: 40,
        }}
      >
        {node.desc}
      </p>

      {/* Graph motif */}
      <div className="mt-4 rounded-xl px-3 py-3" style={{ background: "#FAF9F4", border: "1px solid #F0EDE3" }}>
        <GraphMotif color={areaColor} />
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span
            className="grid h-6 w-6 place-items-center rounded-full text-[11px] font-medium text-white"
            style={{ background: areaColor }}
          >
            {ownerInitial}
          </span>
          <span className="text-[13px]" style={{ color: "#5B5F58" }}>
            {ownerName}
          </span>
        </span>

        {node.horas ? (
          <span
            className="rounded-full px-2.5 py-1 text-[12px] font-medium"
            style={{ background: "#F4E8CE", color: "#8A6420" }}
          >
            {node.horas}
          </span>
        ) : (
          <span className="text-[12px]" style={{ color: "#A7AAA3" }}>
            {node.steps.length} pasos
          </span>
        )}
      </div>
    </Link>
  );
}
