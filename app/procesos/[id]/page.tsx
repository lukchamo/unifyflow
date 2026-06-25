import type { Metadata } from "next";
import { PanelShell } from "@/components/panel/PanelShell";
import { ProcessDetail } from "@/components/panel/ProcessDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // The process data lives client-side (Firestore/store), so the title is the
  // stable route identity; the panel is private, so it stays out of the index.
  await params;
  return {
    title: "Proceso · UnifyFlow",
    description: "Detalle del proceso: pasos, responsable y validación.",
    robots: { index: false, follow: false },
  };
}

export default async function ProcesoDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <PanelShell>
      <ProcessDetail id={id} />
    </PanelShell>
  );
}
