"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { MEMBER_NOMBRE, MEMBER_CARGO, MEMBER_AREA } from "./useInterview";

export interface WelcomeScreenProps {
  onStart: () => void;
}

/**
 * WelcomeScreen — landing screen for the interviewee.
 * Shows inviter info, title, description, privacy panel, prefilled fields,
 * and the start CTA.
 */
export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col gap-6 px-5 py-8 max-w-lg mx-auto w-full">
      {/* Inviter row */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
          style={{ backgroundColor: "var(--accent)", color: "#ffffff" }}
          aria-hidden="true"
        >
          MR
        </div>
        <p className="text-sm" style={{ color: "#4A5C55" }}>
          <span className="font-semibold" style={{ color: "#1C201E" }}>
            Marta Ruiz
          </span>{" "}
          te invitó a{" "}
          <span className="font-semibold" style={{ color: "#1C201E" }}>
            Distribuciones Robledo
          </span>
        </p>
      </div>

      {/* Title */}
      <h1
        className="text-3xl leading-tight"
        style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
      >
        Cuéntanos cómo trabajas tú.
      </h1>

      {/* Description */}
      <p className="text-sm leading-relaxed" style={{ color: "#4A5C55" }}>
        Son 3–4 preguntas, menos de 5 minutos. No hay respuestas correctas —
        solo queremos entender tu día a día para dibujar el mapa.
      </p>

      {/* Privacy panel */}
      <div
        className="rounded-xl p-4 border"
        style={{ backgroundColor: "#F4F0E6", borderColor: "#EADFC4" }}
      >
        <p className="text-sm font-semibold flex items-center gap-2 mb-3" style={{ color: "#3A3020" }}>
          <span aria-hidden="true">🔒</span>
          Qué guardamos y quién lo ve
        </p>
        <ul className="flex flex-col gap-2">
          {[
            "Solo tus respuestas, para dibujar el mapa.",
            "Tu nombre no aparece junto a lo que dices.",
            "Datos en la UE · GDPR · sin captura de pantalla.",
          ].map((bullet) => (
            <li
              key={bullet}
              className="text-xs flex items-start gap-2 leading-relaxed"
              style={{ color: "#5A4E35" }}
            >
              <span
                className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: "#A89060" }}
                aria-hidden="true"
              />
              {bullet}
            </li>
          ))}
        </ul>
      </div>

      {/* Prefilled fields */}
      <div className="flex flex-col gap-3">
        {[
          { label: "Tu nombre", value: MEMBER_NOMBRE },
          { label: "Cargo", value: MEMBER_CARGO },
          { label: "Área", value: MEMBER_AREA },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs mb-1" style={{ color: "#6B7B75" }}>
              {label}
            </p>
            <div
              className="rounded-lg px-3 py-2 text-sm"
              style={{
                backgroundColor: "#F0F2F1",
                color: "#1C201E",
                border: "1px solid #D8DBD9",
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button size="lg" onClick={onStart} className="w-full">
        Empezar la entrevista →
      </Button>

      {/* Footer */}
      <p className="text-xs text-center" style={{ color: "#8A9C95" }}>
        Sin cuenta ni contraseña. Tardas menos de 5 minutos.
      </p>
    </div>
  );
}
