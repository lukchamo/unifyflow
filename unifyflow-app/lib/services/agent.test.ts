import { describe, it, expect } from "vitest";
import {
  ProcessNodeSchema,
  AgentLogSchema,
  AIOpportunitySchema,
  type Interview,
  type Member,
  type ProcessNode,
} from "@/lib/schemas";
import { makeLog, assembleNode, prioritizeOpportunities } from "./agent";

// ── fixtures ─────────────────────────────────────────────────────────────────

const MOCK_INTERVIEW: Interview = {
  id: "i-test",
  memberId: "m-test",
  estado: "completada",
  answers: [],
};

const MOCK_MEMBER_COMERCIAL: Member = {
  id: "m-test",
  orgId: "o1",
  nombre: "Test User",
  email: "test@example.com",
  cargo: "Comercial",
  area: "Comercial",
  rol: "entrevistado",
  done: true,
};

const MOCK_MEMBER_UNKNOWN_AREA: Member = {
  id: "m-test2",
  orgId: "o1",
  nombre: "Test User 2",
  cargo: "Desconocido",
  area: "Desconocido",
  rol: "entrevistado",
  done: true,
};

const OPPORTUNITY_NODES: ProcessNode[] = [
  {
    id: "n-opp1",
    orgId: "o1",
    label: "Generar presupuestos",
    area: "Comercial",
    ownerMemberId: "m1",
    estado: "opportunity",
    posA: { x: 100, y: 100 },
    posB: { x: 50, y: 150 },
    horas: "−6 h/sem",
    inter: true,
    sourceInterviewIds: ["i1"],
    desc: "Proceso manual de presupuestos",
    steps: ["Pedir datos", "Armar presupuesto"],
  },
  {
    id: "n-opp2",
    orgId: "o1",
    label: "Conciliar cobros",
    area: "Finanzas",
    ownerMemberId: "m5",
    estado: "opportunity",
    posA: { x: 500, y: 200 },
    posB: { x: 400, y: 300 },
    horas: "−4 h/sem",
    inter: false,
    sourceInterviewIds: ["i5"],
    desc: "Proceso manual de conciliación",
    steps: ["Descargar extracto", "Cruzar con facturas"],
  },
  {
    id: "n-opp3",
    orgId: "o1",
    label: "Resolver incidencias",
    area: "Atención",
    ownerMemberId: "m6",
    estado: "opportunity",
    posA: { x: 700, y: 100 },
    posB: { x: 600, y: 200 },
    horas: "−8 h/sem",
    inter: false,
    sourceInterviewIds: ["i6"],
    desc: "Clasificación manual de incidencias",
    steps: ["Recibir", "Clasificar", "Reasignar"],
  },
];

// ── makeLog ───────────────────────────────────────────────────────────────────

describe("makeLog", () => {
  it("returns a schema-valid AgentLog", () => {
    const log = makeLog("ensamblado", "input data", "output data");
    expect(() => AgentLogSchema.parse(log)).not.toThrow();
  });

  it("sets tipoDecision to the provided value", () => {
    const log = makeLog("priorización", "in", "out");
    expect(log.tipoDecision).toBe("priorización");
  });

  it("is deterministic when opts provided", () => {
    const opts = { id: "log-1", timestamp: "2024-01-01T00:00:00Z", tokens: 42 };
    const log1 = makeLog("ensamblado", "input", "output", opts);
    const log2 = makeLog("ensamblado", "input", "output", opts);
    expect(log1).toEqual(log2);
  });

  it("uses provided id when given", () => {
    const log = makeLog("test", "in", "out", { id: "my-log-id" });
    expect(log.id).toBe("my-log-id");
  });

  it("uses gemini-2.5-flash as default modelo", () => {
    const log = makeLog("test", "in", "out");
    expect(log.modelo).toBe("gemini-2.5-flash");
  });

  it("allows overriding modelo", () => {
    const log = makeLog("test", "in", "out", { modelo: "gpt-4" });
    expect(log.modelo).toBe("gpt-4");
  });
});

// ── assembleNode ──────────────────────────────────────────────────────────────

describe("assembleNode", () => {
  it("returns a node that validates against ProcessNodeSchema", () => {
    const result = assembleNode(MOCK_INTERVIEW, MOCK_MEMBER_COMERCIAL);
    expect(() => ProcessNodeSchema.parse(result.node)).not.toThrow();
  });

  it("returns a draft node", () => {
    const { node } = assembleNode(MOCK_INTERVIEW, MOCK_MEMBER_COMERCIAL);
    expect(node.estado).toBe("draft");
  });

  it("sets orgId to o1", () => {
    const { node } = assembleNode(MOCK_INTERVIEW, MOCK_MEMBER_COMERCIAL);
    expect(node.orgId).toBe("o1");
  });

  it("sets ownerMemberId to the member's id", () => {
    const { node } = assembleNode(MOCK_INTERVIEW, MOCK_MEMBER_COMERCIAL);
    expect(node.ownerMemberId).toBe(MOCK_MEMBER_COMERCIAL.id);
  });

  it("sets area to the member's area", () => {
    const { node } = assembleNode(MOCK_INTERVIEW, MOCK_MEMBER_COMERCIAL);
    expect(node.area).toBe(MOCK_MEMBER_COMERCIAL.area);
  });

  it("includes the interview id in sourceInterviewIds", () => {
    const { node } = assembleNode(MOCK_INTERVIEW, MOCK_MEMBER_COMERCIAL);
    expect(node.sourceInterviewIds).toContain(MOCK_INTERVIEW.id);
  });

  it("returns at least one Handoff edge", () => {
    const { edges } = assembleNode(MOCK_INTERVIEW, MOCK_MEMBER_COMERCIAL);
    expect(edges.length).toBeGreaterThanOrEqual(1);
  });

  it("returns an AgentLog with tipoDecision === 'ensamblado'", () => {
    const { log } = assembleNode(MOCK_INTERVIEW, MOCK_MEMBER_COMERCIAL);
    expect(log.tipoDecision).toBe("ensamblado");
  });

  it("returns a schema-valid AgentLog", () => {
    const { log } = assembleNode(MOCK_INTERVIEW, MOCK_MEMBER_COMERCIAL);
    expect(() => AgentLogSchema.parse(log)).not.toThrow();
  });

  it("is deterministic when opts.id provided", () => {
    const opts = { id: "node-det" };
    const r1 = assembleNode(MOCK_INTERVIEW, MOCK_MEMBER_COMERCIAL, opts);
    const r2 = assembleNode(MOCK_INTERVIEW, MOCK_MEMBER_COMERCIAL, opts);
    expect(r1.node.id).toBe(r2.node.id);
    expect(r1.node.label).toBe(r2.node.label);
  });

  it("works for area with no existing nodes (fallback position)", () => {
    const { node } = assembleNode(MOCK_INTERVIEW, MOCK_MEMBER_UNKNOWN_AREA);
    expect(() => ProcessNodeSchema.parse(node)).not.toThrow();
  });

  it("handoff edges reference the new node", () => {
    const { node, edges } = assembleNode(MOCK_INTERVIEW, MOCK_MEMBER_COMERCIAL);
    const anyEdgeReferencesNode = edges.some(
      (e) => e.fromNodeId === node.id || e.toNodeId === node.id
    );
    expect(anyEdgeReferencesNode).toBe(true);
  });
});

// ── prioritizeOpportunities ───────────────────────────────────────────────────

describe("prioritizeOpportunities", () => {
  it("returns one AIOpportunity per opportunity node", () => {
    const opps = prioritizeOpportunities(OPPORTUNITY_NODES);
    expect(opps.length).toBe(3);
  });

  it("returns results sorted descending by impacto * frecuencia * viabilidad", () => {
    const opps = prioritizeOpportunities(OPPORTUNITY_NODES);
    for (let i = 0; i < opps.length - 1; i++) {
      const scoreA = opps[i].impacto * opps[i].frecuencia * opps[i].viabilidad;
      const scoreB =
        opps[i + 1].impacto * opps[i + 1].frecuencia * opps[i + 1].viabilidad;
      expect(scoreA).toBeGreaterThanOrEqual(scoreB);
    }
  });

  it("assigns rank 1..n in sorted order", () => {
    const opps = prioritizeOpportunities(OPPORTUNITY_NODES);
    opps.forEach((opp, idx) => {
      expect(opp.rank).toBe(idx + 1);
    });
  });

  it("rank 1 is unlocked (locked: false)", () => {
    const opps = prioritizeOpportunities(OPPORTUNITY_NODES);
    expect(opps[0].locked).toBe(false);
  });

  it("ranks > 1 are locked (locked: true)", () => {
    const opps = prioritizeOpportunities(OPPORTUNITY_NODES);
    opps.slice(1).forEach((opp) => {
      expect(opp.locked).toBe(true);
    });
  });

  it("each result validates against AIOpportunitySchema", () => {
    const opps = prioritizeOpportunities(OPPORTUNITY_NODES);
    opps.forEach((opp) => {
      expect(() => AIOpportunitySchema.parse(opp)).not.toThrow();
    });
  });

  it("returns empty array for no opportunity nodes", () => {
    const nonOppNodes: ProcessNode[] = OPPORTUNITY_NODES.map((n) => ({
      ...n,
      estado: "validated" as const,
    }));
    const opps = prioritizeOpportunities(nonOppNodes);
    expect(opps.length).toBe(0);
  });

  it("sets nodeId to the source node's id", () => {
    const opps = prioritizeOpportunities(OPPORTUNITY_NODES);
    const nodeIds = OPPORTUNITY_NODES.map((n) => n.id);
    opps.forEach((opp) => {
      expect(nodeIds).toContain(opp.nodeId);
    });
  });

  it("evidencia is a non-empty string", () => {
    const opps = prioritizeOpportunities(OPPORTUNITY_NODES);
    opps.forEach((opp) => {
      expect(opp.evidencia.length).toBeGreaterThan(0);
    });
  });
});
