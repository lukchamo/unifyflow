export type PaletteName = "Salvia" | "Azul" | "Terracota" | "Lavanda";

export interface Palette {
  accent: string;
  accentDk: string;
  accentTint: string;
}

export const PALETTES: Record<PaletteName, Palette> = {
  Salvia:    { accent: "#3C7D6E", accentDk: "#2C6457", accentTint: "#E7F0ED" },
  Azul:      { accent: "#3F6FA6", accentDk: "#2F5687", accentTint: "#E7EEF6" },
  Terracota: { accent: "#B05E45", accentDk: "#8E4634", accentTint: "#F6E9E4" },
  Lavanda:   { accent: "#6E5C9E", accentDk: "#564785", accentTint: "#ECE8F4" },
};

/**
 * Applies a palette by setting CSS custom properties on <html>.
 * No-op in non-browser environments.
 */
export function applyPalette(name: PaletteName): void {
  if (typeof document === "undefined") return;
  const p = PALETTES[name];
  const root = document.documentElement;
  root.style.setProperty("--accent", p.accent);
  root.style.setProperty("--accent-dk", p.accentDk);
  root.style.setProperty("--accent-tint", p.accentTint);
}
