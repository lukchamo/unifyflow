"use client";
/**
 * ProcessFlow.tsx — React Flow canvas rendering the process map.
 * Must be imported via next/dynamic with { ssr: false }.
 */
import "@xyflow/react/dist/style.css";
import React, { useCallback } from "react";
import dynamic from "next/dynamic";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  type NodeMouseHandler,
} from "@xyflow/react";
import { ProcessNode } from "./ProcessNode";
import { useMapData } from "./useMapData";
import { useAppStore } from "@/lib/store/useAppStore";

const nodeTypes = {
  process: ProcessNode,
};

function ProcessFlowInner() {
  const { nodes, edges } = useMapData();
  const selectNode = useAppStore((s) => s.selectNode);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        panOnScroll
        zoomOnPinch
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="#E0E4E2"
          gap={20}
          size={1.5}
        />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

export function ProcessFlow() {
  return <ProcessFlowInner />;
}

/**
 * ProcessFlowDynamic — next/dynamic wrapper for SSR-safe import in pages.
 *
 * Usage in a page/layout:
 *   import { ProcessFlowDynamic } from "@/components/map/ProcessFlow";
 *   // Then render: <ProcessFlowDynamic />
 */
export const ProcessFlowDynamic = dynamic(
  () => Promise.resolve(ProcessFlow),
  { ssr: false }
);

export default ProcessFlow;
