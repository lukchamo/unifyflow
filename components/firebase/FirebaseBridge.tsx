"use client";

/**
 * FirebaseBridge — streams Firestore into the Zustand store (firebase mode).
 *
 * Mounted by AuthProvider once an org id is known. It opens realtime listeners
 * for every collection and pushes snapshots into the store via `hydrate`. When
 * the nodes collection grows (e.g. the `onInterviewWritten` trigger assembled a
 * new node), it re-emits the in-app "interview:completed" event so the existing
 * live-map reveal animation runs — no component changes required.
 */

import { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { realtime } from "@/lib/services/realtime";
import * as repo from "@/lib/firebase/repo";
import type { ProcessNode } from "@/lib/schemas";

export function FirebaseBridge({ orgId }: { orgId: string }) {
  const hydrate = useAppStore((s) => s.hydrate);
  const prevNodeIds = useRef<Set<string> | null>(null);

  useEffect(() => {
    if (!orgId) return;

    const unsubs = [
      repo.subscribeOrg(orgId, (org) => org && hydrate({ org })),
      repo.subscribeTeam(orgId, (team) => hydrate({ team })),
      repo.subscribeInterviews(orgId, (interviews) => hydrate({ interviews })),
      repo.subscribeEdges(orgId, (edges) => hydrate({ edges })),
      repo.subscribeOpps(orgId, (opps) => hydrate({ opps })),
      repo.subscribeValidations(orgId, (validations) => hydrate({ validations })),
      repo.subscribeAgentLogs(orgId, (agentLogs) => hydrate({ agentLogs })),
      repo.subscribeComments(orgId, (comments) => hydrate({ comments })),
      repo.subscribeSubscription(
        orgId,
        (subscription) => subscription && hydrate({ subscription })
      ),
      // Nodes: hydrate + detect newly-assembled nodes to drive the map reveal.
      repo.subscribeNodes(orgId, (nodes: ProcessNode[]) => {
        hydrate({ nodes });
        const ids = new Set(nodes.map((n) => n.id));
        if (prevNodeIds.current) {
          for (const n of nodes) {
            if (!prevNodeIds.current.has(n.id)) {
              realtime.emit("interview:completed", { node: n });
            }
          }
        }
        prevNodeIds.current = ids;
      }),
    ];

    return () => unsubs.forEach((u) => u());
  }, [orgId, hydrate]);

  return null;
}
