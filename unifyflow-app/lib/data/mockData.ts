import type {
  Organization,
  Member,
  Interview,
  ProcessNode,
  Handoff,
  AIOpportunity,
} from "@/lib/schemas";

// ── Organization ───────────────────────────────────────────────────────────────
export const MOCK_ORG: Organization = {
  id: "o1",
  nombre: "Distribuciones Robledo",
  sector: "Distribución de material eléctrico",
  plan: "free",
};

// ── Area colors ────────────────────────────────────────────────────────────────
export const AREA_COLORS: Record<string, string> = {
  Comercial: "#3C7D6E",
  Compras: "#5E6E9E",
  Operaciones: "#A8773C",
  Finanzas: "#4F8B86",
  Atención: "#9E6E8C",
};

// ── Team ───────────────────────────────────────────────────────────────────────
export const MOCK_TEAM: Member[] = [
  {
    id: "m1",
    orgId: "o1",
    nombre: "Marta Ruiz",
    email: "marta-ruiz@robledo.es",
    cargo: "Comercial",
    area: "Comercial",
    rol: "admin",
    done: true,
  },
  {
    id: "m2",
    orgId: "o1",
    nombre: "Javier León",
    email: "javier-leon@robledo.es",
    cargo: "Comercial",
    area: "Comercial",
    rol: "entrevistado",
    done: true,
  },
  {
    id: "m3",
    orgId: "o1",
    nombre: "Nuria Gil",
    email: "nuria-gil@robledo.es",
    cargo: "Compras",
    area: "Compras",
    rol: "entrevistado",
    done: true,
  },
  {
    id: "m4",
    orgId: "o1",
    nombre: "Andrés Pérez",
    email: "andres-perez@robledo.es",
    cargo: "Operaciones",
    area: "Operaciones",
    rol: "entrevistado",
    done: true,
  },
  {
    id: "m5",
    orgId: "o1",
    nombre: "Carmen Soto",
    email: "carmen-soto@robledo.es",
    cargo: "Finanzas",
    area: "Finanzas",
    rol: "entrevistado",
    done: true,
  },
  {
    id: "m6",
    orgId: "o1",
    nombre: "Lucía Vidal",
    email: "lucia-vidal@robledo.es",
    cargo: "Atención",
    area: "Atención",
    rol: "validador",
    done: false,
  },
  {
    id: "m7",
    orgId: "o1",
    nombre: "Diego Mora",
    email: "diego-mora@robledo.es",
    cargo: "Operaciones",
    area: "Operaciones",
    rol: "entrevistado",
    done: false,
  },
];

// ── Interviews ─────────────────────────────────────────────────────────────────
export const MOCK_INTERVIEWS: Interview[] = [
  { id: "i1", memberId: "m1", estado: "completada", answers: [] },
  { id: "i2", memberId: "m2", estado: "completada", answers: [] },
  { id: "i3", memberId: "m3", estado: "completada", answers: [] },
  { id: "i4", memberId: "m4", estado: "completada", answers: [] },
  { id: "i5", memberId: "m5", estado: "completada", answers: [] },
  { id: "i6", memberId: "m6", estado: "completada", answers: [] },
];

// ── Nodes ──────────────────────────────────────────────────────────────────────
// NOTE: The minus sign in horas values is Unicode U+2212 "−" (mathematical minus),
// NOT a hyphen-minus U+002D "-".
export const MOCK_NODES: ProcessNode[] = [
  {
    id: "n1",
    orgId: "o1",
    label: "Captar lead",
    area: "Comercial",
    ownerMemberId: "m1",
    estado: "validated",
    posA: { x: 70, y: 36 },
    posB: { x: 16, y: 56 },
    horas: null,
    inter: false,
    sourceInterviewIds: ["i1"],
    desc: "Entra un contacto por web, feria o recomendación. Se registra y se asigna a un comercial.",
    steps: ["Recibir el contacto", "Registrar en la hoja", "Asignar comercial"],
  },
  {
    id: "n2",
    orgId: "o1",
    label: "Elaborar presupuesto",
    area: "Comercial",
    ownerMemberId: "m1",
    estado: "opportunity",
    posA: { x: 180, y: 236 },
    posB: { x: 16, y: 206 },
    horas: "−6 h/sem",
    inter: true,
    sourceInterviewIds: ["i1", "i2", "i3"],
    desc: "Se cruzan precios de Compras y plazos de Operaciones para armar la oferta. Hoy es manual y se rehace a menudo.",
    steps: [
      "Pedir precios a Compras",
      "Confirmar plazos con Operaciones",
      "Montar el presupuesto",
      "Enviar al cliente",
    ],
  },
  {
    id: "n3",
    orgId: "o1",
    label: "Cerrar pedido",
    area: "Comercial",
    ownerMemberId: "m2",
    estado: "validated",
    posA: { x: 40, y: 392 },
    posB: { x: 16, y: 356 },
    horas: null,
    inter: false,
    sourceInterviewIds: ["i2"],
    desc: "El cliente acepta y se formaliza el pedido en el sistema.",
    steps: ["Confirmar aceptación", "Crear el pedido", "Notificar a Operaciones"],
  },
  {
    id: "n4",
    orgId: "o1",
    label: "Reponer stock",
    area: "Compras",
    ownerMemberId: "m3",
    estado: "draft",
    posA: { x: 360, y: 56 },
    posB: { x: 238, y: 126 },
    horas: null,
    inter: false,
    sourceInterviewIds: ["i3"],
    desc: "Compras revisa niveles de stock y lanza pedidos a proveedores.",
    steps: ["Revisar stock", "Pedir a proveedor", "Registrar entrada"],
  },
  {
    id: "n5",
    orgId: "o1",
    label: "Preparar pedido",
    area: "Operaciones",
    ownerMemberId: "m4",
    estado: "validated",
    posA: { x: 430, y: 280 },
    posB: { x: 452, y: 206 },
    horas: null,
    inter: true,
    sourceInterviewIds: ["i4", "i2"],
    desc: "Almacén recoge y empaqueta el material según el pedido.",
    steps: ["Recoger material", "Empaquetar", "Marcar como listo"],
  },
  {
    id: "n6",
    orgId: "o1",
    label: "Coordinar envío",
    area: "Operaciones",
    ownerMemberId: "m4",
    estado: "draft",
    posA: { x: 560, y: 392 },
    posB: { x: 452, y: 356 },
    horas: null,
    inter: false,
    sourceInterviewIds: ["i4"],
    desc: "Se agenda el transporte y se avisa al cliente de la fecha.",
    steps: ["Agendar transporte", "Generar albarán", "Avisar al cliente"],
  },
  {
    id: "n7",
    orgId: "o1",
    label: "Facturar",
    area: "Finanzas",
    ownerMemberId: "m5",
    estado: "validated",
    posA: { x: 700, y: 140 },
    posB: { x: 668, y: 206 },
    horas: null,
    inter: true,
    sourceInterviewIds: ["i5", "i4"],
    desc: "Finanzas emite la factura una vez confirmado el envío.",
    steps: ["Generar factura", "Enviar al cliente"],
  },
  {
    id: "n8",
    orgId: "o1",
    label: "Conciliar cobros",
    area: "Finanzas",
    ownerMemberId: "m5",
    estado: "opportunity",
    posA: { x: 856, y: 360 },
    posB: { x: 668, y: 356 },
    horas: "−4 h/sem",
    inter: false,
    sourceInterviewIds: ["i5"],
    desc: "Se cruzan los extractos bancarios con las facturas. Hoy se hace a mano en una hoja de cálculo.",
    steps: ["Descargar extracto", "Cruzar con facturas", "Marcar cobrado"],
  },
  {
    id: "n9",
    orgId: "o1",
    label: "Resolver incidencias",
    area: "Atención",
    ownerMemberId: "m6",
    estado: "opportunity",
    posA: { x: 900, y: 80 },
    posB: { x: 884, y: 206 },
    horas: "−8 h/sem",
    inter: false,
    sourceInterviewIds: ["i6"],
    desc: "Atención recibe, clasifica y reasigna cada incidencia manualmente.",
    steps: ["Recibir incidencia", "Clasificar", "Reasignar al área", "Cerrar"],
  },
];

// ── Edges (Handoffs) ───────────────────────────────────────────────────────────
export const MOCK_EDGES: Handoff[] = [
  { id: "e1", orgId: "o1", fromNodeId: "n1", toNodeId: "n2", dashed: false },
  { id: "e2", orgId: "o1", fromNodeId: "n2", toNodeId: "n3", dashed: false },
  { id: "e3", orgId: "o1", fromNodeId: "n3", toNodeId: "n5", dashed: false },
  { id: "e4", orgId: "o1", fromNodeId: "n4", toNodeId: "n5", dashed: false },
  { id: "e5", orgId: "o1", fromNodeId: "n5", toNodeId: "n6", dashed: false },
  { id: "e6", orgId: "o1", fromNodeId: "n6", toNodeId: "n7", dashed: false },
  { id: "e7", orgId: "o1", fromNodeId: "n7", toNodeId: "n8", dashed: false },
  { id: "e8", orgId: "o1", fromNodeId: "n6", toNodeId: "n9", dashed: false },
  { id: "e9", orgId: "o1", fromNodeId: "n3", toNodeId: "n7", dashed: false },
  { id: "e10", orgId: "o1", fromNodeId: "n9", toNodeId: "n2", dashed: true },
];

// ── Opportunities ──────────────────────────────────────────────────────────────
export const MOCK_OPPS: AIOpportunity[] = [
  {
    id: "op1",
    orgId: "o1",
    rank: 1,
    titulo: "Generación automática de presupuestos",
    areas: ["Comercial", "Compras", "Operaciones"],
    horas: "≈ 6 h/sem",
    impacto: 90,
    frecuencia: 80,
    viabilidad: 70,
    nodeId: "n2",
    evidencia:
      "Tres personas describen rehacer presupuestos a mano, cruzando precios de Compras con plazos de Operaciones.",
    locked: false,
  },
  {
    id: "op2",
    orgId: "o1",
    rank: 2,
    titulo: "Triaje automático de incidencias",
    areas: ["Atención"],
    horas: "≈ 8 h/sem",
    impacto: 80,
    frecuencia: 90,
    viabilidad: 80,
    nodeId: "n9",
    evidencia:
      "Atención clasifica y reasigna cada incidencia manualmente; el 60 % son cuatro tipos repetidos.",
    locked: true,
  },
  {
    id: "op3",
    orgId: "o1",
    rank: 3,
    titulo: "Conciliación de cobros asistida",
    areas: ["Finanzas"],
    horas: "≈ 4 h/sem",
    impacto: 70,
    frecuencia: 60,
    viabilidad: 80,
    nodeId: "n8",
    evidencia:
      "Finanzas cruza extractos bancarios con facturas en una hoja de cálculo cada semana.",
    locked: true,
  },
];

// ── Comments ───────────────────────────────────────────────────────────────────
export interface Comment {
  id: string;
  nodeId: string;
  author: string;
  time: string;
  text: string;
}

export const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    nodeId: "n2",
    author: "Javier León",
    time: "hace 2 d",
    text: "A veces el precio de Compras llega tarde y reenvío el presupuesto dos veces.",
  },
  {
    id: "c2",
    nodeId: "n9",
    author: "Lucía Vidal",
    time: "hace 1 d",
    text: "El 60 % son los mismos cuatro tipos. Esto se podría automatizar fácil.",
  },
];
