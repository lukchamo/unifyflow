"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";

export interface InviteRowProps {
  onInvite: (email: string) => void;
}

export function InviteRow({ onInvite }: InviteRowProps) {
  const [value, setValue] = React.useState("");

  function handleAdd() {
    if (!value.trim()) return;
    onInvite(value.trim());
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleAdd();
  }

  return (
    <div className="flex items-center gap-2 pt-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="email@persona.com · pega un enlace para invitar"
        className="flex-1 h-9 px-3 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2"
        style={{
          border: "1.5px dashed #C5CAC7",
          backgroundColor: "transparent",
          color: "#3A3E3C",
          fontSize: "13px",
        }}
      />
      <Button
        variant="secondary"
        size="sm"
        onClick={handleAdd}
        disabled={!value.trim()}
      >
        Añadir
      </Button>
    </div>
  );
}
