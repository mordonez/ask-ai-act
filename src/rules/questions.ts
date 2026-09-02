import type { Question } from "./types";

/**
 * Preguntas del árbol de clasificación, en el orden en que debe
 * recorrerlas el wizard. `classify()` en classify.ts es la única
 * fuente de verdad sobre qué hacer con las respuestas — este fichero
 * solo describe qué preguntar y por qué (con su cita legal).
 */

export const Q_ES_SISTEMA_IA: Question = {
  id: "es_sistema_ia",
  text: "¿El sistema aprende, infiere o razona a partir de datos para generar predicciones, contenido, recomendaciones o decisiones que influyen en entornos físicos o virtuales?",
  helpExample:
    "Un sistema basado únicamente en reglas fijas o heurísticas explícitas, sin ningún componente que infiera a partir de datos, puede quedar fuera de esta definición.",
  legalRef: "art. 3.1",
};

export const Q_PRACTICA_PROHIBIDA: Question = {
  id: "practica_prohibida",
  text: "¿El sistema manipula decisiones de forma subliminal o engañosa, explota vulnerabilidades, puntúa socialmente a personas, predice delitos solo por perfilado, crea bases de reconocimiento facial por recopilación indiscriminada, infiere emociones en el trabajo o la educación, categoriza biométricamente datos sensibles, hace identificación biométrica remota en tiempo real en espacios públicos con fines policiales, o genera contenido íntimo no consentido?",
  helpExample:
    "Si dudas, esta pregunta necesita revisión jurídica — no la respondas a la ligera.",
  legalRef: "art. 5",
};

export const Q_ANEXO_I_O_III: Question = {
  id: "anexo_i_o_iii",
  text: "¿El sistema es (o es componente de seguridad de) un producto ya regulado por legislación europea de seguridad (Anexo I), o su finalidad encaja en uno de los ámbitos del Anexo III (biometría, infraestructuras críticas, educación, empleo, servicios esenciales, actuación policial, migración/fronteras, justicia/procesos democráticos)?",
  legalRef: "Anexo I / Anexo III",
};

export const Q_PERFILADO: Question = {
  id: "realiza_perfilado",
  text: "¿El sistema realiza perfilado de personas físicas (evalúa aspectos de su personalidad, comportamiento, situación económica, salud, intereses o comportamiento)?",
  legalRef: "art. 6.3, párrafo final",
};

export const Q_INFLUYE_MATERIALMENTE: Question = {
  id: "influye_materialmente",
  text: "¿El resultado del sistema puede influir de forma relevante en la decisión final, más allá de una función procedimental o preparatoria? (obsérvalo en el funcionamiento real, no en el nombre de la herramienta)",
  legalRef: "art. 6.3",
};

export const Q_TAREA_LIMITADA: Question = {
  id: "tarea_procedimental_limitada",
  text: "¿El sistema ejecuta una tarea procedimental limitada (por ejemplo, convertir documentos a un formato común antes de que una persona examine su contenido), sin usarse para descartar solicitudes?",
  legalRef: "art. 6.3.a",
};

export const Q_MEJORA_TRABAJO_HUMANO: Question = {
  id: "mejora_resultado_humano_terminado",
  text: "¿El sistema mejora el resultado de una actividad humana ya terminada, sin modificar la conclusión ni recomendar una decisión distinta?",
  legalRef: "art. 6.3.b",
};

export const Q_DETECTA_PATRONES: Question = {
  id: "detecta_patrones_sin_sustituir",
  text: "¿El sistema detecta patrones o desviaciones para que una persona los investigue, sin que la señal decida un rechazo ni pese en la evaluación?",
  legalRef: "art. 6.3.c",
};

export const Q_TAREA_PREPARATORIA: Question = {
  id: "tarea_preparatoria",
  text: "¿El sistema realiza una tarea preparatoria (por ejemplo clasificar expedientes por idioma), sin que su resultado condicione la revisión posterior?",
  legalRef: "art. 6.3.d",
};

export const Q_OBLIGACIONES_TRANSPARENCIA: Question = {
  id: "obligaciones_transparencia",
  text: "¿El sistema interactúa directamente con personas (p. ej. un chatbot) o genera/manipula contenido sintético (texto, imagen, audio, vídeo)?",
  legalRef: "art. 50",
};

/** Preguntas del árbol principal, en orden de recorrido por defecto. */
export const CORE_QUESTIONS: Question[] = [
  Q_ES_SISTEMA_IA,
  Q_PRACTICA_PROHIBIDA,
  Q_ANEXO_I_O_III,
];

/** Sub-preguntas del filtro del artículo 6.3, solo si aplica el Anexo III. */
export const FILTER_6_3_QUESTIONS: Question[] = [
  Q_PERFILADO,
  Q_INFLUYE_MATERIALMENTE,
  Q_TAREA_LIMITADA,
  Q_MEJORA_TRABAJO_HUMANO,
  Q_DETECTA_PATRONES,
  Q_TAREA_PREPARATORIA,
];

/** Pregunta de transparencia, para sistemas que no son de alto riesgo. */
export const TRANSPARENCY_QUESTIONS: Question[] = [Q_OBLIGACIONES_TRANSPARENCIA];

export const ROLE_QUESTION_ID = "rol_organizacion";
export type Role =
  | "proveedor"
  | "responsable_despliegue"
  | "importador"
  | "distribuidor"
  | "representante_autorizado";

export const ROLE_LABELS: Record<Role, string> = {
  proveedor: "Proveedor — lo desarrolla y lo comercializa o pone en servicio bajo su marca",
  responsable_despliegue: "Responsable del despliegue — lo utiliza bajo su autoridad",
  importador: "Importador — lo introduce en el mercado de la Unión desde fuera de ella",
  distribuidor: "Distribuidor — lo pone a disposición en la cadena sin ser proveedor ni importador",
  representante_autorizado: "Representante autorizado — actúa en la Unión por mandato de un proveedor externo",
};
