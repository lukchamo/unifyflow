# UnifyFlow Next.js 16 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the UnifyFlow HTML prototype to a functional Next.js 16 app with mock data that completes the full end-to-end loop across 3 roles, with a GSAP-animated landing and mobile-first UI.

**Architecture:** Next.js 16 App Router. A single persisted Zustand store holds all mock state; mock services (agent, auth, stripe, realtime) mutate it. The logic layer (Zod schemas, store actions, services, derived selectors) is unit-tested with Vitest. UI is built on Radix primitives + Tailwind 4, React Flow for the map, GSAP for animation. The dashboard is a step state-machine; roles scope what's shown.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind 4, Radix UI, `@xyflow/react` (React Flow), GSAP + `@gsap/react`, Zustand (+persist), Zod, react-hook-form, Vitest + Testing Library.

## Global Constraints

- Next.js **16** (App Router), React 19, TypeScript strict.
- Tailwind **4** with CSS variables for theming.
- All integrations **mocked** — no backend, no API keys, no network calls. Persist via `localStorage`.
- Default theme palette **Salvia**: `--accent:#3C7D6E`, `--accent-dk:#2C6457`, `--accent-tint:#E7F0ED`. Alt palettes: Azul `#3F6FA6/#2F5687/#E7EEF6`, Terracota `#B05E45/#8E4634/#F6E9E4`, Lavanda `#6E5C9E/#564785/#ECE8F4`.
- Fonts: **Newsreader** (serif display), **IBM Plex Sans** (UI), **IBM Plex Mono** (uppercase labels) via `next/font/google`.
- Copy must be **verbatim** from the prototype inventory (Spanish). Source of truth: `lib/data/content.ts` (landing) and `lib/data/mockData.ts` (app).
- Org: "Distribuciones Robledo" · sector "Distribución de material eléctrico" · initials "DR".
- Area colors: Comercial `#3C7D6E`, Compras `#5E6E9E`, Operaciones `#A8773C`, Finanzas `#4F8B86`, Atención `#9E6E8C`.
- Node state styles: validated (dot `--accent`, pill text `--accent-dk` on `--accent-tint`), draft (ring `#BBC0BC`, pill `#7A807C` on `#EEF1EF`), opportunity (dot `#B58238`, bg `#FCF8EE`, pill `#8A6420` on `#F4E8CE`).
- Respect `prefers-reduced-motion` everywhere (gsap.matchMedia + CSS).
- Server Components by default; `"use client"` only on interactive leaves. `next/font`, code-split React Flow + GSAP.
- Derived values are computed, never hardcoded: "X de 9 nodos validados", "5 de 7 completadas", "≈18h".
- Commit after every task with conventional-commit messages.

---

## Phase 0 — Project foundation

### Task 0.1: Scaffold Next.js 16 + Tailwind 4 + tooling

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `vitest.config.ts`, `vitest.setup.ts`, `.gitignore`, `eslint.config.mjs`
- Create scaffold dir: `unifyflow-app/` (the Next project root, since the repo root holds the PRD/prototype). All app paths below are relative to `unifyflow-app/`.

**Interfaces:**
- Produces: a runnable Next 16 app at `unifyflow-app/`, `npm run dev`, `npm test`, `npm run build`, `npm run typecheck`.

- [ ] **Step 1: Scaffold**

```bash
cd "/Users/lukchamo/Developer/UnifyFlow Product Requirements"
npx create-next-app@latest unifyflow-app --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --no-turbopack --yes
cd unifyflow-app
npm i @xyflow/react gsap @gsap/react zustand zod react-hook-form @hookform/resolvers \
  @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-toggle-group \
  @radix-ui/react-toast @radix-ui/react-avatar @radix-ui/react-tooltip \
  @radix-ui/react-tabs @radix-ui/react-progress @radix-ui/react-scroll-area
npm i -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 2: Add scripts + vitest config**

In `package.json` scripts add: `"test": "vitest run"`, `"test:watch": "vitest"`, `"typecheck": "tsc --noEmit"`.

`vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", globals: true, setupFiles: ["./vitest.setup.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```
`vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Sanity test**

`lib/__smoke__/smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";
describe("smoke", () => { it("runs", () => { expect(1 + 1).toBe(2); }); });
```

- [ ] **Step 4: Verify**

Run: `npm test` → PASS. Run: `npm run build` → succeeds. Run: `npm run typecheck` → no errors.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: scaffold Next.js 16 app with tooling"
```

### Task 0.2: Fonts + theme tokens + global CSS

**Files:**
- Create: `lib/theme/palettes.ts`, `app/globals.css` (extend), `app/fonts.ts`
- Test: `lib/theme/palettes.test.ts`

**Interfaces:**
- Produces: `PALETTES: Record<PaletteName, {accent:string; accentDk:string; accentTint:string}>`, `PaletteName = 'Salvia'|'Azul'|'Terracota'|'Lavanda'`, `applyPalette(name: PaletteName): void` (sets CSS vars on `document.documentElement`). Fonts exported as `newsreader`, `plexSans`, `plexMono`.

- [ ] **Step 1: Write the failing test**

```ts
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
```

- [ ] **Step 2: Run → FAIL** (`npx vitest run lib/theme/palettes.test.ts`).

- [ ] **Step 3: Implement** `lib/theme/palettes.ts` with the 4 palettes (exact hex from Global Constraints) and `applyPalette` writing `--accent/--accent-dk/--accent-tint`.

- [ ] **Step 4: Run → PASS.**

- [ ] **Step 5:** In `app/fonts.ts` configure the 3 Google fonts with CSS variables `--font-newsreader/--font-sans/--font-mono`; wire into `app/layout.tsx` and `globals.css`. Add `:root` defaults (Salvia), neutral tokens, and keyframes `uf-pulse` and `uf-rise`. Set `body` bg `#FBFCFB`, text `#1C201E`, font sans; `::selection rgba(60,125,110,.16)`; `@media (prefers-reduced-motion)` zeroes animation durations.

- [ ] **Step 6: Verify** `npm run build` succeeds and fonts load.

- [ ] **Step 7: Commit** `feat: theme palettes, fonts, global tokens`.

---

## Phase 1 — Data & logic layer (TDD)

### Task 1.1: Zod schemas for all entities

**Files:**
- Create: `lib/schemas/index.ts`
- Test: `lib/schemas/schemas.test.ts`

**Interfaces:**
- Produces Zod schemas + inferred types: `OrganizationSchema/Organization`, `MemberSchema/Member` (`rol: 'admin'|'validador'|'entrevistado'`, `area`, `done:boolean`), `InterviewSchema/Interview`, `AnswerSchema/Answer`, `ProcessNodeSchema/ProcessNode` (`estado: 'draft'|'validated'|'opportunity'`, `posA/posB:{x:number;y:number}`, `horas:string|null`, `inter:boolean`, `sourceInterviewIds:string[]`, `desc:string`, `steps:string[]`), `HandoffSchema/Handoff` (`dashed:boolean`), `AIOpportunitySchema/AIOpportunity` (`rank:number`, `impacto/frecuencia/viabilidad:number`, `locked:boolean`), `ValidationSchema/Validation`, `AgentLogSchema/AgentLog`, `SubscriptionSchema/Subscription`. Also `RoleSchema = z.enum(['admin','validador','entrevistado'])`.

- [ ] **Step 1: Write failing tests** — valid fixtures parse; invalid `estado`/`rol` throw; `ProcessNode` requires `posA` & `posB`.

```ts
import { describe, it, expect } from "vitest";
import { ProcessNodeSchema, MemberSchema } from "./index";
describe("schemas", () => {
  it("accepts a valid node", () => {
    expect(() => ProcessNodeSchema.parse({
      id: "n1", orgId: "o1", label: "Captar lead", ownerMemberId: "m1",
      area: "Comercial", estado: "validated", posA: { x: 70, y: 36 }, posB: { x: 16, y: 56 },
      horas: null, inter: false, sourceInterviewIds: ["i1"], desc: "…", steps: ["a"],
    })).not.toThrow();
  });
  it("rejects bad estado", () => {
    expect(() => ProcessNodeSchema.parse({ estado: "nope" } as any)).toThrow();
  });
  it("rejects bad role", () => {
    expect(() => MemberSchema.parse({ rol: "ceo" } as any)).toThrow();
  });
});
```

- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** all schemas in `lib/schemas/index.ts`.
- [ ] **Step 4: Run → PASS.**
- [ ] **Step 5: Commit** `feat: zod schemas for all entities`.

### Task 1.2: Mock seed data (app)

**Files:**
- Create: `lib/data/mockData.ts`
- Test: `lib/data/mockData.test.ts`

**Interfaces:**
- Produces: `MOCK_ORG`, `MOCK_TEAM: Member[]` (7), `MOCK_NODES: ProcessNode[]` (9), `MOCK_EDGES: Handoff[]` (10), `MOCK_OPPS: AIOpportunity[]` (3), `MOCK_COMMENTS`, `AREA_COLORS: Record<string,string>`. Every item validates against its schema.

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from "vitest";
import { MOCK_NODES, MOCK_EDGES, MOCK_TEAM, MOCK_OPPS, AREA_COLORS } from "./mockData";
import { ProcessNodeSchema } from "@/lib/schemas";
describe("mockData", () => {
  it("has 9 nodes, 10 edges, 7 members, 3 opps", () => {
    expect(MOCK_NODES).toHaveLength(9);
    expect(MOCK_EDGES).toHaveLength(10);
    expect(MOCK_TEAM).toHaveLength(7);
    expect(MOCK_OPPS).toHaveLength(3);
  });
  it("nodes validate", () => { MOCK_NODES.forEach(n => expect(() => ProcessNodeSchema.parse(n)).not.toThrow()); });
  it("n2 is an opportunity with -6 h/sem", () => {
    const n2 = MOCK_NODES.find(n => n.id === "n2")!;
    expect(n2.estado).toBe("opportunity"); expect(n2.horas).toBe("−6 h/sem");
  });
  it("n9→n2 edge is dashed", () => {
    expect(MOCK_EDGES.find(e => e.fromNodeId === "n9" && e.toNodeId === "n2")!.dashed).toBe(true);
  });
  it("opps 2 and 3 are locked", () => {
    expect(MOCK_OPPS.find(o => o.rank === 2)!.locked).toBe(true);
    expect(MOCK_OPPS.find(o => o.rank === 3)!.locked).toBe(true);
  });
});
```

- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** `mockData.ts` transcribing the inventory tables verbatim (9 nodes w/ posA/posB/horas/inter/sources/desc/steps; 10 edges incl. dashed n9→n2; 7 members w/ done flags; 3 opps w/ rank/áreas/horas/impacto·frecuencia·viabilidad/evidencia/locked; seed comments on n2 & n9). Mark opp rank 1 `locked:false`, ranks 2-3 `locked:true`.
- [ ] **Step 4: Run → PASS.**
- [ ] **Step 5: Commit** `feat: faithful mock seed data for the app`.

### Task 1.3: Landing content constants

**Files:**
- Create: `lib/data/content.ts`
- Test: `lib/data/content.test.ts`

**Interfaces:**
- Produces typed objects for every landing section: `NAV`, `HERO`, `TRUST_STRIP`, `PROBLEM`, `HOW_STEPS`, `SHOWCASE`, `MIRROR`, `DIFFERENTIATOR`, `PRINCIPLES`, `PREVIEW`, `PRICING`, `FINAL_CTA`, `FOOTER`, `MODAL_COPY`. All copy verbatim from the landing inventory.

- [ ] **Step 1: Write failing test** asserting key verbatim strings, e.g. `HERO.h1 === "El espejo que tu empresa nunca tuvo."`, `HOW_STEPS` length 4, `PRICING.plans` length 3 with `priceFrom` default `"desde €490"`.
- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** `content.ts` transcribing §1.1–1.14 of the landing inventory verbatim.
- [ ] **Step 4: Run → PASS.**
- [ ] **Step 5: Commit** `feat: landing content constants`.

### Task 1.4: Adaptive interview question bank

**Files:**
- Create: `lib/data/questions.ts`
- Test: `lib/data/questions.test.ts`

**Interfaces:**
- Produces: `getQuestions(member: {nombre:string; cargo:string; area:string}): {id:string; text:string}[]` returning 4 questions, Q1 personalized with `member.nombre`. Q1 verbatim: `Cuéntame: ¿qué haces tú cuando entra un pedido nuevo de un cliente?` for Operaciones; per-area variants for Comercial/Compras/Finanzas/Atención. Also `getFollowUp(area:string): string`.

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from "vitest";
import { getQuestions } from "./questions";
describe("questions", () => {
  it("returns 4 questions for any role", () => {
    expect(getQuestions({ nombre: "Andrés", cargo: "Responsable de almacén", area: "Operaciones" })).toHaveLength(4);
  });
  it("personalizes nothing forbidden and stays in Spanish", () => {
    const qs = getQuestions({ nombre: "Andrés", cargo: "x", area: "Comercial" });
    expect(qs[0].text.length).toBeGreaterThan(10);
  });
});
```

- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** the per-area bank (4 questions each + follow-up), Q1 verbatim where it exists.
- [ ] **Step 4: Run → PASS.**
- [ ] **Step 5: Commit** `feat: adaptive interview question bank`.

### Task 1.5: Mock agent service

**Files:**
- Create: `lib/services/agent.ts`
- Test: `lib/services/agent.test.ts`

**Interfaces:**
- Consumes: `getQuestions`, schemas, `AREA_COLORS`.
- Produces: `assembleNode(interview: Interview, member: Member): { node: ProcessNode; edges: Handoff[]; log: AgentLog }` (creates a draft node positioned near the member's area, links it to an existing area node), `prioritizeOpportunities(nodes: ProcessNode[]): AIOpportunity[]` (sorts by impacto×frecuencia×viabilidad), and `makeLog(tipo, input, output): AgentLog`. Pure functions (no timers) so they're testable; UI adds delays.

- [ ] **Step 1: Write failing test** — `assembleNode` returns a `draft` node validating against `ProcessNodeSchema`, an `AgentLog` with `tipoDecisión: "ensamblado"`, and at least one edge. `prioritizeOpportunities` returns descending by score.
- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** pure functions.
- [ ] **Step 4: Run → PASS.**
- [ ] **Step 5: Commit** `feat: mock AI agent service`.

### Task 1.6: Zustand store + derived selectors

**Files:**
- Create: `lib/store/useAppStore.ts`, `lib/store/selectors.ts`
- Test: `lib/store/store.test.ts`

**Interfaces:**
- Produces: `useAppStore` (Zustand + persist key `"unifyflow"`) with state `{org, team, interviews, nodes, edges, opps, validations, agentLogs, subscription, theme, role, mapState:{organized,revealed,filter,selectedId}, tour:{active,step}}` seeded from mockData. Actions: `inviteMember(email)`, `submitInterview(memberId, answers)`, `validateNode(id, validatorId)`, `addComment(nodeId, text)`, `tagForValidation(nodeId, memberId)`, `addStep(nodeId, step)`, `reorganize()`, `replay()`, `detectOpportunities()`, `pay()`, `setTheme(name)`, `setRole(role)`, `setFilter(f)`, `selectNode(id)`, `startTour()/nextTourStep()/endTour()`, `resetDemo()`. Selectors (`selectors.ts`): `selectValidatedCount(s)`, `selectStatusText(s)` → "X de 9 nodos validados", `selectProgressText(s)` → "N de 7 completadas", `selectTotalHours(s)` → "≈ 18 h", `selectVisibleNodesForRole(s)`.

- [ ] **Step 1: Write failing tests** (use `useAppStore.getState()` / `setState`):
  - initial: 9 nodes, `selectStatusText` = "4 de 9 nodos validados", `selectProgressText` = "5 de 7 completadas".
  - `validateNode("n4","m6")` → n4 estado becomes "validated", count → 5, a `Validation` recorded.
  - `pay()` → subscription paid, all opps `locked:false`.
  - `submitInterview` → adds a node + an `AgentLog`.
  - `resetDemo()` → back to seed.
- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** store + selectors.
- [ ] **Step 4: Run → PASS.**
- [ ] **Step 5: Commit** `feat: zustand store + derived selectors`.

### Task 1.7: Mock auth, stripe, realtime services

**Files:**
- Create: `lib/services/auth.ts`, `lib/services/stripe.ts`, `lib/services/realtime.ts`
- Test: `lib/services/services.test.ts`

**Interfaces:**
- `auth.ts`: `signInAs(role)`, `generateTeamLink(company)` (slugify NFD + base36 4-char code → `unifyflow.eu/e/<slug>-<code>`).
- `stripe.ts`: `checkout(): Promise<{ ok: true }>` that resolves then calls store `pay()`.
- `realtime.ts`: tiny event emitter `on/emit/off` used to notify the map when an interview completes.

- [ ] **Step 1: Write failing test** — `generateTeamLink("Distribuciones Robledo")` matches `/^unifyflow\.eu\/e\/distribuciones-robledo-[a-z0-9]{4}$/`; emitter `on`+`emit` delivers payload.
- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run → PASS.**
- [ ] **Step 5: Commit** `feat: mock auth, stripe, realtime services`.

---

## Phase 2 — UI primitives & shells

> UI tasks verify via `npm run build` + `npm run typecheck` + a render smoke test (Testing Library) asserting key copy renders. Visual fidelity is checked against the inventory.

### Task 2.1: UI primitives on Radix

**Files:**
- Create: `components/ui/{Button,Pill,Badge,Avatar,Field,StatusPill,ProgressSegments,PhoneFrame,BrowserFrame,ThemeProvider,ToastViewport}.tsx`
- Test: `components/ui/ui.test.tsx`

**Interfaces:**
- Produces: `Button` (variant `primary|secondary|ghost`), `Pill`, `Badge`, `Avatar` (initials from name), `Field` (label uppercase mono + input), `StatusPill` (`estado` → label "Validado/Borrador/Oportunidad IA" + colors), `ProgressSegments` (n total, k active), `PhoneFrame`/`BrowserFrame` (chrome), `ThemeProvider` (applies palette + persists), Radix `Toast` viewport bound to store toast.

- [ ] **Step 1: Render test** — `StatusPill estado="opportunity"` shows "Oportunidad IA"; `Avatar name="Marta Ruiz"` shows "MR".
- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** primitives with token classes.
- [ ] **Step 4: Run → PASS;** `npm run build`.
- [ ] **Step 5: Commit** `feat: UI primitives on Radix`.

### Task 2.2: App shell (sidebar + mobile drawer)

**Files:**
- Create: `components/app-shell/{Sidebar,NavItem,OrgFooter,MobileDrawer,AppShell}.tsx`
- Test: `components/app-shell/shell.test.tsx`

**Interfaces:**
- Consumes: store `role`, step state.
- Produces: `AppShell` rendering sidebar (logo rombo + "UnifyFlow" + "Radiografía de procesos"; nav "El recorrido" with 5 items 1-Equipo…5-Radiografía; OrgFooter "DR · Distribuciones Robledo · Distribución de material eléctrico · Datos en la UE · GDPR"). On `<md`, sidebar collapses into Radix Dialog drawer with hamburger. Active item styling per tokens. Validador role hides steps 1/2 and deep-links to Mapa.

- [ ] **Step 1: Render test** — all 5 nav labels present; OrgFooter shows GDPR text.
- [ ] **Step 2: Run → FAIL.** **Step 3: Implement.** **Step 4: PASS + build.**
- [ ] **Step 5: Commit** `feat: app shell with responsive sidebar`.

---

## Phase 3 — The live map (React Flow)

### Task 3.1: Custom node + edge + map canvas

**Files:**
- Create: `components/map/{ProcessNode,ProcessFlow,nodeStateStyles,edgeStyles}.tsx`, `components/map/useMapData.ts`
- Test: `components/map/map.test.tsx`

**Interfaces:**
- Consumes: store nodes/edges, `mapState`, `AREA_COLORS`.
- Produces: `ProcessFlow` (client, `dynamic` import, `fitView`, pan/zoom/pinch) rendering 9 custom `ProcessNode`s (dot + area chip + label + conditional badges horas/cruce/notas/validación-pedida) and 10 edges (dashed n9→n2; connected-to-selected highlight `--accent`/width 2.2, others opacity .16). `useMapData` maps store → React Flow `nodes/edges`, choosing `posA` vs `posB` from `mapState.organized`.

- [ ] **Step 1: Render test** — renders 9 nodes incl. "Elaborar presupuesto"; dashed edge present.
- [ ] **Step 2: Run → FAIL.** **Step 3: Implement.** **Step 4: PASS + build.**
- [ ] **Step 5: Commit** `feat: react flow map with custom nodes/edges`.

### Task 3.2: Map header, filter bar, reveal & reorganize animations

**Files:**
- Create: `components/map/{MapHeader,FilterBar}.tsx`, `lib/animation/useMapReveal.ts`, `lib/animation/useReorganize.ts`
- Test: `components/map/mapheader.test.tsx`, `lib/animation/reveal.test.ts`

**Interfaces:**
- Consumes: store actions `reorganize/replay/setFilter/selectNode`, selectors.
- Produces: `MapHeader` (kicker "Momento espejo · paso 3", title "Así trabaja Distribuciones Robledo hoy.", subtitle "Se dibujó solo a partir de 7 entrevistas. {statusText}.", pill "En vivo" pulsing, "↺ Repetir", "✦ Reorganizar con IA" → "✓ Reorganizado por IA"). `FilterBar` (Radix ToggleGroup: Todos/Borrador/Validado/Oportunidad IA + legend). `useMapReveal` runs the staggered cascade (nodes delay i·55ms → edges ~845ms → done ~1235ms; honor reduced-motion). `useReorganize` animates posA→posB and toggles badges.

- [ ] **Step 1: Test** — `useMapReveal` timing helper returns expected ms for n=9 (`edgesAt(9)===845`, `doneAt(9)===1235`, reduced → 160/240). MapHeader shows derived statusText.
- [ ] **Step 2: Run → FAIL.** **Step 3: Implement.** **Step 4: PASS + build.**
- [ ] **Step 5: Commit** `feat: map header, filters, reveal & reorganize animations`.

### Task 3.3: Node detail panel (validate/comment/share/tag/steps)

**Files:**
- Create: `components/map/{NodeDetailPanel,SharePopover,MentionPicker,CommentList,CommentComposer}.tsx`
- Test: `components/map/nodepanel.test.tsx`

**Interfaces:**
- Consumes: store `selectedId`, actions `validateNode/addComment/tagForValidation/addStep`, services `auth.copyLink`.
- Produces: `NodeDetailPanel` (Radix Dialog on desktop, bottom Sheet on mobile) with sections El proceso (desc + numbered steps + add step), Procedencia (owner + "Aparece en N entrevistas"), Validación (draft→"Validar este proceso"; validated→"✓ Confirmado por tu equipo"; opportunity→"Aquí la IA ahorra tiempo · ver paso 4 →"; "@ Etiquetar a alguien para validar"), Compartir popover (link `unifyflow.eu/r/dr-{id}9a2` + Copiar + toast), Comentarios (seed + composer). Validador role surfaces validate/comment as primary.

- [ ] **Step 1: Test** — selecting a draft node shows "Validar este proceso"; clicking it flips StatusPill to "Validado" and bumps statusText. Comment composer appends "Tú · ahora".
- [ ] **Step 2: Run → FAIL.** **Step 3: Implement.** **Step 4: PASS + build.**
- [ ] **Step 5: Commit** `feat: node detail panel with validation/comments/share`.

### Task 3.4: Mapa step assembly

**Files:**
- Create: `components/steps/MapStep.tsx`
- Modify: `app/app/page.tsx` (route map step)
- Test: covered by 3.1–3.3 render + manual.

- [ ] **Step 1:** Compose MapHeader + FilterBar + ProcessFlow + NodeDetailPanel into `MapStep`; subscribe to `realtime` so a completed interview pushes a new node live.
- [ ] **Step 2: Verify** build + render; selecting/validating/reorganizing all work.
- [ ] **Step 3: Commit** `feat: assemble live map step`.

---

## Phase 4 — Dashboard steps

### Task 4.1: Equipo (onboarding) step

**Files:** Create `components/steps/TeamStep.tsx`, `components/steps/{TeamMemberRow,InviteRow}.tsx`; Test `components/steps/team.test.tsx`.

**Interfaces:** Consumes store team + `inviteMember`. Renders kicker "Paso 1 · sin configuración", h1 "Empecemos por tu equipo.", org/sector read-only, "Equipo invitado · {progressText}", 7 member rows w/ StatusPill ("Entrevista lista"/"Pendiente"), invite row (placeholder "email@persona.com · pega un enlace para invitar" + "Añadir"), CTAs "Ver el mapa vivo →" / "Previsualizar la entrevista".

- [ ] Test: 7 rows render; progress "5 de 7 completadas"; inviting adds a pending row → "6 de 8…". → FAIL → implement → PASS → build.
- [ ] Commit `feat: team/onboarding step`.

### Task 4.2: Entrevista preview step

**Files:** Create `components/steps/InterviewStep.tsx` reusing `PhoneFrame` + chat bubbles + privacy banner. Test render of verbatim Q1 + privacy banner copy.

- [ ] Test → FAIL → implement (kicker "Paso 2 · asíncrono · < 5 min", h1 "La entrevista que se siente como una charla.", phone mock with 2 agent + 1 user bubble verbatim, typing dots, "Voz por Gemini Live — fast-follow", CTA "Ver cómo se dibuja el mapa →") → PASS → build → Commit `feat: interview preview step`.

### Task 4.3: Oportunidades step + paywall

**Files:** Create `components/steps/OpportunitiesStep.tsx`, `components/steps/{OppCard,MetricBar,SummaryPanel,Paywall}.tsx`; Test `opportunities.test.tsx`.

**Interfaces:** Consumes store opps + `subscription.paid`. Renders kicker "Paso 4 · el gancho", h1 "Dónde aplicar IA primero.", 3 OppCards (rank, áreas, horas, 3 MetricBars impacto/frecuencia/viabilidad shown as /10, evidence, "Construir esto →"). **Paywall:** if `!paid`, opp 1 fully visible; opps 2-3 blurred with lock overlay "Oportunidades 2 y 3, bloqueadas" + "Desbloquear las 3 →" → `/checkout`. Dark SummaryPanel ("Si actúas hoy", "≈ 18 h", list, "Generar la radiografía →").

- [ ] Test: when not paid, 2 cards blurred + unlock CTA; after `pay()`, all 3 unblurred. → FAIL → implement → PASS → build → Commit `feat: opportunities step with paywall`.

### Task 4.4: Radiografía step + PDF export

**Files:** Create `components/steps/RadiographyStep.tsx`, `components/steps/{DocumentSheet,ExportPanel}.tsx`; print CSS in `globals.css`. Test render of inventory list (9) + total.

**Interfaces:** Consumes nodes/opps/selectors. Renders document (kicker "Radiografía de procesos + IA", h1 org name, "…· 24 jun 2026", mini-map chain Comercial→Presupuesto·IA→Operaciones→Finanzas, "Inventario de procesos" (9), "Oportunidades priorizadas" + "Potencial total ≈ 18 h/semana", footer "Validado por {n} personas · cada nodo es trazable a su entrevista"). ExportPanel "Exportar PDF" → `window.print()`; "Enlace compartible".

- [ ] Test: lists 9 inventory items, total "≈ 18 h/semana"; export button calls a passed `onExport`. → FAIL → implement → PASS → build → Commit `feat: radiography step + PDF export`.

### Task 4.5: Dashboard orchestrator (step state-machine)

**Files:** Create `app/app/page.tsx`, `components/steps/DashboardSteps.tsx`; Test `dashboard.test.tsx`.

**Interfaces:** Client page reading `mapState`/role; renders AppShell + active step; sidebar nav switches step; deep-link via `?step=`. Validador starts on Mapa.

- [ ] Test: default renders Equipo; clicking "3 Mapa vivo" renders MapHeader. → FAIL → implement → PASS → build → Commit `feat: dashboard step orchestrator`.

---

## Phase 5 — Interviewee flow

### Task 5.1: Interview machine (welcome → questions → thanks)

**Files:** Create `app/e/[slug]/page.tsx`, `components/interview/{WelcomeScreen,InterviewScreen,AgentBubble,UserBubble,TypingIndicator,Composer,ThanksScreen}.tsx`, `components/interview/useInterview.ts`; Test `interview.test.tsx`.

**Interfaces:** Consumes `getQuestions`, store `submitInterview`. `useInterview` is a state machine `welcome → q[i] → thanks` with `answers[]`, `isTyping`, advancing on submit; on finish calls `submitInterview` (assembles node + emits realtime). Mobile-first. WelcomeScreen has the privacy panel "Qué guardamos y quién lo ve" (3 bullets verbatim) + prefilled nombre/cargo/área (Andrés Pérez / Responsable de almacén / Operaciones). InterviewScreen: progress "Pregunta N de 4" + ProgressSegments, agent/user bubbles, typing, Composer (text + 🎙 disabled w/ "fast-follow" tooltip + send →). ThanksScreen: "Gracias, Andrés.", "Dibujando el mapa…" pill, "Crear mi cuenta" CTA.

- [ ] Test: completing all 4 questions reaches ThanksScreen and calls `submitInterview` once with 4 answers; store gains a node. → FAIL → implement → PASS → build → Commit `feat: interviewee flow`.

### Task 5.2: Perfil + Notificaciones

**Files:** Create `app/yo/procesos/page.tsx`, `app/yo/notificaciones/page.tsx`, `components/interview/{ProfileView,ProcessRow,AddProcessCard,NotificationsPanel,NotificationCard}.tsx`; Test render of process rows + notification cards.

**Interfaces:** Profile lists aported processes (Preparar pedido/Coordinar envío/Recepción de mercancía/Control de incidencias) with StatusPills + "+ Indicar un proceso nuevo" + add card. Notifications: 3 cards (verify "Elaborar presupuesto", comment from Lucía on "Coordinar envío", merge suggestion from Javier) verbatim; "Verificar" deep-links to the node in the map.

- [ ] Test → FAIL → implement → PASS → build → Commit `feat: collaborator profile + notifications`.

---

## Phase 6 — Landing (GSAP)

### Task 6.1: Static landing sections

**Files:** Create `app/page.tsx`, `components/landing/{Nav,Hero,HeroMap,TrustStrip,Problem,HowItWorks,MirrorMoment,Differentiator,Principles,Preview,Pricing,FinalCTA,Footer}.tsx`; Test `landing.test.tsx`.

**Interfaces:** Consumes `content.ts`. Each section renders verbatim copy + responsive grids (collapse to 1 col on mobile). HeroMap is a static styled version of the live map (4 nodes). Preview shows the unlocked opp 1 + blurred 2-3 with lock.

- [ ] Test: renders H1 "El espejo que tu empresa nunca tuvo.", 4 how-it-works steps, 3 pricing plans. → FAIL → implement → PASS → build → Commit `feat: static landing sections`.

### Task 6.2: Quick-start modal + toast

**Files:** Create `components/landing/{QuickStartModal,StartStep,LinkStep}.tsx`; uses Radix Dialog; Test `modal.test.tsx`.

**Interfaces:** Consumes `auth.generateTeamLink`, `react-hook-form` + Zod (`{company:nonempty, email:email}`). Step "start": fields "Nombre de la empresa"/"Tu email", "Generar enlace de equipo →" (disabled until both filled). Step "link": readonly `genLink` + "Copiar" (toast "Enlace copiado") + "Enviar por email" (mailto verbatim subject/body) + "Entendido". "Empieza gratis" buttons across landing open it; on "Entendido" optionally route to `/app`.

- [ ] Test: submit button disabled until both fields valid; submitting moves to link step and shows a generated `unifyflow.eu/e/...` link. → FAIL → implement → PASS → build → Commit `feat: quick-start modal`.

### Task 6.3: GSAP animations

**Files:** Create `lib/animation/{useReveal,useShowcase}.ts`, `components/landing/Showcase.tsx`; integrate ScrollTrigger; Test timing helpers.

**Interfaces:** `useReveal` (ScrollTrigger fade+slide-up, stagger). `Showcase` 3 rows: (1) chat bubbles staggered, (2) map "draws itself" nodes→edges→badges, (3) chip "Borrador"→"✓ Validado" crossfade. All wrapped in `gsap.matchMedia()`; reduced-motion shows final state instantly. Register plugins client-side, lazy.

- [ ] Test: a pure timing helper returns expected stagger offsets; component renders both Borrador and Validado chips. → FAIL → implement → PASS → build → Commit `feat: GSAP landing animations`.

---

## Phase 7 — Demo launcher, tour, checkout, polish

### Task 7.1: Demo launcher

**Files:** Create `app/demo/page.tsx`, `components/demo/RoleCard.tsx`; Test render.

**Interfaces:** "Entrar como…" with 3 RoleCards (Admin/Champion → `/app`; Validador → `/app?role=validador`; Entrevistado → `/e/distribuciones-robledo-3f9a`). Simulated magic-link/Google buttons call `auth.signInAs`. "Reiniciar demo" → `resetDemo()`.

- [ ] Test → FAIL → implement → PASS → build → Commit `feat: demo launcher`.

### Task 7.2: Guided tour

**Files:** Create `components/demo/GuidedTour.tsx`, `lib/store` tour actions (already in 1.6); Test tour step progression.

**Interfaces:** Floating "Tour guiado" control; steps encadenan crear→invitar→entrevista→espejo→validar→IA→pagar→radiografía, each with a short coachmark + "Siguiente" that navigates/sets step. `endTour()` dismisses. Honors reduced-motion.

- [ ] Test: `startTour()` sets step 0; `nextTourStep()` advances and routes. → FAIL → implement → PASS → build → Commit `feat: guided tour`.

### Task 7.3: Checkout (Stripe simulated)

**Files:** Create `app/checkout/page.tsx`; Test render + pay.

**Interfaces:** Branded mock checkout (price tiers €490/€990/€1.490) → "Pagar" calls `stripe.checkout()` → `pay()` → success screen "Radiografía desbloqueada" → route to `/app?step=radiografia`. Shows it's a demo (no real card).

- [ ] Test: paying flips `subscription.paid` and unlocks opps. → FAIL → implement → PASS → build → Commit `feat: simulated checkout`.

### Task 7.4: Mobile-first pass + a11y + reduced-motion audit

**Files:** Touch responsive classes across components; Test a couple of mobile-layout assertions where feasible.

- [ ] Verify each route at 375px: sidebar drawer works, map fits + node panel is a bottom sheet, interview is native-feeling, landing single-column, no horizontal overflow. Keyboard focus visible; `prefers-reduced-motion` disables GSAP/CSS motion. Run Lighthouse/a11y check via chrome-devtools if available.
- [ ] Commit `fix: mobile-first + a11y + reduced-motion polish`.

### Task 7.5: Final integration verification

- [ ] Run full loop manually (and/or with Playwright if added): landing → modal create org → `/app` invite → `/e/...` complete interview → new node appears on map → reveal → validate → reorganize → opportunities (locked) → checkout → unlock → export Radiografía PDF. From a second role (Validador) validate a node and see counts update.
- [ ] Run `npm test`, `npm run typecheck`, `npm run build` — all green.
- [ ] Commit `test: end-to-end loop verification`.

---

## Self-Review

**Spec coverage:** Stack (T0.1), theme/fonts/tokens (T0.2), schemas (T1.1), faithful mock data (T1.2/1.3), question bank (T1.4), agent/auth/stripe/realtime services (T1.5/1.7), store+selectors+derived values (T1.6), primitives+shell+mobile drawer (T2.x), React Flow map + reveal + reorganize + node panel + paywall-adjacent (T3.x), all 5 dashboard steps incl. paywall + PDF (T4.x), interviewee flow + profile + notifications (T5.x), landing + modal + GSAP (T6.x), demo launcher + both modes (tour) + checkout + mobile/a11y + e2e (T7.x). All spec sections map to a task.

**Placeholder scan:** No "TBD/TODO"; UI tasks intentionally reference `content.ts`/`mockData.ts` as the verbatim source rather than re-transcribing every string in the plan (those strings are themselves produced and tested in T1.2/1.3).

**Type consistency:** `ProcessNode` fields (posA/posB/horas/inter/sourceInterviewIds/desc/steps), `estado` union, `rol` union, selector names (`selectStatusText`, `selectProgressText`, `selectTotalHours`), and store actions are referenced consistently across tasks.
