"use client";
/**
 * ProcessFlowDynamic — the SSR-safe entry point for the React Flow map.
 *
 * This wrapper intentionally does NOT statically import ProcessFlow (or
 * @xyflow/react). The factory's dynamic import is what lets `ssr: false`
 * actually skip evaluating React Flow on the server. Pages must import the
 * map from here, never from "./ProcessFlow" directly.
 *
 *   import { ProcessFlowDynamic } from "@/components/map/ProcessFlowDynamic";
 *   <ProcessFlowDynamic />
 */
import dynamic from "next/dynamic";

export const ProcessFlowDynamic = dynamic(
  () => import("./ProcessFlow").then((m) => m.ProcessFlow),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9CA29E",
          fontFamily: "var(--font-mono), monospace",
          fontSize: "12px",
        }}
      >
        Dibujando el mapa…
      </div>
    ),
  }
);

export default ProcessFlowDynamic;
