# Canal de WhatsApp — dónde colocarlo en el Customer Journey

Documento de decisión sobre **en qué momento** se muestra la novedad de WhatsApp
y **por qué ahí y no antes**. Acompaña a la implementación en
`components/whatsapp/`, `lib/services/whatsapp.ts` y `app/legal/whatsapp`.

## El principio que ordena todo

El número de teléfono es la pieza de dato más cara que le podemos pedir a un
usuario: más que el email, más que el nombre de la empresa. Se percibe como
personal, como irreversible y como puerta a que alguien te moleste.

De ahí la regla que gobierna todas las decisiones de abajo:

> **Nunca pedimos el número antes de haber entregado valor. La novedad se
> anuncia pronto; el número se pide tarde.**

Anunciar ≠ pedir. Se pueden separar en el tiempo, y conviene hacerlo: el
anuncio temprano prepara el terreno (cuando llega la petición ya no sorprende)
sin cobrar el peaje de fricción por adelantado.

## Mapa de momentos

| # | Momento | Estado mental | Qué mostramos | Por qué |
|---|---------|---------------|---------------|---------|
| 1 | Landing | Escéptico, evaluando | Nada nuevo | La landing ya tiene una promesa que defender. Meter WhatsApp aquí compite con ella y abre la pregunta equivocada ("¿me van a estar escribiendo?"). |
| 2 | Formulario de nueva cápsula | Decidido a probar, con prisa | **Tira "NUEVO"** — solo texto, sin campo | Máxima intención, mínima paciencia. Un campo de teléfono aquí es una barrera entre el usuario y su primera cápsula. La tira sube la expectativa de valor sin cobrar fricción. |
| 3 | **Cápsula lista** | Momento de orgullo + necesidad real de un canal | **Botón "Enviar por WhatsApp"** (acción destacada) + **tarjeta de alta del asistente**, plegada | El *aha moment*. Acaba de aparecer un enlace y su siguiente problema literal es "¿y cómo se lo hago llegar?". WhatsApp no es un extra: es la respuesta a la pregunta que se acaba de hacer. Aquí la motivación está en su pico y la petición del número por fin tiene una razón evidente. |
| 4 | Paso "Equipo" (app) | Gestionando, revisando pendientes | Botón de envío + **icono de recordatorio por fila pendiente** | Es el momento de la distribución y del seguimiento. El recordatorio individual va justo donde se ve quién falta, no en una barra genérica. |
| 5 | Entrevista (invitado) | A punto de escribir desde el móvil, quizá en planta o conduciendo | **Tarjeta "¿Prefieres responder por WhatsApp?"**, debajo del CTA principal | Es donde la nota de voz gana de verdad: gente que no quiere teclear. Va *después* del botón de empezar para que se lea como salida de emergencia, no como camino rival. |
| 6 | Mapa / radiografía | Consumiendo resultado | Nada | El canal ya no aporta nada al trabajo que se está haciendo aquí. |

### Respuesta corta a "¿lo mostramos en todo el proceso?"

No. Mostrarlo en todas partes lo convierte en ruido y quema la etiqueta
*NUEVO* antes de que sirva de algo. La colocación es **1 anuncio + 3 usos**:
se anuncia una vez (momento 2) y aparece como acción solo donde resuelve un
problema que el usuario tiene en ese instante (momentos 3, 4 y 5).

## Dos consentimientos distintos (y por qué no se mezclan)

Es el punto donde la mayoría de productos se equivoca: tratan "mandar un enlace
por WhatsApp" y "darse de alta en un bot" como si fueran lo mismo. No lo son.

**A. Compartir la cápsula → no requiere consentimiento nuestro.**
El botón abre un `wa.me` de *click-to-chat*: el mensaje se compone en el
WhatsApp del propio usuario y lo envía él, a quien él elija. UnifyFlow no
guarda el número del destinatario ni le escribe. Por eso el botón no lleva
casilla: pedir consentimiento donde no hay tratamiento de datos entrena al
usuario a firmar sin leer.

**B. Activar el asistente → consentimiento explícito y verificable.**
Aquí la persona nos entrega **su propio** número para que le escribamos. Eso sí
es tratamiento, y lleva:

1. Casilla **desmarcada por defecto**, que bloquea el botón hasta marcarse.
2. Enlace visible a los términos (`/legal/whatsapp`), no un texto enterrado.
3. **Doble opt-in**: marcar registra la intención; el canal se activa cuando la
   persona envía desde su teléfono el mensaje de alta que le abrimos. Ese
   segundo paso prueba que el número es suyo — y protege de que alguien dé de
   alta el teléfono de un tercero.
4. Registro con sello de tiempo y **versión de los términos aceptada**
   (`WHATSAPP_TERMS_VERSION`), para poder demostrar quién aceptó qué.
5. Baja escribiendo `BAJA` en el propio chat, anunciada en el mismo sitio donde
   se pide el alta.

El invitado (momento 5) escribe él primero desde su móvil: ese mensaje es su
consentimiento, así que no hay casilla, solo enlace a los términos.

## Detalles de copy que cargan el peso

- **"Enviar por WhatsApp"**, no "Compartir". Nombrar la acción exacta.
- La microcopia del envío dice qué **no** hacemos: *"Tú eliges a quién se lo
  mandas; nosotros no guardamos ese número"*. La objeción se responde antes de
  que se formule.
- La promesa del asistente se cuenta en beneficio, no en tecnología: *"Responde
  con notas de voz mientras conduces o estás en planta"*, no "bot con
  transcripción automática".
- La etiqueta *NUEVO* aparece como máximo una vez por pantalla.

## Qué medir antes de mover nada

1. **Conversión del formulario de cápsula** (momento 2). Es el control: si baja
   tras añadir la tira, el anuncio molesta y hay que reducirlo.
2. **Reparto de canal** en el momento 3: WhatsApp vs. copiar vs. email.
3. **Tasa de alta del asistente**: casilla marcada → mensaje realmente enviado.
   Un salto grande entre ambos significa que el segundo paso no se entiende.
4. **Finalización de entrevista por canal**: web vs. WhatsApp. Si WhatsApp gana
   de forma clara, el momento 5 debería subir de jerarquía.
5. **Bajas (`BAJA`) por cada 100 altas**. Por encima del 5 % el problema no es
   el canal, es lo que enviamos por él.

## Lo siguiente, si los números acompañan

- Recordatorio automático por WhatsApp a las 48 h para quien dejó la entrevista
  a medias (hoy el recordatorio del momento 4 es manual).
- Alta del asistente también desde el panel, para el admin que quiere seguir el
  avance sin abrir la web.
- Selector de prefijo internacional en el campo de teléfono; hoy se asume `+34`
  cuando se escribe un número nacional sin prefijo
  (`normalizePhone` en `lib/services/whatsapp.ts`).
