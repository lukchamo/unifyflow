"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store/useAppStore";
import { AREA_COLORS } from "@/lib/data/mockData";
import { ProcessCard } from "@/components/panel/ProcessCard";
import { NewProcessDialog } from "@/components/panel/NewProcessDialog";

function orgInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function parseHoras(horas: string | null): number {
  if (!horas) return 0;
  const m = horas.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

const PRIMARY = (
  <button
    className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-white transition-all hover:brightness-110 active:scale-[0.98]"
    style={{ background: "#1C201E", boxShadow: "0 8px 20px -10px rgba(28,32,30,.6)" }}
  >
    <span style={{ fontSize: 16, lineHeight: 0 }}>+</span> Nuevo proceso
  </button>
);

export function ProcessPanel() {
  const org = useAppStore((s) => s.org);
  const nodes = useAppStore((s) => s.nodes);
  const team = useAppStore((s) => s.team);

  const ownerName = useMemo(() => {
    const map = new Map(team.map((m) => [m.id, m.nombre]));
    return (id: string) => map.get(id) ?? "Sin asignar";
  }, [team]);

  const stats = useMemo(() => {
    let validated = 0;
    let opportunity = 0;
    let hours = 0;
    for (const n of nodes) {
      if (n.estado === "validated") validated++;
      if (n.estado === "opportunity") opportunity++;
      hours += parseHoras(n.horas);
    }
    return { total: nodes.length, validated, opportunity, hours };
  }, [nodes]);

  return (
    <>
      {/* Header */}
      <section className="flex flex-col gap-6 pt-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span
            className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-2xl text-lg font-semibold text-white"
            style={{
              background: "linear-gradient(150deg, var(--accent) 0%, var(--accent-dk) 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,.25), 0 8px 20px -12px rgba(44,100,87,.6)",
            }}
          >
            {orgInitials(org.nombre)}
          </span>
          <div>
            <h1
              className="text-[34px] leading-[1.05] sm:text-[40px]"
              style={{ fontFamily: "var(--font-newsreader), serif", color: "var(--fg)", letterSpacing: "-0.01em" }}
            >
              {org.nombre}
            </h1>
            <p className="mt-1 text-[14px]" style={{ color: "#6B6F69" }}>
              {org.sector}
            </p>
            <Link
              href="/app?step=mapa"
              className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium transition-colors hover:underline"
              style={{ color: "var(--accent-dk)" }}
            >
              Ver mapa vivo
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="flex-shrink-0">
          <NewProcessDialog trigger={PRIMARY} />
        </div>
      </section>

      {/* Metrics strip */}
      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric label="Procesos" value={stats.total} />
        <Metric label="Validados" value={stats.validated} accent />
        <Metric label="Oportunidades IA" value={stats.opportunity} />
        <Metric label="Horas / sem" value={stats.hours > 0 ? `≈ ${stats.hours}` : "—"} />
      </section>

      {/* Grid */}
      <section className="mt-7">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-[13px] uppercase tracking-[0.14em]" style={{ fontFamily: "var(--font-mono), monospace", color: "#9A9588" }}>
            Procesos de la empresa
          </h2>
        </div>

        {nodes.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {nodes.map((node, i) => (
              <ProcessCard
                key={node.id}
                node={node}
                ownerName={ownerName(node.ownerMemberId)}
                areaColor={AREA_COLORS[node.area] ?? "var(--accent)"}
                index={i}
              />
            ))}

            {/* Add tile */}
            <NewProcessDialog
              trigger={
                <button
                  className="panel-add panel-up flex min-h-[230px] flex-col items-center justify-center gap-2 rounded-2xl text-sm"
                  style={{
                    border: "1.5px dashed #D8D3C2",
                    background: "rgba(255,255,255,0.35)",
                    color: "#8A8E86",
                    animationDelay: `${Math.min(nodes.length, 8) * 55}ms`,
                  }}
                >
                  <span
                    className="grid h-9 w-9 place-items-center rounded-full"
                    style={{ background: "var(--accent-tint)", color: "var(--accent-dk)", fontSize: 18 }}
                  >
                    +
                  </span>
                  Crear un proceso
                </button>
              }
            />
          </div>
        )}
      </section>
    </>
  );
}

function Metric({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid #ECE8DC" }}>
      <p className="text-[11px] uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-mono), monospace", color: "#9A9588" }}>
        {label}
      </p>
      <p className="mt-0.5 text-[24px]" style={{ fontFamily: "var(--font-newsreader), serif", color: accent ? "var(--accent-dk)" : "var(--fg)" }}>
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center gap-3 rounded-2xl px-6 py-16 text-center"
      style={{ border: "1.5px dashed #D8D3C2", background: "rgba(255,255,255,0.4)" }}
    >
      <p className="text-[20px]" style={{ fontFamily: "var(--font-newsreader), serif", color: "var(--fg)" }}>
        Aún no hay procesos
      </p>
      <p className="max-w-sm text-[14px]" style={{ color: "#6B6F69" }}>
        Crea el primero o invita a tu equipo a las micro-entrevistas para que el mapa se dibuje solo.
      </p>
      <div className="mt-2">
        <NewProcessDialog trigger={PRIMARY} />
      </div>
    </div>
  );
}
