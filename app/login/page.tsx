"use client";

/**
 * /login — Firebase Auth sign-in (email/password + Google) with one-click demo
 * accounts. Only meaningful when NEXT_PUBLIC_DATA_BACKEND=firebase; in mock mode
 * it just points back to the role-selector demo.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";

// Seeded demo accounts (see scripts/seed.ts). Password is the seed default.
const DEMO_PASSWORD = "unifyflow123";
const DEMO_ACCOUNTS = [
  { label: "Admin · Champion", email: "marta-ruiz@robledo.es" },
  { label: "Validador", email: "lucia-vidal@robledo.es" },
  { label: "Entrevistado", email: "andres-perez@robledo.es" },
];

export default function LoginPage() {
  const router = useRouter();
  const { mode, signInEmail, signInGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
      router.push("/app");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar sesión.");
    } finally {
      setBusy(false);
    }
  }

  if (mode === "mock") {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center"
        style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
      >
        <p>El login real requiere el backend de Firebase.</p>
        <Link href="/demo" style={{ color: "var(--accent-dk)" }}>
          → Ir a la demo con selector de rol
        </Link>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="w-full max-w-sm flex flex-col gap-6">
        <header className="flex flex-col gap-2 text-center">
          <p
            className="text-xs font-medium tracking-widest uppercase"
            style={{ fontFamily: "var(--font-mono), monospace", color: "var(--accent)" }}
          >
            UnifyFlow
          </p>
          <h1
            className="text-3xl font-normal"
            style={{ fontFamily: "var(--font-newsreader), serif", color: "var(--fg)" }}
          >
            Inicia sesión
          </h1>
        </header>

        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            void run(() => signInEmail(email, password));
          }}
        >
          <input
            type="email"
            required
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border, #ddd)", color: "var(--fg)" }}
          />
          <input
            type="password"
            required
            placeholder="contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border, #ddd)", color: "var(--fg)" }}
          />
          <Button type="submit" disabled={busy}>
            {busy ? "Entrando…" : "Entrar con email"}
          </Button>
        </form>

        <Button variant="ghost" disabled={busy} onClick={() => void run(signInGoogle)}>
          Continuar con Google
        </Button>

        {error && (
          <p className="text-sm text-center" style={{ color: "#b00" }} role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <p
            className="text-center text-xs"
            style={{ fontFamily: "var(--font-mono), monospace", color: "var(--fg)", opacity: 0.5 }}
          >
            Cuentas demo (contraseña: {DEMO_PASSWORD})
          </p>
          {DEMO_ACCOUNTS.map((a) => (
            <Button
              key={a.email}
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => void run(() => signInEmail(a.email, DEMO_PASSWORD))}
            >
              {a.label}
            </Button>
          ))}
        </div>

        <Link
          href="/"
          className="text-center text-sm hover:underline"
          style={{ color: "var(--accent-dk)" }}
        >
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}
