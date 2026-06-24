/**
 * auth.ts — Mock authentication service for UnifyFlow demo app.
 */

import { useAppStore } from "@/lib/store/useAppStore";
import type { Role } from "@/lib/schemas";

/**
 * Signs in as the given role by updating the Zustand store.
 */
export function signInAs(role: Role): void {
  useAppStore.getState().setRole(role);
}

/**
 * Generates a shareable team onboarding link for the given company name.
 * Format: `unifyflow.eu/e/<slug>-<4-char-base36-code>` (no protocol).
 *
 * Slug rules:
 * - Lowercase
 * - Strip accents (NFD decomposition, remove combining diacritics U+0300–U+036F)
 * - Replace non-alphanumeric chars with "-"
 * - Collapse consecutive dashes
 * - Trim leading/trailing dashes
 * - Truncate to 24 chars (trimming trailing dashes after truncation)
 * - Fallback to "tu-empresa" if result is empty
 */
export function generateTeamLink(company: string): string {
  let slug = company
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24)
    .replace(/-+$/g, "");

  if (!slug) {
    slug = "tu-empresa";
  }

  const code = Math.random().toString(36).slice(2, 6).padEnd(4, "0");

  return `unifyflow.eu/e/${slug}-${code}`;
}
