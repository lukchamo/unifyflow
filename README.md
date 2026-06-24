# UnifyFlow

> El espejo que tu empresa nunca tuvo.

UnifyFlow reconstruye cómo trabaja una organización *de verdad* —a partir de micro‑entrevistas con IA— y la dibuja como un **mapa de procesos vivo**, validado por las personas que lo habitan. Sobre esa claridad, prioriza **dónde aplicar IA primero**. El entregable es la *Radiografía de Procesos + IA*.

Este repositorio contiene el **PRD**, el **prototipo** original y una **demo funcional en Next.js 16** que recorre el flujo completo con datos de ejemplo.

## Estructura

| Ruta | Qué es |
|---|---|
| `unifyflow-prd.md` | Product Requirements Document |
| `prototipo/` | Prototipo HTML original + screenshots |
| `unifyflow-app/` | **App Next.js 16** (la demo funcional) |
| `docs/superpowers/` | Spec de diseño técnico + plan de implementación |

## La demo (`unifyflow-app/`)

Stack: **Next.js 16 · React 19 · TypeScript · Tailwind 4 · Radix UI · React Flow · GSAP · Zustand · Zod · Vitest**.

Todo funciona con **datos mock** — sin backend, sin claves, sin red. Auth, el agente de IA, Stripe y el "tiempo real" están simulados; un único store (Zustand, persistido en `localStorage`) es la fuente de verdad.

### Arrancar

```bash
cd unifyflow-app
npm install
npm run dev        # http://localhost:3000
```

Otros scripts: `npm test` · `npm run build` · `npm run typecheck`.

### El recorrido

- `/` — Landing animada (GSAP), mobile‑first.
- `/demo` — "Entrar como…": Admin · Champion, Validador o Entrevistado.
- `/app` — Dashboard de 5 pasos: **Equipo → Entrevista → Mapa vivo (React Flow) → Oportunidades (con paywall) → Radiografía** (export PDF). Incluye "Reorganizar con IA", el "momento espejo" y un **tour guiado**.
- `/e/[slug]` — La micro‑entrevista del colaborador (al completarla, el nodo aparece en el mapa).
- `/yo/procesos`, `/yo/notificaciones` — Vista del colaborador.
- `/checkout` — Pago simulado que desbloquea las oportunidades.

---

*Anclas del producto: **Fácil · Sanador y mágico · Seguro.*** · por *Lucho con IA*.
