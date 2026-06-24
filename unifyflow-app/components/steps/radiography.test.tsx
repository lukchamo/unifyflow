/**
 * radiography.test.tsx — TDD tests for RadiographyStep, DocumentSheet, ExportPanel.
 * Run: npx vitest run components/steps/radiography.test.tsx
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAppStore } from "@/lib/store/useAppStore";
import { RadiographyStep } from "./RadiographyStep";

// Mock next/navigation so useRouter doesn't throw in jsdom
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Reset store to seed before each test
beforeEach(() => {
  useAppStore.getState().resetDemo();
});

// ── 1. Org name ───────────────────────────────────────────────────────────────

describe("DocumentSheet org name", () => {
  it('renders org name "Distribuciones Robledo"', () => {
    render(<RadiographyStep />);
    expect(
      screen.getByRole("heading", { level: 1 })
    ).toHaveTextContent("Distribuciones Robledo");
  });
});

// ── 2. Subtitle ───────────────────────────────────────────────────────────────

describe("DocumentSheet subtitle", () => {
  it('renders subtitle containing "Distribución de material eléctrico · 24 jun 2026"', () => {
    render(<RadiographyStep />);
    expect(
      screen.getByText("Distribución de material eléctrico · 24 jun 2026")
    ).toBeInTheDocument();
  });
});

// ── 3. Inventory list ─────────────────────────────────────────────────────────

describe("DocumentSheet inventory list", () => {
  it('renders "Captar lead" in the inventory', () => {
    render(<RadiographyStep />);
    expect(screen.getByText("Captar lead")).toBeInTheDocument();
  });

  it('renders "Resolver incidencias" in the inventory', () => {
    render(<RadiographyStep />);
    expect(screen.getByText("Resolver incidencias")).toBeInTheDocument();
  });

  it("renders exactly 9 inventory rows", () => {
    render(<RadiographyStep />);
    const rows = screen.getAllByTestId("inventory-row");
    expect(rows).toHaveLength(9);
  });
});

// ── 4. Potencial total ────────────────────────────────────────────────────────

describe("DocumentSheet total potential", () => {
  it('renders "Potencial total" label', () => {
    render(<RadiographyStep />);
    expect(screen.getByText("Potencial total")).toBeInTheDocument();
  });

  it('renders "≈ 18 h/semana" value', () => {
    render(<RadiographyStep />);
    expect(screen.getByText("≈ 18 h/semana")).toBeInTheDocument();
  });
});

// ── 5. Footer ─────────────────────────────────────────────────────────────────

describe("DocumentSheet footer", () => {
  it('renders "Validado por 6 personas · cada nodo es trazable a su entrevista"', () => {
    render(<RadiographyStep />);
    expect(
      screen.getByText(
        "Validado por 6 personas · cada nodo es trazable a su entrevista"
      )
    ).toBeInTheDocument();
  });
});

// ── 6. Export button ──────────────────────────────────────────────────────────

describe("ExportPanel export button", () => {
  it('calls onExport mock when "Exportar PDF" is clicked', () => {
    const mockExport = vi.fn();
    render(<RadiographyStep onExport={mockExport} />);
    fireEvent.click(screen.getByRole("button", { name: /exportar pdf/i }));
    expect(mockExport).toHaveBeenCalledTimes(1);
  });
});
