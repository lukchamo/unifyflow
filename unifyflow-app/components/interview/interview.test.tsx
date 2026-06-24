/**
 * interview.test.tsx — TDD tests for the interviewee micro-interview flow.
 * Run: npx vitest run components/interview/interview.test.tsx
 *
 * Timer strategy: useInterview uses a typing delay (setTimeout).
 * We use vi.useFakeTimers() + act(() => vi.runAllTimers()) to advance
 * through the delay synchronously in tests, so no real async waiting is needed.
 */

import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { useAppStore } from "@/lib/store/useAppStore";
import { InterviewPage } from "./InterviewPage";

// ── Timer setup ───────────────────────────────────────────────────────────────

beforeEach(() => {
  useAppStore.getState().resetDemo();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// ── WelcomeScreen ─────────────────────────────────────────────────────────────

describe("WelcomeScreen", () => {
  it('shows the title "Cuéntanos cómo trabajas tú."', () => {
    render(<InterviewPage slug="test" />);
    expect(
      screen.getByText("Cuéntanos cómo trabajas tú.")
    ).toBeInTheDocument();
  });

  it('shows the privacy bullet "Datos en la UE · GDPR · sin captura de pantalla."', () => {
    render(<InterviewPage slug="test" />);
    expect(
      screen.getByText("Datos en la UE · GDPR · sin captura de pantalla.")
    ).toBeInTheDocument();
  });

  it('shows prefilled "Andrés Pérez"', () => {
    render(<InterviewPage slug="test" />);
    expect(screen.getByText("Andrés Pérez")).toBeInTheDocument();
  });

  it('shows the start button "Empezar la entrevista →"', () => {
    render(<InterviewPage slug="test" />);
    expect(
      screen.getByRole("button", { name: /Empezar la entrevista/i })
    ).toBeInTheDocument();
  });
});

// ── InterviewScreen (after clicking start) ────────────────────────────────────

describe("InterviewScreen — start", () => {
  it('clicking "Empezar la entrevista →" shows counter "Pregunta 1 de 4"', () => {
    render(<InterviewPage slug="test" />);
    fireEvent.click(
      screen.getByRole("button", { name: /Empezar la entrevista/i })
    );
    expect(screen.getByText("Pregunta 1 de 4")).toBeInTheDocument();
  });

  it("shows the first question from the Operaciones bank after start", () => {
    render(<InterviewPage slug="test" />);
    fireEvent.click(
      screen.getByRole("button", { name: /Empezar la entrevista/i })
    );
    // First question for Operaciones area (member Andrés Pérez)
    // The question bank replaces {nombre} with the full name "Andrés Pérez"
    expect(
      screen.getByText(/Hola, Andrés Pérez\. Para empezar/)
    ).toBeInTheDocument();
  });
});

// ── Full interview flow → ThanksScreen ────────────────────────────────────────

describe("Full interview flow", () => {
  function answerQuestion(text: string) {
    const input = screen.getByPlaceholderText("Escribe tu respuesta…");
    fireEvent.change(input, { target: { value: text } });
    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));
    // Advance timers to complete the typing delay between questions
    act(() => { vi.runAllTimers(); });
  }

  it('answering all 4 questions reaches ThanksScreen "Gracias, Andrés."', () => {
    const { getByRole, getByPlaceholderText } = render(
      <InterviewPage slug="test" />
    );

    // Start
    fireEvent.click(getByRole("button", { name: /Empezar la entrevista/i }));

    // Answer 4 questions
    answerQuestion("Respuesta uno");
    answerQuestion("Respuesta dos");
    answerQuestion("Respuesta tres");
    answerQuestion("Respuesta cuatro");

    expect(screen.getByText("Gracias, Andrés.")).toBeInTheDocument();
  });

  it("store gains exactly 1 node after all 4 answers submitted", () => {
    const initialNodeCount = useAppStore.getState().nodes.length;

    render(<InterviewPage slug="test" />);
    fireEvent.click(
      screen.getByRole("button", { name: /Empezar la entrevista/i })
    );

    answerQuestion("Respuesta uno");
    answerQuestion("Respuesta dos");
    answerQuestion("Respuesta tres");
    answerQuestion("Respuesta cuatro");

    expect(useAppStore.getState().nodes.length).toBe(initialNodeCount + 1);
  });

  it("store gains an AgentLog after submission", () => {
    const initialLogCount = useAppStore.getState().agentLogs.length;

    render(<InterviewPage slug="test" />);
    fireEvent.click(
      screen.getByRole("button", { name: /Empezar la entrevista/i })
    );

    answerQuestion("Respuesta uno");
    answerQuestion("Respuesta dos");
    answerQuestion("Respuesta tres");
    answerQuestion("Respuesta cuatro");

    expect(useAppStore.getState().agentLogs.length).toBeGreaterThan(
      initialLogCount
    );
  });

  it("submitInterview is called exactly once (node count +1, not +4)", () => {
    const initialNodeCount = useAppStore.getState().nodes.length;

    render(<InterviewPage slug="test" />);
    fireEvent.click(
      screen.getByRole("button", { name: /Empezar la entrevista/i })
    );

    answerQuestion("Respuesta uno");
    answerQuestion("Respuesta dos");
    answerQuestion("Respuesta tres");
    answerQuestion("Respuesta cuatro");

    // submitInterview called once → exactly 1 new node, not 4
    expect(useAppStore.getState().nodes.length).toBe(initialNodeCount + 1);
  });
});
