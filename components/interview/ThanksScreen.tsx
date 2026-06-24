"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";

/**
 * ThanksScreen — shown after all questions are answered.
 * Confirms submission, shows live map status, and CTA to create account.
 */
export function ThanksScreen() {
  return (
    <div className="flex flex-col items-center gap-6 px-5 py-12 max-w-lg mx-auto w-full text-center">
      {/* Check circle */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
        style={{ backgroundColor: "var(--accent-tint)", color: "var(--accent)" }}
        aria-hidden="true"
      >
        ✓
      </div>

      {/* Title */}
      <h1
        className="text-3xl leading-tight"
        style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
      >
        Gracias, Andrés.
      </h1>

      {/* Paragraph */}
      <p className="text-sm leading-relaxed" style={{ color: "#4A5C55" }}>
        Tu parte está lista. Tus respuestas ya están dibujando el mapa de
        Distribuciones Robledo.
      </p>

      {/* Status pill */}
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
        style={{
          backgroundColor: "var(--accent-tint)",
          color: "var(--accent-dk)",
        }}
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{
            backgroundColor: "var(--accent)",
            animation: "uf-pulse 2s ease-in-out infinite",
          }}
          aria-hidden="true"
        />
        Dibujando el mapa…
      </div>

      {/* CTA card */}
      <div
        className="w-full rounded-2xl border p-5 flex flex-col gap-4 text-left"
        style={{ borderColor: "#D8DBD9", backgroundColor: "#FBFCFB" }}
      >
        <p className="text-sm font-semibold" style={{ color: "#1C201E" }}>
          Crea tu cuenta para…
        </p>
        <ul className="flex flex-col gap-3">
          {[
            "Aportar más procesos cuando quieras",
            "Validar el mapa de tu área",
            "Ver el mapa cuando esté listo",
          ].map((benefit) => (
            <li
              key={benefit}
              className="text-sm flex items-start gap-2"
              style={{ color: "#4A5C55" }}
            >
              <span style={{ color: "var(--accent)" }} aria-hidden="true">
                →
              </span>
              {benefit}
            </li>
          ))}
        </ul>
        <Button size="lg" className="w-full">
          Crear mi cuenta
        </Button>
      </div>

      {/* Skip link */}
      <button
        type="button"
        className="text-sm underline"
        style={{ color: "#8A9C95" }}
      >
        Ahora no, gracias
      </button>

      {/* Footer */}
      <p className="text-xs" style={{ color: "#8A9C95" }}>
        Tu progreso se guarda igualmente.
      </p>
    </div>
  );
}
