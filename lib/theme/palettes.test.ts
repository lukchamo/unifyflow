import { describe, it, expect } from "vitest";
import { PALETTES } from "./palettes";
describe("palettes", () => {
  it("Salvia is the default green", () => {
    expect(PALETTES.Salvia).toEqual({ accent: "#3C7D6E", accentDk: "#2C6457", accentTint: "#E7F0ED" });
  });
  it("has all four palettes", () => {
    expect(Object.keys(PALETTES)).toEqual(["Salvia", "Azul", "Terracota", "Lavanda"]);
  });
});
