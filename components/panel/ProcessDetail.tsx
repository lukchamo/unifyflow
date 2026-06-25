"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store/useAppStore";
import { useAuth } from "@/components/auth/AuthProvider";
import { AREA_COLORS } from "@/lib/data/mockData";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";

export function ProcessDetail({ id }: { id: string }) {
  const nodes = useAppStore((s) => s.nodes);
  const team = useAppStore((s) => s.team);
  const validateNode = useAppStore((s) => s.validateNode);
  const addStep = useAppStore((s) => s.addStep);
  const { memberId } = useAuth();

  const [stepInput, setStepInput] = useState("");

  const node = nodes.find((n) => n.id === id);

  if (!node) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-[20px]" style={{ fontFamily: "var(--font-newsreader), serif", color: "var(--fg)" }}>
          {nodes.length === 0 ? "Cargando proceso…" : "Proceso no encontrado"}
        </p>
        <Link href="/procesos" className="text-[13px] font-medium hover:underline" style={{ color: "var(--accent-dk)" }}>
          ← Volver a procesos
        </Link>
      </div>
    );
  }

  const areaColor = AREA_COLORS[node.area] ?? "var(--accent)";
  const owner = team.find((m) => m.id === node.ownerMemberId)?.nombre ?? "Sin asignar";

  function onAddStep() {
    if (stepInput.trim().length < 2) return;
    addStep(id, stepInput.trim());
    setStepInput("");
  }

  return (
    <div className="pt-8">
      <Link href="/procesos" className="text-[13px] transition-colors hover:underline" style={{ color: "#6B6F69" }}>
        ← Procesos
      </Link>

      <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        {/* Main */}
        <div>
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em]"
              style={{ fontFamily: "var(--font-mono), monospace", color: "#8A8E86" }}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: areaColor }} />
              {node.area}
            </span>
            <StatusPill estado={node.estado} />
          </div>

          <h1
            className="mt-3 text-[36px] leading-[1.08]"
            style={{ fontFamily: "var(--font-newsreader), serif", color: "var(--fg)", letterSpacing: "-0.01em" }}
          >
            {node.label}
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed" style={{ color: "#55594F" }}>
            {node.desc}
          </p>

          {/* Steps */}
          <div className="mt-8">
            <h2 className="text-[13px] uppercase tracking-[0.14em]" style={{ fontFamily: "var(--font-mono), monospace", color: "#9A9588" }}>
              Pasos del proceso
            </h2>
            <ol className="mt-3 flex flex-col gap-2">
              {node.steps.map((step, i) => (
                <li
                  key={`${step}-${i}`}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: "#fff", border: "1px solid #ECE8DC" }}
                >
                  <span
                    className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full text-[12px] font-medium"
                    style={{ background: "var(--accent-tint)", color: "var(--accent-dk)" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[14px]" style={{ color: "var(--fg)" }}>
                    {step}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-3 flex gap-2">
              <input
                value={stepInput}
                onChange={(e) => setStepInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onAddStep()}
                placeholder="Añadir un paso…"
                className="h-10 flex-1 rounded-lg px-3 text-sm outline-none focus:border-[var(--accent)]"
                style={{ border: "1px solid #E2DECF", background: "#FCFBF7", color: "var(--fg)" }}
              />
              <Button variant="secondary" size="sm" onClick={onAddStep} disabled={stepInput.trim().length < 2}>
                Añadir
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid #ECE8DC" }}>
            <Meta label="Responsable" value={owner} />
            <Meta label="Área" value={node.area} />
            <Meta label="Estado" value={node.estado === "validated" ? "Validado" : node.estado === "opportunity" ? "Oportunidad IA" : "Borrador"} />
            {node.horas ? <Meta label="Ahorro estimado" value={node.horas} /> : null}
            <Meta
              label="Origen"
              value={node.sourceInterviewIds.length > 0 ? `${node.sourceInterviewIds.length} entrevista(s)` : "Creado a mano"}
              last
            />
          </div>

          {node.estado !== "validated" ? (
            <Button onClick={() => validateNode(id, memberId ?? node.ownerMemberId)}>
              Validar proceso
            </Button>
          ) : (
            <div
              className="flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium"
              style={{ background: "var(--accent-tint)", color: "var(--accent-dk)" }}
            >
              ✓ Proceso validado
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Meta({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className="flex items-center justify-between py-2.5"
      style={{ borderBottom: last ? "none" : "1px solid #F1EEE4" }}
    >
      <span className="text-[12px]" style={{ color: "#9A9588" }}>
        {label}
      </span>
      <span className="text-[13.5px] font-medium" style={{ color: "var(--fg)" }}>
        {value}
      </span>
    </div>
  );
}
