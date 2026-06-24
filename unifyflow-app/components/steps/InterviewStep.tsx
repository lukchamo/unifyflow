"use client";

import * as React from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { ProgressSegments } from "@/components/ui/ProgressSegments";
import { Button } from "@/components/ui/Button";

// ── Typing indicator dots ─────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div
      className="flex items-center gap-1 px-3 py-2 rounded-[14px_14px_14px_4px] w-fit"
      style={{ backgroundColor: "var(--accent-tint)" }}
      aria-label="Agente escribiendo…"
    >
      {[0, 0.2, 0.4].map((delay, i) => (
        <span
          key={i}
          className="rounded-full"
          style={{
            width: 6,
            height: 6,
            backgroundColor: "#B4C7C0",
            display: "inline-block",
            animation: "uf-pulse 1.2s ease-in-out infinite",
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Chat bubble ───────────────────────────────────────────────────────────────

interface BubbleProps {
  side: "left" | "right";
  children: React.ReactNode;
}

function Bubble({ side, children }: BubbleProps) {
  const isLeft = side === "left";
  return (
    <div className={`flex ${isLeft ? "justify-start" : "justify-end"}`}>
      <div
        className="max-w-[85%] px-3 py-2 text-[13px] leading-snug"
        style={
          isLeft
            ? {
                backgroundColor: "var(--accent-tint)",
                color: "#234A41",
                borderRadius: "14px 14px 14px 4px",
              }
            : {
                backgroundColor: "#15201C",
                color: "#F2F4F3",
                borderRadius: "14px 14px 4px 14px",
              }
        }
      >
        {children}
      </div>
    </div>
  );
}

// ── Phone screen content ──────────────────────────────────────────────────────

function ChatScreen() {
  return (
    <div className="flex flex-col h-full text-[13px]">
      {/* Chat header */}
      <div
        className="flex items-center justify-between px-3 py-2 flex-shrink-0"
        style={{ borderBottom: "1px solid #E7EAE8" }}
      >
        <div className="flex items-center gap-1.5">
          {/* Rombo accent */}
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <rect
              x="5"
              y="0"
              width="7"
              height="7"
              transform="rotate(45 5 5)"
              fill="var(--accent)"
            />
          </svg>
          <span
            className="font-medium text-[12px]"
            style={{ color: "#1A1D1B" }}
          >
            UnifyFlow
          </span>
        </div>
        <span
          className="font-mono text-[11px]"
          style={{ color: "#9CA29E" }}
        >
          3 / 4
        </span>
      </div>

      {/* Progress segments */}
      <div className="px-3 pt-2 pb-1 flex-shrink-0">
        <ProgressSegments total={4} active={3} />
      </div>

      {/* Privacy banner */}
      <div
        className="mx-3 my-2 px-2.5 py-2 rounded-lg flex-shrink-0 text-[11px] leading-snug"
        style={{
          backgroundColor: "#F4F0E6",
          border: "1px solid #EADFC4",
          color: "#7A6B45",
        }}
      >
        🔒 Solo guardamos tus respuestas, para dibujar el mapa. Tu nombre no aparece junto a lo que dices — tu jefe ve el proceso, no quién lo contó.
      </div>

      {/* Chat bubbles */}
      <div className="flex flex-col gap-2 px-3 py-2 flex-1 overflow-hidden">
        <Bubble side="left">
          ¿Qué haces tú cuando entra un pedido nuevo de un cliente?
        </Bubble>
        <Bubble side="right">
          Reviso si hay stock. Si no hay, le pregunto a Nuria de Compras cuándo llega.
        </Bubble>
        <Bubble side="left">
          Entiendo. Y cuando Nuria te confirma el plazo, ¿a quién se lo pasas para preparar el envío?
        </Bubble>
        <TypingDots />
      </div>

      {/* Input bar */}
      <div
        className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
        style={{ borderTop: "1px solid #E7EAE8" }}
      >
        <div
          className="flex-1 rounded-full px-3 py-1.5 text-[12px]"
          style={{
            backgroundColor: "#F4F6F5",
            color: "#9CA29E",
            border: "1px solid #E7EAE8",
          }}
        >
          Escribe o pulsa para hablar…
        </div>
        <button
          type="button"
          aria-label="Hablar"
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            backgroundColor: "var(--accent)",
            fontSize: "18px",
            border: "none",
            cursor: "default",
          }}
        >
          🎙
        </button>
      </div>
    </div>
  );
}

// ── InterviewStep ─────────────────────────────────────────────────────────────

export function InterviewStep() {
  const setStep = useAppStore((s) => s.setStep);

  return (
    <>
      {/* Keyframe injection */}
      <style>{`
        @keyframes uf-pulse {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(-3px); }
        }
      `}</style>

      <div
        className="flex flex-col items-center w-full"
        style={{
          padding: "64px 24px 64px",
          minHeight: "100vh",
          background:
            "radial-gradient(ellipse at 50% 20%, #FFFFFF 0%, #F4F6F5 100%)",
        }}
      >
        <div className="w-full" style={{ maxWidth: 560 }}>
          {/* Kicker */}
          <p
            className="font-mono uppercase tracking-widest mb-4"
            style={{ fontSize: "11px", color: "var(--accent-dk)" }}
          >
            Paso 2 · asíncrono · &lt; 5 min
          </p>

          {/* H1 */}
          <h1
            className="font-medium mb-4"
            style={{
              fontFamily: "Newsreader, Georgia, serif",
              fontSize: "30px",
              lineHeight: "1.2",
              color: "#1A1D1B",
            }}
          >
            La entrevista que se siente como una charla.
          </h1>

          {/* Paragraph */}
          <p
            className="mb-10"
            style={{ fontSize: "15px", lineHeight: "1.6", color: "#4A4E4C" }}
          >
            El agente adapta sus preguntas al rol y repregunta cuando algo queda
            ambiguo. Sin jerga, sin instrucciones.
          </p>

          {/* Phone mockup */}
          <div className="flex justify-center mb-10">
            <PhoneFrame time="9:41">
              <ChatScreen />
            </PhoneFrame>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setStep("mapa")}
            >
              Ver cómo se dibuja el mapa →
            </Button>
            <p
              className="font-mono text-center"
              style={{ fontSize: "11px", color: "#9CA29E" }}
            >
              Voz por Gemini Live — fast-follow
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
