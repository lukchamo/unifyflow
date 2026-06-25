# UnifyFlow

> El espejo que tu empresa nunca tuvo.

UnifyFlow reconstruye cómo trabaja una organización *de verdad* —a partir de micro‑entrevistas con IA— y la dibuja como un **mapa de procesos vivo**, validado por las personas que lo habitan. Sobre esa claridad, prioriza **dónde aplicar IA primero**. El entregable es la *Radiografía de Procesos + IA*.

Este repositorio es la **demo funcional en Next.js 16** que recorre el flujo completo con datos de ejemplo. La documentación del producto (PRD, prototipo, diseño técnico) vive en [`docs/`](docs/).

## Stack

**Next.js 16 · React 19 · TypeScript · Tailwind 4 · Radix UI · React Flow · GSAP · Zustand · Zod · Vitest.**
Backend opcional: **Firebase Auth + Firestore + Cloud Functions (triggers)**, con **Firebase Emulator**.

Dos backends de datos, seleccionables con `NEXT_PUBLIC_DATA_BACKEND`:

- **`mock`** (por defecto sin configuración) — todo simulado, sin red; un store Zustand (`localStorage`) es la fuente de verdad. Es lo que despliega Vercel.
- **`firebase`** — Auth real (email + Google), Firestore en todo el ciclo, **roles por custom claims** y triggers que ensamblan el mapa en el servidor.

## Arrancar

```bash
npm install

# Demo mock (sin backend):
npm run dev          # http://localhost:3000

# Stack Firebase completo (emulador + seed + dev, un solo comando):
npm run firebase     # requiere JDK 17+ para el emulador de Firestore
```

Con Firebase: entra en **/login** o **/demo** con las cuentas demo (contraseña `unifyflow123`):
`marta-ruiz@robledo.es` (admin) · `lucia-vidal@robledo.es` (validador) · `andres-perez@robledo.es` (entrevistado).
Emulator UI en <http://localhost:4000>. **Guía completa: [`docs/FIREBASE.md`](docs/FIREBASE.md).**

Otros scripts: `npm test` (314 tests) · `npm run build` · `npm run typecheck` · `npm run dev:mock` · `npm run seed`.

## El recorrido

- `/` — Landing animada (GSAP), mobile‑first.
- `/demo` — "Entrar como…": Admin · Champion, Validador o Entrevistado.
- `/app` — Dashboard de 5 pasos: **Equipo → Entrevista → Mapa vivo (React Flow) → Oportunidades (con paywall) → Radiografía** (export PDF). Incluye "Reorganizar con IA", el "momento espejo" y un **tour guiado**.
- `/e/[slug]` — La micro‑entrevista del colaborador (al completarla, el nodo aparece en el mapa).
- `/yo/procesos`, `/yo/notificaciones` — Vista del colaborador.
- `/checkout` — Pago simulado que desbloquea las oportunidades.

## Estructura

```
app/            Rutas Next.js (App Router) — incluye /login y /demo
components/     UI: landing/, app-shell/, steps/, map/, interview/, ui/, demo/, auth/, firebase/
lib/            data/ · schemas/ (Zod) · services/ · store/ (Zustand) · firebase/ (client, admin, auth, repo) · theme/ · animation/
functions/      Cloud Functions — triggers de Firestore (ensamblado de nodos, claims de rol)
scripts/        run.sh (emulador/live), seed.ts, smoke.ts
docs/           PRD, prototipo, spec, plan y FIREBASE.md
firebase.json · firestore.rules · firestore.indexes.json · .firebaserc · .env.example
```

---

*Anclas del producto: **Fácil · Sanador y mágico · Seguro.*** · por *Lucho con IA*.
