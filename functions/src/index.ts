/**
 * index.ts — UnifyFlow Cloud Functions (Firestore triggers).
 *
 * These run in the Functions emulator during local dev and in Cloud Functions
 * when deployed. They make Firestore the engine of the whole project lifecycle:
 *
 *   1. onInterviewWritten  — interview marked "completada" → assemble the
 *      process node + handoff + agent log server-side. The app never builds the
 *      node itself; it just writes the interview and the map updates via the
 *      realtime listener once this trigger runs.
 *
 *   2. onMemberWritten     — a member's role/email changes → sync the matching
 *      auth user's custom claims (role, orgId, memberId) and the users/{uid}
 *      link doc. This is how authentication-with-roles stays in sync with the
 *      team table.
 */

import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions/v2";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { assembleNode, type MemberDoc } from "./assemble";

initializeApp();
const db = getFirestore();
const auth = getAuth();

// ── Trigger 1: interview completed → assemble node ───────────────────────────

export const onInterviewWritten = onDocumentWritten(
  "interviews/{interviewId}",
  async (event) => {
    const after = event.data?.after.data();
    if (!after) return; // deleted
    if (after.estado !== "completada") return;
    if (after.nodeAssembled === true) return; // idempotency guard

    const interviewId = event.params.interviewId;
    const memberSnap = await db.collection("members").doc(after.memberId).get();
    if (!memberSnap.exists) {
      logger.warn(`interview ${interviewId}: member ${after.memberId} missing`);
      return;
    }
    const member = memberSnap.data() as MemberDoc;

    // Anchor the new draft to an existing node in the same area, if any.
    const anchorSnap = await db
      .collection("nodes")
      .where("orgId", "==", member.orgId)
      .where("area", "==", member.area)
      .limit(1)
      .get();
    const anchorNodeId = anchorSnap.empty ? null : anchorSnap.docs[0].id;

    const timestamp = new Date().toISOString();
    const { node, edges, log } = assembleNode(
      interviewId,
      member,
      anchorNodeId,
      timestamp
    );

    const batch = db.batch();
    batch.set(db.collection("nodes").doc(node.id), node);
    for (const edge of edges) {
      batch.set(db.collection("edges").doc(edge.id), edge);
    }
    batch.set(db.collection("agentLogs").doc(log.id), log);
    // Mark the member done + flag the interview so we don't re-assemble.
    batch.set(
      db.collection("members").doc(member.id),
      { done: true },
      { merge: true }
    );
    batch.set(
      db.collection("interviews").doc(interviewId),
      { nodeAssembled: true },
      { merge: true }
    );
    await batch.commit();

    logger.info(
      `Assembled node ${node.id} from interview ${interviewId} (area ${member.area}).`
    );
  }
);

// ── Trigger 2: member role/email change → sync auth custom claims ────────────

export const onMemberWritten = onDocumentWritten(
  "members/{memberId}",
  async (event) => {
    const after = event.data?.after.data();
    if (!after) return; // deleted — leave the auth user as-is
    const { email, rol, orgId } = after as {
      email?: string;
      rol?: string;
      orgId?: string;
    };
    if (!email || !rol || !orgId) return;

    let user;
    try {
      user = await auth.getUserByEmail(email);
    } catch {
      // No auth account for this member yet (e.g. an invited member who hasn't
      // signed in). Claims will be applied when the seed/sign-up creates them.
      logger.info(`No auth user for ${email}; skipping claim sync.`);
      return;
    }

    const memberId = event.params.memberId;
    const claims = { role: rol, orgId, memberId };
    await auth.setCustomUserClaims(user.uid, claims);
    await db.collection("users").doc(user.uid).set(
      {
        uid: user.uid,
        email,
        memberId,
        orgId,
        role: rol,
      },
      { merge: true }
    );

    logger.info(`Synced claims for ${email} → role=${rol} org=${orgId}.`);
  }
);
