/**
 * checkout.test.tsx — TDD tests for the Checkout page (Task 7.3).
 * Run with: npx vitest run app/checkout/checkout.test.tsx
 */

import React from "react";
import { beforeEach, describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { useAppStore } from "@/lib/store/useAppStore";

// ── Mock next/navigation ──────────────────────────────────────────────────────

const mockPush = vi.fn();
const mockBack = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

// ── Mock stripe service (fast, but still async) ───────────────────────────────
// The real stripe.ts does: await new Promise<void>(resolve => setTimeout(resolve, 0))
// We let it pass through to the real store; it's fast enough with real timers.

// ── Import the component AFTER mocks ─────────────────────────────────────────

import CheckoutPage from "./page";

// ── Helpers ───────────────────────────────────────────────────────────────────

const getState = () => useAppStore.getState();

beforeEach(() => {
  useAppStore.getState().resetDemo();
  mockPush.mockReset();
  mockBack.mockReset();
});

// ── Rendering ─────────────────────────────────────────────────────────────────

describe("CheckoutPage rendering", () => {
  it("renders the main heading 'Desbloquea tu radiografía'", () => {
    render(<CheckoutPage />);
    expect(
      screen.getByRole("heading", { name: /desbloquea tu radiografía/i })
    ).toBeInTheDocument();
  });

  it("renders all 3 price tiers", () => {
    render(<CheckoutPage />);
    expect(screen.getAllByText(/€490/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/€990/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/€1\.490/).length).toBeGreaterThanOrEqual(1);
  });

  it("default selected tier shows 'Pagar €490' on the CTA button", () => {
    render(<CheckoutPage />);
    expect(
      screen.getByRole("button", { name: /pagar €490/i })
    ).toBeInTheDocument();
  });

  it("renders the DEMO notice", () => {
    render(<CheckoutPage />);
    expect(screen.getByText(/demo/i)).toBeInTheDocument();
  });

  it("renders the back link", () => {
    render(<CheckoutPage />);
    expect(screen.getByText(/volver/i)).toBeInTheDocument();
  });
});

// ── Tier selection ────────────────────────────────────────────────────────────

describe("tier selection", () => {
  it("clicking €990 tier updates the CTA to 'Pagar €990'", async () => {
    render(<CheckoutPage />);
    const tier990 = screen.getByText(/€990/);
    fireEvent.click(tier990);
    expect(
      screen.getByRole("button", { name: /pagar €990/i })
    ).toBeInTheDocument();
  });

  it("clicking €1.490 tier updates the CTA to 'Pagar €1.490'", async () => {
    render(<CheckoutPage />);
    const tier1490 = screen.getByText(/€1\.490/);
    fireEvent.click(tier1490);
    expect(
      screen.getByRole("button", { name: /pagar €1\.490/i })
    ).toBeInTheDocument();
  });
});

// ── Pay flow ──────────────────────────────────────────────────────────────────

describe("payment flow", () => {
  it("after clicking Pagar, subscription.paid becomes true", async () => {
    render(<CheckoutPage />);
    const btn = screen.getByRole("button", { name: /pagar €490/i });

    fireEvent.click(btn);

    await waitFor(() => {
      expect(getState().subscription.paid).toBe(true);
    });
  });

  it("after clicking Pagar, all opps have locked === false", async () => {
    render(<CheckoutPage />);
    const btn = screen.getByRole("button", { name: /pagar €490/i });

    fireEvent.click(btn);

    await waitFor(() => {
      const allUnlocked = getState().opps.every((op) => op.locked === false);
      expect(allUnlocked).toBe(true);
    });
  });

  it("after clicking Pagar, success UI 'Radiografía desbloqueada' appears", async () => {
    render(<CheckoutPage />);
    const btn = screen.getByRole("button", { name: /pagar €490/i });

    fireEvent.click(btn);

    expect(
      await screen.findByText(/radiografía desbloqueada/i)
    ).toBeInTheDocument();
  });

  it("'Ver la radiografía →' button calls router.push('/app?step=radiografia')", async () => {
    render(<CheckoutPage />);
    const btn = screen.getByRole("button", { name: /pagar €490/i });

    fireEvent.click(btn);

    const verBtn = await screen.findByRole("button", {
      name: /ver la radiografía/i,
    });

    fireEvent.click(verBtn);
    expect(mockPush).toHaveBeenCalledWith("/app?step=radiografia");
  });
});
