"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { AuthGate } from "@/components/auth/AuthGate";
import { PanelChrome } from "@/components/panel/PanelChrome";

/**
 * PanelShell — shared chrome for the Procesos panel routes: applies the palette,
 * gates auth (firebase mode), paints the warm paper background and renders the
 * top bar above the page content.
 */
export function PanelShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthGate>
        <div
          className="min-h-screen"
          style={{
            background:
              "radial-gradient(120% 80% at 50% -10%, #F7F5EF 0%, #F3F1EA 38%, #F1EEE6 100%)",
          }}
        >
          <PanelChrome />
          <main className="mx-auto max-w-[1200px] px-5 pb-28 sm:px-8">
            {children}
          </main>
        </div>
      </AuthGate>
    </ThemeProvider>
  );
}
