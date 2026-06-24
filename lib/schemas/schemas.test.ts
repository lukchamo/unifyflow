import { describe, it, expect } from "vitest";
import { ProcessNodeSchema, MemberSchema } from "./index";

describe("schemas", () => {
  // From brief verbatim
  it("accepts a valid node", () => {
    expect(() =>
      ProcessNodeSchema.parse({
        id: "n1",
        orgId: "o1",
        label: "Captar lead",
        ownerMemberId: "m1",
        area: "Comercial",
        estado: "validated",
        posA: { x: 70, y: 36 },
        posB: { x: 16, y: 56 },
        horas: null,
        inter: false,
        sourceInterviewIds: ["i1"],
        desc: "…",
        steps: ["a"],
      })
    ).not.toThrow();
  });

  it("rejects bad estado", () => {
    expect(() => ProcessNodeSchema.parse({ estado: "nope" } as unknown)).toThrow();
  });

  it("rejects bad role", () => {
    expect(() => MemberSchema.parse({ rol: "ceo" } as unknown)).toThrow();
  });

  // Extra tests
  it("accepts a valid Member", () => {
    expect(() =>
      MemberSchema.parse({
        id: "m1",
        orgId: "o1",
        nombre: "Juan Pérez",
        cargo: "CEO",
        area: "Comercial",
        rol: "admin",
        done: false,
      })
    ).not.toThrow();
  });

  it("ProcessNode requires posA and posB", () => {
    expect(() =>
      ProcessNodeSchema.parse({
        id: "n1",
        orgId: "o1",
        label: "Captar lead",
        ownerMemberId: "m1",
        area: "Comercial",
        estado: "validated",
        // posA and posB intentionally omitted
        horas: null,
        inter: false,
        sourceInterviewIds: [],
        desc: "",
        steps: [],
      })
    ).toThrow();
  });
});
