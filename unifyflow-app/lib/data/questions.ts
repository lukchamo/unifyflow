export interface QuestionMember {
  nombre: string;
  cargo: string;
  area: string;
}

export interface Question {
  id: string;
  text: string;
}

type AreaBank = [string, string, string, string];

const banks: Record<string, AreaBank> = {
  Operaciones: [
    "Hola, {nombre}. Para empezar, cuéntame: ¿qué haces tú cuando entra un pedido nuevo de un cliente?",
    "¿A quién le pasas ese pedido cuando ya lo tienes listo, y cómo se lo haces llegar?",
    "¿Qué parte del proceso te quita más tiempo o te toca rehacer a mano?",
    "¿Hay algo que te frene para cerrar un pedido más rápido de lo que quisiera?",
  ],
  Comercial: [
    "Hola, {nombre}. Cuéntame un poco: ¿cómo arranca tu día cuando tienes que darle seguimiento a un cliente?",
    "Cuando cierras una venta, ¿a quién le avisas y cómo le pasas la información?",
    "¿Qué parte del proceso de venta te toca hacer a mano que sientes que debería ser automático?",
    "¿Qué te frena más a la hora de responderle rápido a un cliente potencial?",
  ],
  Compras: [
    "Hola, {nombre}. Para empezar, cuéntame: ¿cómo decides cuándo hay que hacer un pedido a un proveedor?",
    "¿A quién le informas cuando colocas una orden de compra y cómo lo haces?",
    "¿Qué parte de gestionar compras te quita más tiempo o repites con más frecuencia?",
    "¿Qué te complica más para tener el inventario al día sin sorpresas?",
  ],
  Finanzas: [
    "Hola, {nombre}. Cuéntame: ¿cómo es tu proceso cuando tienes que registrar un pago o una factura nueva?",
    "¿A quién le compartes los reportes financieros y cómo se los haces llegar?",
    "¿Qué tarea de cierre de mes te toca hacer a mano y te gustaría que fluyera sola?",
    "¿Qué parte del trabajo te frena para tener los números listos cuando los necesitan?",
  ],
  Atención: [
    "Hola, {nombre}. Cuéntame cómo empieza tu día cuando recibes una solicitud o queja de un cliente.",
    "¿A quién escala un caso cuando no puedes resolverlo tú solo y cómo se lo pasas?",
    "¿Qué tipo de consulta te toca responder una y otra vez que sientes que podría resolverse sola?",
    "¿Qué te quita más tiempo de atender bien a un cliente cuando más lo necesita?",
  ],
};

const defaultBank: AreaBank = [
  "Hola, {nombre}. Para empezar, cuéntame: ¿cómo es un día típico de trabajo para ti?",
  "¿Con quién colaboras más seguido y cómo le pasas la información que necesita?",
  "¿Qué tarea del día a día sientes que te quita demasiado tiempo o repites a mano?",
  "¿Qué te frena para hacer tu trabajo más rápido o con menos tropiezos?",
];

export function getQuestions(member: QuestionMember): Question[] {
  const bank: AreaBank = banks[member.area] ?? defaultBank;
  return bank.map((text, i) => ({
    id: `${member.area}-q${i + 1}`,
    text: text.replace("{nombre}", member.nombre),
  }));
}

const followUps: Record<string, string> = {
  Operaciones: "Entiendo. ¿Puedes contarme un poco más de esa parte del proceso?",
  Comercial: "Claro. ¿Puedes darme un ejemplo concreto de cuándo eso te pasa?",
  Compras: "Interesante. ¿Qué tan seguido te ocurre eso que me cuentas?",
  Finanzas: "Entiendo. ¿Cómo afecta eso al cierre o a los reportes?",
  Atención: "Gracias. ¿Puedes contarme más sobre cómo suele terminar ese tipo de caso?",
};

const defaultFollowUp = "Entiendo. ¿Puedes contarme un poco más de esa parte?";

export function getFollowUp(area: string): string {
  return followUps[area] ?? defaultFollowUp;
}
