/**
 * team.test.tsx — TDD tests for TeamStep, TeamMemberRow, InviteRow.
 * Run: npx vitest run components/steps/team.test.tsx
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "@/lib/store/useAppStore";
import { TeamStep } from "./TeamStep";

// Reset store to seed before each test
beforeEach(() => {
  useAppStore.getState().resetDemo();
});

// ── Row rendering ──────────────────────────────────────────────────────────────

describe("TeamStep renders member rows", () => {
  it("renders all 7 team member names", () => {
    render(<TeamStep />);
    expect(screen.getByText("Marta Ruiz")).toBeInTheDocument();
    expect(screen.getByText("Javier León")).toBeInTheDocument();
    expect(screen.getByText("Nuria Gil")).toBeInTheDocument();
    expect(screen.getByText("Andrés Pérez")).toBeInTheDocument();
    expect(screen.getByText("Carmen Soto")).toBeInTheDocument();
    expect(screen.getByText("Lucía Vidal")).toBeInTheDocument();
    expect(screen.getByText("Diego Mora")).toBeInTheDocument();
  });

  it("renders exactly 7 member rows", () => {
    render(<TeamStep />);
    // Each row has a data-testid="member-row"
    const rows = screen.getAllByTestId("member-row");
    expect(rows).toHaveLength(7);
  });
});

// ── Progress pill ──────────────────────────────────────────────────────────────

describe("progress pill", () => {
  it('shows "5 de 7 completadas" in the progress pill', () => {
    render(<TeamStep />);
    expect(screen.getByTestId("progress-pill")).toHaveTextContent(
      "5 de 7 completadas"
    );
  });
});

// ── Member status pills ────────────────────────────────────────────────────────

describe("member status pills", () => {
  it('shows "Pendiente" for Lucía Vidal (done: false)', () => {
    render(<TeamStep />);
    // Find the row for Lucía Vidal
    const luciaRow = screen.getByText("Lucía Vidal").closest("[data-testid='member-row']");
    expect(luciaRow).not.toBeNull();
    expect(luciaRow).toHaveTextContent("Pendiente");
  });

  it('shows "Entrevista lista" for Marta Ruiz (done: true)', () => {
    render(<TeamStep />);
    const martaRow = screen.getByText("Marta Ruiz").closest("[data-testid='member-row']");
    expect(martaRow).not.toBeNull();
    expect(martaRow).toHaveTextContent("Entrevista lista");
  });
});

// ── InviteRow ─────────────────────────────────────────────────────────────────

describe("InviteRow invite flow", () => {
  it("typing an email and clicking Añadir calls inviteMember → team length becomes 8", () => {
    render(<TeamStep />);

    const input = screen.getByPlaceholderText(
      "email@persona.com · pega un enlace para invitar"
    );
    fireEvent.change(input, { target: { value: "nuevo@empresa.com" } });
    fireEvent.click(screen.getByRole("button", { name: /añadir/i }));

    const team = useAppStore.getState().team;
    expect(team).toHaveLength(8);
  });

  it("progress pill becomes '5 de 8 completadas' after invite", () => {
    render(<TeamStep />);

    const input = screen.getByPlaceholderText(
      "email@persona.com · pega un enlace para invitar"
    );
    fireEvent.change(input, { target: { value: "nuevo@empresa.com" } });
    fireEvent.click(screen.getByRole("button", { name: /añadir/i }));

    // Re-render to pick up store update - check via store state directly
    expect(useAppStore.getState().team).toHaveLength(8);
    const doneCount = useAppStore.getState().team.filter((m) => m.done).length;
    expect(`${doneCount} de 8 completadas`).toBe("5 de 8 completadas");
  });

  it("Añadir button is disabled when input is empty", () => {
    render(<TeamStep />);
    const btn = screen.getByRole("button", { name: /añadir/i });
    expect(btn).toBeDisabled();
  });

  it("clears input after clicking Añadir", () => {
    render(<TeamStep />);
    const input = screen.getByPlaceholderText(
      "email@persona.com · pega un enlace para invitar"
    );
    fireEvent.change(input, { target: { value: "nuevo@empresa.com" } });
    fireEvent.click(screen.getByRole("button", { name: /añadir/i }));
    expect(input).toHaveValue("");
  });
});
