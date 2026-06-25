/**
 * assemble.ts — Server-side port of the "AI agent" node assembly.
 *
 * Self-contained (no app imports) so it can run inside Cloud Functions. Mirrors
 * lib/services/agent.ts#assembleNode but derives positions from per-area base
 * coordinates instead of the mock node table.
 */

export interface MemberDoc {
  id: string;
  orgId: string;
  nombre: string;
  area: string;
  email?: string;
  rol: string;
}

export interface NodeDoc {
  id: string;
  orgId: string;
  label: string;
  area: string;
  ownerMemberId: string;
  estado: "draft" | "validated" | "opportunity";
  posA: { x: number; y: number };
  posB: { x: number; y: number };
  horas: string | null;
  inter: boolean;
  sourceInterviewIds: string[];
  desc: string;
  steps: string[];
}

export interface EdgeDoc {
  id: string;
  orgId: string;
  fromNodeId: string;
  toNodeId: string;
  dashed: boolean;
}

export interface AgentLogDoc {
  id: string;
  orgId: string;
  tipoDecision: string;
  input: string;
  output: string;
  modelo: string;
  tokens: number;
  timestamp: string;
}

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

// Per-area base positions for the two map layouts (A = scattered, B = grid).
const AREA_BASE: Record<string, { a: { x: number; y: number }; b: { x: number; y: number } }> = {
  Comercial: { a: { x: 70, y: 36 }, b: { x: 16, y: 56 } },
  Compras: { a: { x: 360, y: 56 }, b: { x: 238, y: 126 } },
  Operaciones: { a: { x: 430, y: 280 }, b: { x: 452, y: 206 } },
  Finanzas: { a: { x: 700, y: 140 }, b: { x: 668, y: 206 } },
  Atención: { a: { x: 900, y: 80 }, b: { x: 884, y: 206 } },
};

function pickLabel(area: string, idx: number): string {
  const pool = AREA_LABELS[area] ?? DEFAULT_LABELS;
  return pool[idx % pool.length];
}

/**
 * Assemble a draft node + a (dashed) handoff to the area anchor + an agent log
 * from a completed interview. Ids are derived from the interview id so the
 * operation is idempotent (re-running yields the same ids → setDoc overwrites).
 */
export function assembleNode(
  interviewId: string,
  member: MemberDoc,
  anchorNodeId: string | null,
  timestamp: string
): { node: NodeDoc; edges: EdgeDoc[]; log: AgentLogDoc } {
  const labelIdx = interviewId
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const label = pickLabel(member.area, labelIdx);
  const base = AREA_BASE[member.area] ?? {
    a: { x: 200, y: 200 },
    b: { x: 100, y: 200 },
  };

  const nodeId = `node-${interviewId}`;
  const node: NodeDoc = {
    id: nodeId,
    orgId: member.orgId,
    label,
    area: member.area,
    ownerMemberId: member.id,
    estado: "draft",
    posA: { x: base.a.x + 120, y: base.a.y + 80 },
    posB: { x: base.b.x + 120, y: base.b.y + 80 },
    horas: null,
    inter: false,
    sourceInterviewIds: [interviewId],
    desc: `Actividad identificada en el área de ${member.area} durante la entrevista.`,
    steps: ["Identificar necesidad", "Documentar proceso", "Validar con el equipo"],
  };

  const edges: EdgeDoc[] = anchorNodeId
    ? [
        {
          id: `edge-${interviewId}`,
          orgId: member.orgId,
          fromNodeId: nodeId,
          toNodeId: anchorNodeId,
          dashed: true,
        },
      ]
    : [];

  const log: AgentLogDoc = {
    id: `log-${interviewId}`,
    orgId: member.orgId,
    tipoDecision: "ensamblado",
    input: `interview:${interviewId} member:${member.id} area:${member.area}`,
    output: `node:${nodeId} label:${label}`,
    modelo: "gemini-2.5-flash",
    tokens: 0,
    timestamp,
  };

  return { node, edges, log };
}
