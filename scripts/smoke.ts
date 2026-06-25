/**
 * smoke.ts — End-to-end check that the Firestore trigger works in the emulator.
 *
 * Run inside `firebase emulators:exec` AFTER seeding:
 *   firebase emulators:exec --only auth,firestore,functions \
 *     "npm run seed && npx tsx scripts/smoke.ts"
 *
 * It submits a brand-new completed interview for member m7 (Diego, who has no
 * seeded interview) and polls for the node the `onInterviewWritten` Cloud
 * Function should assemble. Exits non-zero if the node never appears.
 */

import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "demo-unifyflow";
const EMU_HOST = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST ?? "127.0.0.1";
const FS_PORT =
  process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_PORT ?? "8080";
process.env.FIRESTORE_EMULATOR_HOST ??= `${EMU_HOST}:${FS_PORT}`;

if (!getApps().length) initializeApp({ projectId: PROJECT_ID });
const db = getFirestore();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const interviewId = `i-smoke-${Date.now()}`;
  const expectedNodeId = `node-${interviewId}`;

  console.log(`\n🔬 Submitting interview ${interviewId} for member m7…`);
  await db.collection("interviews").doc(interviewId).set({
    id: interviewId,
    memberId: "m7",
    orgId: "o1",
    estado: "completada",
    completedAt: new Date().toISOString(),
    answers: [],
  });

  console.log("⏳ Waiting for onInterviewWritten to assemble the node…");
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    const node = await db.collection("nodes").doc(expectedNodeId).get();
    if (node.exists) {
      console.log(`\n✅ Trigger OK — assembled ${expectedNodeId}:`);
      const d = node.data()!;
      console.log(`   label="${d.label}" area=${d.area} estado=${d.estado}`);
      const edge = await db.collection("edges").doc(`edge-${interviewId}`).get();
      console.log(`   handoff edge present: ${edge.exists}`);
      const log = await db.collection("agentLogs").doc(`log-${interviewId}`).get();
      console.log(`   agentLog present: ${log.exists}`);
      const member = await db.collection("members").doc("m7").get();
      console.log(`   member m7 marked done: ${member.data()?.done === true}`);
      process.exit(0);
    }
  }

  console.error(
    `\n❌ Trigger FAILED — node ${expectedNodeId} not found after 10s.`
  );
  process.exit(1);
}

main().catch((err) => {
  console.error("❌ Smoke test error:", err);
  process.exit(1);
});
