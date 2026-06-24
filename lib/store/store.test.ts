/**
 * store.test.ts — TDD tests for useAppStore + selectors.
 * Run with: npx vitest run lib/store/store.test.ts
 */

import { beforeEach, describe, it, expect } from "vitest";
import { useAppStore } from "./useAppStore";
import {
  selectValidatedCount,
  selectStatusText,
  selectProgressText,
  selectTotalHours,
  selectVisibleNodesForRole,
} from "./selectors";

// Helper: get current state snapshot
const getState = () => useAppStore.getState();

// Reset store to seed before each test
beforeEach(() => {
  useAppStore.getState().resetDemo();
});

// ── Initial state ──────────────────────────────────────────────────────────────

describe("initial state", () => {
  it("has 9 nodes", () => {
    expect(getState().nodes).toHaveLength(9);
  });

  it("selectStatusText === '4 de 9 nodos validados'", () => {
    expect(selectStatusText(getState())).toBe("4 de 9 nodos validados");
  });

  it("selectProgressText === '5 de 7 completadas'", () => {
    expect(selectProgressText(getState())).toBe("5 de 7 completadas");
  });

  it("selectTotalHours === '≈ 18 h'", () => {
    expect(selectTotalHours(getState())).toBe("≈ 18 h");
  });

  it("selectValidatedCount initial is 4", () => {
    expect(selectValidatedCount(getState())).toBe(4);
  });
});

// ── validateNode ───────────────────────────────────────────────────────────────

describe("validateNode", () => {
  it("sets n4 estado to validated", () => {
    getState().validateNode("n4", "m6");
    const n4 = getState().nodes.find((n) => n.id === "n4");
    expect(n4?.estado).toBe("validated");
  });

  it("increments validated count to 5", () => {
    getState().validateNode("n4", "m6");
    expect(selectValidatedCount(getState())).toBe(5);
  });

  it("records a Validation entry", () => {
    getState().validateNode("n4", "m6");
    const validations = getState().validations;
    const v = validations.find((v) => v.nodeId === "n4" && v.validatorId === "m6");
    expect(v).toBeDefined();
    expect(v?.accion).toBeTruthy();
  });
});

// ── pay ────────────────────────────────────────────────────────────────────────

describe("pay", () => {
  it("sets subscription.paid to true", () => {
    getState().pay();
    expect(getState().subscription.paid).toBe(true);
  });

  it("sets all opps locked to false", () => {
    getState().pay();
    const allUnlocked = getState().opps.every((op) => op.locked === false);
    expect(allUnlocked).toBe(true);
  });
});

// ── submitInterview ────────────────────────────────────────────────────────────

describe("submitInterview", () => {
  it("adds a new node after interview submission", () => {
    const initialCount = getState().nodes.length;
    // m7 (Diego Mora) has done: false — a good candidate
    getState().submitInterview("m7", []);
    expect(getState().nodes.length).toBeGreaterThan(initialCount);
  });

  it("adds an AgentLog after interview submission", () => {
    const initialLogCount = getState().agentLogs.length;
    getState().submitInterview("m7", []);
    expect(getState().agentLogs.length).toBeGreaterThan(initialLogCount);
  });

  it("marks the member as done after submission", () => {
    getState().submitInterview("m7", []);
    const member = getState().team.find((m) => m.id === "m7");
    expect(member?.done).toBe(true);
  });
});

// ── resetDemo ─────────────────────────────────────────────────────────────────

describe("resetDemo", () => {
  it("restores 9 nodes after mutations", () => {
    // Mutate state
    getState().submitInterview("m7", []);
    getState().validateNode("n4", "m6");
    expect(getState().nodes.length).toBeGreaterThan(9);

    // Reset
    getState().resetDemo();
    expect(getState().nodes).toHaveLength(9);
  });

  it("restores subscription.paid to false", () => {
    getState().pay();
    expect(getState().subscription.paid).toBe(true);
    getState().resetDemo();
    expect(getState().subscription.paid).toBe(false);
  });

  it("clears validations", () => {
    getState().validateNode("n4", "m6");
    expect(getState().validations.length).toBeGreaterThan(0);
    getState().resetDemo();
    expect(getState().validations).toHaveLength(0);
  });
});

// ── selectors ─────────────────────────────────────────────────────────────────

describe("selectVisibleNodesForRole", () => {
  it("returns all nodes when role is null", () => {
    // Default role is null in seed
    const nodes = selectVisibleNodesForRole(getState());
    expect(nodes).toHaveLength(getState().nodes.length);
  });

  it("returns all nodes when role is admin", () => {
    getState().setRole("admin");
    const nodes = selectVisibleNodesForRole(getState());
    expect(nodes).toHaveLength(getState().nodes.length);
  });

  it("filters nodes to validador area when role is validador", () => {
    // m6 is the validador in area "Atención"
    getState().setRole("validador");
    const nodes = selectVisibleNodesForRole(getState());
    // Should only return nodes from "Atención" area
    nodes.forEach((n) => expect(n.area).toBe("Atención"));
    // n9 is the Atención node
    expect(nodes.some((n) => n.id === "n9")).toBe(true);
  });
});

// ── inviteMember ───────────────────────────────────────────────────────────────

describe("inviteMember", () => {
  it("adds a pending member to team", () => {
    const initialCount = getState().team.length;
    getState().inviteMember("nuevo@test.com");
    expect(getState().team.length).toBe(initialCount + 1);
  });

  it("new member has done: false", () => {
    getState().inviteMember("nuevo@test.com");
    const last = getState().team[getState().team.length - 1];
    expect(last.done).toBe(false);
  });

  it("new member has email set correctly", () => {
    getState().inviteMember("nuevo@test.com");
    const last = getState().team[getState().team.length - 1];
    expect(last.email).toBe("nuevo@test.com");
  });
});

// ── addComment ────────────────────────────────────────────────────────────────

describe("addComment", () => {
  it("appends a comment to the store", () => {
    const initialCount = getState().comments.length;
    getState().addComment("n1", "Test comment");
    expect(getState().comments.length).toBe(initialCount + 1);
  });

  it("comment has correct nodeId and text", () => {
    getState().addComment("n1", "Hello world");
    const last = getState().comments[getState().comments.length - 1];
    expect(last.nodeId).toBe("n1");
    expect(last.text).toBe("Hello world");
    expect(last.author).toBe("Tú");
    expect(last.time).toBe("ahora");
  });
});

// ── tour ──────────────────────────────────────────────────────────────────────

describe("tour actions", () => {
  it("startTour sets active: true and step: 0", () => {
    getState().startTour();
    expect(getState().tour.active).toBe(true);
    expect(getState().tour.step).toBe(0);
  });

  it("nextTourStep increments step", () => {
    getState().startTour();
    getState().nextTourStep();
    expect(getState().tour.step).toBe(1);
  });

  it("endTour sets active: false", () => {
    getState().startTour();
    getState().endTour();
    expect(getState().tour.active).toBe(false);
  });
});

// ── mapState actions ──────────────────────────────────────────────────────────

describe("mapState actions", () => {
  it("reorganize sets organized: true", () => {
    getState().reorganize();
    expect(getState().mapState.organized).toBe(true);
  });

  it("replay resets organized and revealed to false", () => {
    getState().reorganize();
    getState().replay();
    expect(getState().mapState.organized).toBe(false);
    expect(getState().mapState.revealed).toBe(false);
  });

  it("selectNode sets selectedId", () => {
    getState().selectNode("n3");
    expect(getState().mapState.selectedId).toBe("n3");
  });

  it("setFilter updates filter", () => {
    getState().setFilter("validated");
    expect(getState().mapState.filter).toBe("validated");
  });
});
