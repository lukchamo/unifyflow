"use client";

/**
 * app/checkout/page.tsx — Simulated Stripe checkout for UnifyFlow demo.
 *
 * Shows 3 price tiers, a demo notice, and a pay button.
 * On pay: calls stripe.checkout() → store.pay() → success screen.
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { checkout } from "@/lib/services/stripe";
import { useAppStore } from "@/lib/store/useAppStore";
import { Button } from "@/components/ui/Button";

// ── Price tiers ───────────────────────────────────────────────────────────────

interface Tier {
  id: string;
  label: string;
  range: string;
  price: string;
  priceDisplay: string;
}

const TIERS: Tier[] = [
  {
    id: "tier-490",
    label: "Hasta 25 personas",
    range: "Hasta 25 personas",
    price: "€490",
    priceDisplay: "€490",
  },
  {
    id: "tier-990",
    label: "26 – 75 personas",
    range: "26 – 75 personas",
    price: "€990",
    priceDisplay: "€990",
  },
  {
    id: "tier-1490",
    label: "76 – 150 personas",
    range: "76 – 150 personas",
    price: "€1.490",
    priceDisplay: "€1.490",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const setStep = useAppStore((s) => s.setStep);

  const [selectedTierId, setSelectedTierId] = useState<string>(TIERS[0].id);
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const selectedTier = TIERS.find((t) => t.id === selectedTierId) ?? TIERS[0];

  async function handlePay() {
    setLoading(true);
    try {
      await checkout();
      setPaid(true);
    } finally {
      setLoading(false);
    }
  }

  function handleVerRadiografia() {
    setStep("radiografia");
    router.push("/app?step=radiografia");
  }

  function handleBack() {
    router.back();
  }

  // ── Success state ───────────────────────────────────────────────────────────

  if (paid) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-4 py-16"
        style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
      >
        <div className="w-full max-w-md mx-auto text-center space-y-6">
          {/* Check icon */}
          <div
            className="mx-auto w-16 h-16 rounded-full flex items-center justify-center text-3xl"
            style={{ backgroundColor: "var(--accent-tint)", color: "var(--accent)" }}
            aria-hidden="true"
          >
            ✓
          </div>

          {/* Heading */}
          <h1
            className="text-3xl font-semibold leading-tight"
            style={{ fontFamily: "var(--font-newsreader)", color: "var(--fg)" }}
          >
            Radiografía desbloqueada
          </h1>

          {/* Subtitle */}
          <p className="text-sm leading-relaxed" style={{ color: "var(--fg)", opacity: 0.7 }}>
            Las 3 oportunidades están disponibles, con su evidencia y plan.
          </p>

          {/* CTA */}
          <Button size="lg" onClick={handleVerRadiografia} className="w-full">
            Ver la radiografía →
          </Button>
        </div>
      </main>
    );
  }

  // ── Checkout state ──────────────────────────────────────────────────────────

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
    >
      <div className="w-full max-w-lg mx-auto space-y-8">

        {/* Back link */}
        <button
          onClick={handleBack}
          className="text-sm flex items-center gap-1 cursor-pointer"
          style={{ color: "var(--accent-dk)", fontFamily: "var(--font-mono)" }}
        >
          ← Volver
        </button>

        {/* Eyebrow */}
        <p
          className="text-xs tracking-widest uppercase"
          style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", opacity: 0.8 }}
        >
          Radiografía de Procesos + IA
        </p>

        {/* Main heading */}
        <div className="space-y-3">
          <h1
            className="text-4xl font-semibold leading-tight"
            style={{ fontFamily: "var(--font-newsreader)", color: "var(--fg)" }}
          >
            Desbloquea tu radiografía
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--fg)", opacity: 0.65 }}>
            Pago único. Sin suscripción. El detalle, la prioridad y el plan de
            implementación de las 3 oportunidades.
          </p>
        </div>

        {/* Price tiers */}
        <div className="space-y-3" role="radiogroup" aria-label="Plan de precio">
          {TIERS.map((tier, idx) => {
            const isSelected = tier.id === selectedTierId;
            const isHighlighted = idx === 0; // first tier (€490) is the default / most common

            return (
              <button
                key={tier.id}
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedTierId(tier.id)}
                className="w-full text-left rounded-xl px-5 py-4 cursor-pointer transition-all duration-150 flex items-center justify-between"
                style={{
                  border: isSelected
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
                  backgroundColor: isSelected
                    ? "var(--accent-tint)"
                    : isHighlighted
                    ? "rgba(60,125,110,0.04)"
                    : "#F4F5F4",
                  outline: "none",
                }}
              >
                <span className="space-y-0.5">
                  <span
                    className="block text-sm font-medium"
                    style={{ color: "var(--fg)" }}
                  >
                    {tier.range}
                  </span>
                  {isHighlighted && !isSelected && (
                    <span
                      className="block text-xs"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--accent)",
                        opacity: 0.8,
                      }}
                    >
                      Más popular
                    </span>
                  )}
                </span>
                <span
                  className="text-base font-semibold tabular-nums"
                  style={{
                    color: isSelected ? "var(--accent-dk)" : "var(--fg)",
                  }}
                >
                  {tier.priceDisplay}
                </span>
              </button>
            );
          })}
        </div>

        {/* DEMO notice */}
        <div
          className="rounded-lg px-4 py-3 text-xs"
          style={{
            fontFamily: "var(--font-mono)",
            backgroundColor: "#F4F5F4",
            color: "var(--fg)",
            opacity: 0.65,
          }}
        >
          Demo · no se cobra ninguna tarjeta real.
        </div>

        {/* Fake card fields (decorative) */}
        <div
          className="rounded-xl border px-5 py-4 space-y-3 cursor-not-allowed select-none"
          style={{ borderColor: "#D9DBD9", opacity: 0.45 }}
          aria-hidden="true"
        >
          <div
            className="text-xs uppercase tracking-widest mb-1"
            style={{ fontFamily: "var(--font-mono)", color: "var(--fg)", opacity: 0.6 }}
          >
            Datos de tarjeta
          </div>
          <div className="flex gap-3">
            <div
              className="flex-1 rounded-md px-3 py-2 text-sm"
              style={{ backgroundColor: "#EDEDEC", color: "#AAB0AA" }}
            >
              4242 4242 4242 4242
            </div>
          </div>
          <div className="flex gap-3">
            <div
              className="w-24 rounded-md px-3 py-2 text-sm"
              style={{ backgroundColor: "#EDEDEC", color: "#AAB0AA" }}
            >
              MM / AA
            </div>
            <div
              className="w-20 rounded-md px-3 py-2 text-sm"
              style={{ backgroundColor: "#EDEDEC", color: "#AAB0AA" }}
            >
              CVC
            </div>
          </div>
        </div>

        {/* Pay button */}
        <Button
          size="lg"
          onClick={handlePay}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Procesando..." : `Pagar ${selectedTier.priceDisplay}`}
        </Button>
      </div>
    </main>
  );
}
