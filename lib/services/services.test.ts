/**
 * services.test.ts — TDD tests for auth, stripe, and realtime services.
 * Run RED first (before implementation), then GREEN after.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── generateTeamLink ──────────────────────────────────────────────────────────

describe("generateTeamLink", () => {
  it("slugifies a company name and appends a 4-char base36 code", async () => {
    const { generateTeamLink } = await import("./auth");
    const link = generateTeamLink("Distribuciones Robledo");
    expect(link).toMatch(/^unifyflow\.eu\/e\/distribuciones-robledo-[a-z0-9]{4}$/);
  });

  it("falls back to 'tu-empresa' when company is empty", async () => {
    const { generateTeamLink } = await import("./auth");
    const link = generateTeamLink("");
    expect(link).toMatch(/^unifyflow\.eu\/e\/tu-empresa-[a-z0-9]{4}$/);
  });

  it("strips accents from company name", async () => {
    const { generateTeamLink } = await import("./auth");
    const link = generateTeamLink("Óptica Martínez");
    expect(link).toMatch(/^unifyflow\.eu\/e\/optica-martinez-[a-z0-9]{4}$/);
  });

  it("trims slug to 24 chars", async () => {
    const { generateTeamLink } = await import("./auth");
    const longName = "A".repeat(40);
    const link = generateTeamLink(longName);
    // slug part before the dash+code should be max 24 chars
    const match = link.match(/^unifyflow\.eu\/e\/([a-z0-9-]+)-[a-z0-9]{4}$/);
    expect(match).not.toBeNull();
    expect(match![1].length).toBeLessThanOrEqual(24);
  });
});

// ── signInAs ──────────────────────────────────────────────────────────────────

describe("signInAs", () => {
  beforeEach(() => {
    // Reset store module between tests by clearing persisted state
    vi.resetModules();
    localStorage.clear();
  });

  it("sets the role in the store", async () => {
    const { signInAs } = await import("./auth");
    const { useAppStore } = await import("@/lib/store/useAppStore");

    signInAs("validador");
    expect(useAppStore.getState().role).toBe("validador");
  });

  it("can set role to null", async () => {
    const { signInAs } = await import("./auth");
    const { useAppStore } = await import("@/lib/store/useAppStore");

    signInAs("admin");
    signInAs(null as unknown as import("@/lib/schemas").Role);
    expect(useAppStore.getState().role).toBeNull();
  });
});

// ── checkout ──────────────────────────────────────────────────────────────────

describe("checkout", () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
  });

  it("resolves with { ok: true } and sets subscription.paid to true", async () => {
    const { checkout } = await import("./stripe");
    const { useAppStore } = await import("@/lib/store/useAppStore");

    const result = await checkout();
    expect(result).toEqual({ ok: true });
    expect(useAppStore.getState().subscription.paid).toBe(true);
  });
});

// ── realtime emitter ──────────────────────────────────────────────────────────

describe("realtime emitter", () => {
  it("on + emit delivers payload to handler", async () => {
    const { realtime } = await import("./realtime");
    const handler = vi.fn();

    realtime.on("interview:completed", handler);
    realtime.emit("interview:completed", { nodeId: "n1" });

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith({ nodeId: "n1" });

    realtime.off("interview:completed", handler);
  });

  it("off stops delivery", async () => {
    const { realtime } = await import("./realtime");
    const handler = vi.fn();

    realtime.on("test:event", handler);
    realtime.off("test:event", handler);
    realtime.emit("test:event", { data: "x" });

    expect(handler).not.toHaveBeenCalled();
  });

  it("multiple handlers for same event all receive payload", async () => {
    const { realtime } = await import("./realtime");
    const h1 = vi.fn();
    const h2 = vi.fn();

    realtime.on("multi:event", h1);
    realtime.on("multi:event", h2);
    realtime.emit("multi:event", { value: 42 });

    expect(h1).toHaveBeenCalledWith({ value: 42 });
    expect(h2).toHaveBeenCalledWith({ value: 42 });

    realtime.off("multi:event", h1);
    realtime.off("multi:event", h2);
  });

  it("removing one handler does not affect others", async () => {
    const { realtime } = await import("./realtime");
    const h1 = vi.fn();
    const h2 = vi.fn();

    realtime.on("selective:event", h1);
    realtime.on("selective:event", h2);
    realtime.off("selective:event", h1);
    realtime.emit("selective:event", { ok: true });

    expect(h1).not.toHaveBeenCalled();
    expect(h2).toHaveBeenCalledOnce();

    realtime.off("selective:event", h2);
  });
});
