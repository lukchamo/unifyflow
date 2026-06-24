"use client";
/**
 * GuidedTour.tsx — Coachmark overlay for the UnifyFlow guided tour.
 *
 * - Renders nothing when tour.active === false.
 * - When active: shows a calm, bottom-anchored coachmark card with the
 *   current step's title + body, a progress indicator, a "Siguiente →"
 *   button, and a "Saltar tour" dismiss link.
 * - Syncs the dashboard step to the tour's current dashboardStep via useEffect.
 * - Calls pay() before showing the radiografia step so it renders unlocked.
 * - Respects prefers-reduced-motion (fades only when motion is allowed).
 * - Mobile-first: full-width at bottom on small screens, constrained on desktop.
 */

import React, { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { tourSteps } from "@/lib/data/tourSteps";
import { Button } from "@/components/ui/Button";

const TOTAL = tourSteps.length;

export function GuidedTour() {
  const tour = useAppStore((s) => s.tour);
  const nextTourStep = useAppStore((s) => s.nextTourStep);
  const endTour = useAppStore((s) => s.endTour);
  const setStep = useAppStore((s) => s.setStep);
  const pay = useAppStore((s) => s.pay);

  const currentTourStep = tourSteps[tour.step] ?? tourSteps[0];
  const isLast = tour.step >= TOTAL - 1;

  // Sync dashboard step whenever the tour step changes
  useEffect(() => {
    if (!tour.active) return;
    const step = tourSteps[tour.step];
    if (step?.dashboardStep) {
      setStep(step.dashboardStep);
    }
  }, [tour.active, tour.step, setStep]);

  // Pay (unlock) when reaching the radiografia step
  const paidRef = useRef(false);
  useEffect(() => {
    if (!tour.active) {
      paidRef.current = false;
      return;
    }
    if (currentTourStep.key === "radiografia" && !paidRef.current) {
      paidRef.current = true;
      pay();
    }
  }, [tour.active, currentTourStep.key, pay]);

  if (!tour.active) return null;

  function handleNext() {
    if (isLast) {
      endTour();
    } else {
      // If we're on oportunidades (step 4, index 4) and about to go to radiografia,
      // pay() is handled by the useEffect above when step becomes 5.
      nextTourStep();
    }
  }

  return (
    <>
      {/* Soft scrim — app stays visible behind it */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-40 pointer-events-none"
        style={{ background: "rgba(0,0,0,0.18)" }}
      />

      {/* Coachmark card — bottom-center, mobile-first */}
      <div
        role="dialog"
        aria-modal="false"
        aria-label={`Tour guiado: ${currentTourStep.title}`}
        className={[
          "fixed bottom-0 left-0 right-0 z-50",
          "sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm sm:rounded-2xl",
          "rounded-t-2xl",
          "bg-white dark:bg-neutral-900",
          "shadow-2xl",
          "p-5",
          "motion-safe:animate-[fadeSlideUp_200ms_ease-out_both]",
        ].join(" ")}
        style={{
          // Inline fallback for environments without Tailwind animation utility
          animation: "fadeSlideUp 200ms ease-out both",
        }}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <p
            className="text-xs font-semibold tracking-wide uppercase"
            style={{ color: "var(--accent, #6366f1)" }}
          >
            Tour guiado
          </p>
          <button
            onClick={endTour}
            aria-label="Cerrar tour"
            className="text-neutral-400 hover:text-neutral-600 transition-colors text-lg leading-none -mt-0.5 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Step title */}
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50 mb-1.5">
          {currentTourStep.title}
        </h2>

        {/* Step body */}
        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
          {currentTourStep.body}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between gap-3">
          {/* Progress */}
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            Paso {tour.step + 1} de {TOTAL}
          </span>

          <div className="flex items-center gap-3">
            {/* Saltar tour */}
            <button
              onClick={endTour}
              className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer underline-offset-2 hover:underline"
            >
              Saltar tour
            </button>

            {/* Siguiente / Finalizar */}
            <Button
              size="sm"
              variant="primary"
              onClick={handleNext}
            >
              {isLast ? "Finalizar" : "Siguiente →"}
            </Button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 mt-4 justify-center">
          {tourSteps.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-200"
              style={{
                width: i === tour.step ? "20px" : "6px",
                height: "6px",
                backgroundColor:
                  i === tour.step
                    ? "var(--accent, #6366f1)"
                    : i < tour.step
                    ? "var(--accent-tint, #c7d2fe)"
                    : "#e5e7eb",
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [role="dialog"] { animation: none !important; }
        }
      `}</style>
    </>
  );
}
