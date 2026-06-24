/**
 * nodeStateStyles.ts — Maps node estado to visual style tokens.
 */
import { AREA_COLORS } from "@/lib/data/mockData";

export interface NodeStateStyle {
  dotColor: string;
  dotRing?: string; // for draft state — ring CSS value
  bg: string;
  border: string;
  pillText: string;
  pillBg: string;
  pillLabel: string;
}

export const NODE_STATE_STYLES: Record<string, NodeStateStyle> = {
  validated: {
    dotColor: "var(--accent)",
    bg: "#FFFFFF",
    border: "#CDE0D8",
    pillText: "var(--accent-dk)",
    pillBg: "var(--accent-tint)",
    pillLabel: "Validado",
  },
  draft: {
    dotColor: "transparent",
    dotRing: "1.5px solid #BBC0BC",
    bg: "#FFFFFF",
    border: "#E2E6E4",
    pillText: "#7A807C",
    pillBg: "#EEF1EF",
    pillLabel: "Borrador",
  },
  opportunity: {
    dotColor: "#B58238",
    bg: "#FCF8EE",
    border: "#E9D8B2",
    pillText: "#8A6420",
    pillBg: "#F4E8CE",
    pillLabel: "Oportunidad IA",
  },
};

/** Returns the text color for an area chip from AREA_COLORS */
export function getAreaChipColor(area: string): string {
  return AREA_COLORS[area] ?? "#555";
}
