/**
 * tourSteps.ts — Data for the UnifyFlow guided tour coachmarks.
 *
 * Each step maps to a dashboard NavStep (or null) and contains
 * Spanish-language copy in the product's calm, clear voice.
 */

import type { NavStep } from "@/lib/store/useAppStore";

export interface TourStep {
  key: string;
  dashboardStep: NavStep | null;
  title: string;
  body: string;
}

export const tourSteps: TourStep[] = [
  {
    key: "equipo",
    dashboardStep: "equipo",
    title: "Invita a tu equipo",
    body: "Cada persona responde 3–4 preguntas en menos de 5 minutos. El mapa se dibuja con sus respuestas.",
  },
  {
    key: "entrevista",
    dashboardStep: "entrevista",
    title: "Una charla, no un formulario",
    body: "El agente adapta sus preguntas al rol y repregunta cuando algo queda ambiguo.",
  },
  {
    key: "mapa",
    dashboardStep: "mapa",
    title: "El momento espejo",
    body: "Así trabaja tu empresa hoy — dibujado solo a partir de las entrevistas. Reorganízalo con IA.",
  },
  {
    key: "validar",
    dashboardStep: "mapa",
    title: "El humano confirma",
    body: "Abre un nodo para validarlo, comentar o etiquetar a quien debe verificar. La validación es control.",
  },
  {
    key: "oportunidades",
    dashboardStep: "oportunidades",
    title: "Dónde aplicar IA",
    body: "El agente prioriza por impacto × frecuencia × viabilidad y justifica cada propuesta.",
  },
  {
    key: "radiografia",
    dashboardStep: "radiografia",
    title: "La radiografía",
    body: "El entregable: mapa + inventario + oportunidades priorizadas. Listo para tu dirección.",
  },
];
