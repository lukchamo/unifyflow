/**
 * stripe.ts — Mock Stripe checkout service for UnifyFlow demo app.
 */

import { useAppStore } from "@/lib/store/useAppStore";

/**
 * Simulates a Stripe checkout flow.
 * Resolves with { ok: true } and updates the store to mark subscription as paid.
 */
export async function checkout(): Promise<{ ok: true }> {
  // Simulate async network call (0ms delay for fast tests)
  await new Promise<void>((resolve) => setTimeout(resolve, 0));

  useAppStore.getState().pay();

  return { ok: true };
}
