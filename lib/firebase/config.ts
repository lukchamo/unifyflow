/**
 * config.ts — Centralized Firebase configuration & feature flags.
 *
 * Reads from `NEXT_PUBLIC_*` env vars (inlined at build time). Everything here
 * is safe to import from both client and server code.
 */

export type DataBackend = "mock" | "firebase";

/**
 * Which data layer the app uses. Defaults to "mock" so the original demo keeps
 * working anywhere (e.g. Vercel) without any Firebase setup. Set
 * `NEXT_PUBLIC_DATA_BACKEND=firebase` to use Firestore + Firebase Auth.
 */
export const DATA_BACKEND: DataBackend =
  process.env.NEXT_PUBLIC_DATA_BACKEND === "firebase" ? "firebase" : "mock";

export const USE_FIREBASE = DATA_BACKEND === "firebase";

/** Whether to point the SDKs at the local emulator suite. */
export const USE_EMULATOR =
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "demo-api-key",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    "demo-unifyflow.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "demo-unifyflow",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "demo-unifyflow.appspot.com",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "000000000000",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    "1:000000000000:web:demouni0000000000",
};

export const emulator = {
  host: process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST ?? "127.0.0.1",
  authPort: Number(
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT ?? "9099"
  ),
  firestorePort: Number(
    process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_PORT ?? "8080"
  ),
};

/** A `demo-` project id means "emulator only", no real Firebase backend. */
export const IS_DEMO_PROJECT = firebaseConfig.projectId.startsWith("demo-");
