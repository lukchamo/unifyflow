"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RoleCard } from "@/components/demo/RoleCard";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store/useAppStore";
import { signInAs } from "@/lib/services/auth";
import { useAuth } from "@/components/auth/AuthProvider";

// Seeded demo accounts (see scripts/seed.ts) used in firebase mode.
const DEMO_PASSWORD = "unifyflow123";
const DEMO_EMAIL = {
  admin: "marta-ruiz@robledo.es",
  validador: "lucia-vidal@robledo.es",
  entrevistado: "andres-perez@robledo.es",
} as const;

export default function DemoPage() {
  const router = useRouter();
  const { setRole, resetDemo } = useAppStore();
  const { mode, signInEmail } = useAuth();
  const [resetConfirmed, setResetConfirmed] = useState(false);

  function handleReset() {
    resetDemo();
    setResetConfirmed(true);
    setTimeout(() => setResetConfirmed(false), 3000);
  }

  // In firebase mode, really authenticate as the seeded account (role comes
  // from custom claims). In mock mode, keep the original store-based role.
  function enter(
    role: "admin" | "validador" | "entrevistado",
    destination: string
  ) {
    if (mode === "firebase") {
      void signInEmail(DEMO_EMAIL[role], DEMO_PASSWORD)
        .then(() => router.push(destination))
        .catch((e) => console.error("demo sign-in failed", e));
      return;
    }
    signInAs(role);
    setRole(role);
    router.push(destination);
  }

  const roles = [
    {
      icon: "🏗️",
      title: "Admin · Champion",
      description:
        "Crea la org, invita al equipo, ve el mapa, desbloquea las oportunidades y exporta la radiografía.",
      onEnter: () => enter("admin", "/app"),
    },
    {
      icon: "✅",
      title: "Validador",
      description: "Confirma y corrige el mapa de tu área. Comenta y valida.",
      onEnter: () => enter("validador", "/app?role=validador&step=mapa"),
    },
    {
      icon: "🎤",
      title: "Entrevistado",
      description:
        "Responde 3–4 preguntas en menos de 5 minutos. Tu respuesta dibuja el mapa.",
      onEnter: () =>
        enter("entrevistado", "/e/distribuciones-robledo-3f9a"),
    },
  ];

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="w-full max-w-2xl flex flex-col gap-10">
        {/* Header */}
        <header className="flex flex-col gap-3 text-center">
          <p
            className="text-xs font-medium tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-mono), monospace",
              color: "var(--accent)",
            }}
          >
            DEMO · UnifyFlow
          </p>
          <h1
            className="text-4xl sm:text-5xl font-normal leading-tight"
            style={{
              fontFamily: "var(--font-newsreader), serif",
              color: "var(--fg)",
            }}
          >
            Entra como…
          </h1>
          <p
            className="text-base leading-relaxed max-w-md mx-auto"
            style={{ color: "var(--fg)", opacity: 0.65 }}
          >
            Recorre el flujo completo desde cualquier rol. Todo es una demo con datos de ejemplo.
          </p>
        </header>

        {/* Role cards — 1 col on mobile, 3 cols on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {roles.map((role) => (
            <RoleCard
              key={role.title}
              icon={role.icon}
              title={role.title}
              description={role.description}
              onEnter={role.onEnter}
            />
          ))}
        </div>

        {/* Simulated auth note (decorative) */}
        <p
          className="text-center text-xs"
          style={{
            fontFamily: "var(--font-mono), monospace",
            color: "var(--fg)",
            opacity: 0.4,
          }}
        >
          Acceso simulado · enlace mágico / Google
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Reiniciar demo
          </Button>
          {resetConfirmed && (
            <p
              className="text-sm"
              style={{ color: "var(--accent)" }}
              role="status"
            >
              Demo reiniciada
            </p>
          )}
          <Link
            href="/"
            className="text-sm transition-colors hover:underline"
            style={{ color: "var(--accent-dk)" }}
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
