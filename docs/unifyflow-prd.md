# UnifyFlow — Product Requirements Document (PRD)

| | |
|---|---|
| **Producto** | UnifyFlow |
| **Owner** | Luis · *Lucho con IA* |
| **Versión** | 1.0 |
| **Fecha** | 24 jun 2026 |
| **Estado** | Draft para build — MVP / hackathon |
| **Contexto de lanzamiento** | Build with Gemini XPRIZE · deadline 17 ago 2026 (~8 semanas) |

---

## 0. TL;DR

UnifyFlow le devuelve a una empresa su propio reflejo. A través de micro-entrevistas asistidas por IA (asíncronas, 3–4 preguntas, voz o texto), reconstruye automáticamente cómo trabaja la organización de verdad y lo dibuja como un **mapa de procesos vivo** en React Flow, validado por las personas que lo habitan. Sobre esa claridad, un agente Gemini detecta y prioriza **dónde aplicar IA**. El entregable —la *Radiografía de Procesos + IA*— se vende como servicio productizado.

El producto se evalúa contra una sola pregunta de diseño: **¿una empresa abrumada sale de aquí con calma, claridad y una decisión accionable?**

---

## 1. El problema

Las organizaciones crecen más rápido de lo que documentan. Los procesos nunca se escriben: viven en cabezas, en Excels sueltos, en un *"pregúntale a María"*. Funciona durante años — hasta que deja de funcionar.

Hoy esto se agrava por una presión nueva: **"apliquen IA"**. Pero en el momento exacto en que un equipo intenta mapear un proceso para automatizarlo, todo se enreda, porque **no se puede automatizar lo que no se puede ver**. El gerente intuye el desorden pero no puede señalarlo. No tiene mapa. No tiene espejo.

Las soluciones actuales no cierran este hueco para PYMEs y mid-market:

- **Process mining** (Celonis, IBM, KYP.ai): exige event logs limpios de los sistemas; pesado, caro, enterprise.
- **Captura de SOPs** (Scribe, Tango): documenta *una* tarea por grabación de pantalla; no produce un mapa conectado de la organización.
- **Consultoría**: meses, costosa, y produce un diagrama muerto en un cajón.
- **Descubrimiento por entrevista con IA** (Ontora, Cerenovus — YC): categoría validada y en disputa, pero horizontal, en inglés y sin el "último kilómetro" de ejecución.

**El hueco de UnifyFlow:** descubrimiento por conversación (sin integraciones ni logs), que ensambla un mapa *conectado a nivel organización*, validado por humanos, y que termina en una decisión de IA priorizada — con una estética que sana el abrumo.

---

## 2. Visión

> Una empresa que se ve a sí misma con claridad ya está a medio camino de mejorar.

UnifyFlow no es una herramienta de diagramas. Es el espejo que una organización nunca tuvo, y el puente entre "no sé cómo trabajamos" y "sé exactamente dónde la IA me da el siguiente salto". A largo plazo, es la capa de inteligencia operativa viva de la empresa.

---

## 3. Principios de UX (columna vertebral)

Estos tres principios no son adornos: son el criterio con el que se acepta o se rechaza **cada** decisión de producto. Toda feature lleva una etiqueta indicando a qué principio sirve.

### P1 — Fácil de usar *(Effortless)*
La complejidad es nuestra, no del usuario. El entrevistado no se entrena, no configura nada: responde 3–4 preguntas en <5 minutos, cuando quiere, desde el móvil. El gerente obtiene su primer mapa con cero configuración.

**Reglas de diseño**
- Una sola acción primaria por pantalla.
- Cero-config para llegar al primer valor; el sistema asume defaults sensatos.
- Lenguaje llano, sin jerga; la IA adapta sus preguntas al rol.
- Divulgación progresiva: lo avanzado existe, pero está oculto hasta que se pide.

**Criterio de éxito:** time-to-first-map < 24 h desde alta; un entrevistado completa su sesión sin leer ninguna instrucción.

### P2 — Sanador y mágico *(Healing & magical)*
El trabajo emocional del producto es convertir abrumo en alivio. "Mágico" = el mapa que se dibuja solo a partir de conversaciones; la empresa viéndose por primera vez; la IA revelando lo que nadie veía. La magia es **serena**, nunca estridente.

**Reglas de diseño**
- El primer mapa se revela de forma coreografiada y calmada (momento "espejo").
- Nunca se avergüenza al usuario por su desorden. No decimos "encontramos caos"; decimos "así trabaja tu empresa hoy".
- El mapa está vivo: crece en tiempo real conforme la gente responde.
- Blanco, aire, paz mental. La calma es una decisión de diseño (ver Manifiesto).

**Criterio de éxito:** en test cualitativo, el usuario describe la primera vista del mapa con una palabra de alivio/asombro ("por fin", "wow", "esto es").

### P3 — Transmitir seguridad *(Trust & safety)*
Seguridad en dos ejes que deben sentirse a la vez: **(a) privacidad/datos** —GDPR, residencia UE, sin captura encubierta de pantalla, claridad de qué se comparte— y **(b) confianza/credibilidad** —el resultado es preciso, validado por humanos, con procedencia visible, y el producto se siente sólido y profesional, no un beta frágil.

**Reglas de diseño**
- Privacidad visible y por defecto: el usuario siempre sabe qué se guarda y quién lo ve.
- Procedencia: cada nodo muestra de qué entrevista/persona proviene.
- Validación humana como mecanismo de confianza (no como burocracia).
- Cada sugerencia de IA explica *por qué* se propone (evidencia, no oráculo).
- Pulido profesional = fiabilidad percibida.

**Criterio de éxito:** un decisor entrega datos de su empresa sin pedir un NDA primero; la validación se percibe como "control", no como "trabajo".

---

## 4. Usuarios y roles

| Rol | Quién es | Qué necesita | Principio dominante |
|---|---|---|---|
| **Champion / Comprador** | Director de operaciones, gerente general, dueño de PYME abrumado | Ver su empresa con claridad y saber dónde meter IA, sin proyecto eterno | P2, P3 |
| **Entrevistado** | Cualquier empleado | Contar lo que hace en 5 min sin fricción ni sensación de vigilancia | P1, P3 |
| **Validador** | Mando intermedio / líder de área | Confirmar o corregir el mapa de su área; sentir que tiene el control | P3 |
| **Admin** | El champion o quien él designe | Invitar gente, ver progreso, exportar la radiografía, gestionar el plan | P1 |

**Segmento inicial:** PYME / mid-market (10–150 empleados) en crecimiento, sin procesos documentados, bajo presión de "adoptar IA".
**Primer cliente de pago:** vía red personal de *Lucho con IA* (decisión abierta — ver §15).

---

## 5. Objetivos y métricas

**North Star:** nº de **radiografías validadas entregadas** (empresas que llegaron al momento "espejo" con un mapa validado + oportunidades de IA priorizadas).

| Categoría | Métrica | Meta MVP (8 semanas) |
|---|---|---|
| Activación | Time-to-first-map | < 24 h |
| Activación | % de invitados que completan su entrevista | ≥ 60 % |
| Magia (P2) | % del mapa autogenerado sin edición humana | ≥ 70 % |
| Confianza (P3) | % de nodos validados por un humano | ≥ 80 % antes de entrega |
| **Negocio (XPRIZE)** | **€ cobrados de clientes reales** | **≥ 1 cliente pagando; meta 3** |
| Negocio | Testimonios verificables de clientes | ≥ 2 |
| AI-native (XPRIZE) | Decisiones ejecutadas autónomamente por el agente, con logs | Trazadas al 100 % |

### Cómo mapea al jurado del XPRIZE
- **Viabilidad de negocio →** ingresos reales por la radiografía (one-time) en la ventana.
- **Operaciones AI-nativas →** el agente Gemini ejecuta en producción la entrevista, el ensamblado del grafo y la priorización de oportunidades; todo queda logueado.
- **Impacto de categoría (Small Business Services / Professional Services Access) →** democratiza un diagnóstico que antes solo pagaban grandes vía consultoras.

---

## 6. Alcance

### 6.1 Dentro del MVP (P0)
El **loop esencial**, end-to-end, en un vertical:

1. Alta de organización + invitación de equipo.
2. Entrevista asíncrona con agente IA (texto primero; voz como fast-follow).
3. Ensamblado automático del grafo de procesos.
4. Mapa vivo en React Flow (tiempo real).
5. Validación humana (rol validador).
6. Detección + priorización de oportunidades de IA.
7. Exportación de la *Radiografía de Procesos + IA*.
8. Cobro con Stripe.

### 6.2 Fuera del MVP (no-goals explícitos)
Se cortan deliberadamente para proteger la velocidad y el foco:

- ❌ **Compartir pantalla / screen-recording / heatmaps / redacción de sensibles.** Coste enorme, cero diferenciación (ya existe en terceros). v3, vía integración, nunca desarrollo propio.
- ❌ **Cumplimiento HIPAA** y certificaciones pesadas. Fuera del segmento y del tiempo.
- ❌ **Integraciones con sistemas** (process mining por logs). No es el wedge.
- ❌ **App móvil nativa.** La entrevista es web responsive; suficiente.
- ❌ **Multi-idioma completo, marketplace de plantillas, analítica avanzada.** Post-hackathon.

> Regla de oro: si una feature no acerca a una empresa al momento "espejo" o a un cobro, no entra en el MVP.

---

## 7. El loop (user journey)

```
Champion crea la org
      │
      ▼
Invita a su equipo (link/email)          ── P1: un clic, sin fricción
      │
      ▼
Cada persona: micro-entrevista IA        ── P1 async <5min · P3 "qué guardamos"
  (rol → 3-4 preguntas adaptativas)
      │
      ▼
Agente Gemini ensambla el grafo          ── P2 magia: el mapa se dibuja solo
  (nodos = actividades, edges = handoffs)
      │
      ▼
Mapa vivo en React Flow (tiempo real)    ── P2 momento "espejo" coreografiado
      │
      ▼
Validadores confirman / corrigen         ── P3 control + procedencia visible
      │
      ▼
Agente detecta y prioriza IA             ── P3 cada sugerencia explica su porqué
  (impacto × frecuencia × viabilidad)
      │
      ▼
Radiografía exportable + handoff         ── el entregable que se cobra
```

---

## 8. Requisitos funcionales

Prioridad: **P0** = MVP/hackathon · **P1** = fast-follow · **P2** = post-lanzamiento.

### 8.1 Organización, roles y onboarding — P0
- Crear organización con nombre y sector. *(P1)*
- Invitar miembros por email o link compartible. *(P1)*
- Asignar rol (admin, validador, entrevistado). *(P3)*
- Onboarding cero-config: del alta a "invita a tu equipo" en una pantalla. *(P1)*

**Aceptación:** un admin nuevo invita a 5 personas en < 3 min sin documentación.

### 8.2 Agente de entrevista IA — P0
- El entrevistado introduce nombre, cargo y área (o se prellenan desde la invitación).
- El agente Gemini genera 3–4 preguntas **adaptativas al rol** y repregunta cuando algo queda ambiguo.
- Modalidad **texto** en MVP; **voz** (Gemini Live / capa de voz comprada) como fast-follow. *(voz = P1)*
- Antes de empezar: panel claro de "qué guardamos y quién lo ve". *(P3)*
- Sesión reanudable; guarda progreso. *(P1)*

**Aceptación:** un entrevistado completa la sesión en < 5 min, sin instrucciones, y entiende qué se guardó.

### 8.3 Ensamblado del grafo — P0 *(núcleo AI-nativo)*
- El agente convierte respuestas en **nodos** (actividades/responsabilidades) y **edges** (handoffs entre personas/áreas).
- Detecta solapamientos, duplicidades y huecos entre lo que dicen distintas personas.
- Cada nodo guarda **procedencia** (de qué entrevista proviene). *(P3)*
- Cada decisión autónoma del agente se **loguea** (input, output, modelo, timestamp). *(requisito XPRIZE)*

**Aceptación:** con 5 entrevistas, ≥ 70 % del grafo se genera sin edición manual; cada nodo es trazable a su fuente.

### 8.4 Mapa vivo (React Flow) — P0
- Render del grafo en React Flow, enriquecido (nodos por persona/área, colores sobrios, estados: borrador / validado / con oportunidad IA).
- **Tiempo real:** el mapa crece conforme entran respuestas (Firestore listeners). *(P2)*
- Pan/zoom, agrupar por área, filtrar por persona o estado.
- Momento "espejo": primera apertura del mapa con reveal calmado y coreografiado. *(P2)*

**Aceptación:** al entrar una entrevista nueva, el nodo aparece en el mapa sin recargar.

### 8.5 Validación humana — P0
- El validador ve los nodos de su área marcados como "borrador" y puede **confirmar, editar o fusionar**.
- Estado del nodo refleja la validación; la procedencia y el historial quedan visibles. *(P3)*
- La validación se siente como control, con microcopy que no culpabiliza. *(P2/P3)*

**Aceptación:** un validador procesa su área en < 10 min; el estado global de validación es visible para el admin.

### 8.6 Detección de oportunidades de IA — P0 *(el gancho monetizable)*
- Botón/capa: "Dónde aplicar IA". El agente analiza el grafo validado y propone intervenciones.
- Cada propuesta se **prioriza** por *impacto × frecuencia × viabilidad* y **explica su evidencia** (qué nodos, por qué). *(P3)*
- Cada oportunidad es accionable: descripción concreta, no "pon un chatbot". *(handoff natural a construir → CooWeb, fuera del producto)*

**Aceptación:** sobre un grafo validado, el agente devuelve ≥ 3 oportunidades priorizadas y justificadas.

### 8.7 Radiografía (entregable) — P0
- Vista/export consolidado: mapa + inventario de procesos + oportunidades de IA priorizadas.
- Export a **PDF** de marca (estética blanca/calma) y enlace compartible. *(PDF = P0, link = P1)*

**Aceptación:** el champion exporta un documento presentable a su dirección sin tocar diseño.

### 8.8 Cobro (Stripe) — P0 *(requisito de ingresos)*
- Pago de la radiografía (one-time) y/o suscripción al mapa vivo.
- Checkout + portal de cliente + webhook.
- Evidencia de ingresos exportable (para el envío del XPRIZE). *(requisito)*

**Aceptación:** un cliente real paga de extremo a extremo y el ingreso queda registrado en Stripe.

### 8.9 Auth — P0
- Firebase Auth (email/enlace mágico + Google). Multi-organización. *(P1: multi-tenant)*

---

## 9. Operaciones AI-nativas (clave para el jurado)

El negocio está **operado por agentes**, no solo asistido. Decisiones que la IA ejecuta en producción de forma autónoma:

1. **Conduce la entrevista** — genera y adapta preguntas, repregunta, decide cuándo cerrar.
2. **Ensambla el grafo** — decide qué es nodo, qué es handoff, qué fusionar.
3. **Detecta y prioriza oportunidades de IA** — la decisión de negocio central.

**Trazabilidad obligatoria:** todas estas decisiones generan logs (prompt, respuesta, modelo, tokens, timestamp, entidad afectada), tanto por requisito del XPRIZE (evidencia de producto: logs de agente + uso de API) como por el principio P3 (procedencia y explicabilidad).

---

## 10. Modelo de datos (alto nivel)

| Entidad | Campos clave | Notas |
|---|---|---|
| `Organization` | id, nombre, sector, plan | Tenant raíz |
| `Member` | id, orgId, nombre, email, cargo, área, rol | Roles: admin/validador/entrevistado |
| `Interview` | id, memberId, estado, startedAt, completedAt | Reanudable |
| `Answer` | id, interviewId, pregunta, respuesta, modalidad | Texto/voz |
| `ProcessNode` | id, orgId, label, ownerMemberId, área, estado, sourceInterviewIds | Estado: draft/validated; **procedencia** |
| `Handoff` *(edge)* | id, orgId, fromNodeId, toNodeId, tipo | Conexión entre actividades |
| `AIOpportunity` | id, orgId, nodeIds, descripción, impacto, frecuencia, viabilidad, score, evidencia | Priorizada + justificada |
| `Validation` | id, nodeId, validatorId, acción, timestamp | Historial de confianza |
| `AgentLog` | id, orgId, tipoDecisión, input, output, modelo, tokens, timestamp | Evidencia XPRIZE + explicabilidad |
| `Subscription` | id, orgId, stripeId, plan, estado | Stripe |

> Firestore (documental + tiempo real). Las relaciones (org→miembros→nodos→edges) se modelan con colecciones/subcolecciones; el grafo es naturalmente documental.

---

## 11. Arquitectura y stack

| Capa | Elección | Por qué (y qué restricción cubre) |
|---|---|---|
| Frontend / app | **Next.js 16 + TypeScript** | Stack moderno, SSR, un solo repo |
| UI marketing | **Meridian (shadcnblocks)** | Premium, shadcn/Tailwind 4, ya licenciado; landing + pricing + docs |
| UI app (dashboard) | **shadcnblocks Admin Kit** (mismo premium) | Shell autenticado coherente con Meridian |
| Sistema de diseño | **shadcn/ui + Tailwind 4** | Minimalista, blanco, coherente marketing↔app |
| Auth + DB + realtime | **Firebase (Auth + Firestore)** | Tiempo real best-in-class (mapa vivo) · **es producto Google Cloud → cubre requisito XPRIZE** |
| IA / agente | **Genkit + Gemini (Vertex AI)** | Acceso first-party a Gemini; logs de agente bajo nuestro control |
| Mapa | **React Flow (xyflow)** | MIT, el canvas vivo; el artefacto-wow |
| Pagos | **Stripe** | Cobro real → evidencia de ingresos |
| Hosting | **Vercel o Cloud Run** | Cloud Run refuerza la narrativa Google Cloud |
| Voz (fast-follow) | **Gemini Live / Vapi / Retell** | Comprar, no desarrollar |

**Decisión de base:** Meridian como base del proyecto Next.js; se le añaden Firebase Auth + Firestore + Stripe + Genkit + React Flow. (Los boilerplates Firebase gratuitos quedaron descartados por desfase de versión vs. Tailwind 4 / Next 16.)

---

## 12. Dirección de UX/UI

Coherente con el Manifiesto y los tres principios.

- **Estética:** blanco sereno con aire (no cream cliché), un único acento calmado, tipografía editorial para los momentos narrativos + sans limpia (IBM Plex / similar) para la app. El **mapa es el héroe**; todo lo demás se retira.
- **Momento "espejo":** la primera apertura del mapa es la pantalla más cuidada del producto — reveal lento, calmado (P2).
- **Microcopy:** activa, en sentido del usuario, nunca culpabilizadora. Errores que explican y orientan, no que se disculpan. Pantallas vacías como invitación a actuar.
- **Movimiento:** mínimo y deliberado; respeta `prefers-reduced-motion`. El exceso de animación rompe la calma.
- **Accesibilidad (piso de calidad):** responsive a móvil (la entrevista vive ahí), foco de teclado visible, contraste suficiente.

---

## 13. Privacidad, confianza y seguridad (P3 operacionalizado)

- **Privacy-first como feature:** sin captura de pantalla en MVP. La privacidad es argumento de venta, no carga.
- **Transparencia de datos:** antes de cada entrevista, panel de "qué se guarda y quién lo ve".
- **Residencia y GDPR:** datos en UE; base legal y retención claras. Diferenciador real frente a herramientas US.
- **Permisos por rol:** entrevistado ve lo suyo; validador, su área; admin, el todo.
- **Procedencia y explicabilidad:** cada nodo y cada oportunidad muestran su origen y su razón.
- **Validación humana:** mecanismo de confianza central, presentado como control del cliente.

---

## 14. Monetización

- **Producto principal:** *Radiografía de Procesos + IA* — **pago único** (rango a validar, p. ej. €490–€1.490 según tamaño). Cierra rápido → ingresos dentro de la ventana del hackathon.
- **Suscripción (fast-follow):** acceso al **mapa vivo** que se mantiene actualizado + re-detección periódica de oportunidades.
- **Handoff de ejecución:** las oportunidades de IA detectadas son la puerta natural a "y te lo construimos" (servicio, fuera del producto). El mapa es el imán; el servicio, la conversión.

---

## 15. Roadmap (8 semanas)

| Semanas | Foco | Salida |
|---|---|---|
| 1 | Base + decisiones | Meridian + Firebase Auth + esqueleto app; vertical, precio y primer prospecto fijados |
| 2–3 | Loop núcleo | Entrevista IA (texto) → ensamblado de grafo → mapa React Flow en tiempo real |
| 4 | Confianza | Rol validador + procedencia + panel de privacidad |
| 5 | Gancho | Detección/priorización de oportunidades de IA + logs de agente |
| 6 | Cobro + entregable | Stripe end-to-end + export Radiografía PDF |
| 7 | Pulido + magia | Momento "espejo", microcopy, estética calma, voz si da tiempo |
| 8 | Cliente + envío | Cerrar cliente(s) de pago, recoger testimonios, vídeo 3 min, narrativa, evidencias |

**Post-hackathon:** voz, multi-tenant completo, suscripción de mapa vivo, link compartible, multi-idioma, integraciones ligeras.

---

## 16. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| **Ingresos reales en 8 semanas** (criterio dominante) | Alto | Vender la radiografía como one-time desde semana 1; pre-vender antes de terminar el build |
| Competencia financiada (Ontora, Cerenovus) | Alto | Vertical estrecho + español/UE/GDPR + último kilómetro de ejecución; no competir horizontal |
| Adopción/confianza del entrevistado | Medio | P1 (fricción mínima) + P3 (privacidad visible); sin captura de pantalla |
| Precisión del grafo autogenerado | Medio | Validación humana de serie; el humano es feature, no parche |
| Scope creep (volver al screen-share/HIPAA) | Alto | No-goals explícitos (§6.2); regla de oro de §6 |
| Dependencia de un solo modelo | Bajo | Genkit abstrae el proveedor; Gemini por defecto (requisito), fallback posible |

---

## 17. Decisiones abiertas

1. **Vertical exacto** del primer push (recomendado: estrecho y con presupuesto asociado a la radiografía).
2. **Precio** del entregable (rango propuesto arriba — validar con 2–3 prospectos).
3. **Primer cliente de pago** vía red de *Lucho con IA*.
4. **Categoría XPRIZE** definitiva: Small Business Services (recomendada) vs. Professional Services Access.

---

## 18. Glosario

- **Radiografía:** el entregable consolidado (mapa + inventario + oportunidades de IA).
- **Momento "espejo":** la primera vez que la empresa ve su mapa vivo. El clímax emocional.
- **Handoff:** traspaso de trabajo entre personas/áreas; un edge del grafo.
- **Oportunidad de IA:** intervención priorizada y justificada sobre el grafo validado.
- **Validador:** humano que confirma/corrige el mapa de su área (mecanismo de confianza).

---

*Anclas de este PRD: **Fácil · Sanador y mágico · Seguro.** Si una decisión no sirve a uno de los tres, no entra.*
