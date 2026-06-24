"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useAppStore } from "@/lib/store/useAppStore";
import { AREA_COLORS } from "@/lib/data/mockData";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { SharePopover } from "./SharePopover";
import { MentionPicker } from "./MentionPicker";
import { CommentList } from "./CommentList";
import { CommentComposer } from "./CommentComposer";
import type { Member } from "@/lib/schemas";

// The validator id is the team member with rol 'validador' (Lucía Vidal, m6)
const CURRENT_VALIDATOR_ID = "m6";

export function NodeDetailPanel() {
  const selectedId = useAppStore((s) => s.mapState.selectedId);
  const nodes = useAppStore((s) => s.nodes);
  const team = useAppStore((s) => s.team);
  const comments = useAppStore((s) => s.comments);
  const selectNode = useAppStore((s) => s.selectNode);
  const validateNode = useAppStore((s) => s.validateNode);
  const addComment = useAppStore((s) => s.addComment);
  const tagForValidation = useAppStore((s) => s.tagForValidation);
  const addStep = useAppStore((s) => s.addStep);
  const setStep = useAppStore((s) => s.setStep);

  const [showStepInput, setShowStepInput] = React.useState(false);
  const [stepInputValue, setStepInputValue] = React.useState("");
  const [taggedMember, setTaggedMember] = React.useState<Member | null>(null);
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);

  // Reset local state when node changes
  React.useEffect(() => {
    setShowStepInput(false);
    setStepInputValue("");
    setTaggedMember(null);
  }, [selectedId]);

  // Auto-clear toast
  React.useEffect(() => {
    if (toastMsg) {
      const t = setTimeout(() => setToastMsg(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toastMsg]);

  if (!selectedId) return null;

  const node = nodes.find((n) => n.id === selectedId);
  if (!node) return null;

  const owner = team.find((m) => m.id === node.ownerMemberId);
  const nodeComments = comments.filter((c) => c.nodeId === selectedId);
  const areaColor = AREA_COLORS[node.area] ?? "#3C7D6E";

  // Members available for mention (exclude node owner)
  const mentionableMembers = team.filter((m) => m.id !== node.ownerMemberId);

  function handleValidate() {
    validateNode(selectedId!, CURRENT_VALIDATOR_ID);
  }

  function handleAddStep() {
    const trimmed = stepInputValue.trim();
    if (!trimmed) return;
    addStep(selectedId!, trimmed);
    setStepInputValue("");
    setShowStepInput(false);
  }

  function handleTag(member: Member) {
    tagForValidation(selectedId!, member.id);
    setTaggedMember(member);
  }

  function handleAddComment(text: string) {
    addComment(selectedId!, text);
  }

  const panelContent = (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ maxHeight: "100%" }}
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-2 px-5 pt-5 pb-3 border-b"
        style={{ borderColor: "#E4EBE7" }}
      >
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          {/* Area chip + Share + Close row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: areaColor }}
            >
              {node.area}
            </span>
            <div className="flex-1" />
            <SharePopover
              nodeId={selectedId}
              onToast={(msg) => setToastMsg(msg)}
            >
              <button
                className="text-xs font-medium flex items-center gap-1 transition-colors hover:opacity-70"
                style={{ color: areaColor }}
                aria-label="Compartir"
              >
                ↗ Compartir
              </button>
            </SharePopover>
            <button
              className="text-sm font-medium leading-none transition-colors hover:opacity-70 ml-1"
              style={{ color: "#7A807C" }}
              onClick={() => selectNode(null)}
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          {/* Title */}
          <Dialog.Title
            className="font-semibold leading-snug text-[#15201C]"
            style={{ fontSize: "21px", fontFamily: "var(--font-newsreader, Georgia, serif)" }}
          >
            {node.label}
          </Dialog.Title>

          {/* Status pill */}
          <StatusPill estado={node.estado} />
        </div>
      </div>

      {/* ── Sections ── */}
      <div className="flex flex-col gap-6 px-5 py-5">

        {/* ── El proceso ── */}
        <section className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7A807C" }}>
            El proceso
          </h3>
          <p className="text-sm leading-relaxed text-[#3B4840]">{node.desc}</p>

          {/* Numbered steps */}
          {node.steps.length > 0 && (
            <ol className="flex flex-col gap-2">
              {node.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span
                    className="text-xs font-mono font-semibold w-5 shrink-0 mt-0.5"
                    style={{ color: areaColor }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-snug text-[#15201C]">{step}</span>
                </li>
              ))}
            </ol>
          )}

          {/* Add step */}
          {!showStepInput ? (
            <button
              className="text-xs font-medium self-start transition-colors hover:opacity-70"
              style={{ color: areaColor }}
              onClick={() => setShowStepInput(true)}
            >
              + Añadir un paso o detalle
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={stepInputValue}
                onChange={(e) => setStepInputValue(e.target.value)}
                placeholder="Describe el paso…"
                className="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none focus:ring-1"
                style={{
                  borderColor: "#D1D8D4",
                  backgroundColor: "#F7FAF8",
                  color: "#15201C",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddStep();
                  if (e.key === "Escape") {
                    setShowStepInput(false);
                    setStepInputValue("");
                  }
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={handleAddStep}>
                  Añadir
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowStepInput(false);
                    setStepInputValue("");
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* ── Procedencia ── */}
        <section className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7A807C" }}>
            Procedencia
          </h3>
          <div className="flex items-center gap-2.5">
            {owner && <Avatar name={owner.nombre} size="sm" />}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#15201C]">
                {owner?.nombre ?? "—"}
              </span>
              <span className="text-xs" style={{ color: "#7A807C" }}>
                {node.sourceInterviewIds.length > 1
                  ? `Aparece en ${node.sourceInterviewIds.length} entrevistas`
                  : "De 1 entrevista"}
              </span>
            </div>
          </div>
        </section>

        {/* ── Validación ── */}
        <section className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7A807C" }}>
            Validación
          </h3>

          {node.estado === "draft" && (
            <Button variant="primary" size="sm" onClick={handleValidate} className="self-start">
              Validar este proceso
            </Button>
          )}

          {node.estado === "validated" && (
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3"
              style={{ backgroundColor: "var(--accent-tint)" }}
            >
              <span className="text-sm font-medium" style={{ color: "var(--accent-dk)" }}>
                ✓ Confirmado por tu equipo
              </span>
            </div>
          )}

          {node.estado === "opportunity" && (
            <button
              className="flex items-center gap-2 rounded-xl px-4 py-3 border text-left w-full transition-colors hover:brightness-95"
              style={{
                backgroundColor: "#FCF8EE",
                borderColor: "#E9D8B2",
                color: "#8A6420",
              }}
              onClick={() => setStep("oportunidades")}
            >
              <span className="text-sm font-medium">
                Aquí la IA ahorra tiempo · ver paso 4 →
              </span>
            </button>
          )}

          {/* Etiquetar */}
          {taggedMember ? (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium self-start"
              style={{ backgroundColor: "#F6EEF3", color: "#9E6E8C" }}
            >
              🕓 Esperando a {taggedMember.nombre}
            </span>
          ) : (
            <MentionPicker members={mentionableMembers} onSelect={handleTag}>
              <button
                className="text-xs font-medium self-start transition-colors hover:opacity-70"
                style={{ color: "#7A807C" }}
              >
                @ Etiquetar a alguien para validar
              </button>
            </MentionPicker>
          )}
        </section>

        {/* ── Comentarios ── */}
        <section className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7A807C" }}>
            Comentarios · {nodeComments.length}
          </h3>

          <CommentList comments={nodeComments} />
          <CommentComposer onSubmit={handleAddComment} />
        </section>
      </div>

      {/* ── Toast ── */}
      {toastMsg && (
        <div
          className="fixed bottom-4 right-4 px-4 py-3 rounded-xl shadow-lg text-sm font-medium z-[9999]"
          style={{ backgroundColor: "#15201C", color: "#FBFCFB" }}
          role="status"
          aria-live="polite"
        >
          {toastMsg}
        </div>
      )}
    </div>
  );

  return (
    <Dialog.Root
      open={!!selectedId}
      onOpenChange={(open) => {
        if (!open) selectNode(null);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 md:bg-transparent bg-black/30" />
        {/* Desktop: right-side floating panel */}
        <Dialog.Content
          aria-describedby={undefined}
          className={[
            "fixed z-50 bg-white focus:outline-none",
            // Mobile: bottom sheet
            "bottom-0 left-0 right-0 rounded-t-2xl max-h-[85vh]",
            // Desktop: right-side panel
            "md:bottom-auto md:top-4 md:right-4 md:left-auto md:rounded-2xl md:h-[calc(100vh-2rem)]",
          ].join(" ")}
          style={{
            width: undefined,
            // Desktop width set via class overrides
            boxShadow:
              "0 8px 32px rgba(21, 32, 28, 0.16), 0 2px 8px rgba(21, 32, 28, 0.08)",
          }}
        >
          {/* Apply width only on md+ */}
          <div
            className="h-full flex flex-col md:w-[376px]"
            style={{ overflowY: "auto" }}
          >
            {panelContent}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
