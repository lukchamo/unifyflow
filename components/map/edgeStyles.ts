/**
 * edgeStyles.ts — Edge visual style configuration for the React Flow map.
 */
import type { CSSProperties } from "react";

/** Base edge style (solid) */
export const baseEdgeStyle: CSSProperties = {
  stroke: "#CBD3CF",
  strokeWidth: 1.6,
  strokeLinecap: "round",
};

/** Dashed edge variant */
export const dashedEdgeStyle: CSSProperties = {
  ...baseEdgeStyle,
  strokeDasharray: "5 6",
  stroke: "#D6CFBE",
};

/** Selected / connected highlight style */
export const selectedEdgeStyle: CSSProperties = {
  stroke: "var(--accent)",
  strokeWidth: 2.2,
  opacity: 1,
  strokeLinecap: "round",
};

/** Non-connected (dimmed) when a node is selected */
export const dimmedEdgeStyle: CSSProperties = {
  opacity: 0.16,
};

export interface EdgeStyleResult {
  style: CSSProperties;
}

/**
 * Compute the combined edge style given selection state.
 * @param dashed    — whether this edge is a dashed handoff
 * @param connected — whether this edge touches the selected node
 * @param anySelected — whether any node is currently selected
 */
export function computeEdgeStyle(
  dashed: boolean,
  connected: boolean,
  anySelected: boolean
): CSSProperties {
  const base = dashed ? dashedEdgeStyle : baseEdgeStyle;
  if (!anySelected) return base;
  if (connected) return { ...base, ...selectedEdgeStyle };
  return { ...base, ...dimmedEdgeStyle };
}
