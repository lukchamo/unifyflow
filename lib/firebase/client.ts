/**
 * client.ts — Firebase Web SDK singletons (browser + client components).
 *
 * Initializes the app once and, when `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true`,
 * wires Auth + Firestore to the local emulator suite. Importing this module is
 * a no-op when the app runs in mock mode — nothing connects until you actually
 * use `auth`/`db`.
 */

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  GoogleAuthProvider,
  type Auth,
} from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  type Firestore,
} from "firebase/firestore";
import { firebaseConfig, USE_EMULATOR, emulator } from "./config";

let _app: FirebaseApp | undefined;
let _auth: Auth | undefined;
let _db: Firestore | undefined;
let _emulatorsConnected = false;

export function getFirebaseApp(): FirebaseApp {
  if (!_app) {
    _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return _app;
}

function connectEmulatorsOnce(auth: Auth, db: Firestore) {
  if (_emulatorsConnected || !USE_EMULATOR) return;
  // Guard against double-connect during Fast Refresh / HMR.
  connectAuthEmulator(auth, `http://${emulator.host}:${emulator.authPort}`, {
    disableWarnings: true,
  });
  connectFirestoreEmulator(db, emulator.host, emulator.firestorePort);
  _emulatorsConnected = true;
}

export function getFirebaseAuth(): Auth {
  if (!_auth) {
    _auth = getAuth(getFirebaseApp());
    if (USE_EMULATOR) connectEmulatorsOnce(_auth, getDb());
  }
  return _auth;
}

export function getDb(): Firestore {
  if (!_db) {
    _db = getFirestore(getFirebaseApp());
    if (USE_EMULATOR) connectEmulatorsOnce(getFirebaseAuth(), _db);
  }
  return _db;
}

/** Pre-configured Google provider for popup/redirect sign-in. */
export const googleProvider = new GoogleAuthProvider();
