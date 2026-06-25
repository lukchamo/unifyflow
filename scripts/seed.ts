/**
 * seed.ts — Seed Firestore + Firebase Auth with the UnifyFlow demo dataset.
 *
 * Run with tsx (see package.json `seed` / `seed:live` scripts):
 *   npm run seed         # → emulator (default)
 *   npm run seed:live    # → the real project in .firebaserc / env
 *
 * Idempotent: every doc/user uses a deterministic id/email and is overwritten,
 * so you can re-run it freely. It writes the "already discovered" state (the
 * full mock map) AND creates one auth account per team member with role-based
 * custom claims, so you can sign in as admin / validador / entrevistado.
 *
 * Type-only imports from `@/lib/schemas` inside mockData are erased at runtime,
 * so this script needs no path-alias resolution.
 */

import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import {
  MOCK_ORG,
  MOCK_TEAM,
  MOCK_INTERVIEWS,
  MOCK_NODES,
  MOCK_EDGES,
  MOCK_OPPS,
  MOCK_COMMENTS,
} from "../lib/data/mockData";

// ── Target selection ──────────────────────────────────────────────────────────
// Defaults to the EMULATOR so a stray `npm run seed` can never touch production.
// Opt into a real project with SEED_TARGET=live (or NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false).
const USE_EMULATOR =
  process.env.SEED_TARGET === "live"
    ? false
    : process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR !== "false";

const PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "demo-unifyflow";

const EMU_HOST = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST ?? "127.0.0.1";
const FS_PORT =
  process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_PORT ?? "8080";
const AUTH_PORT =
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT ?? "9099";

if (USE_EMULATOR) {
  // The Admin SDK targets the emulator transparently when these are set.
  process.env.FIRESTORE_EMULATOR_HOST ??= `${EMU_HOST}:${FS_PORT}`;
  process.env.FIREBASE_AUTH_EMULATOR_HOST ??= `${EMU_HOST}:${AUTH_PORT}`;
}

const PASSWORD = process.env.SEED_DEFAULT_PASSWORD ?? "unifyflow123";

if (!getApps().length) initializeApp({ projectId: PROJECT_ID });
const db = getFirestore();
const auth = getAuth();

// ── Helpers ───────────────────────────────────────────────────────────────────
async function upsertAuthUser(
  email: string,
  displayName: string,
  claims: Record<string, string>
): Promise<string> {
  let uid: string;
  try {
    const existing = await auth.getUserByEmail(email);
    uid = existing.uid;
    await auth.updateUser(uid, { displayName, password: PASSWORD });
  } catch {
    const created = await auth.createUser({
      email,
      emailVerified: true,
      displayName,
      password: PASSWORD,
    });
    uid = created.uid;
  }
  await auth.setCustomUserClaims(uid, claims);
  return uid;
}

// ── Seed ──────────────────────────────────────────────────────────────────────
async function seed() {
  const where = USE_EMULATOR
    ? `emulator (${EMU_HOST}:${FS_PORT})`
    : `LIVE project "${PROJECT_ID}"`;
  console.log(`\n🌱 Seeding UnifyFlow → ${where}\n`);

  const batch = db.batch();

  // Organization
  batch.set(db.collection("organizations").doc(MOCK_ORG.id), MOCK_ORG);

  // Members
  for (const m of MOCK_TEAM) {
    batch.set(db.collection("members").doc(m.id), m);
  }

  // Interviews — flag nodeAssembled so the trigger doesn't re-build the seeded
  // map. New interviews submitted from the app WILL trigger assembly.
  for (const i of MOCK_INTERVIEWS) {
    const member = MOCK_TEAM.find((m) => m.id === i.memberId);
    batch.set(db.collection("interviews").doc(i.id), {
      ...i,
      orgId: member?.orgId ?? MOCK_ORG.id,
      nodeAssembled: true,
    });
  }

  // Nodes / edges / opportunities (the already-discovered map)
  for (const n of MOCK_NODES) batch.set(db.collection("nodes").doc(n.id), n);
  for (const e of MOCK_EDGES) batch.set(db.collection("edges").doc(e.id), e);
  for (const o of MOCK_OPPS)
    batch.set(db.collection("opportunities").doc(o.id), o);

  // Comments
  for (const c of MOCK_COMMENTS)
    batch.set(db.collection("comments").doc(c.id), c);

  // Subscription
  batch.set(db.collection("subscriptions").doc("sub1"), {
    id: "sub1",
    orgId: MOCK_ORG.id,
    plan: "free",
    estado: "active",
    paid: false,
  });

  await batch.commit();
  console.log(
    `✓ Firestore: 1 org, ${MOCK_TEAM.length} members, ${MOCK_INTERVIEWS.length} interviews, ` +
      `${MOCK_NODES.length} nodes, ${MOCK_EDGES.length} edges, ${MOCK_OPPS.length} opportunities.`
  );

  // Auth users with role claims + users/{uid} link docs
  console.log(`\n👤 Creating auth users (password: "${PASSWORD}")…`);
  for (const m of MOCK_TEAM) {
    if (!m.email) continue;
    const claims = { role: m.rol, orgId: m.orgId, memberId: m.id };
    const uid = await upsertAuthUser(m.email, m.nombre, claims);
    await db
      .collection("users")
      .doc(uid)
      .set({ uid, email: m.email, memberId: m.id, orgId: m.orgId, role: m.rol });
    console.log(`  ✓ ${m.email.padEnd(28)} role=${m.rol}`);
  }

  console.log(`\n✅ Done. Demo sign-ins (password "${PASSWORD}"):`);
  // These three match the one-click accounts in /login and /demo. The
  // entrevistado is Andrés (m4) — the member the micro-interview submits as.
  console.log(`   admin        → marta-ruiz@robledo.es`);
  console.log(`   validador    → lucia-vidal@robledo.es`);
  console.log(`   entrevistado → andres-perez@robledo.es\n`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
