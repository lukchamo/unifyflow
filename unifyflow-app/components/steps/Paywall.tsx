"use client";

/**
 * Paywall.tsx — Wraps children with a blur + lock overlay.
 * Children are rendered with a blur filter, and an absolutely-positioned
 * overlay panel prompts the user to unlock.
 */

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export interface PaywallProps {
  children: React.ReactNode;
}

export function Paywall({ children }: PaywallProps) {
  const router = useRouter();

  return (
    <div style={{ position: "relative" }}>
      {/* Blurred card content */}
      <div style={{ filter: "blur(4px)", pointerEvents: "none", userSelect: "none" }}>
        {children}
      </div>

      {/* Lock overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "24px",
            maxWidth: "280px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span style={{ fontSize: "32px" }}>🔒</span>
          <p
            style={{
              margin: 0,
              fontSize: "15px",
              fontWeight: 600,
              color: "#1A2420",
            }}
          >
            Oportunidades 2 y 3, bloqueadas
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#4A5E58",
              lineHeight: 1.5,
            }}
          >
            Su evidencia, prioridad y plan de implementación se desbloquean con
            la Radiografía.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push("/checkout")}
          >
            Desbloquear las 3 →
          </Button>
        </div>
      </div>
    </div>
  );
}
