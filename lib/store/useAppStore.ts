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

// ── NavStep ───────────────────────────────────────────────────────────────────

export type NavStep = "equipo" | "entrevista" | "mapa" | "oportunidades" | "radiografia";

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
}

export type AppState = Seed & AppActions;

// ── Store ─────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...buildSeed(),

      // ── Member management ──────────────────────────────────────────────────

      inviteMember: (email: string) => {
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

      // ── Node management ────────────────────────────────────────────────────

      validateNode: (id: string, validatorId: string) => {
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
        set(buildSeed());
      },
    }),
    {
      name: "unifyflow",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
