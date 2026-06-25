/**
 * collections.ts — Firestore collection names and document shapes.
 *
 * Documents mirror the Zod domain types from `@/lib/schemas`, with the Firestore
 * document id equal to the entity `id`. A couple of collections add a server
 * `createdAt` for ordering; the app's domain types are otherwise unchanged.
 */

export const COLLECTIONS = {
  organizations: "organizations",
  members: "members",
  interviews: "interviews",
  nodes: "nodes",
  edges: "edges",
  opportunities: "opportunities",
  validations: "validations",
  agentLogs: "agentLogs",
  subscriptions: "subscriptions",
  comments: "comments",
  users: "users",
} as const;

export type CollectionName =
  (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

/** uid → member link document stored at users/{uid}. */
export interface UserLink {
  uid: string;
  email: string;
  memberId: string;
  orgId: string;
  role: "admin" | "validador" | "entrevistado";
}
