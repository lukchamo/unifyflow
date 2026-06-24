/**
 * selectors.ts — Pure derived selectors for AppState.
 * These are standalone functions (not Zustand subscriptions) that take
 * the store state and return derived values.
 */

import type { AppState } from "./useAppStore";

// ── Helper ────────────────────────────────────────────────────────────────────

/** Extract the first integer from a horas string like "−6 h/sem" or "≈ 18 h". */
function parseHorasInt(horas: string | null): number {
  if (!horas) return 0;
  const match = horas.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

// ── Selectors ─────────────────────────────────────────────────────────────────

/**
 * Returns the number of nodes with estado === 'validated'.
 */
export function selectValidatedCount(s: AppState): number {
  return s.nodes.filter((n) => n.estado === "validated").length;
}

/**
 * Returns a string like "4 de 9 nodos validados".
 */
export function selectStatusText(s: AppState): string {
  const validatedCount = selectValidatedCount(s);
  const totalNodes = s.nodes.length;
  return `${validatedCount} de ${totalNodes} nodos validados`;
}

/**
 * Returns a string like "5 de 7 completadas".
 * Counts team members whose done === true vs total team size.
 */
export function selectProgressText(s: AppState): string {
  const doneCount = s.team.filter((m) => m.done).length;
  const teamCount = s.team.length;
  return `${doneCount} de ${teamCount} completadas`;
}

/**
 * Returns a string like "≈ 18 h" — sum of hours from opportunity nodes.
 * Parses the integer from each opportunity's `horas` field.
 */
export function selectTotalHours(s: AppState): string {
  const sum = s.opps.reduce((acc, op) => acc + parseHorasInt(op.horas), 0);
  return `≈ ${sum} h`;
}

/**
 * For role 'validador', returns only nodes matching the validador member's area.
 * For all other roles (or null), returns all nodes.
 */
export function selectVisibleNodesForRole(s: AppState) {
  if (s.role !== "validador") {
    return s.nodes;
  }

  // Find the member with rol 'validador' in the team
  const validadorMember = s.team.find((m) => m.rol === "validador");
  if (!validadorMember) {
    return s.nodes;
  }

  return s.nodes.filter((n) => n.area === validadorMember.area);
}
