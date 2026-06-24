"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ProcessRow } from "./ProcessRow";
import { AddProcessCard } from "./AddProcessCard";
import type { EstadoType } from "@/components/ui/StatusPill";

// ── Static process data (local constants, no global store needed) ─────────────

interface ProcessData {
  id: string;
  label: string;
  source: string;
  area: string;
  estado: EstadoType;
}

const INITIAL_PROCESSES: ProcessData[] = [
  {
    id: "p1",
    label: "Preparar pedido",
    source: "De tu entrevista · 24 jun",
    area: "Operaciones",
    estado: "validated",
  },
  {
    id: "p2",
    label: "Coordinar envío",
    source: "De tu entrevista · 24 jun",
    area: "Operaciones",
    estado: "draft",
  },
  {
    id: "p3",
    label: "Recepción de mercancía",
    source: "Detectado en tu conversación",
    area: "Operaciones",
    estado: "opportunity",
  },
  {
    id: "p4",
    label: "Control de incidencias de almacén",
    source: "De tu entrevista · 24 jun",
    area: "Operaciones",
    estado: "draft",
  },
];

// ── ProfileView ───────────────────────────────────────────────────────────────

export function ProfileView() {
  const router = useRouter();
  const [processes, setProcesses] = React.useState<ProcessData[]>(INITIAL_PROCESSES);
  const [activeTab, setActiveTab] = React.useState<"procesos" | "notificaciones">(
    "procesos"
  );

  function handleAddProcess(label: string) {
    setProcesses((prev) => [
      ...prev,
      {
        id: `p-${Date.now()}`,
        label,
        source: "Añadido por ti",
        area: "Operaciones",
        estado: "draft",
      },
    ]);
  }

  function handleNotificacionesClick() {
    setActiveTab("notificaciones");
    router.push("/yo/notificaciones");
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
          onClick={() => setActiveTab("procesos")}
          className="px-3 py-2 text-sm font-medium border-b-2 transition-colors"
          style={{
            borderColor:
              activeTab === "procesos" ? "var(--accent)" : "transparent",
            color:
              activeTab === "procesos" ? "var(--accent-dk)" : "#9CA29E",
          }}
        >
          Mis procesos
        </button>
        <button
          onClick={handleNotificacionesClick}
          className="relative px-3 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5"
          style={{
            borderColor:
              activeTab === "notificaciones" ? "var(--accent)" : "transparent",
            color:
              activeTab === "notificaciones" ? "var(--accent-dk)" : "#9CA29E",
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
        {/* ── Profile header ─────────────────────────────────────────────── */}
        <div className="flex items-start gap-3 mb-5">
          <Avatar name="Andrés Pérez" size="lg" variant="accent" />
          <div className="flex-1 min-w-0">
            <h2
              className="font-semibold"
              style={{
                fontFamily: "var(--font-newsreader)",
                fontSize: "20px",
                color: "var(--fg)",
              }}
            >
              Andrés Pérez
            </h2>
            <p style={{ fontSize: "13px", color: "#9CA29E" }}>
              Responsable de almacén · Operaciones · Distribuciones Robledo
            </p>
          </div>
        </div>

        <Button variant="secondary" size="sm" className="mb-6 w-full">
          + Indicar un proceso nuevo
        </Button>

        {/* ── Section header ─────────────────────────────────────────────── */}
        <h3
          className="font-semibold mb-1"
          style={{ fontSize: "16px", color: "var(--fg)" }}
        >
          Mis procesos aportados
        </h3>
        <p
          className="mb-4"
          style={{
            fontSize: "12px",
            color: "#9CA29E",
            fontFamily: "var(--font-mono)",
          }}
        >
          Inventario generado de tus 2 conversaciones · última: 24 jun
        </p>

        {/* ── Process rows ─────────────────────────────────────────────── */}
        <div>
          {processes.map((p) => (
            <ProcessRow
              key={p.id}
              label={p.label}
              source={p.source}
              area={p.area}
              estado={p.estado}
            />
          ))}
        </div>

        {/* ── Add process card ────────────────────────────────────────── */}
        <AddProcessCard onAdd={handleAddProcess} />
      </div>
    </div>
  );
}
