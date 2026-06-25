"use client";

/**
 * AuthProvider — app-wide authentication context.
 *
 * In `firebase` mode it tracks the Firebase Auth user, reads the role/org/member
 * custom claims, pushes the role into the Zustand store (so every existing
 * role-gated selector keeps working), and mounts <FirebaseBridge> to stream
 * Firestore data in.
 *
 * In `mock` mode it's inert: the original demo (role chosen via the store) runs
 * unchanged and the sign-in methods are no-ops.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import { USE_FIREBASE } from "@/lib/firebase/config";
import { useAppStore } from "@/lib/store/useAppStore";
import type { Role } from "@/lib/schemas";
import { FirebaseBridge } from "@/components/firebase/FirebaseBridge";
import {
  onAuthChange,
  getSessionClaims,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOut as fbSignOut,
} from "@/lib/firebase/auth";

export interface AuthContextValue {
  mode: "mock" | "firebase";
  user: User | null;
  role: Role | null;
  orgId: string | null;
  memberId: string | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const noop = async () => {
  throw new Error("Auth is only available when NEXT_PUBLIC_DATA_BACKEND=firebase");
};

// Inert default so components rendered without an <AuthProvider> (e.g. in unit
// tests, or any mock-mode subtree) degrade gracefully to the demo behaviour.
const MOCK_CONTEXT: AuthContextValue = {
  mode: "mock",
  user: null,
  role: null,
  orgId: null,
  memberId: null,
  loading: false,
  signInEmail: noop,
  signUpEmail: noop,
  signInGoogle: noop,
  signOut: async () => {},
};

const AuthContext = createContext<AuthContextValue>(MOCK_CONTEXT);

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const setStoreRole = useAppStore((s) => s.setRole);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(USE_FIREBASE);

  useEffect(() => {
    if (!USE_FIREBASE) return;
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        // forceRefresh so a just-assigned claim (seed/onMemberWritten) is read.
        const claims = await getSessionClaims(u, true);
        setRole(claims.role);
        setOrgId(claims.orgId);
        setMemberId(claims.memberId);
        if (claims.role) setStoreRole(claims.role);
      } else {
        setRole(null);
        setOrgId(null);
        setMemberId(null);
        setStoreRole(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [setStoreRole]);

  const signInEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmail(email, password);
  }, []);
  const signUpEmail = useCallback(async (email: string, password: string) => {
    await signUpWithEmail(email, password);
  }, []);
  const signInGoogle = useCallback(async () => {
    await signInWithGoogle();
  }, []);
  const signOut = useCallback(async () => {
    await fbSignOut();
  }, []);

  const value: AuthContextValue = USE_FIREBASE
    ? {
        mode: "firebase",
        user,
        role,
        orgId,
        memberId,
        loading,
        signInEmail,
        signUpEmail,
        signInGoogle,
        signOut,
      }
    : MOCK_CONTEXT;

  return (
    <AuthContext.Provider value={value}>
      {USE_FIREBASE && orgId ? <FirebaseBridge orgId={orgId} /> : null}
      {children}
    </AuthContext.Provider>
  );
}
