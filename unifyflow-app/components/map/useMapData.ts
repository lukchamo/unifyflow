/**
 * useMapData.ts — Maps the Zustand app store to React Flow nodes and edges.
 */
import { useMemo } from "react";
import type { Node, Edge } from "@xyflow/react";
import { useAppStore } from "@/lib/store/useAppStore";
import { computeEdgeStyle } from "./edgeStyles";

/** Data carried in each React Flow node for ProcessNode rendering. */
export interface ProcessNodeData extends Record<string, unknown> {
  label: string;
  area: string;
  estado: string;
  organized: boolean;
  inter: boolean;
  horas: string | null;
  notes: number;
  selected: boolean;
  /** True when a non-"all" filter is active and this node's estado doesn't match. */
  dimmed: boolean;
}

/** Data carried in each React Flow edge. */
export interface ProcessEdgeData extends Record<string, unknown> {
  dashed: boolean;
}

export type ProcessFlowNode = Node<ProcessNodeData, "process">;
export type ProcessFlowEdge = Edge<ProcessEdgeData>;

export function useMapData(): {
  nodes: ProcessFlowNode[];
  edges: ProcessFlowEdge[];
} {
  const storeNodes = useAppStore((s) => s.nodes);
  const storeEdges = useAppStore((s) => s.edges);
  const comments = useAppStore((s) => s.comments);
  const mapState = useAppStore((s) => s.mapState);

  const { organized, selectedId, filter } = mapState;

  const nodes: ProcessFlowNode[] = useMemo(() => {
    return storeNodes.map((n) => {
      // Count comments for this node
      const notes = comments.filter((c) => c.nodeId === n.id).length;

      // Dimmed when a non-"all" filter is active and this node's estado doesn't match
      const dimmed = filter !== "all" && n.estado !== filter;

      return {
        id: n.id,
        type: "process" as const,
        position: organized ? n.posB : n.posA,
        data: {
          label: n.label,
          area: n.area,
          estado: n.estado,
          organized,
          inter: n.inter,
          horas: n.horas,
          notes,
          selected: n.id === selectedId,
          dimmed,
        },
      };
    });
  }, [storeNodes, comments, organized, selectedId, filter]);

  const edges: ProcessFlowEdge[] = useMemo(() => {
    const anySelected = selectedId !== null;

    // Build a set of edge IDs connected to the selected node
    const connectedEdgeIds = new Set<string>();
    if (anySelected) {
      storeEdges.forEach((e) => {
        if (e.fromNodeId === selectedId || e.toNodeId === selectedId) {
          connectedEdgeIds.add(e.id);
        }
      });
    }

    return storeEdges.map((e) => {
      const connected = connectedEdgeIds.has(e.id);
      const style = computeEdgeStyle(e.dashed, connected, anySelected);

      return {
        id: e.id,
        source: e.fromNodeId,
        target: e.toNodeId,
        data: { dashed: e.dashed },
        style,
      };
    });
  }, [storeEdges, selectedId]);

  return { nodes, edges };
}
