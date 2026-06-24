/**
 * interview-step.test.tsx — TDD tests for InterviewStep.
 * Run: npx vitest run components/steps/interview-step.test.tsx
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "@/lib/store/useAppStore";
import { InterviewStep } from "./InterviewStep";

// Reset store to seed before each test
beforeEach(() => {
  useAppStore.getState().resetDemo();
});

// ── Heading ───────────────────────────────────────────────────────────────────

describe("InterviewStep heading", () => {
  it('renders H1 "La entrevista que se siente como una charla."', () => {
    render(<InterviewStep />);
    expect(
      screen.getByRole("heading", { level: 1 })
    ).toHaveTextContent("La entrevista que se siente como una charla.");
  });
});

// ── Privacy banner ────────────────────────────────────────────────────────────

describe("InterviewStep privacy banner", () => {
  it('renders privacy banner with "tu jefe ve el proceso, no quién lo contó"', () => {
    render(<InterviewStep />);
    expect(
      screen.getByText(/tu jefe ve el proceso, no quién lo contó/i)
    ).toBeInTheDocument();
  });
});

// ── Chat bubbles ──────────────────────────────────────────────────────────────

describe("InterviewStep chat bubbles", () => {
  it('renders first IA bubble "¿Qué haces tú cuando entra un pedido nuevo de un cliente?"', () => {
    render(<InterviewStep />);
    expect(
      screen.getByText("¿Qué haces tú cuando entra un pedido nuevo de un cliente?")
    ).toBeInTheDocument();
  });
});

// ── CTA ───────────────────────────────────────────────────────────────────────

describe("InterviewStep CTA", () => {
  it('clicking "Ver cómo se dibuja el mapa →" sets currentStep to "mapa"', () => {
    render(<InterviewStep />);
    const cta = screen.getByRole("button", {
      name: /Ver cómo se dibuja el mapa/i,
    });
    fireEvent.click(cta);
    expect(useAppStore.getState().currentStep).toBe("mapa");
  });
});
