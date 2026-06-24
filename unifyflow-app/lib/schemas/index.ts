import { z } from "zod";

// ── Role ──────────────────────────────────────────────────────────────────────
export const RoleSchema = z.enum(["admin", "validador", "entrevistado"]);
export type Role = z.infer<typeof RoleSchema>;

// ── Organization ──────────────────────────────────────────────────────────────
export const OrganizationSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  sector: z.string(),
  plan: z.string(),
});
export type Organization = z.infer<typeof OrganizationSchema>;

// ── Member ────────────────────────────────────────────────────────────────────
export const MemberSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  nombre: z.string(),
  email: z.string().optional(),
  cargo: z.string(),
  area: z.string(),
  rol: RoleSchema,
  done: z.boolean(),
});
export type Member = z.infer<typeof MemberSchema>;

// ── Answer ────────────────────────────────────────────────────────────────────
export const AnswerSchema = z.object({
  id: z.string(),
  interviewId: z.string(),
  pregunta: z.string(),
  respuesta: z.string(),
  modalidad: z.enum(["texto", "voz"]),
});
export type Answer = z.infer<typeof AnswerSchema>;

// ── Interview ─────────────────────────────────────────────────────────────────
export const InterviewSchema = z.object({
  id: z.string(),
  memberId: z.string(),
  estado: z.string(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  answers: z.array(AnswerSchema),
});
export type Interview = z.infer<typeof InterviewSchema>;

// ── ProcessNode ───────────────────────────────────────────────────────────────
const PosSchema = z.object({ x: z.number(), y: z.number() });

export const ProcessNodeSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  label: z.string(),
  ownerMemberId: z.string(),
  area: z.string(),
  estado: z.enum(["draft", "validated", "opportunity"]),
  posA: PosSchema,
  posB: PosSchema,
  horas: z.string().nullable(),
  inter: z.boolean(),
  sourceInterviewIds: z.array(z.string()),
  desc: z.string(),
  steps: z.array(z.string()),
});
export type ProcessNode = z.infer<typeof ProcessNodeSchema>;

// ── Handoff ───────────────────────────────────────────────────────────────────
export const HandoffSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  fromNodeId: z.string(),
  toNodeId: z.string(),
  dashed: z.boolean(),
});
export type Handoff = z.infer<typeof HandoffSchema>;

// ── AIOpportunity ─────────────────────────────────────────────────────────────
export const AIOpportunitySchema = z.object({
  id: z.string(),
  orgId: z.string(),
  rank: z.number(),
  titulo: z.string(),
  areas: z.array(z.string()),
  horas: z.string(),
  impacto: z.number(),
  frecuencia: z.number(),
  viabilidad: z.number(),
  nodeId: z.string(),
  evidencia: z.string(),
  locked: z.boolean(),
});
export type AIOpportunity = z.infer<typeof AIOpportunitySchema>;

// ── Validation ────────────────────────────────────────────────────────────────
export const ValidationSchema = z.object({
  id: z.string(),
  nodeId: z.string(),
  validatorId: z.string(),
  accion: z.string(),
  timestamp: z.string(),
});
export type Validation = z.infer<typeof ValidationSchema>;

// ── AgentLog ──────────────────────────────────────────────────────────────────
export const AgentLogSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  tipoDecision: z.string(),
  input: z.string(),
  output: z.string(),
  modelo: z.string(),
  tokens: z.number(),
  timestamp: z.string(),
});
export type AgentLog = z.infer<typeof AgentLogSchema>;

// ── Subscription ──────────────────────────────────────────────────────────────
export const SubscriptionSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  plan: z.string(),
  estado: z.string(),
  paid: z.boolean(),
});
export type Subscription = z.infer<typeof SubscriptionSchema>;
