"use client";

import { useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useAppStore } from "@/lib/store/useAppStore";
import { AREA_COLORS } from "@/lib/data/mockData";
import { Button } from "@/components/ui/Button";

const AREAS = Object.keys(AREA_COLORS);

const fieldStyle: React.CSSProperties = {
  border: "1px solid #E2DECF",
  background: "#FCFBF7",
  color: "var(--fg)",
};

/**
 * NewProcessDialog — a deliberately small "create a process" flow: name, area,
 * owner, one-line description. Writes a draft node via the store (Firestore in
 * firebase mode, local in mock mode).
 */
export function NewProcessDialog({ trigger }: { trigger: ReactNode }) {
  const team = useAppStore((s) => s.team);
  const createProcess = useAppStore((s) => s.createProcess);

  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [area, setArea] = useState(AREAS[0] ?? "Comercial");
  const [ownerMemberId, setOwnerMemberId] = useState(team[0]?.id ?? "");
  const [desc, setDesc] = useState("");

  const valid = label.trim().length > 1 && area && ownerMemberId;

  function reset() {
    setLabel("");
    setArea(AREAS[0] ?? "Comercial");
    setOwnerMemberId(team[0]?.id ?? "");
    setDesc("");
  }

  function submit() {
    if (!valid) return;
    createProcess({
      label: label.trim(),
      area,
      ownerMemberId,
      desc: desc.trim() || `Proceso del área de ${area}.`,
    });
    reset();
    setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50"
          style={{ background: "rgba(28,32,30,0.32)", backdropFilter: "blur(2px)" }}
        />
        <Dialog.Content
          className="panel-up fixed left-1/2 top-1/2 z-50 w-[min(94vw,460px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6"
          style={{ background: "#fff", border: "1px solid #ECE8DC", boxShadow: "0 30px 80px -24px rgba(28,32,30,.42)" }}
        >
          <Dialog.Title
            className="text-[22px]"
            style={{ fontFamily: "var(--font-newsreader), serif", color: "var(--fg)" }}
          >
            Nuevo proceso
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-[13.5px]" style={{ color: "#6B6F69" }}>
            Añade una actividad al mapa. Podrás validarla y conectarla después.
          </Dialog.Description>

          <div className="mt-5 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium" style={{ color: "#5B5F58" }}>
                Nombre del proceso
              </span>
              <input
                autoFocus
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="p. ej. Conciliar cobros"
                className="h-10 rounded-lg px-3 text-sm outline-none focus:border-[var(--accent)]"
                style={fieldStyle}
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-medium" style={{ color: "#5B5F58" }}>
                  Área
                </span>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="h-10 rounded-lg px-2.5 text-sm outline-none focus:border-[var(--accent)]"
                  style={fieldStyle}
                >
                  {AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-medium" style={{ color: "#5B5F58" }}>
                  Responsable
                </span>
                <select
                  value={ownerMemberId}
                  onChange={(e) => setOwnerMemberId(e.target.value)}
                  className="h-10 rounded-lg px-2.5 text-sm outline-none focus:border-[var(--accent)]"
                  style={fieldStyle}
                >
                  {team.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium" style={{ color: "#5B5F58" }}>
                Descripción <span style={{ color: "#A7AAA3" }}>(opcional)</span>
              </span>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
                placeholder="¿Qué se hace en este proceso?"
                className="resize-none rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                style={fieldStyle}
              />
            </label>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="ghost" size="sm">
                Cancelar
              </Button>
            </Dialog.Close>
            <Button size="sm" onClick={submit} disabled={!valid}>
              Crear proceso
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
