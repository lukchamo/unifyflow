"use client";

/**
 * AuthGate — protects a subtree in firebase mode. In mock mode it's a
 * pass-through so the original demo keeps working with the store-based role.
 */

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export function AuthGate({ children }: { children: ReactNode }) {
  const { mode, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (mode === "firebase" && !loading && !user) {
      router.replace("/login");
    }
  }, [mode, loading, user, router]);

  if (mode === "mock") return <>{children}</>;

  if (loading || !user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-sm"
        style={{ backgroundColor: "var(--bg)", color: "var(--fg)", opacity: 0.6 }}
      >
        Cargando sesión…
      </div>
    );
  }

  return <>{children}</>;
}
