import { describe, it, expect } from "vitest";
import {
  MOCK_NODES,
  MOCK_EDGES,
  MOCK_TEAM,
  MOCK_OPPS,
  MOCK_INTERVIEWS,
  MOCK_COMMENTS,
  AREA_COLORS,
} from "./mockData";
import {
  ProcessNodeSchema,
  MemberSchema,
  HandoffSchema,
  AIOpportunitySchema,
} from "@/lib/schemas";

describe("mockData", () => {
  it("has 9 nodes, 10 edges, 7 members, 3 opps", () => {
    expect(MOCK_NODES).toHaveLength(9);
    expect(MOCK_EDGES).toHaveLength(10);
    expect(MOCK_TEAM).toHaveLength(7);
    expect(MOCK_OPPS).toHaveLength(3);
  });

  it("nodes validate", () => {
    MOCK_NODES.forEach((n) =>
      expect(() => ProcessNodeSchema.parse(n)).not.toThrow()
    );
  });

  it("n2 is an opportunity with −6 h/sem", () => {
    const n2 = MOCK_NODES.find((n) => n.id === "n2")!;
    expect(n2.estado).toBe("opportunity");
    expect(n2.horas).toBe("−6 h/sem");
  });

  it("n9→n2 edge is dashed", () => {
    expect(
      MOCK_EDGES.find((e) => e.fromNodeId === "n9" && e.toNodeId === "n2")!
        .dashed
    ).toBe(true);
  });

  it("opps 2 and 3 are locked", () => {
    expect(MOCK_OPPS.find((o) => o.rank === 2)!.locked).toBe(true);
    expect(MOCK_OPPS.find((o) => o.rank === 3)!.locked).toBe(true);
  });

  it("all members validate", () => {
    MOCK_TEAM.forEach((m) =>
      expect(() => MemberSchema.parse(m)).not.toThrow()
    );
  });

  it("all edges validate", () => {
    MOCK_EDGES.forEach((e) =>
      expect(() => HandoffSchema.parse(e)).not.toThrow()
    );
  });

  it("all opps validate", () => {
    MOCK_OPPS.forEach((o) =>
      expect(() => AIOpportunitySchema.parse(o)).not.toThrow()
    );
  });

  it("has 6 interviews", () => {
    expect(MOCK_INTERVIEWS).toHaveLength(6);
  });

  it("has 2 comments", () => {
    expect(MOCK_COMMENTS).toHaveLength(2);
  });

  it("AREA_COLORS has entries for all 5 areas", () => {
    expect(AREA_COLORS["Comercial"]).toBe("#3C7D6E");
    expect(AREA_COLORS["Compras"]).toBe("#5E6E9E");
    expect(AREA_COLORS["Operaciones"]).toBe("#A8773C");
    expect(AREA_COLORS["Finanzas"]).toBe("#4F8B86");
    expect(AREA_COLORS["Atención"]).toBe("#9E6E8C");
  });

  it("opp rank 1 is not locked", () => {
    expect(MOCK_OPPS.find((o) => o.rank === 1)!.locked).toBe(false);
  });
});
