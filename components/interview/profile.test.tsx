/**
 * profile.test.tsx — TDD tests for ProfileView and NotificationsPanel.
 * Run: npx vitest run components/interview/profile.test.tsx
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAppStore } from "@/lib/store/useAppStore";

// ── Mock next/navigation ──────────────────────────────────────────────────────

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// ── Lazy imports so mock is set up before modules load ────────────────────────

let ProfileView: React.ComponentType;
let NotificationsPanel: React.ComponentType;

beforeEach(async () => {
  useAppStore.getState().resetDemo();
  mockPush.mockReset();
  // Dynamic import to ensure mocks are in place
  const pv = await import("./ProfileView");
  ProfileView = pv.ProfileView;
  const np = await import("./NotificationsPanel");
  NotificationsPanel = np.NotificationsPanel;
});

// ── ProfileView ───────────────────────────────────────────────────────────────

describe("ProfileView", () => {
  it('renders "Andrés Pérez"', () => {
    render(<ProfileView />);
    expect(screen.getByText("Andrés Pérez")).toBeInTheDocument();
  });

  it('renders subtitle "Responsable de almacén · Operaciones · Distribuciones Robledo"', () => {
    render(<ProfileView />);
    expect(
      screen.getByText("Responsable de almacén · Operaciones · Distribuciones Robledo")
    ).toBeInTheDocument();
  });

  it("renders all 4 process row labels", () => {
    render(<ProfileView />);
    expect(screen.getByText("Preparar pedido")).toBeInTheDocument();
    expect(screen.getByText("Coordinar envío")).toBeInTheDocument();
    expect(screen.getByText("Recepción de mercancía")).toBeInTheDocument();
    expect(screen.getByText("Control de incidencias de almacén")).toBeInTheDocument();
  });

  it('renders AddProcessCard title "¿Falta algo que no contaste?"', () => {
    render(<ProfileView />);
    expect(screen.getByText("¿Falta algo que no contaste?")).toBeInTheDocument();
  });

  it("typing in AddProcessCard and clicking Añadir appends a 5th row", () => {
    render(<ProfileView />);
    const input = screen.getByPlaceholderText("p. ej. Devoluciones de cliente…");
    fireEvent.change(input, { target: { value: "Gestión de devoluciones" } });
    fireEvent.click(screen.getByRole("button", { name: /Añadir/i }));
    expect(screen.getByText("Gestión de devoluciones")).toBeInTheDocument();
  });
});

// ── NotificationsPanel ────────────────────────────────────────────────────────

describe("NotificationsPanel", () => {
  it('renders "Notificaciones"', () => {
    render(<NotificationsPanel />);
    expect(screen.getByRole("heading", { name: "Notificaciones" })).toBeInTheDocument();
  });

  it('renders verify card with "te pidió validar"', () => {
    render(<NotificationsPanel />);
    expect(screen.getByText(/te pidió validar/)).toBeInTheDocument();
  });

  it('renders verify card with "Elaborar presupuesto"', () => {
    render(<NotificationsPanel />);
    expect(screen.getByText(/Elaborar presupuesto/)).toBeInTheDocument();
  });

  it('renders comment quote substring "¿Avisas tú al cliente"', () => {
    render(<NotificationsPanel />);
    expect(screen.getByText(/¿Avisas tú al cliente/)).toBeInTheDocument();
  });

  it('renders suggestion "sugiere fusionar"', () => {
    render(<NotificationsPanel />);
    expect(screen.getByText(/sugiere fusionar/)).toBeInTheDocument();
  });

  it('"Verificar" button calls setRole + setStep + router.push', () => {
    render(<NotificationsPanel />);
    fireEvent.click(screen.getByRole("button", { name: /Verificar/i }));
    expect(useAppStore.getState().role).toBe("validador");
    expect(useAppStore.getState().currentStep).toBe("mapa");
    expect(mockPush).toHaveBeenCalledWith("/app?role=validador&step=mapa");
  });
});
