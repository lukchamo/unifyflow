"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RoleCard } from "@/components/demo/RoleCard";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store/useAppStore";
import { signInAs } from "@/lib/services/auth";

export default function DemoPage() {
  const router = useRouter();
  const { setRole, resetDemo } = useAppStore();
  const [resetConfirmed, setResetConfirmed] = useState(false);

  function handleReset() {
    resetDemo();
    setResetConfirmed(true);
    setTimeout(() => setResetConfirmed(false), 3000);
  }

  const roles = [
    {
      icon: "🏗️",
      title: "Admin · Champion",
      description:
        "Crea la org, invita al equipo, ve el mapa, desbloquea las oportunidades y exporta la radiografía.",
      onEnter: () => {
        signInAs("admin");
        setRole("admin");
        router.push("/app");
      },
    },
    {
      icon: "✅",
      title: "Validador",
      description: "Confirma y corrige el mapa de tu área. Comenta y valida.",
      onEnter: () => {
        signInAs("validador");
        setRole("validador");
        router.push("/app?role=validador&step=mapa");
      },
    },
    {
      icon: "🎤",
      title: "Entrevistado",
      description:
        "Responde 3–4 preguntas en menos de 5 minutos. Tu respuesta dibuja el mapa.",
      onEnter: () => {
        signInAs("entrevistado");
        setRole("entrevistado");
        router.push("/e/distribuciones-robledo-3f9a");
      },
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
