/**
 * tour.test.tsx — TDD tests for the Guided Tour feature.
 *
 * Tests:
 *   1. startTour() → GuidedTour renders first step title "Invita a tu equipo" and "Paso 1 de 6"
 *   2. clicking "Siguiente →" calls nextTourStep and coachmark shows step 2 "Una charla, no un formulario"
 *   3. advancing to the radiografia step results in subscription.paid === true
 *   4. on the last step "Siguiente →" calls endTour (tour.active false)
 *
 * Run: npx vitest run components/demo/tour.test.tsx
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useAppStore } from "@/lib/store/useAppStore";

// ── Mock next/navigation ──────────────────────────────────────────────────────
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// ── Import after mocks ────────────────────────────────────────────────────────
import { GuidedTour } from "./GuidedTour";
import { tourSteps } from "@/lib/data/tourSteps";

// ── Helpers ───────────────────────────────────────────────────────────────────
const getStore = () => useAppStore.getState();

// ── Reset store before each test ─────────────────────────────────────────────
beforeEach(() => {
  useAppStore.getState().resetDemo();
});

// ── Tour data sanity ──────────────────────────────────────────────────────────

describe("tourSteps data", () => {
  it("has exactly 6 steps", () => {
    expect(tourSteps).toHaveLength(6);
  });

  it("first step key is 'equipo'", () => {
    expect(tourSteps[0].key).toBe("equipo");
  });

  it("last step key is 'radiografia'", () => {
    expect(tourSteps[5].key).toBe("radiografia");
  });

  it("step 4 (oportunidades) has dashboardStep 'oportunidades'", () => {
    expect(tourSteps[4].dashboardStep).toBe("oportunidades");
  });
});

// ── GuidedTour renders nothing when inactive ──────────────────────────────────

describe("GuidedTour when tour.active=false", () => {
  it("renders nothing when tour is not active", () => {
    const { container } = render(<GuidedTour />);
    expect(container.firstChild).toBeNull();
  });
});

// ── GuidedTour renders first step when active ─────────────────────────────────

describe("GuidedTour after startTour()", () => {
  it("renders the first step title 'Invita a tu equipo'", () => {
    act(() => {
      getStore().startTour();
    });
    render(<GuidedTour />);
    expect(screen.getByText("Invita a tu equipo")).toBeInTheDocument();
  });

  it("shows 'Paso 1 de 6' progress indicator", () => {
    act(() => {
      getStore().startTour();
    });
    render(<GuidedTour />);
    expect(screen.getByText(/Paso 1 de 6/i)).toBeInTheDocument();
  });

  it("shows the first step body text", () => {
    act(() => {
      getStore().startTour();
    });
    render(<GuidedTour />);
    expect(
      screen.getByText(/Cada persona responde 3–4 preguntas/i)
    ).toBeInTheDocument();
  });

  it("shows 'Siguiente →' button", () => {
    act(() => {
      getStore().startTour();
    });
    render(<GuidedTour />);
    expect(screen.getByRole("button", { name: /Siguiente/i })).toBeInTheDocument();
  });

  it("shows 'Saltar tour' dismiss affordance", () => {
    act(() => {
      getStore().startTour();
    });
    render(<GuidedTour />);
    expect(screen.getByText(/Saltar tour/i)).toBeInTheDocument();
  });
});

// ── Clicking "Siguiente →" advances to step 2 ────────────────────────────────

describe("GuidedTour — clicking Siguiente → advances step", () => {
  it("store tour.step increments to 1 when Siguiente is clicked", () => {
    act(() => {
      getStore().startTour();
    });
    render(<GuidedTour />);
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/i }));
    expect(getStore().tour.step).toBe(1);
  });

  it("coachmark shows step 2 title 'Una charla, no un formulario' after click", () => {
    act(() => {
      getStore().startTour();
    });
    const { rerender } = render(<GuidedTour />);
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/i }));
    rerender(<GuidedTour />);
    expect(
      screen.getByText("Una charla, no un formulario")
    ).toBeInTheDocument();
  });

  it("shows 'Paso 2 de 6' after clicking Siguiente once", () => {
    act(() => {
      getStore().startTour();
    });
    const { rerender } = render(<GuidedTour />);
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/i }));
    rerender(<GuidedTour />);
    expect(screen.getByText(/Paso 2 de 6/i)).toBeInTheDocument();
  });
});

// ── Advancing past oportunidades unlocks (calls pay) ─────────────────────────

describe("GuidedTour — advancing to radiografia step unlocks subscription", () => {
  it("subscription.paid === true when tour reaches radiografia step (step 5)", () => {
    act(() => {
      getStore().startTour();
      // Advance to step 4 (oportunidades, index 4)
      getStore().nextTourStep(); // step 1
      getStore().nextTourStep(); // step 2
      getStore().nextTourStep(); // step 3
      getStore().nextTourStep(); // step 4 = oportunidades
    });

    render(<GuidedTour />);

    // Click Siguiente to advance FROM oportunidades (step 4) TO radiografia (step 5)
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/i }));

    // subscription should now be paid
    expect(getStore().subscription.paid).toBe(true);
  });
});

// ── Last step — Siguiente calls endTour ───────────────────────────────────────

describe("GuidedTour — last step Siguiente calls endTour", () => {
  it("tour.active becomes false when Siguiente is clicked on last step (step 5)", () => {
    act(() => {
      getStore().startTour();
      // Advance to last step (index 5)
      getStore().nextTourStep(); // 1
      getStore().nextTourStep(); // 2
      getStore().nextTourStep(); // 3
      getStore().nextTourStep(); // 4
      getStore().nextTourStep(); // 5 = radiografia (last)
    });

    render(<GuidedTour />);
    fireEvent.click(screen.getByRole("button", { name: /Siguiente|Finalizar/i }));

    expect(getStore().tour.active).toBe(false);
  });
});

// ── Saltar tour dismisses ─────────────────────────────────────────────────────

describe("GuidedTour — Saltar tour dismisses", () => {
  it("tour.active becomes false when 'Saltar tour' is clicked", () => {
    act(() => {
      getStore().startTour();
    });
    render(<GuidedTour />);
    fireEvent.click(screen.getByText(/Saltar tour/i));
    expect(getStore().tour.active).toBe(false);
  });
});
