/**
 * agent.ts — Pure mock AI agent service.
 * No Date.now(), Math.random(), or new Date() calls in the pure path.
 * All randomness/time must be injected via opts for deterministic testing.
 */

import {
  ProcessNodeSchema,
  type ProcessNode,
  type Handoff,
  type AIOpportunity,
  type AgentLog,
  type Interview,
  type Member,
} from "@/lib/schemas";
import { MOCK_NODES } from "@/lib/data/mockData";

// ── Internal counter for deterministic id generation when no opts provided ─────
// NOTE: This counter is module-level. Tests that need strict determinism should
// supply opts.id explicitly; the counter is for runtime convenience only.
let _logCounter = 0;
let _nodeCounter = 0;

// ── Per-area label pools ───────────────────────────────────────────────────────
const AREA_LABELS: Record<string, string[]> = {
  Comercial: [
    "Seguimiento de oportunidades",
    "Calificación de leads",
    "Actualizar CRM",
    "Registro de contactos",
  ],
  Compras: [
    "Evaluación de proveedores",
    "Gestión de órdenes de compra",
    "Control de entradas",
    "Negociación de precios",
  ],
  Operaciones: [
    "Planificación de rutas",
    "Control de almacén",
    "Gestión de devoluciones",
    "Seguimiento de envíos",
  ],
  Finanzas: [
    "Registro de pagos",
    "Cierre mensual",
    "Conciliación bancaria",
    "Gestión de impuestos",
  ],
  Atención: [
    "Seguimiento de tickets",
    "Registro de reclamaciones",
    "Encuesta de satisfacción",
    "Escalado de incidencias",
  ],
};

const DEFAULT_LABELS = [
  "Nueva actividad de proceso",
  "Tarea de revisión",
  "Actividad de coordinación",
];

// ── Evidence sentence templates ────────────────────────────────────────────────
const EVIDENCIA_TEMPLATES: Record<string, string> = {
  Comercial:
    "Miembros del área Comercial describen pasos manuales repetitivos que consumen {horas} semanales.",
  Compras:
    "El área de Compras realiza tareas manuales de {label} con una carga de {horas} semanales.",
  Operaciones:
    "En Operaciones se identificó {label} como proceso manual con impacto estimado de {horas} semanales.",
  Finanzas:
    "El área de Finanzas invierte {horas} semanales en {label} de forma manual.",
  Atención:
    "Atención al cliente dedica {horas} semanales a {label}, proceso susceptible de automatización.",
};

const DEFAULT_EVIDENCIA =
  "El proceso {label} requiere {horas} semanales de trabajo manual según las entrevistas.";

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Pick a label for the given area based on a deterministic index. */
function pickLabel(area: string, idx: number): string {
  const pool = AREA_LABELS[area] ?? DEFAULT_LABELS;
  return pool[idx % pool.length];
}

/** Get the first existing MOCK_NODE in the given area, or undefined. */
function findAreaNode(area: string): ProcessNode | undefined {
  return MOCK_NODES.find((n) => n.area === area);
}

/** Compute a position offset from an existing area node. */
function computePosition(
  area: string,
  view: "A" | "B"
): { x: number; y: number } {
  const areaNode = findAreaNode(area);
  if (areaNode) {
    const base = view === "A" ? areaNode.posA : areaNode.posB;
    return { x: base.x + 120, y: base.y + 80 };
  }
  // Fallback positions for unknown areas
  return view === "A" ? { x: 200, y: 200 } : { x: 100, y: 200 };
}

/** Parse horas string like "−6 h/sem" → numeric hours, default to 0 */
function parseHoras(horas: string | null): number {
  if (!horas) return 0;
  const match = horas.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/** Build a horas display string from numeric hours */
function formatHoras(hours: number): string {
  if (hours <= 0) return "≈ 2 h/sem";
  return `≈ ${hours} h/sem`;
}

// ── makeLog ───────────────────────────────────────────────────────────────────

export interface MakeLogOpts {
  id?: string;
  timestamp?: string;
  modelo?: string;
  tokens?: number;
  orgId?: string;
}

/**
 * Builds a valid AgentLog. Pure/deterministic when opts are fully supplied.
 */
export function makeLog(
  tipoDecision: string,
  input: string,
  output: string,
  opts?: MakeLogOpts
): AgentLog {
  const id = opts?.id ?? `log-${++_logCounter}`;
  return {
    id,
    orgId: opts?.orgId ?? "o1",
    tipoDecision,
    input,
    output,
    modelo: opts?.modelo ?? "gemini-2.5-flash",
    tokens: opts?.tokens ?? 0,
    timestamp: opts?.timestamp ?? "",
  };
}

// ── assembleNode ──────────────────────────────────────────────────────────────

export interface AssembleNodeOpts {
  id?: string;
  logId?: string;
}

/**
 * Produces a new draft ProcessNode owned by `member`, positioned near other
 * nodes of the member's area. Also returns at least one Handoff linking the
 * new node to an existing area node, and an AgentLog.
 */
export function assembleNode(
  interview: Interview,
  member: Member,
  opts?: AssembleNodeOpts
): { node: ProcessNode; edges: Handoff[]; log: AgentLog } {
  const idx = opts?.id ? _nodeCounter : ++_nodeCounter;

  const nodeId = opts?.id ?? `node-draft-${idx}`;
  // When opts.id is supplied, derive the label index from the id string so the
  // result is stable across multiple calls with the same opts.
  const labelIdx = opts?.id
    ? opts.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
    : idx;
  const label = pickLabel(member.area, labelIdx);

  const posA = computePosition(member.area, "A");
  const posB = computePosition(member.area, "B");

  const node: ProcessNode = ProcessNodeSchema.parse({
    id: nodeId,
    orgId: "o1",
    label,
    area: member.area,
    ownerMemberId: member.id,
    estado: "draft",
    posA,
    posB,
    horas: null,
    inter: false,
    sourceInterviewIds: [interview.id],
    desc: `Actividad identificada en el área de ${member.area} durante la entrevista.`,
    steps: ["Identificar necesidad", "Documentar proceso", "Validar con el equipo"],
  });

  // Build at least one Handoff linking to the nearest existing area node.
  // If no area node and no fallback node exists, return empty edges.
  const areaNode = findAreaNode(member.area);
  const targetNodeId = areaNode?.id ?? MOCK_NODES[0]?.id;

  const edges: Handoff[] = targetNodeId
    ? [
        {
          id: `edge-draft-${idx}`,
          orgId: "o1",
          fromNodeId: nodeId,
          toNodeId: targetNodeId,
          dashed: true,
        },
      ]
    : [];

  const log = makeLog(
    "ensamblado",
    `interview:${interview.id} member:${member.id} area:${member.area}`,
    `node:${nodeId} label:${label}`,
    { id: opts?.logId ?? `log-asm-${idx}`, orgId: "o1" }
  );

  return { node, edges, log };
}

// ── prioritizeOpportunities ───────────────────────────────────────────────────

export interface PrioritizeOpts {
  orgId?: string;
}

/**
 * From nodes with estado === "opportunity", builds AIOpportunity objects scored
 * and sorted DESCENDING by impacto * frecuencia * viabilidad.
 * rank 1 → locked: false, rest → locked: true.
 */
export function prioritizeOpportunities(
  nodes: ProcessNode[],
  opts?: PrioritizeOpts
): AIOpportunity[] {
  const orgId = opts?.orgId ?? "o1";
  const oppNodes = nodes.filter((n) => n.estado === "opportunity");

  if (oppNodes.length === 0) return [];

  // Score each node. We derive impacto/frecuencia/viabilidad from horas and
  // area to produce stable, relative scores without randomness.
  interface Scored {
    node: ProcessNode;
    impacto: number;
    frecuencia: number;
    viabilidad: number;
    score: number;
  }

  // Area-based viabilidad modifiers (deterministic)
  const VIABILIDAD_BY_AREA: Record<string, number> = {
    Comercial: 70,
    Compras: 75,
    Operaciones: 65,
    Finanzas: 80,
    Atención: 80,
  };

  const scored: Scored[] = oppNodes.map((node) => {
    const horasNum = parseHoras(node.horas);
    // impacto: scale hours to 0-100 (cap at 10 h/sem → 100)
    const impacto = Math.min(100, Math.round((horasNum / 10) * 100));
    // frecuencia: weekly tasks get high frecuencia; use inter flag as a boost
    const frecuencia = node.inter ? 90 : 80;
    const viabilidad = VIABILIDAD_BY_AREA[node.area] ?? 65;
    const score = impacto * frecuencia * viabilidad;
    return { node, impacto, frecuencia, viabilidad, score };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored.map((item, idx): AIOpportunity => {
    const rank = idx + 1;
    const { node, impacto, frecuencia, viabilidad } = item;
    const horasNum = parseHoras(node.horas);
    const horasDisplay = formatHoras(horasNum);

    const template =
      EVIDENCIA_TEMPLATES[node.area] ?? DEFAULT_EVIDENCIA;
    const evidencia = template
      .replace("{label}", node.label.toLowerCase())
      .replace("{horas}", horasDisplay);

    return {
      id: `op-${node.id}`,
      orgId,
      rank,
      titulo: node.label,
      areas: [node.area],
      horas: horasDisplay,
      impacto,
      frecuencia,
      viabilidad,
      nodeId: node.id,
      evidencia,
      locked: rank > 1,
    };
  });
}
