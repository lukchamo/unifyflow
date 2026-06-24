"use client";

/**
 * RadiographyStep.tsx — "Radiografía de procesos + IA" step.
 * Grid: 1fr 264px (stacks to 1 col on mobile).
 * bg #EEF1EF. Renders DocumentSheet + ExportPanel.
 */

import React from "react";
import { DocumentSheet } from "./DocumentSheet";
import { ExportPanel } from "./ExportPanel";

export interface RadiographyStepProps {
  onExport?: () => void;
}

export function RadiographyStep({ onExport }: RadiographyStepProps) {
  return (
    <>
      <style>{`
        .radiography-step {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 264px;
          gap: 32px;
          align-items: flex-start;
          background-color: #EEF1EF;
          min-height: 100%;
          padding: 32px;
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
          .radiography-step {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .radiography-step .export-panel-wrapper {
            order: -1;
          }
        }
      `}</style>
      <div className="radiography-step">
        {/* Left: document sheet */}
        <DocumentSheet />

        {/* Right: sticky export panel */}
        <div className="export-panel-wrapper">
          <ExportPanel onExport={onExport} />
        </div>
      </div>
    </>
  );
}
