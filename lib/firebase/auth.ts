/**
 * auth.ts — Firebase Auth helpers (email/password + Google) with role claims.
 *
 * Roles are delivered as custom claims on the ID token (`role`, `orgId`,
 * `memberId`), set by the `onMemberWritten` Cloud Function. `getSessionRole`
 * reads them back, forcing a token refresh so a freshly-set claim is visible.
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { getFirebaseAuth, googleProvider } from "./client";
import type { Role } from "@/lib/schemas";

export interface SessionClaims {
  role: Role | null;
  orgId: string | null;
  memberId: string | null;
}

export function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export function signUpWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export function signInWithGoogle() {
  return signInWithPopup(getFirebaseAuth(), googleProvider);
}

export function signOut() {
  return fbSignOut(getFirebaseAuth());
}

export function onAuthChange(cb: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(getFirebaseAuth(), cb);
}

/**
 * Read the role/org/member claims from the user's ID token.
 * `forceRefresh` re-fetches the token so a just-assigned claim is picked up.
 */
export async function getSessionClaims(
  user: User,
  forceRefresh = false
): Promise<SessionClaims> {
  const token = await user.getIdTokenResult(forceRefresh);
  const claims = token.claims as Record<string, unknown>;
  const role = claims.role;
  return {
    role:
      role === "admin" || role === "validador" || role === "entrevistado"
        ? role
        : null,
    orgId: typeof claims.orgId === "string" ? claims.orgId : null,
    memberId: typeof claims.memberId === "string" ? claims.memberId : null,
  };
}
