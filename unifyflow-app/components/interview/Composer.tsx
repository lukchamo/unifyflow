"use client";

import * as React from "react";
import { useState } from "react";

export interface ComposerProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

/**
 * Composer — text input + mic button (disabled, fast-follow) + send button.
 * Enter key submits. Send button labeled "enviar" for accessibility.
 */
export function Composer({ onSubmit, disabled = false }: ComposerProps) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div
      className="flex items-end gap-2 p-3 border-t"
      style={{ borderColor: "#E2E6E4", backgroundColor: "#FBFCFB" }}
    >
      {/* Text area */}
      <textarea
        className="flex-1 resize-none rounded-xl px-3 py-2 text-sm outline-none border"
        style={{
          borderColor: "#D1D8D5",
          minHeight: "42px",
          maxHeight: "120px",
          lineHeight: "1.5",
        }}
        placeholder="Escribe tu respuesta…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
      />

      {/* Mic button — disabled, fast-follow */}
      <button
        type="button"
        disabled
        title="Voz — fast-follow"
        aria-label="Micrófono (próximamente)"
        className="flex items-center justify-center w-10 h-10 rounded-xl text-lg flex-shrink-0 disabled:opacity-40 cursor-not-allowed"
        style={{ backgroundColor: "#E2E6E4", color: "#6B7B75" }}
      >
        🎙
      </button>

      {/* Send button */}
      <button
        type="button"
        aria-label="enviar"
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className="flex items-center justify-center w-10 h-10 rounded-xl text-base font-bold flex-shrink-0 disabled:opacity-40 transition-opacity"
        style={{
          backgroundColor: "var(--accent)",
          color: "#ffffff",
        }}
      >
        →
      </button>
    </div>
  );
}
