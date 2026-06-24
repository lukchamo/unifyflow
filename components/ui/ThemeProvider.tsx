"use client";

import * as React from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { applyPalette } from "@/lib/theme/palettes";

/**
 * ThemeProvider — client component.
 * On mount and whenever the store `theme` changes, calls applyPalette(theme)
 * to sync CSS custom properties with the chosen palette.
 *
 * Usage: wrap the app in layout.tsx
 *   <ThemeProvider>{children}</ThemeProvider>
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.theme);

  React.useEffect(() => {
    applyPalette(theme);
  }, [theme]);

  return <>{children}</>;
}
