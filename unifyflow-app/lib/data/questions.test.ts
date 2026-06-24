import { describe, it, expect } from "vitest";
import { getQuestions, getFollowUp } from "./questions";

describe("getQuestions", () => {
  it("returns exactly 4 questions for Operaciones", () => {
    const qs = getQuestions({ nombre: "Andrés", cargo: "Responsable de almacén", area: "Operaciones" });
    expect(qs).toHaveLength(4);
  });

  it("returns exactly 4 questions for Comercial", () => {
    const qs = getQuestions({ nombre: "Laura", cargo: "Ejecutiva", area: "Comercial" });
    expect(qs).toHaveLength(4);
  });

  it("returns exactly 4 questions for Compras", () => {
    const qs = getQuestions({ nombre: "Miguel", cargo: "Analista", area: "Compras" });
    expect(qs).toHaveLength(4);
  });

  it("returns exactly 4 questions for Finanzas", () => {
    const qs = getQuestions({ nombre: "Sofía", cargo: "Contadora", area: "Finanzas" });
    expect(qs).toHaveLength(4);
  });

  it("returns exactly 4 questions for Atención", () => {
    const qs = getQuestions({ nombre: "Carlos", cargo: "Agente", area: "Atención" });
    expect(qs).toHaveLength(4);
  });

  it("returns exactly 4 questions for an unknown area", () => {
    const qs = getQuestions({ nombre: "Test", cargo: "x", area: "UnknownArea" });
    expect(qs).toHaveLength(4);
  });

  it("Q1 contains the member nombre for Operaciones", () => {
    const qs = getQuestions({ nombre: "Andrés", cargo: "x", area: "Operaciones" });
    expect(qs[0].text).toContain("Andrés");
  });

  it("Q1 contains the member nombre for Comercial", () => {
    const qs = getQuestions({ nombre: "Laura", cargo: "x", area: "Comercial" });
    expect(qs[0].text).toContain("Laura");
  });

  it("Q1 contains the member nombre for unknown area", () => {
    const qs = getQuestions({ nombre: "Test", cargo: "x", area: "Unknown" });
    expect(qs[0].text).toContain("Test");
  });

  it("Q1 uses only the first name for Compras (full name splits)", () => {
    const qs = getQuestions({ nombre: "Miguel Rodríguez", cargo: "Analista", area: "Compras" });
    expect(qs[0].text).toContain("Miguel");
    expect(qs[0].text).not.toContain("Miguel Rodríguez");
  });

  it("Q1 uses only the first name for Finanzas (full name splits)", () => {
    const qs = getQuestions({ nombre: "Sofía López", cargo: "Contadora", area: "Finanzas" });
    expect(qs[0].text).toContain("Sofía");
    expect(qs[0].text).not.toContain("Sofía López");
  });

  it("Q1 uses only the first name for Atención (full name splits)", () => {
    const qs = getQuestions({ nombre: "Carlos Pérez", cargo: "Agente", area: "Atención" });
    expect(qs[0].text).toContain("Carlos");
    expect(qs[0].text).not.toContain("Carlos Pérez");
  });

  it("all questions have non-empty text", () => {
    const areas = ["Operaciones", "Comercial", "Compras", "Finanzas", "Atención", "Desconocida"];
    for (const area of areas) {
      const qs = getQuestions({ nombre: "Ana", cargo: "x", area });
      for (const q of qs) {
        expect(q.text.trim().length).toBeGreaterThan(10);
      }
    }
  });

  it("all questions have unique string ids", () => {
    const qs = getQuestions({ nombre: "Ana", cargo: "x", area: "Operaciones" });
    const ids = qs.map((q) => q.id);
    expect(new Set(ids).size).toBe(4);
  });

  it("Q1 for Operaciones matches verbatim template (greeting + pedido)", () => {
    const qs = getQuestions({ nombre: "Andrés", cargo: "x", area: "Operaciones" });
    expect(qs[0].text).toContain("pedido nuevo");
  });
});

describe("getFollowUp", () => {
  it("returns a non-empty string for any area", () => {
    const areas = ["Operaciones", "Comercial", "Compras", "Finanzas", "Atención", "Unknown"];
    for (const area of areas) {
      expect(getFollowUp(area).trim().length).toBeGreaterThan(5);
    }
  });
});
