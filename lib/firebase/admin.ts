/**
 * admin.ts — Firebase Admin SDK singleton (server / scripts only).
 *
 * NEVER import this from a client component. Used by the seed script and any
 * server-side code. When `FIRESTORE_EMULATOR_HOST` is set (the seed script and
 * the `dev:emulator` flow set it), the Admin SDK transparently targets the
 * emulator and no service-account credentials are required.
 *
 * For a REAL project, provide credentials via either:
 *   - GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json, or
 *   - FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
 */

import {
  getApps,
  initializeApp,
  cert,
  applicationDefault,
  type App,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
  process.env.GCLOUD_PROJECT ??
  "demo-unifyflow";

const USING_EMULATOR =
  !!process.env.FIRESTORE_EMULATOR_HOST ||
  !!process.env.FIREBASE_AUTH_EMULATOR_HOST;

function resolveCredential() {
  if (USING_EMULATOR) return undefined; // emulator needs no real credentials
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return applicationDefault();
  }
  return undefined;
}

export function getAdminApp(): App {
  if (getApps().length) return getApps()[0]!;
  const credential = resolveCredential();
  return initializeApp({
    projectId: PROJECT_ID,
    ...(credential ? { credential } : {}),
  });
}

export const adminAuth = () => getAuth(getAdminApp());
export const adminDb = () => getFirestore(getAdminApp());
