/**
 * demo.test.tsx — TDD tests for the Demo launcher screen.
 * Run with: npx vitest run components/demo/demo.test.tsx
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useAppStore } from "@/lib/store/useAppStore";

// ── Mock next/navigation ──────────────────────────────────────────────────────
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// ── Mock auth service ─────────────────────────────────────────────────────────
vi.mock("@/lib/services/auth", () => ({
  signInAs: vi.fn(),
}));

// ── Import components after mocks ─────────────────────────────────────────────
import DemoPage from "@/app/demo/page";
import { RoleCard } from "@/components/demo/RoleCard";

// ── Helpers ───────────────────────────────────────────────────────────────────
const getState = () => useAppStore.getState();

beforeEach(() => {
  vi.clearAllMocks();
  useAppStore.getState().resetDemo();
});

// ── RoleCard component ────────────────────────────────────────────────────────

describe("RoleCard", () => {
  it("renders title, description, and enter affordance", () => {
    const onEnter = vi.fn();
    render(
      <RoleCard
        title="Admin · Champion"
        description="Crea la org"
        onEnter={onEnter}
      />
    );
    expect(screen.getByText("Admin · Champion")).toBeTruthy();
    expect(screen.getByText("Crea la org")).toBeTruthy();
    expect(screen.getByText(/Entrar/)).toBeTruthy();
  });

  it("calls onEnter when the card enter button is clicked", () => {
    const onEnter = vi.fn();
    render(
      <RoleCard title="Validador" description="Confirma el mapa" onEnter={onEnter} />
    );
    fireEvent.click(screen.getByText(/Entrar/));
    expect(onEnter).toHaveBeenCalledTimes(1);
  });
});

// ── DemoPage ──────────────────────────────────────────────────────────────────

describe("DemoPage", () => {
  it("renders the heading 'Entra como…'", () => {
    render(<DemoPage />);
    expect(screen.getByRole("heading", { name: /Entra como/i })).toBeTruthy();
  });

  it("renders the eyebrow 'DEMO · UnifyFlow'", () => {
    render(<DemoPage />);
    expect(screen.getByText(/DEMO.*UnifyFlow/i)).toBeTruthy();
  });

  it("renders 3 role cards: Admin · Champion, Validador, Entrevistado", () => {
    render(<DemoPage />);
    expect(screen.getByText("Admin · Champion")).toBeTruthy();
    expect(screen.getByText("Validador")).toBeTruthy();
    expect(screen.getByText("Entrevistado")).toBeTruthy();
  });

  it("renders 'Reiniciar demo' button", () => {
    render(<DemoPage />);
    expect(screen.getByRole("button", { name: /Reiniciar demo/i })).toBeTruthy();
  });

  it("renders '← Volver al inicio' back link", () => {
    render(<DemoPage />);
    expect(screen.getByText(/Volver al inicio/i)).toBeTruthy();
  });

  it("clicking Entrevistado card calls router.push with '/e/distribuciones-robledo-3f9a'", () => {
    render(<DemoPage />);
    // Find the Entrevistado card's enter button
    const cards = screen.getAllByText(/Entrar/i);
    // Entrevistado is the 3rd card
    fireEvent.click(cards[2]);
    expect(mockPush).toHaveBeenCalledWith("/e/distribuciones-robledo-3f9a");
  });

  it("clicking Validador card calls router.push with '/app?role=validador&step=mapa'", () => {
    render(<DemoPage />);
    const cards = screen.getAllByText(/Entrar/i);
    // Validador is the 2nd card
    fireEvent.click(cards[1]);
    expect(mockPush).toHaveBeenCalledWith("/app?role=validador&step=mapa");
  });

  it("clicking Validador card sets role to 'validador' in the store", () => {
    render(<DemoPage />);
    const cards = screen.getAllByText(/Entrar/i);
    fireEvent.click(cards[1]);
    expect(getState().role).toBe("validador");
  });

  it("clicking Admin card calls router.push with '/app'", () => {
    render(<DemoPage />);
    const cards = screen.getAllByText(/Entrar/i);
    fireEvent.click(cards[0]);
    expect(mockPush).toHaveBeenCalledWith("/app");
  });

  it("clicking 'Reiniciar demo' calls resetDemo — nodes back to 9 after mutation", () => {
    // Mutate state first
    getState().submitInterview("m7", []);
    expect(getState().nodes.length).toBeGreaterThan(9);

    render(<DemoPage />);
    fireEvent.click(screen.getByRole("button", { name: /Reiniciar demo/i }));

    expect(getState().nodes).toHaveLength(9);
  });

  it("shows 'Demo reiniciada' confirmation after clicking Reiniciar demo", () => {
    render(<DemoPage />);
    fireEvent.click(screen.getByRole("button", { name: /Reiniciar demo/i }));
    expect(screen.getByText(/Demo reiniciada/i)).toBeTruthy();
  });
});
