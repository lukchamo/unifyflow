/**
 * useAppStore.ts — Zustand store for UnifyFlow demo app.
 * Single source of truth for all app state, persisted to localStorage.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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
  Role,
  Answer,
} from "@/lib/schemas";
import {
  MOCK_ORG,
  MOCK_TEAM,
  MOCK_INTERVIEWS,
  MOCK_NODES,
  MOCK_EDGES,
  MOCK_OPPS,
  MOCK_COMMENTS,
  type Comment,
} from "@/lib/data/mockData";
import {
  assembleNode,
  prioritizeOpportunities,
  makeLog,
} from "@/lib/services/agent";
import { realtime } from "@/lib/services/realtime";
import type { PaletteName } from "@/lib/theme/palettes";
import { USE_FIREBASE } from "@/lib/firebase/config";
import * as fb from "@/lib/firebase/repo";

// ── NavStep ───────────────────────────────────────────────────────────────────

export type NavStep = "equipo" | "entrevista" | "mapa" | "oportunidades" | "radiografia";

// ── createProcess input ─────────────────────────────────────────────────────

export interface CreateProcessInput {
  label: string;
  area: string;
  desc: string;
  ownerMemberId: string;
  steps?: string[];
}

// Per-area base coordinates for placing a newly-created node on the map.
const AREA_POS: Record<string, { a: { x: number; y: number }; b: { x: number; y: number } }> = {
  Comercial: { a: { x: 70, y: 36 }, b: { x: 16, y: 56 } },
  Compras: { a: { x: 360, y: 56 }, b: { x: 238, y: 126 } },
  Operaciones: { a: { x: 430, y: 280 }, b: { x: 452, y: 206 } },
  Finanzas: { a: { x: 700, y: 140 }, b: { x: 668, y: 206 } },
  Atención: { a: { x: 900, y: 80 }, b: { x: 884, y: 206 } },
};

// ── Seed builder ──────────────────────────────────────────────────────────────

function buildSeed() {
  return {
    org: MOCK_ORG as Organization,
    team: MOCK_TEAM.map((m) => ({ ...m })) as Member[],
    interviews: MOCK_INTERVIEWS.map((i) => ({ ...i })) as Interview[],
    nodes: MOCK_NODES.map((n) => ({ ...n })) as ProcessNode[],
    edges: MOCK_EDGES.map((e) => ({ ...e })) as Handoff[],
    opps: MOCK_OPPS.map((o) => ({ ...o })) as AIOpportunity[],
    validations: [] as Validation[],
    agentLogs: [] as AgentLog[],
    subscription: {
      id: "sub1",
      orgId: "o1",
      plan: "free",
      estado: "active",
      paid: false,
    } as Subscription,
    comments: MOCK_COMMENTS.map((c) => ({ ...c })) as Comment[],
    theme: "Salvia" as PaletteName,
    role: null as Role | null,
    currentStep: "equipo" as NavStep,
    mapState: {
      organized: false,
      revealed: false,
      edgesVisible: false,
      filter: "all",
      selectedId: null as string | null,
    },
    tour: {
      active: false,
      step: 0,
    },
  };
}

// ── State & Actions interface ──────────────────────────────────────────────────

type Seed = ReturnType<typeof buildSeed>;

interface AppActions {
  // Member management
  inviteMember: (email: string) => void;
  submitInterview: (memberId: string, answers: Answer[]) => void;

  // Process authoring (admin creates a process directly, no interview)
  createProcess: (input: CreateProcessInput) => void;

  // Node management
  validateNode: (id: string, validatorId: string) => void;
  addComment: (nodeId: string, text: string) => void;
  tagForValidation: (nodeId: string, memberId: string) => void;
  addStep: (nodeId: string, step: string) => void;

  // Map state
  reorganize: () => void;
  replay: () => void;
  setRevealed: (b: boolean) => void;
  setEdgesVisible: (b: boolean) => void;

  // Opportunities
  detectOpportunities: () => void;

  // Subscription
  pay: () => void;

  // UI
  setTheme: (name: PaletteName) => void;
  setRole: (role: Role | null) => void;
  setStep: (step: NavStep) => void;
  setFilter: (f: string) => void;
  selectNode: (id: string | null) => void;

  // Tour
  startTour: () => void;
  nextTourStep: () => void;
  endTour: () => void;

  // Demo
  resetDemo: () => void;

  // Firebase sync — merge a partial of server-sourced data into the store.
  // Used by FirebaseBridge to stream Firestore snapshots into state.
  hydrate: (partial: Partial<Seed>) => void;
}

export type AppState = Seed & AppActions;

// ── Store ─────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...buildSeed(),

      // ── Member management ──────────────────────────────────────────────────

      inviteMember: (email: string) => {
        if (USE_FIREBASE) {
          // Firestore is the source of truth; the members listener will add it.
          void fb.inviteMember(get().org.id, email).catch(console.error);
          return;
        }
        const newMember: Member = {
          id: `m-invite-${Date.now()}`,
          orgId: "o1",
          nombre: email.split("@")[0] ?? email,
          email,
          cargo: "Pendiente",
          area: "Pendiente",
          rol: "entrevistado",
          done: false,
        };
        set((s) => ({ team: [...s.team, newMember] }));
      },

      submitInterview: (memberId: string, answers: Answer[]) => {
        const state = get();
        const member = state.team.find((m) => m.id === memberId);
        if (!member) return;

        if (USE_FIREBASE) {
          // Persist the interview only; the `onInterviewWritten` Cloud Function
          // assembles the node server-side and the nodes listener streams it
          // back (FirebaseBridge re-emits "interview:completed" for the map).
          const existing = state.interviews.find((i) => i.memberId === memberId);
          void fb
            .submitInterview(member, answers, existing?.id)
            .catch(console.error);
          return;
        }

        // Find or create interview
        let interview = state.interviews.find((i) => i.memberId === memberId);
        if (!interview) {
          interview = {
            id: `i-${memberId}-${Date.now()}`,
            memberId,
            estado: "completada",
            answers,
          };
        }

        // Assemble new node via agent service
        const { node, edges, log } = assembleNode(interview, member);

        // Mark member as done, mark interview as completed
        const updatedTeam = state.team.map((m) =>
          m.id === memberId ? { ...m, done: true } : m
        );
        const updatedInterviews = state.interviews.some(
          (i) => i.memberId === memberId
        )
          ? state.interviews.map((i) =>
              i.memberId === memberId ? { ...i, estado: "completada", answers } : i
            )
          : [...state.interviews, { ...interview, estado: "completada", answers }];

        set((s) => ({
          team: updatedTeam,
          interviews: updatedInterviews,
          nodes: [...s.nodes, node],
          edges: [...s.edges, ...edges],
          agentLogs: [...s.agentLogs, log],
        }));

        // Realtime: notify subscribers (the live map) that a new node was
        // assembled, so the Champion's map can re-reveal it without a reload.
        realtime.emit("interview:completed", { node, log });
      },

      // ── Process authoring ──────────────────────────────────────────────────

      createProcess: (input: CreateProcessInput) => {
        const { org } = get();
        const id = `node-new-${Date.now()}`;
        const base = AREA_POS[input.area] ?? {
          a: { x: 200, y: 200 },
          b: { x: 120, y: 200 },
        };
        const node: ProcessNode = {
          id,
          orgId: org.id,
          label: input.label,
          area: input.area,
          ownerMemberId: input.ownerMemberId,
          estado: "draft",
          posA: { x: base.a.x + 110, y: base.a.y + 70 },
          posB: { x: base.b.x + 110, y: base.b.y + 70 },
          horas: null,
          inter: false,
          sourceInterviewIds: [],
          desc: input.desc,
          steps:
            input.steps && input.steps.length > 0
              ? input.steps
              : ["Identificar necesidad", "Documentar proceso", "Validar con el equipo"],
        };

        if (USE_FIREBASE) {
          void fb.createProcess(node).catch(console.error);
          return;
        }
        set((s) => ({ nodes: [...s.nodes, node] }));
        realtime.emit("interview:completed", { node });
      },

      // ── Node management ────────────────────────────────────────────────────

      validateNode: (id: string, validatorId: string) => {
        if (USE_FIREBASE) {
          void fb.validateNode(id, validatorId).catch(console.error);
          return;
        }
        const validation: Validation = {
          id: `val-${id}-${validatorId}-${Date.now()}`,
          nodeId: id,
          validatorId,
          accion: "validado",
          timestamp: new Date().toISOString(),
        };
        set((s) => ({
          nodes: s.nodes.map((n) =>
            n.id === id ? { ...n, estado: "validated" } : n
          ),
          validations: [...s.validations, validation],
        }));
      },

      addComment: (nodeId: string, text: string) => {
        if (USE_FIREBASE) {
          void fb.addComment(nodeId, text).catch(console.error);
          return;
        }
        const comment: Comment = {
          id: `c-${Date.now()}`,
          nodeId,
          author: "Tú",
          time: "ahora",
          text,
        };
        set((s) => ({ comments: [...s.comments, comment] }));
      },

      tagForValidation: (nodeId: string, memberId: string) => {
        if (USE_FIREBASE) {
          void fb.tagForValidation(nodeId, memberId).catch(console.error);
          return;
        }
        const log = makeLog(
          "tagForValidation",
          `nodeId:${nodeId} memberId:${memberId}`,
          `node ${nodeId} tagged for validation by ${memberId}`
        );
        set((s) => ({
          nodes: s.nodes.map((n) =>
            n.id === nodeId ? { ...n, taggedBy: memberId } : n
          ),
          agentLogs: [...s.agentLogs, log],
        }));
      },

      addStep: (nodeId: string, step: string) => {
        if (USE_FIREBASE) {
          void fb.addStep(nodeId, step).catch(console.error);
          return;
        }
        set((s) => ({
          nodes: s.nodes.map((n) =>
            n.id === nodeId ? { ...n, steps: [...n.steps, step] } : n
          ),
        }));
      },

      // ── Map state ──────────────────────────────────────────────────────────

      reorganize: () => {
        set((s) => ({
          mapState: { ...s.mapState, organized: true },
        }));
      },

      replay: () => {
        set((s) => ({
          mapState: {
            ...s.mapState,
            organized: false,
            revealed: false,
            edgesVisible: false,
            selectedId: null,
          },
        }));
      },

      setRevealed: (b: boolean) => {
        set((s) => ({
          mapState: { ...s.mapState, revealed: b },
        }));
      },

      setEdgesVisible: (b: boolean) => {
        set((s) => ({
          mapState: { ...s.mapState, edgesVisible: b },
        }));
      },

      // ── Opportunities ──────────────────────────────────────────────────────

      detectOpportunities: () => {
        if (USE_FIREBASE) {
          // Opportunities are seeded in Firestore and streamed via the listener;
          // nothing to recompute client-side in firebase mode.
          return;
        }
        const { nodes, opps } = get();
        const lockedIds = new Set(
          opps.filter((o) => o.locked).map((o) => o.nodeId)
        );
        const newOpps = prioritizeOpportunities(nodes).map((op) => ({
          ...op,
          // Preserve locked state for already-locked opps unless user paid
          locked: lockedIds.has(op.nodeId) ? true : op.locked,
        }));
        set({ opps: newOpps });
      },

      // ── Subscription ───────────────────────────────────────────────────────

      pay: () => {
        if (USE_FIREBASE) {
          const { org, subscription, opps } = get();
          void fb
            .pay(org.id, subscription.id, opps)
            .catch(console.error);
          return;
        }
        set((s) => ({
          subscription: { ...s.subscription, paid: true },
          opps: s.opps.map((op) => ({ ...op, locked: false })),
        }));
      },

      // ── UI ─────────────────────────────────────────────────────────────────

      setTheme: (name: PaletteName) => {
        set({ theme: name });
      },

      setRole: (role: Role | null) => {
        set({ role });
      },

      setStep: (step: NavStep) => {
        set({ currentStep: step });
      },

      setFilter: (f: string) => {
        set((s) => ({
          mapState: { ...s.mapState, filter: f },
        }));
      },

      selectNode: (id: string | null) => {
        set((s) => ({
          mapState: { ...s.mapState, selectedId: id },
        }));
      },

      // ── Tour ───────────────────────────────────────────────────────────────

      startTour: () => {
        set({ tour: { active: true, step: 0 } });
      },

      nextTourStep: () => {
        set((s) => ({ tour: { ...s.tour, step: s.tour.step + 1 } }));
      },

      endTour: () => {
        set((s) => ({ tour: { ...s.tour, active: false } }));
      },

      // ── Demo reset ─────────────────────────────────────────────────────────

      resetDemo: () => {
        if (USE_FIREBASE) {
          // Don't clobber Firestore-sourced data with the mock seed; just reset
          // the local UI state. Re-seed the backend with `npm run seed`.
          const fresh = buildSeed();
          set({
            theme: fresh.theme,
            currentStep: fresh.currentStep,
            mapState: fresh.mapState,
            tour: fresh.tour,
          });
          return;
        }
        set(buildSeed());
      },

      // ── Firebase hydration ─────────────────────────────────────────────────

      hydrate: (partial) => {
        set(partial as Partial<AppState>);
      },
    }),
    {
      name: "unifyflow",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
