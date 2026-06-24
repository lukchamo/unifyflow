import { describe, it, expect } from "vitest";
import {
  HERO,
  HOW,
  PRICING,
  DIFFERENTIATOR,
  MODAL_COPY,
} from "./content";

describe("Landing content constants", () => {
  it("HERO.h1 is verbatim", () => {
    expect(HERO.h1).toBe("El espejo que tu empresa nunca tuvo.");
  });

  it("HOW.steps has 4 items", () => {
    expect(HOW.steps.length).toBe(4);
  });

  it("PRICING has 3 plans and correct priceFrom default", () => {
    expect(PRICING.plans.length).toBe(3);
    expect(PRICING.priceFrom).toBe("desde €490");
  });

  it("DIFFERENTIATOR has 4 rows and last row is highlighted", () => {
    expect(DIFFERENTIATOR.rows.length).toBe(4);
    expect(DIFFERENTIATOR.rows[DIFFERENTIATOR.rows.length - 1].highlight).toBe(true);
  });

  it("MODAL_COPY.mailtoSubject is verbatim", () => {
    expect(MODAL_COPY.mailtoSubject).toBe(
      "Ayúdame a mapear cómo trabajamos (5 min)"
    );
  });
});
