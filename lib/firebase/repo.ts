/**
 * repo.ts — Typed Firestore data access for UnifyFlow (client SDK).
 *
 * Two halves:
 *   1. `subscribe*` — realtime listeners (onSnapshot) that stream a collection
 *      into a callback. These replace the in-memory EventEmitter: when the
 *      `onInterviewWritten` Cloud Function assembles a node, the nodes listener
 *      fires and the live map re-reveals — true cross-client realtime.
 *   2. write actions — mirror the store's mutations, but persist to Firestore.
 *      Node assembly from an interview is intentionally NOT done here; it is the
 *      job of the server-side trigger (see functions/src/index.ts).
 */

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";
import { getDb } from "./client";
import { COLLECTIONS } from "./collections";
import type {
  Organization,
  Member,
  Interview,
  ProcessNode,
  Handoff,
  AIOpportunity,
  Validation,
  AgentLog,
  Subscription,
  Answer,
} from "@/lib/schemas";
import type { Comment } from "@/lib/data/mockData";

// ── Subscriptions ───────────────────────────────────────────────────────────

type Cb<T> = (rows: T[]) => void;

/** Subscribe to all docs in a collection scoped to an org, ordered client-side. */
function subscribeOrgCollection<T>(
  name: string,
  orgId: string,
  cb: Cb<T>
): Unsubscribe {
  const q = query(collection(getDb(), name), where("orgId", "==", orgId));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => d.data() as T));
  });
}

export const subscribeTeam = (orgId: string, cb: Cb<Member>) =>
  subscribeOrgCollection<Member>(COLLECTIONS.members, orgId, cb);

export const subscribeNodes = (orgId: string, cb: Cb<ProcessNode>) =>
  subscribeOrgCollection<ProcessNode>(COLLECTIONS.nodes, orgId, cb);

export const subscribeEdges = (orgId: string, cb: Cb<Handoff>) =>
  subscribeOrgCollection<Handoff>(COLLECTIONS.edges, orgId, cb);

export const subscribeOpps = (orgId: string, cb: Cb<AIOpportunity>) =>
  subscribeOrgCollection<AIOpportunity>(COLLECTIONS.opportunities, orgId, cb);

export const subscribeAgentLogs = (orgId: string, cb: Cb<AgentLog>) =>
  subscribeOrgCollection<AgentLog>(COLLECTIONS.agentLogs, orgId, cb);

export const subscribeValidations = (orgId: string, cb: Cb<Validation>) =>
  subscribeOrgCollection<Validation>(COLLECTIONS.validations, orgId, cb);

export const subscribeComments = (orgId: string, cb: Cb<Comment>) =>
  // comments don't carry orgId in the mock type; query by org via nodes isn't
  // needed for the demo — listen to the whole collection.
  onSnapshot(collection(getDb(), COLLECTIONS.comments), (snap) =>
    cb(snap.docs.map((d) => d.data() as Comment))
  );

/** Interviews carry a denormalized orgId, so we scope the listener by org. */
export const subscribeInterviews = (orgId: string, cb: Cb<Interview>) =>
  subscribeOrgCollection<Interview>(COLLECTIONS.interviews, orgId, cb);

export function subscribeOrg(
  orgId: string,
  cb: (org: Organization | null) => void
): Unsubscribe {
  return onSnapshot(doc(getDb(), COLLECTIONS.organizations, orgId), (snap) =>
    cb(snap.exists() ? (snap.data() as Organization) : null)
  );
}

export function subscribeSubscription(
  orgId: string,
  cb: (sub: Subscription | null) => void
): Unsubscribe {
  const q = query(
    collection(getDb(), COLLECTIONS.subscriptions),
    where("orgId", "==", orgId)
  );
  return onSnapshot(q, (snap) =>
    cb(snap.empty ? null : (snap.docs[0].data() as Subscription))
  );
}

// ── Write actions ───────────────────────────────────────────────────────────

/** Create a brand-new draft process node (admin-authored, not from an interview). */
export async function createProcess(node: ProcessNode): Promise<void> {
  await setDoc(doc(getDb(), COLLECTIONS.nodes, node.id), node);
}

export async function inviteMember(
  orgId: string,
  email: string
): Promise<void> {
  const id = `m-invite-${Date.now()}`;
  const member: Member = {
    id,
    orgId,
    nombre: email.split("@")[0] ?? email,
    email,
    cargo: "Pendiente",
    area: "Pendiente",
    rol: "entrevistado",
    done: false,
  };
  await setDoc(doc(getDb(), COLLECTIONS.members, id), member);
}

/**
 * Persist the completed interview and mark the member done. The
 * `onInterviewWritten` Cloud Function picks this up and assembles the node,
 * edges and agent log server-side — which then stream back via subscribeNodes.
 */
export async function submitInterview(
  member: Member,
  answers: Answer[],
  existingInterviewId?: string
): Promise<void> {
  const db = getDb();
  const interviewId =
    existingInterviewId ?? `i-${member.id}-${Date.now()}`;
  const interview: Interview = {
    id: interviewId,
    memberId: member.id,
    estado: "completada",
    completedAt: new Date().toISOString(),
    answers: answers.map((a) => ({ ...a, interviewId })),
  };
  const batch = writeBatch(db);
  batch.set(doc(db, COLLECTIONS.interviews, interviewId), {
    ...interview,
    orgId: member.orgId, // denormalized for security-rule scoping
  });
  batch.update(doc(db, COLLECTIONS.members, member.id), { done: true });
  await batch.commit();
}

export async function validateNode(
  nodeId: string,
  validatorId: string
): Promise<void> {
  const db = getDb();
  const valId = `val-${nodeId}-${validatorId}-${Date.now()}`;
  const validation: Validation = {
    id: valId,
    nodeId,
    validatorId,
    accion: "validado",
    timestamp: new Date().toISOString(),
  };
  const batch = writeBatch(db);
  batch.update(doc(db, COLLECTIONS.nodes, nodeId), { estado: "validated" });
  batch.set(doc(db, COLLECTIONS.validations, valId), validation);
  await batch.commit();
}

export async function addComment(
  nodeId: string,
  text: string,
  author = "Tú"
): Promise<void> {
  const id = `c-${Date.now()}`;
  const comment: Comment & { createdAt: unknown } = {
    id,
    nodeId,
    author,
    time: "ahora",
    text,
    createdAt: serverTimestamp(),
  };
  await setDoc(doc(getDb(), COLLECTIONS.comments, id), comment);
}

export async function tagForValidation(
  nodeId: string,
  memberId: string
): Promise<void> {
  await updateDoc(doc(getDb(), COLLECTIONS.nodes, nodeId), {
    taggedBy: memberId,
  });
}

export async function addStep(nodeId: string, step: string): Promise<void> {
  await updateDoc(doc(getDb(), COLLECTIONS.nodes, nodeId), {
    steps: arrayUnion(step),
  });
}

/** Write recomputed opportunities (rank/locked) back to Firestore. */
export async function saveOpportunities(
  opps: AIOpportunity[]
): Promise<void> {
  const db = getDb();
  const batch = writeBatch(db);
  for (const op of opps) {
    batch.set(doc(db, COLLECTIONS.opportunities, op.id), op);
  }
  await batch.commit();
}

/** Mark the org subscription paid and unlock every opportunity. */
export async function pay(
  orgId: string,
  subscriptionId: string,
  opps: AIOpportunity[]
): Promise<void> {
  const db = getDb();
  const batch = writeBatch(db);
  batch.update(doc(db, COLLECTIONS.subscriptions, subscriptionId), {
    paid: true,
    plan: "pro",
  });
  for (const op of opps) {
    batch.update(doc(db, COLLECTIONS.opportunities, op.id), { locked: false });
  }
  await batch.commit();
}
