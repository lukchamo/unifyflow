# UnifyFlow — Diseño técnico: port a Next.js 16 (demo funcional con mock)

| | |
|---|---|
| **Fecha** | 24 jun 2026 |
| **Estado** | Aprobado para plan de implementación |
| **Origen** | `unifyflow-prd.md` + prototipo en `prototipo/*.dc.html` |
| **Objetivo** | App Next.js 16 funcional con data mock que completa el flujo end-to-end desde los 3 roles, con landing animada (GSAP) y mobile-first en todo |

---

## 1. Objetivo y criterio de éxito

Convertir el prototipo (3 pantallas HTML estáticas) en una aplicación Next.js 16 **funcional con datos mock**, sin backend ni claves, donde un evaluador puede:

1. Ver la **landing animada** (GSAP) y crear una organización desde el modal quick-start.
2. Entrar como cualquiera de los **3 roles** desde un demo launcher.
3. Completar el **loop end-to-end**: crear org → invitar equipo → entrevista IA → ensamblado del mapa (el mapa crece en vivo) → momento espejo → validación humana → detección/priorización de oportunidades IA → paywall → checkout (Stripe simulado) → exportar Radiografía PDF.
4. Hacerlo desde **móvil** (mobile-first) con todas las funcionalidades.

**Criterio de aceptación global:** el loop completo se puede recorrer sin errores, el estado compartido refleja las acciones entre roles, el copy y la estética son fieles al prototipo, y todo funciona en viewport móvil.

---

## 2. Decisiones de alcance (confirmadas con el usuario)

| Decisión | Elección |
|---|---|
| Integraciones | **Todo simulado (mock)**: auth, datos, agente IA guionizado, Stripe y "tiempo real" en cliente |
| Navegación de roles | **Demo launcher** "Entrar como…" (login mágico/Google simulados) |
| Fidelidad | **Port fiel + GSAP completo + mobile-first** en todo |
| Rol Validador | **Reusa el dashboard del Champion**, scoped a su área + acciones de validar/comentar |
| Modo demo | **Ambos**: navegación libre + botón "Tour guiado" que encadena los pasos del loop |
| Persistencia | Zustand + `persist` (localStorage). Botón "Reiniciar demo" |
| Voz en entrevista | UI presente (🎙) marcada "fast-follow"; modalidad **texto** funcional |
| Paywall | **Se añade** (no existe en el prototipo de la app): opp 1 gratis, 2-3 bloqueadas |

---

## 3. Stack

| Capa | Elección |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript + React 19 |
| Estilos | Tailwind 4 + CSS variables de tema (4 paletas) |
| Primitivos UI | Radix UI: Dialog, AlertDialog, Popover, ToggleGroup, Toast, Avatar, Tooltip, Tabs, Progress |
| Mapa | React Flow (`@xyflow/react`): nodos custom, edges sólido/dashed, pan/zoom táctil, controles |
| Animación | GSAP + ScrollTrigger + `@gsap/react` (`useGSAP`), `gsap.matchMedia()` para `prefers-reduced-motion` |
| Estado | Zustand + middleware `persist` (localStorage) |
| Validación | Zod (schemas de entidades + formularios, vía `react-hook-form` + `@hookform/resolvers`) |
| Tipografía | `next/font/google`: Newsreader, IBM Plex Sans, IBM Plex Mono |

Aplica **vercel-react-best-practices**: Server Components por defecto, `"use client"` solo en hojas interactivas (mapa, modal, entrevista, store), `next/font`, `next/image`, code-splitting de React Flow/GSAP, memoización donde haya listas grandes.

---

## 4. Rutas

```
/                    Landing animada (GSAP)
/demo                Demo launcher "Entrar como…" (Admin/Champion · Validador · Entrevistado)
/app                 Dashboard (state machine de 5 pasos): Equipo · Entrevista · Mapa vivo ·
                     Oportunidades · Radiografía. Scoped por rol (?role= o store).
/e/[slug]            Entrevista del invitado: bienvenida+privacidad → 3-4 preguntas → gracias
/yo/procesos         Perfil del colaborador (procesos aportados)
/yo/notificaciones   Bandeja (validar, comentarios, sugerencias de fusión)
/checkout            Stripe simulado → desbloquea las 3 oportunidades
```

El dashboard usa una **state machine de pasos** (no rutas por paso) con la sidebar persistente, igual que el prototipo (`state.screen`). La sidebar colapsa a **drawer** (Radix Dialog) en móvil.

---

## 5. Modelo de datos (Zod schemas) y store

Entidades según PRD §10, validadas con Zod en `lib/schemas/`:

- `Organization` { id, nombre, sector, plan }
- `Member` { id, orgId, nombre, email?, cargo, área, rol: 'admin'|'validador'|'entrevistado', done }
- `Interview` { id, memberId, estado, startedAt?, completedAt?, answers[] }
- `Answer` { id, interviewId, pregunta, respuesta, modalidad: 'texto'|'voz' }
- `ProcessNode` { id, orgId, label, ownerMemberId, área, estado: 'draft'|'validated'|'opportunity', posA{x,y}, posB{x,y}, horas?, inter, sourceInterviewIds[], desc, steps[] }
- `Handoff` (edge) { id, orgId, fromNodeId, toNodeId, dashed }
- `AIOpportunity` { id, orgId, rank, título, áreas[], horas, impacto, frecuencia, viabilidad, nodeId, evidencia, locked }
- `Validation` { id, nodeId, validatorId, acción, timestamp }
- `AgentLog` { id, orgId, tipoDecisión, input, output, modelo, tokens, timestamp }
- `Subscription` { id, orgId, plan, estado, paid }

**Store Zustand** (`lib/store/`): `org`, `team[]`, `interviews[]`, `nodes[]`, `edges[]`, `opps[]`, `validations[]`, `agentLogs[]`, `paywall{paid}`, `theme`, `role`, `mapState{organized, revealed, filter, selectedId}`, `tour{active, step}`. Acciones: `inviteMember`, `submitInterview` (ensambla nodo + log + "realtime"), `validateNode`, `addComment`, `tagForValidation`, `addStep`, `reorganize`, `replay`, `detectOpportunities`, `pay`, `setTheme`, `resetDemo`. Datos derivados (memoizados): `statusText` ("X de 9 validados"), `progressText` ("5 de 7 completadas"), `totalHours` ("≈18h").

---

## 6. Servicios mock

- `services/agent.ts` — agente IA guionizado: `getQuestions(member)` (banco adaptativo por rol/área), `followUp(answer)` (repregunta guionizada), `assembleNode(interview)` (crea/actualiza `ProcessNode` + edges), `prioritizeOpportunities(nodes)`. Cada llamada emite un `AgentLog`. Delays simulados (typing).
- `services/auth.ts` — `signInAs(role)`, `magicLink`, `googleSignIn` (todo simulado, setea `role` en store).
- `services/stripe.ts` — `checkout()` que tras "pago" setea `paywall.paid=true` y `Subscription`.
- `services/realtime.ts` — pub/sub interno (event emitter) para que el mapa del Champion refleje entrevistas completadas sin recargar.

`lib/data/questions.ts`: banco de 3-4 preguntas + repreguntas por área (Comercial, Compras, Operaciones, Finanzas, Atención). Q1 verbatim del prototipo; Q2-4 diseñadas nuevas en el mismo tono. Nombre del invitado inyectado.

---

## 7. Datos mock fieles (de `lib/data/mockData.ts`)

- **Org**: "Distribuciones Robledo" · "Distribución de material eléctrico" · iniciales DR.
- **Equipo (7)**: Marta Ruiz/Comercial/✓, Javier León/Comercial/✓, Nuria Gil/Compras/✓, Andrés Pérez/Operaciones/✓, Carmen Soto/Finanzas/✓, Lucía Vidal/Atención/pendiente, Diego Mora/Operaciones/pendiente. → "5 de 7 completadas".
- **9 nodos** (id, label, área, owner, estado, posA, posB, horas, inter, sources) — tabla exacta del inventario: n1 Captar lead, n2 Elaborar presupuesto (opp, −6h), n3 Cerrar pedido, n4 Reponer stock, n5 Preparar pedido, n6 Coordinar envío, n7 Facturar, n8 Conciliar cobros (opp, −4h), n9 Resolver incidencias (opp, −8h).
- **10 edges**: n1→n2, n2→n3, n3→n5, n4→n5, n5→n6, n6→n7, n7→n8, n6→n9, n3→n7, n9→n2 (dashed).
- **3 oportunidades**: 01 Generación automática de presupuestos (≈6h, 9/8/7), 02 Triaje automático de incidencias (≈8h, 8/9/8, **locked**), 03 Conciliación de cobros asistida (≈4h, 7/6/8, **locked**).
- **Detalles, pasos y comentarios** de cada nodo: verbatim del inventario (`seedDetails`, `seedComments`).
- **Colores por área**: Comercial #3C7D6E, Compras #5E6E9E, Operaciones #A8773C, Finanzas #4F8B86, Atención #9E6E8C.

---

## 8. Tema y tokens

CSS variables en `:root`, conmutables por paleta (default Salvia):

| Paleta | accent | accent-dk | accent-tint |
|---|---|---|---|
| Salvia (default) | #3C7D6E | #2C6457 | #E7F0ED |
| Azul | #3F6FA6 | #2F5687 | #E7EEF6 |
| Terracota | #B05E45 | #8E4634 | #F6E9E4 |
| Lavanda | #6E5C9E | #564785 | #ECE8F4 |

Neutros, semánticos de estado de nodo (validated/draft/opportunity) y de chat según las tablas del inventario. Keyframes globales `uf-pulse` (puntos "En vivo"/typing) y `uf-rise` (paneles/toast). Fuentes: Newsreader (display), IBM Plex Sans (UI), IBM Plex Mono (labels uppercase).

---

## 9. Animaciones (GSAP)

- **Landing**: reveals on-scroll por sección (ScrollTrigger), stagger; showcase 3 rows (burbujas chat escalonadas, mapa que se "dibuja solo" nodos→edges→badges, chip Borrador→✓Validado crossfade); hero con entrada coreografiada; `gsap.matchMedia()` desactiva motion con `prefers-reduced-motion`.
- **Momento espejo (mapa)**: reveal en cascada de los 9 nodos (delay i·55ms) → edges fade-in (~845ms) → fin (~1235ms). Hook `useMapReveal`.
- **Reorganizar con IA**: edges off → nodos animan de posA→posB (transición left/top .85s) + badges horas/cruces → edges on. Hook `useReorganize`.
- **Entrevista**: typing dots `uf-pulse`, entrada de burbujas, avance de barra de progreso.
- Carga diferida de GSAP/ScrollTrigger; React Flow en client component con `dynamic`.

---

## 10. Pantallas (fidelidad al inventario)

Cada pantalla replica copy, layout y estados del inventario de los 3 agentes:

- **Landing**: Nav · Hero+HeroMap · TrustStrip · Problema (3 cards) · Cómo funciona (4 pasos) · Showcase (3 rows animadas) · Momento espejo (split oscuro, métricas ≥70%/≥80%/<24h) · Diferenciador (tabla) · Principios (3) · Anticipo/paywall · Precio (3 planes) · CTA · Footer · Modal quick-start (start→link, genera enlace, copia, toast).
- **Dashboard** (sidebar 5 pasos + footer org GDPR):
  - **Equipo**: form org/sector + lista 7 miembros con estado + invitar + CTAs.
  - **Entrevista** (preview): mockup móvil con chat, banner privacidad, CTA.
  - **Mapa vivo**: React Flow con 9 nodos/10 edges, header ("Así trabaja … hoy", "Se dibujó solo a partir de 7 entrevistas. X de 9 nodos validados"), pill "En vivo", Repetir, Reorganizar con IA; FilterBar (Todos/Borrador/Validado/Oportunidad IA) + leyenda; **NodeDetailPanel** (proceso+pasos, procedencia, validación, compartir, etiquetar, comentarios).
  - **Oportunidades**: 3 cards (rank, áreas, horas, barras impacto/frecuencia/viabilidad, evidencia, "Construir esto") con **paywall** en 2-3; panel oscuro lateral ("Si actúas hoy", ≈18h, "Generar la radiografía").
  - **Radiografía**: documento export (mini-mapa validado, inventario 9 procesos, oportunidades priorizadas, pie trazabilidad) + panel "Exportar PDF" (`window.print()`) + "Próximo paso".
- **Entrevista del invitado** (`/e/[slug]`): WelcomeScreen (bienvenida + panel "qué guardamos y quién lo ve" + captura nombre/cargo/área prellenados) → InterviewScreen (header progreso "Pregunta N de 4", burbujas agente/usuario, typing, composer texto+🎙) → ThanksScreen ("Gracias, Andrés", "Dibujando el mapa…", CTA crear cuenta). Al completar: **ensambla nodo en el store → aparece en el mapa del Champion**.
- **Perfil** (`/yo/procesos`) y **Notificaciones** (`/yo/notificaciones`): según inventario (procesos aportados con estados; bandeja de validación/comentarios/fusión).

---

## 11. Mobile-first

- Tailwind mobile-first; breakpoints `sm/md/lg`.
- Sidebar → drawer (Radix Dialog) con botón hamburguesa en `/app` móvil.
- Mapa: React Flow `fitView`, `panOnScroll`, `zoomOnPinch`, controles táctiles; NodeDetailPanel como bottom sheet (Radix) en móvil.
- Entrevista: diseñada mobile-first (es donde vive); el `PhoneFrame` solo se usa para los previews dentro de desktop.
- Landing: grids colapsan a 1 columna; tipografía fluida.

---

## 12. Componentes (resumen de árbol)

Ver árbol en §D del diseño presentado: `components/{landing,app-shell,steps,map,interview,ui}` + `lib/{data,schemas,services,store,theme,animation}`. Cada unidad con una responsabilidad clara, presentacional sobre primitivos Radix, datos vía store/props.

---

## 13. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| React Flow + posA/posB + reorganize | Hook dedicado `useReorganize` con `setNodes`; transición CSS en nodo custom |
| GSAP + Server Components | Animaciones en client components hoja con `useGSAP`; carga diferida |
| Estado compartido entre roles | Único store persistido; `services/realtime` para reflejar cambios sin recargar |
| Fidelidad de copy | Inventario verbatim en `lib/data/content.ts` (landing) y `mockData.ts` (app) |
| Tamaño del scope | Construir por fases (landing → shell → mapa → entrevista → oportunidades/paywall → radiografía → tour/mobile/pulido) |

---

## 14. Fuera de alcance (no-goals)

Backend real, Firebase/Gemini/Stripe reales, captura de pantalla, multi-idioma, app nativa, voz funcional, multi-tenant real. Todo simulado o diferido, según PRD §6.2.
