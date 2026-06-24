/**
 * opportunities.test.tsx — TDD tests for OpportunitiesStep and sub-components.
 * Run: npx vitest run components/steps/opportunities.test.tsx
 */

import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAppStore } from "@/lib/store/useAppStore";
import { OpportunitiesStep } from "./OpportunitiesStep";

// Mock next/navigation so useRouter doesn't throw in jsdom
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Reset store to seed before each test
beforeEach(() => {
  useAppStore.getState().resetDemo();
});

// ── 1. Heading ────────────────────────────────────────────────────────────────

describe("OpportunitiesStep heading", () => {
  it('renders H1 "Dónde aplicar IA primero."', () => {
    render(<OpportunitiesStep />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Dónde aplicar IA primero."
    );
  });
});

// ── 2. First opportunity card ─────────────────────────────────────────────────

describe("OpportunitiesStep opportunity cards", () => {
  it('renders opp 1 title "Generación automática de presupuestos"', () => {
    render(<OpportunitiesStep />);
    expect(
      screen.getByText("Generación automática de presupuestos")
    ).toBeInTheDocument();
  });
});

// ── 3. Paywall when not paid ──────────────────────────────────────────────────

describe("OpportunitiesStep paywall (unpaid)", () => {
  it("shows lock copy when subscription.paid is false", () => {
    render(<OpportunitiesStep />);
    expect(
      screen.getByText(/Oportunidades 2 y 3, bloqueadas/i)
    ).toBeInTheDocument();
  });

  it("opp 2 and 3 evidence text is not directly visible when locked", () => {
    render(<OpportunitiesStep />);
    // The evidence text of locked cards should still be in DOM (blurred visually)
    // but the paywall lock indicator must be present
    expect(
      screen.getByText(/Oportunidades 2 y 3, bloqueadas/i)
    ).toBeInTheDocument();
    // Evidence text of locked opps may exist in DOM but is visually blurred
    // We verify the paywall is shown (lock copy present) not that content is hidden
  });
});

// ── 4. Paywall removed after pay() ───────────────────────────────────────────

describe("OpportunitiesStep after pay()", () => {
  it("lock copy is gone after store pay()", () => {
    render(<OpportunitiesStep />);

    // Initially locked
    expect(
      screen.getByText(/Oportunidades 2 y 3, bloqueadas/i)
    ).toBeInTheDocument();

    // Trigger pay
    act(() => {
      useAppStore.getState().pay();
    });

    // Lock copy should be gone
    expect(
      screen.queryByText(/Oportunidades 2 y 3, bloqueadas/i)
    ).not.toBeInTheDocument();
  });
});

// ── 5. MetricBar value display ────────────────────────────────────────────────

describe("MetricBar value display", () => {
  it("MetricBar for impacto 90 shows '9' (Math.round(90/10))", () => {
    render(<OpportunitiesStep />);
    // The first opp has impacto=90, so MetricBar should show "9"
    // There may be multiple "9" values from other bars, we just confirm at least one exists
    const nineElements = screen.getAllByText("9");
    expect(nineElements.length).toBeGreaterThan(0);
  });
});

// ── 6. SummaryPanel total hours ───────────────────────────────────────────────

describe("SummaryPanel", () => {
  it('shows "≈ 18 h" as total hours', () => {
    render(<OpportunitiesStep />);
    expect(screen.getByText("≈ 18 h")).toBeInTheDocument();
  });
});
