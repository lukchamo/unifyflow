import type { Metadata } from "next";
import { PanelShell } from "@/components/panel/PanelShell";
import { ProcessPanel } from "@/components/panel/ProcessPanel";

export const metadata: Metadata = {
  title: "Procesos · UnifyFlow",
  description:
    "Panel de procesos: visualiza cómo trabaja tu empresa de verdad y crea nuevos procesos en segundos.",
  // Private, authenticated console — don't index.
  robots: { index: false, follow: false },
};

export default function ProcesosPage() {
  return (
    <PanelShell>
      <ProcessPanel />
    </PanelShell>
  );
}
