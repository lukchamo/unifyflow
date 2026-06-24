"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Button } from "@/components/ui/Button";

export interface SharePopoverProps {
  nodeId: string;
  children: React.ReactNode;
  onToast?: (msg: string) => void;
}

export function SharePopover({ nodeId, children, onToast }: SharePopoverProps) {
  const link = `unifyflow.eu/r/dr-${nodeId}9a2`;
  const fullUrl = `https://${link}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fullUrl);
      onToast?.("Enlace copiado");
    } catch {
      // fallback: silently ignore in test / server env
    }
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="end"
          sideOffset={8}
          className="z-50 rounded-xl shadow-xl border p-4 flex flex-col gap-3 w-72"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#E4EBE7",
          }}
        >
          <Popover.Arrow style={{ fill: "#E4EBE7" }} />

          <p className="text-sm font-semibold text-[#15201C]">
            Compartir este proceso
          </p>

          {/* Readonly link */}
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2 border"
            style={{ borderColor: "#D1D8D4", backgroundColor: "#F7FAF8" }}
          >
            <span className="text-xs font-mono flex-1 min-w-0 truncate text-[#3B4840]">
              {link}
            </span>
            <Button variant="secondary" size="sm" onClick={handleCopy}>
              Copiar
            </Button>
          </div>

          <p className="text-xs leading-relaxed" style={{ color: "#7A807C" }}>
            Cualquiera con el enlace puede ver y comentar. Validar requiere
            cuenta — los datos siguen en la UE.
          </p>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
