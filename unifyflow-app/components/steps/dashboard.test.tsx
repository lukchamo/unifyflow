/**
 * dashboard.test.tsx — TDD tests for DashboardSteps orchestrator.
 *
 * Strategy:
 *   - MapStep uses ProcessFlowDynamic (next/dynamic, ssr:false) which resolves
 *     to a loading fallback in jsdom. We mock MapStep entirely and assert on
 *     MapHeader (which is rendered directly by MapStep's stub). For simplicity
 *     and reliability, we mock the entire MapStep module so the test does NOT
 *     depend on React Flow internals in jsdom.
 *
 * Run: npx vitest run components/steps/dashboard.test.tsx
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAppStore } from "@/lib/store/useAppStore";

// ── Mock next/navigation so useRouter doesn't throw in jsdom ─────────────────
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// ── Mock MapStep to avoid React Flow / dynamic-import complexity in jsdom ─────
// We render a stable sentinel that matches what MapHeader would show.
vi.mock("./MapStep", () => ({
  MapStep: () => (
    <div>
      <div data-testid="map-step-mock">
        <span>Momento espejo · paso 3</span>
        <span>Así trabaja Distribuciones Robledo hoy.</span>
      </div>
    </div>
  ),
}));

// ── Import after mocks are set up ─────────────────────────────────────────────
import { DashboardSteps } from "./DashboardSteps";

// ── Reset store to seed before each test ─────────────────────────────────────
beforeEach(() => {
  useAppStore.getState().resetDemo();
});

// ── Default state: equipo step ─────────────────────────────────────────────────

describe("DashboardSteps default state (currentStep='equipo', role=null)", () => {
  it("renders the TeamStep — shows 'Empecemos por tu equipo.'", () => {
    render(<DashboardSteps />);
    expect(screen.getByText("Empecemos por tu equipo.")).toBeInTheDocument();
  });

  it("does NOT render the map sentinel", () => {
    render(<DashboardSteps />);
    expect(screen.queryByTestId("map-step-mock")).not.toBeInTheDocument();
  });
});

// ── setStep('mapa') → map renders ─────────────────────────────────────────────

describe("DashboardSteps after setStep('mapa')", () => {
  it("renders the map mock — shows 'Momento espejo · paso 3'", () => {
    useAppStore.getState().setStep("mapa");
    render(<DashboardSteps />);
    expect(screen.getByText("Momento espejo · paso 3")).toBeInTheDocument();
  });

  it("renders the map mock — shows 'Así trabaja Distribuciones Robledo hoy.'", () => {
    useAppStore.getState().setStep("mapa");
    render(<DashboardSteps />);
    expect(
      screen.getByText("Así trabaja Distribuciones Robledo hoy.")
    ).toBeInTheDocument();
  });

  it("does NOT render the TeamStep text", () => {
    useAppStore.getState().setStep("mapa");
    render(<DashboardSteps />);
    expect(
      screen.queryByText("Empecemos por tu equipo.")
    ).not.toBeInTheDocument();
  });
});

// ── setStep('oportunidades') ───────────────────────────────────────────────────

describe("DashboardSteps after setStep('oportunidades')", () => {
  it("renders OpportunitiesStep — shows 'Dónde aplicar IA primero.'", () => {
    useAppStore.getState().setStep("oportunidades");
    render(<DashboardSteps />);
    expect(screen.getByText("Dónde aplicar IA primero.")).toBeInTheDocument();
  });
});

// ── Validador coercion: equipo → mapa ─────────────────────────────────────────

describe("DashboardSteps with role='validador' and currentStep='equipo'", () => {
  it("renders the map (not the team step) — validador coercion", () => {
    // Store defaults: currentStep='equipo'; set role to validador
    useAppStore.getState().setRole("validador");
    render(<DashboardSteps />);
    // Should show map sentinel, not team step
    expect(screen.getByTestId("map-step-mock")).toBeInTheDocument();
    expect(
      screen.queryByText("Empecemos por tu equipo.")
    ).not.toBeInTheDocument();
  });

  it("coercion also applies for currentStep='entrevista'", () => {
    useAppStore.getState().setRole("validador");
    useAppStore.getState().setStep("entrevista");
    render(<DashboardSteps />);
    expect(screen.getByTestId("map-step-mock")).toBeInTheDocument();
    expect(
      screen.queryByText("Empecemos por tu equipo.")
    ).not.toBeInTheDocument();
  });
});

// ── All other steps render without crashing ───────────────────────────────────

describe("DashboardSteps covers all NavStep values", () => {
  it("renders InterviewStep for step 'entrevista'", () => {
    useAppStore.getState().setStep("entrevista");
    // InterviewStep renders a phone frame; just check it doesn't crash
    const { container } = render(<DashboardSteps />);
    expect(container).toBeTruthy();
  });

  it("renders RadiographyStep for step 'radiografia'", () => {
    useAppStore.getState().setStep("radiografia");
    const { container } = render(<DashboardSteps />);
    expect(container).toBeTruthy();
  });
});
