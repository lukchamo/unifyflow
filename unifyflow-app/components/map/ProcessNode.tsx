"use client";
/**
 * ProcessNode.tsx — Custom React Flow node for process steps.
 */
import React from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { NODE_STATE_STYLES, getAreaChipColor } from "./nodeStateStyles";
import type { ProcessNodeData } from "./useMapData";

export type ProcessNodeType = Node<ProcessNodeData, "process">;

export function ProcessNode({ data, selected }: NodeProps<ProcessNodeType>) {
  const {
    label,
    area,
    estado,
    organized,
    inter,
    horas,
    notes,
  } = data;

  const style = NODE_STATE_STYLES[estado] ?? NODE_STATE_STYLES.draft;
  const areaColor = getAreaChipColor(area);
  const isSelected = selected || data.selected;

  const containerStyle: React.CSSProperties = {
    width: 144,
    padding: "11px 13px 12px",
    borderRadius: 13,
    background: style.bg,
    border: `1px solid ${isSelected ? "var(--accent)" : style.border}`,
    boxShadow: isSelected
      ? "0 0 0 2px var(--accent), 0 14px 34px rgba(28,32,30,.16)"
      : "0 2px 8px rgba(28,32,30,.06)",
    fontFamily: "inherit",
    cursor: "pointer",
    position: "relative",
  };

  const dotStyle: React.CSSProperties = {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: style.dotColor,
    flexShrink: 0,
    ...(style.dotRing
      ? {
          border: style.dotRing,
          background: "transparent",
        }
      : {}),
  };

  const areaChipStyle: React.CSSProperties = {
    fontFamily: "monospace",
    fontSize: 9.5,
    textTransform: "uppercase" as const,
    color: areaColor,
    letterSpacing: "0.04em",
    lineHeight: 1,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13.5,
    fontWeight: 600,
    color: "#1C201E",
    lineHeight: 1.35,
    marginTop: 6,
    marginBottom: organized ? 6 : 0,
  };

  const badgeBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 4,
    padding: "1px 5px",
    fontSize: 9.5,
    fontFamily: "monospace",
    lineHeight: 1.4,
    marginTop: 3,
    marginRight: 3,
  };

  return (
    <>
      {/* Target handle (top) */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "transparent",
          border: "1.5px solid #CBD3CF",
          width: 8,
          height: 8,
          borderRadius: "50%",
        }}
      />

      <div style={containerStyle}>
        {/* Header row: status dot + area chip */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={dotStyle} />
          <span style={areaChipStyle}>{area}</span>
        </div>

        {/* Label */}
        <div style={labelStyle}>{label}</div>

        {/* Status pill */}
        <div
          style={{
            ...badgeBase,
            background: style.pillBg,
            color: style.pillText,
            marginTop: 4,
          }}
        >
          {style.pillLabel}
        </div>

        {/* Conditional badges (only shown when organized) */}
        {organized && (
          <div style={{ display: "flex", flexWrap: "wrap", marginTop: 4 }}>
            {/* Hours badge for opportunity nodes */}
            {estado === "opportunity" && horas && (
              <span
                style={{
                  ...badgeBase,
                  background: "#F4E8CE",
                  color: "#8A6420",
                }}
              >
                {horas}
              </span>
            )}

            {/* Cross-area badge */}
            {inter && (
              <span
                style={{
                  ...badgeBase,
                  background: "#EEF1F6",
                  color: "#67718E",
                }}
              >
                ⤬ cruce de áreas
              </span>
            )}

            {/* Notes badge */}
            {notes > 0 && (
              <span
                style={{
                  ...badgeBase,
                  background: "#F1F3F2",
                  color: "#7A807C",
                }}
              >
                {notes} nota{notes !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Source handle (bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "transparent",
          border: "1.5px solid #CBD3CF",
          width: 8,
          height: 8,
          borderRadius: "50%",
        }}
      />
    </>
  );
}

export default ProcessNode;
