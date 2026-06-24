"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Sidebar } from "./Sidebar";
import type { NavStep } from "@/lib/store/useAppStore";

export interface MobileDrawerProps {
  currentStep: NavStep;
  role: string | null;
  orgNombre: string;
  orgSector: string;
  onStepChange: (step: NavStep) => void;
}

export function MobileDrawer({
  currentStep,
  role,
  orgNombre,
  orgSector,
  onStepChange,
}: MobileDrawerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* Hamburger trigger */}
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open navigation menu"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "4px",
            width: "36px",
            height: "36px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            borderRadius: "6px",
            padding: "6px",
          }}
        >
          <span style={{ display: "block", width: "18px", height: "2px", background: "var(--fg, #1C201E)", borderRadius: "1px" }} />
          <span style={{ display: "block", width: "18px", height: "2px", background: "var(--fg, #1C201E)", borderRadius: "1px" }} />
          <span style={{ display: "block", width: "18px", height: "2px", background: "var(--fg, #1C201E)", borderRadius: "1px" }} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 49,
          }}
        />

        {/* Drawer panel */}
        <Dialog.Content
          aria-label="Navigation drawer"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 50,
            outline: "none",
          }}
        >
          <Dialog.Title style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
            Navigation
          </Dialog.Title>
          <Sidebar
            currentStep={currentStep}
            role={role}
            orgNombre={orgNombre}
            orgSector={orgSector}
            onStepChange={onStepChange}
            onNavClick={() => setOpen(false)}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
