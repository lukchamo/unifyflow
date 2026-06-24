"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";

export interface AddProcessCardProps {
  onAdd?: (label: string) => void;
}

export function AddProcessCard({ onAdd }: AddProcessCardProps) {
  const [value, setValue] = React.useState("");

  function handleAdd() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd?.(trimmed);
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleAdd();
  }

  return (
    <div
      className="rounded-xl p-4 mt-4"
      style={{
        border: "1.5px dashed #BBC0BC",
        backgroundColor: "#FAFBFA",
      }}
    >
      <p
        className="font-semibold mb-1"
        style={{ fontSize: "14px", color: "var(--fg)" }}
      >
        ¿Falta algo que no contaste?
      </p>
      <p className="mb-3" style={{ fontSize: "13px", color: "#9CA29E" }}>
        Añade un proceso o un detalle y lo sumamos a tu inventario.
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="p. ej. Devoluciones de cliente…"
          className="flex-1 min-w-0 rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            border: "1px solid #D1D8D3",
            backgroundColor: "#fff",
            color: "var(--fg)",
          }}
        />
        <Button size="sm" variant="primary" onClick={handleAdd}>
          Añadir
        </Button>
      </div>
    </div>
  );
}
