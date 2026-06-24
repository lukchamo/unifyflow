/**
 * mapheader.test.tsx — Tests for MapHeader and FilterBar components.
 * TDD: write tests first, implement after.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MapHeader } from "./MapHeader";
import { FilterBar } from "./FilterBar";
import { useAppStore } from "@/lib/store/useAppStore";

// ── Store seed ────────────────────────────────────────────────────────────────

function seedStore() {
  useAppStore.getState().resetDemo();
}

// ── MapHeader tests ───────────────────────────────────────────────────────────

describe("MapHeader", () => {
  beforeEach(() => {
    act(() => {
      seedStore();
    });
  });

  it('renders kicker "Momento espejo · paso 3"', () => {
    render(<MapHeader />);
    expect(screen.getByText("Momento espejo · paso 3")).toBeTruthy();
  });

  it('renders title containing "Distribuciones Robledo"', () => {
    render(<MapHeader />);
    const title = screen.getByText(/Distribuciones Robledo/);
    expect(title).toBeTruthy();
  });

  it("renders subtitle containing statusText from store", () => {
    render(<MapHeader />);
    // From mock data: 4 nodes are validated (n3,n5,n7,n9 per mockData)
    const subtitle = screen.getByText(/nodos validados/);
    expect(subtitle).toBeTruthy();
  });

  it("renders the En vivo pill", () => {
    render(<MapHeader />);
    expect(screen.getByText("En vivo")).toBeTruthy();
  });

  it('renders "↺ Repetir" button', () => {
    render(<MapHeader />);
    expect(screen.getByText(/Repetir/)).toBeTruthy();
  });

  it('renders "✦ Reorganizar con IA" button initially', () => {
    render(<MapHeader />);
    expect(screen.getByText(/Reorganizar con IA/)).toBeTruthy();
  });

  it('shows "✓ Reorganizado por IA" when store.mapState.organized is true', () => {
    act(() => {
      useAppStore.getState().reorganize();
    });
    render(<MapHeader />);
    expect(screen.getByText(/Reorganizado por IA/)).toBeTruthy();
  });
});

// ── FilterBar tests ───────────────────────────────────────────────────────────

describe("FilterBar", () => {
  beforeEach(() => {
    act(() => {
      seedStore();
    });
  });

  it("renders all four filter chips", () => {
    render(<FilterBar />);
    expect(screen.getAllByText("Todos").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Borrador").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Validado").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Oportunidad IA").length).toBeGreaterThanOrEqual(1);
  });

  it("renders legend items", () => {
    render(<FilterBar />);
    // Legend has "Validado", "Borrador", "Oportunidad IA"
    const validados = screen.getAllByText("Validado");
    expect(validados.length).toBeGreaterThanOrEqual(1);
    const borradores = screen.getAllByText("Borrador");
    expect(borradores.length).toBeGreaterThanOrEqual(1);
    const opps = screen.getAllByText("Oportunidad IA");
    expect(opps.length).toBeGreaterThanOrEqual(1);
  });
});
