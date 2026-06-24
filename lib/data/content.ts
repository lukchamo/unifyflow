// Landing page content constants -- all verbatim Spanish copy.
// Source: /prototipo/Landing.dc.html + task-1.3-content.md
// No React / JSX -- data only.
// NOTE: all TypeScript string delimiters below are ASCII U+0022 straight quotes.

// --- NAV --------------------------------------------------------------------

export const NAV = {
  brand: 'UnifyFlow',
  links: [
    { label: 'El problema', href: '#problema' },
    { label: 'Cómo funciona', href: '#como' },
    { label: 'Precio', href: '#precio' },
  ],
  cta: 'Empieza gratis',
} as const;

// --- HERO -------------------------------------------------------------------

export const HERO = {
  badge: 'Radiografía de Procesos + IA',
  h1: 'El espejo que tu empresa nunca tuvo.',
  /** Full paragraph text; the phrase in `emphasis` appears in italics in the HTML. */
  paragraph:
    'UnifyFlow reconstruye cómo trabaja tu organización de verdad —a partir de micro-entrevistas con IA— y te muestra exactamente dónde aplicar IA primero. Sin integraciones, sin consultoras, sin proyectos eternos.',
  emphasis: 'de verdad',
  ctaPrimary: 'Empieza gratis',
  ctaSecondary: 'Ver cómo funciona →',
  trust: [
    'Datos en la UE · GDPR',
    'Sin captura de pantalla',
    'Validado por humanos',
  ],
  heroMap: {
    label: 'El mapa vivo',
    live: 'En vivo',
    nodes: [
      { label: 'Captar lead', area: 'Comercial' },
      { label: 'Elaborar presupuesto', area: 'Comercial', badge: '−6 h/sem', opportunity: true },
      { label: 'Preparar pedido', area: 'Operac.' },
      { label: 'Facturar', area: 'Finanzas' },
    ],
  },
} as const;

// --- TRUST STRIP ------------------------------------------------------------

export const TRUST_STRIP = {
  // U+2013 en-dash in '10–50'
  items: [
    'Para PYMEs en crecimiento',
    '10–150 personas',
    'Sin procesos documentados',
    'Bajo presión de adoptar IA',
  ],
} as const;

// --- PROBLEM ----------------------------------------------------------------

export const PROBLEM = {
  eyebrow: 'El problema',
  h2: 'No puedes automatizar lo que no puedes ver.',
  paragraph:
    'Las empresas crecen más rápido de lo que documentan. Los procesos nunca se escriben: viven en cabezas, en Excels sueltos, en un “pregúntale a María”. Funciona durante años — hasta que llega la presión de “apliquen IA” y todo se enreda.',
  cards: [
    {
      n: '01',
      title: 'Vive en cabezas',
      text: 'El conocimiento de cómo trabajan no está en ningún sitio. Si alguien se va, se va con él.',
    },
    {
      n: '02',
      title: 'Presión por la IA',
      text: 'Todos dicen “apliquen IA”, pero nadie sabe dónde empezar sin un mapa de cómo trabaja la empresa.',
    },
    {
      n: '03',
      title: 'Intuyes el desorden',
      text: 'El gerente siente que algo no fluye, pero no puede señalarlo. No tiene mapa. No tiene espejo.',
    },
  ],
} as const;

// --- HOW --------------------------------------------------------------------

export const HOW = {
  eyebrow: 'Cómo funciona',
  h2: 'De conversaciones a una decisión accionable.',
  subtitle: 'Cuatro pasos. Cero configuración. Tu primer mapa en menos de 24 horas.',
  steps: [
    {
      n: 1,
      title: 'Invita a tu equipo',
      text: 'Un enlace o un email. Sin configuración, sin instalar nada.',
    },
    {
      n: 2,
      title: 'Responden en 5 min',
      text: 'El agente adapta sus preguntas al rol de cada persona. Texto o voz, desde el móvil.',
    },
    {
      n: 3,
      title: 'El mapa se dibuja solo',
      text: 'La IA ensambla actividades y traspasos en un mapa vivo, en tiempo real.',
    },
    {
      n: 4,
      title: 'Dónde aplicar IA',
      text: 'El agente prioriza las oportunidades por impacto, frecuencia y viabilidad.',
    },
  ],
} as const;

// --- SHOWCASE ---------------------------------------------------------------

export const SHOWCASE = {
  eyebrow: 'Míralo cobrar vida',
  h2: 'De la conversación al mapa, paso a paso.',
  row1: {
    label: 'Entrevista · 5 min',
    stepper: '1 / 4',
    bubbles: [
      { from: 'ia', text: '¿Qué haces tú cuando entra un pedido nuevo de un cliente?' },
      { from: 'user', text: 'Reviso si hay stock. Si no, le pregunto a Compras cuándo llega.' },
      { from: 'ia', text: 'Entiendo. Y cuando te lo confirman, ¿a quién avisas para preparar el envío?' },
    ],
    eyebrow: '01 · Conversación',
    h3: 'Una charla, no un formulario.',
    text: 'El agente adapta sus preguntas al rol de cada persona y repregunta cuando algo queda ambiguo. Texto o voz, desde el móvil, en menos de 5 minutos.',
  },
  row2: {
    eyebrow: '02 · El momento espejo',
    h3: 'El mapa se dibuja solo.',
    text: 'A partir de las entrevistas, la IA ensambla actividades y traspasos en un mapa vivo. Marca los cruces entre áreas y dónde se puede ahorrar tiempo con IA.',
    mapNodes: [
      { label: 'Captar lead', area: 'Comercial' },
      { label: 'Elaborar presupuesto', area: 'Comercial', badge: '−6 h/sem', opportunity: true },
      { label: 'Preparar pedido', area: 'Operac.' },
      { label: 'Facturar', area: 'Finanzas' },
      { label: 'Resolver incidencias', area: 'Atención', badge: '−8 h/sem', opportunity: true },
    ],
  },
  row3: {
    label: 'Tu equipo valida y aporta',
    item: {
      label: 'Coordinar envío',
      meta: 'Operaciones · de la entrevista de Andrés',
      from: 'Borrador',
      to: '✓ Validado',
    },
    notif: {
      text: 'Lucía comentó: “¿Avisas tú al cliente o Atención?”',
      time: 'hace 5 h',
    },
    eyebrow: '03 · Validar y aportar',
    h3: 'El humano confirma. El mapa es de fiar.',
    text: 'Cada persona valida los procesos de su área, comenta, etiqueta a quien debe verificar y añade lo que faltó. La validación es control, no burocracia — y cada nodo recuerda de dónde nació.',
  },
} as const;

// --- MIRROR -----------------------------------------------------------------

export const MIRROR = {
  eyebrow: 'El momento espejo',
  h2: 'La primera vez que tu empresa se ve a sí misma.',
  paragraph:
    'El mapa se dibuja solo a partir de las entrevistas y crece en tiempo real conforme tu gente responde. No decimos “encontramos caos”. Decimos: así trabaja tu empresa hoy.',
  emphasis: 'así trabaja tu empresa hoy',
  checks: [
    { bold: 'Cada nodo es trazable', rest: ' a la entrevista de la que nació.' },
    { bold: 'Validado por humanos', rest: ', no un diagrama generado a ciegas.' },
    { bold: 'La IA reorganiza', rest: ' el mapa y marca los cruces entre áreas.' },
  ],
  card: {
    label: 'Resultado típico',
    big: '≈ 18 h',
    sub: 'recuperadas por semana, identificadas en oportunidades de IA concretas y priorizadas.',
    metrics: [
      { label: 'Mapa autogenerado, sin editar', value: '≥ 70 %' },
      { label: 'Nodos validados por humanos', value: '≥ 80 %' },
      { label: 'Tiempo hasta el primer mapa', value: '< 24 h' },
    ],
  },
} as const;

// --- DIFFERENTIATOR ---------------------------------------------------------

export const DIFFERENTIATOR = {
  eyebrow: 'Por qué UnifyFlow',
  h2: 'Lo que las alternativas no cierran.',
  rows: [
    {
      name: 'Process mining',
      note: 'Exige event logs limpios de tus sistemas. Pesado, caro, enterprise.',
      tag: 'No es para PYMEs',
      highlight: false,
    },
    {
      name: 'Captura de SOPs',
      note: 'Documenta una tarea por grabación. No produce un mapa conectado de la organización.',
      tag: 'Una tarea, no el todo',
      highlight: false,
    },
    {
      name: 'Consultoría',
      note: 'Meses y un coste alto, para acabar con un diagrama muerto en un cajón.',
      tag: 'Lento y estático',
      highlight: false,
    },
    {
      name: 'UnifyFlow',
      note: 'Conversación → mapa vivo conectado → decisión de IA priorizada. En días, en español, con datos en la UE.',
      tag: 'El último kilómetro',
      highlight: true,
    },
  ],
} as const;

// --- PRINCIPLES -------------------------------------------------------------

export const PRINCIPLES = {
  eyebrow: 'Nuestros principios',
  h2: 'Fácil · Sanador · Seguro.',
  cards: [
    {
      title: 'Fácil de usar',
      text: 'La complejidad es nuestra, no tuya. Tu equipo responde 3–4 preguntas en menos de 5 minutos, desde el móvil, cuando quiera. Cero configuración.',
    },
    {
      title: 'Sanador y mágico',
      text: 'Convertimos el abrumo en alivio. El mapa que se dibuja solo, la empresa viéndose por primera vez. Una magia serena, nunca estridente.',
    },
    {
      title: 'Transmite seguridad',
      text: 'Datos en la UE, GDPR, sin captura de pantalla. Cada nodo muestra su procedencia y cada sugerencia de IA explica su porqué.',
    },
  ],
} as const;

// --- PREVIEW ----------------------------------------------------------------

export const PREVIEW = {
  eyebrow: 'Verás el resultado antes de pagar',
  h2: 'Un anticipo, no una caja negra.',
  paragraph:
    'El mapa es tuyo gratis. Te decimos cuántas oportunidades hay y cuánto puedes ahorrar — y desbloqueas la primera como muestra. El detalle, la prioridad y el plan llegan con la Radiografía.',
  panel: {
    label: 'Oportunidades de IA detectadas',
    count: '3 oportunidades',
    hours: '≈ 18 h',
    hoursSub: 'recuperables / semana',
    unlocked: {
      rank: '01',
      title: 'Generación automática de presupuestos',
      hours: '≈ 6 h/sem',
      pill: 'Muestra gratis · desbloqueada',
      quote:
        'Tres personas describen rehacer presupuestos a mano, cruzando precios de Compras con plazos de Operaciones.',
    },
    lockedLabel: 'Oportunidades 2 y 3, bloqueadas',
    lockedText:
      'Su evidencia, prioridad y plan de implementación se desbloquean con la Radiografía.',
    lockedCta: 'Desbloquear las 3 →',
  },
} as const;

// --- PRICING ----------------------------------------------------------------

export const PRICING = {
  eyebrow: 'Precio',
  h2: 'Empieza gratis. Paga cuando quieras actuar.',
  subtitle:
    'Ver tu empresa con claridad es gratis. La decisión accionable y el entregable son la Radiografía.',
  /** Default value; runtime can override via props.priceFrom */
  priceFrom: 'desde €490',
  plans: [
    {
      name: 'El espejo',
      tagline: 'Gratis · para siempre',
      price: '€0',
      features: [
        'Mapa vivo + entrevistas IA',
        'Hasta 10 personas · 1 organización',
        'Validación básica del equipo',
      ],
      note: '🔒 3 oportunidades · ≈ 18 h/sem — Las detectamos por ti. El detalle y el porqué se desbloquean con la Radiografía.',
      cta: 'Empieza gratis',
      highlight: false,
    },
    {
      name: 'Radiografía + IA',
      tagline: 'Pago único · desbloquea todo',
      price: 'desde €490',
      priceSuffix: '· según tamaño',
      badge: 'Más popular',
      tiers: [
        'Hasta 25 personas €490',
        '26 – 75 personas €990',
        '76 – 150 personas €1.490',
      ],
      features: [
        'Todo lo del Espejo, y además:',
        'Oportunidades de IA desbloqueadas y justificadas',
        'Export de la Radiografía de marca',
        'Equipo y áreas ilimitadas',
      ],
      cta: 'Desbloquear radiografía',
      highlight: true,
    },
    {
      name: 'Mapa Vivo',
      tagline: 'Suscripción · próximamente',
      price: 'Pronto',
      features: [
        'El mapa se mantiene actualizado solo',
        'Re-detección periódica de oportunidades',
        'Voz en las entrevistas',
      ],
      cta: 'Únete a la lista',
      highlight: false,
    },
  ],
} as const;

// --- FINAL CTA --------------------------------------------------------------

export const FINAL_CTA = {
  h2: '¿Lista tu empresa para verse con claridad?',
  paragraph:
    'Sal de aquí con calma, claridad y una decisión accionable sobre dónde aplicar IA.',
  cta: 'Empieza gratis · crea el enlace',
  link: 'Hablar con el equipo →',
} as const;

// --- FOOTER -----------------------------------------------------------------

export const FOOTER = {
  brand: 'UnifyFlow',
  by: 'por Lucho con IA',
  legal: 'Datos en la UE · GDPR · © 2026',
} as const;

// --- MODAL COPY -------------------------------------------------------------

export const MODAL_COPY = {
  start: {
    h3: 'Crea el espejo de tu empresa.',
    paragraph: 'Gratis, sin tarjeta. En un minuto tienes un enlace para enviar a tu equipo.',
    fieldCompany: {
      label: 'Nombre de la empresa',
      placeholder: 'p. ej. Distribuciones Robledo',
    },
    fieldEmail: {
      label: 'Tu email',
      placeholder: 'tú@empresa.com',
    },
    button: 'Generar enlace de equipo →',
    micro: 'Te pediremos crear cuenta solo cuando quieras guardar tu mapa.',
  },
  link: {
    h3: 'Tu enlace está listo.',
    paragraph:
      'Compártelo con tu equipo. Cada persona responde 3–4 preguntas en menos de 5 minutos, desde el móvil.',
    copyButton: 'Copiar',
    emailButton: 'Enviar por email',
    doneButton: 'Entendido',
    micro:
      'Cuando completen sus entrevistas, tu mapa se dibuja solo. Te pediremos registrarte para guardarlo y desbloquear las oportunidades de IA.',
  },
  mailtoSubject: 'Ayúdame a mapear cómo trabajamos (5 min)',
  mailtoBody:
    'Responde 3–4 preguntas para dibujar el mapa de nuestros procesos:\n\nhttps://{link}\n\nGracias.',
} as const;
