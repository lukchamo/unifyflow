"use client";

/**
 * PanelChrome — the sticky top bar for the Procesos panel.
 *
 * Mirrors the brand-switcher / actions pattern of a modern product console, in
 * UnifyFlow's calm editorial language: a sage flow-glyph logo, the wordmark, an
 * org switcher (Radix Popover) and the account menu.
 */

import Link from "next/link";
import * as Popover from "@radix-ui/react-popover";
import { useAppStore } from "@/lib/store/useAppStore";
import { useAuth } from "@/components/auth/AuthProvider";

function FlowGlyph() {
  return (
    <span
      aria-hidden
      className="grid place-items-center rounded-[10px]"
      style={{
        width: 30,
        height: 30,
        background: "linear-gradient(150deg, var(--accent) 0%, var(--accent-dk) 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.25)",
      }}
    >
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path
          d="M3 4.5h4.5v8H14"
          stroke="#fff"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity=".95"
        />
        <circle cx="3" cy="4.5" r="1.7" fill="#fff" />
        <circle cx="14" cy="12.5" r="1.7" fill="#fff" />
      </svg>
    </span>
  );
}

export function PanelChrome() {
  const org = useAppStore((s) => s.org);
  const { mode, user, signOut } = useAuth();

  const initial = org.nombre?.[0]?.toUpperCase() ?? "U";

  return (
    <header
      className="sticky top-0 z-30"
      style={{
        background: "rgba(243,241,234,0.82)",
        backdropFilter: "saturate(140%) blur(10px)",
        WebkitBackdropFilter: "saturate(140%) blur(10px)",
        borderBottom: "1px solid #E8E4D9",
      }}
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-3 px-5 sm:px-8">
        <Link href="/procesos" className="flex items-center gap-2.5">
          <FlowGlyph />
          <span
            className="hidden text-[15px] sm:inline"
            style={{ fontFamily: "var(--font-newsreader), serif", fontWeight: 600, color: "var(--fg)" }}
          >
            UnifyFlow
          </span>
        </Link>

        <span aria-hidden style={{ color: "#C8C3B5" }}>
          /
        </span>

        {/* Org switcher */}
        <Popover.Root>
          <Popover.Trigger
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm transition-colors hover:bg-[#EAE6DA]"
            style={{ color: "var(--fg)", fontWeight: 500 }}
          >
            {org.nombre}
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              align="start"
              sideOffset={8}
              className="z-50 w-60 rounded-xl p-1.5"
              style={{
                background: "#fff",
                border: "1px solid #EAE7DE",
                boxShadow: "0 12px 40px -12px rgba(28,32,30,.22)",
              }}
            >
              <div className="flex items-center justify-between rounded-lg px-2.5 py-2" style={{ background: "var(--accent-tint)" }}>
                <span className="text-sm" style={{ color: "var(--accent-dk)", fontWeight: 500 }}>
                  {org.nombre}
                </span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M3 7.5 6 10.5l5-6.5" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <button
                disabled
                className="mt-0.5 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm"
                style={{ color: "#9A9588", cursor: "not-allowed" }}
              >
                <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> Nueva organización
                <span
                  className="ml-auto rounded-full px-1.5 py-0.5 text-[10px]"
                  style={{ background: "#F0EDE4", color: "#9A9588", fontFamily: "var(--font-mono), monospace" }}
                >
                  pronto
                </span>
              </button>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        <div className="ml-auto flex items-center gap-1.5">
          <Link
            href="/app?step=mapa"
            className="hidden rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-[#EAE6DA] sm:block"
            style={{ color: "#5B5F58" }}
          >
            Mapa vivo
          </Link>

          {/* Account */}
          <Popover.Root>
            <Popover.Trigger
              className="grid h-8 w-8 place-items-center rounded-full text-sm font-medium text-white transition-transform hover:scale-105"
              style={{ background: "var(--accent-dk)" }}
              aria-label="Cuenta"
            >
              {(user?.email?.[0] ?? initial).toUpperCase()}
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                align="end"
                sideOffset={8}
                className="z-50 w-56 rounded-xl p-1.5"
                style={{ background: "#fff", border: "1px solid #EAE7DE", boxShadow: "0 12px 40px -12px rgba(28,32,30,.22)" }}
              >
                <div className="px-2.5 py-2">
                  <p className="text-xs" style={{ color: "#9A9588", fontFamily: "var(--font-mono), monospace" }}>
                    Sesión
                  </p>
                  <p className="truncate text-sm" style={{ color: "var(--fg)" }}>
                    {user?.email ?? "Demo · datos de ejemplo"}
                  </p>
                </div>
                <Link
                  href="/app"
                  className="block rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-[#F2F0E9]"
                  style={{ color: "var(--fg)" }}
                >
                  Ir al dashboard
                </Link>
                {mode === "firebase" ? (
                  <button
                    onClick={() => void signOut()}
                    className="block w-full rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-[#F2F0E9]"
                    style={{ color: "#B0573C" }}
                  >
                    Cerrar sesión
                  </button>
                ) : (
                  <Link
                    href="/demo"
                    className="block rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-[#F2F0E9]"
                    style={{ color: "var(--fg)" }}
                  >
                    Cambiar de rol
                  </Link>
                )}
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>
    </header>
  );
}
