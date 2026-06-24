/**
 * shell.test.tsx — TDD tests for App Shell (Sidebar, NavItem, OrgFooter, AppShell)
 * Run: npx vitest run components/app-shell/shell.test.tsx
 */
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "@/lib/store/useAppStore";
import { AppShell } from "./AppShell";

// Reset store before each test
beforeEach(() => {
  useAppStore.getState().resetDemo();
  // Ensure role is null (non-validador)
  useAppStore.getState().setRole(null);
});

describe("AppShell — non-validador role", () => {
  it("renders all 5 nav labels", () => {
    render(<AppShell><div>content</div></AppShell>);
    expect(screen.getByText("Equipo")).toBeInTheDocument();
    expect(screen.getByText("Entrevista")).toBeInTheDocument();
    expect(screen.getByText("Mapa vivo")).toBeInTheDocument();
    expect(screen.getByText("Oportunidades")).toBeInTheDocument();
    expect(screen.getByText("Radiografía")).toBeInTheDocument();
  });

  it("renders step numbers 1–5", () => {
    render(<AppShell><div>content</div></AppShell>);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});

describe("AppShell — OrgFooter", () => {
  it('shows "Datos en la UE · GDPR"', () => {
    render(<AppShell><div>content</div></AppShell>);
    expect(screen.getByText(/Datos en la UE · GDPR/)).toBeInTheDocument();
  });

  it('shows org name "Distribuciones Robledo"', () => {
    render(<AppShell><div>content</div></AppShell>);
    expect(screen.getByText("Distribuciones Robledo")).toBeInTheDocument();
  });

  it('shows org sector', () => {
    render(<AppShell><div>content</div></AppShell>);
    expect(screen.getByText("Distribución de material eléctrico")).toBeInTheDocument();
  });

  it('shows "DR" avatar initials', () => {
    render(<AppShell><div>content</div></AppShell>);
    expect(screen.getByText("DR")).toBeInTheDocument();
  });
});

describe("AppShell — validador role", () => {
  beforeEach(() => {
    useAppStore.getState().setRole("validador");
  });

  it('does NOT render "Equipo" nav item', () => {
    render(<AppShell><div>content</div></AppShell>);
    expect(screen.queryByText("Equipo")).not.toBeInTheDocument();
  });

  it('does NOT render "Entrevista" nav item', () => {
    render(<AppShell><div>content</div></AppShell>);
    expect(screen.queryByText("Entrevista")).not.toBeInTheDocument();
  });

  it('still renders "Mapa vivo", "Oportunidades", "Radiografía"', () => {
    render(<AppShell><div>content</div></AppShell>);
    expect(screen.getByText("Mapa vivo")).toBeInTheDocument();
    expect(screen.getByText("Oportunidades")).toBeInTheDocument();
    expect(screen.getByText("Radiografía")).toBeInTheDocument();
  });
});
