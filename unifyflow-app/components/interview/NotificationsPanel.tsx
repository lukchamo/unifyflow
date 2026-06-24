"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { useAppStore } from "@/lib/store/useAppStore";
import { NotificationCard } from "./NotificationCard";

// ── NotificationsPanel ────────────────────────────────────────────────────────

export function NotificationsPanel() {
  const router = useRouter();
  const setRole = useAppStore((s) => s.setRole);
  const setStep = useAppStore((s) => s.setStep);

  function handleVerificar() {
    setRole("validador");
    setStep("mapa");
    router.push("/app?role=validador&step=mapa");
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
    >
      {/* ── Top nav ─────────────────────────────────────────────────────── */}
      <nav
        className="flex items-center gap-1 px-4 pt-4 pb-0 border-b border-[#EEF1EF]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <button
          onClick={() => router.push("/yo/procesos")}
          className="px-3 py-2 text-sm font-medium border-b-2 transition-colors"
          style={{
            borderColor: "transparent",
            color: "#9CA29E",
          }}
        >
          Mis procesos
        </button>
        <button
          className="relative px-3 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5"
          style={{
            borderColor: "var(--accent)",
            color: "var(--accent-dk)",
          }}
        >
          Notificaciones
          <span
            className="inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: "var(--accent)", fontSize: "10px" }}
          >
            3
          </span>
        </button>
        <div className="ml-auto pb-2">
          <Avatar name="Andrés Pérez" size="sm" variant="accent" />
        </div>
      </nav>

      <div className="px-4 pt-5 pb-8 max-w-lg mx-auto">
        {/* ── Title ──────────────────────────────────────────────────────── */}
        <div className="flex items-baseline justify-between mb-1">
          <h1
            role="heading"
            style={{
              fontFamily: "var(--font-newsreader)",
              fontSize: "24px",
              fontWeight: 600,
              color: "var(--fg)",
            }}
          >
            Notificaciones
          </h1>
        </div>
        <p
          className="mb-5"
          style={{
            fontSize: "12px",
            color: "#9CA29E",
            fontFamily: "var(--font-mono)",
          }}
        >
          3 pendientes ·{" "}
          <button
            className="underline"
            style={{ color: "var(--accent-dk)" }}
          >
            Marcar todo leído
          </button>
        </p>

        {/* ── Section: Pendiente de verificar ────────────────────────── */}
        <p
          className="font-medium mb-3"
          style={{
            fontSize: "11px",
            color: "#9CA29E",
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Pendiente de verificar
        </p>

        <NotificationCard
          variant="verify"
          message={
            <>
              <strong>Marta Ruiz</strong>
              {" te pidió validar "}
              <strong>&ldquo;Elaborar presupuesto&rdquo;</strong>
            </>
          }
          meta="Cruza con tu área · hace 2 h"
          actions={[
            { label: "Después", variant: "ghost" },
            { label: "Verificar", variant: "primary", onClick: handleVerificar },
          ]}
        />

        {/* ── Section: Comentarios y sugerencias ─────────────────────── */}
        <p
          className="font-medium mb-3 mt-5"
          style={{
            fontSize: "11px",
            color: "#9CA29E",
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Comentarios y sugerencias
        </p>

        <NotificationCard
          variant="comment"
          message={
            <>
              <strong>Lucía Vidal</strong>
              {" comentó en "}
              <strong>&ldquo;Coordinar envío&rdquo;</strong>
            </>
          }
          quote="&ldquo;¿Avisas tú al cliente de la fecha, o lo hace Atención? No me queda claro.&rdquo;"
          meta="hace 5 h"
          actions={[{ label: "Responder", variant: "secondary" }]}
        />

        <NotificationCard
          variant="suggestion"
          message={
            <>
              <strong>Javier León</strong>
              {" sugiere fusionar "}
              <strong>&ldquo;Recepción de mercancía&rdquo;</strong>
              {" con "}
              <strong>&ldquo;Preparar pedido&rdquo;</strong>
            </>
          }
          meta="Afecta a un proceso que aportaste · ayer"
          actions={[{ label: "Revisar", variant: "secondary" }]}
        />
      </div>
    </div>
  );
}
