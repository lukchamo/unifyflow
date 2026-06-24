"use client";
/**
 * TourButton.tsx — Floating "Tour guiado" trigger button.
 *
 * Calls startTour() from the store. Mounts alongside GuidedTour in the
 * dashboard layout. Hidden when a tour is already active.
 */

import React from "react";
import { useAppStore } from "@/lib/store/useAppStore";

export function TourButton() {
  const startTour = useAppStore((s) => s.startTour);
  const tourActive = useAppStore((s) => s.tour.active);

  if (tourActive) return null;

  return (
    <button
      onClick={startTour}
      aria-label="Iniciar tour guiado"
      className={[
        "fixed bottom-6 left-6 z-40",
        "flex items-center gap-2",
        "text-sm font-medium",
        "px-4 py-2.5",
        "rounded-full",
        "shadow-lg",
        "transition-all duration-150",
        "hover:shadow-xl hover:brightness-90",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        "cursor-pointer",
      ].join(" ")}
      style={{
        backgroundColor: "var(--accent, #6366f1)",
        color: "#ffffff",
      }}
    >
      <span aria-hidden="true">🗺</span>
      Tour guiado
    </button>
  );
}
