import type { Question } from "./types";

/**
 * Preguntas del árbol de clasificación, en el orden en que debe
 * recorrerlas el wizard. `classify()` en classify.ts es la única
 * fuente de verdad sobre qué hacer con las respuestas — este fichero
 * solo describe qué preguntar y por qué (con su cita legal).
 *
 * Cada pregunta lleva `helpExample` con un caso que respondería "sí"
 * y, cuando ayuda a no confundirlo, uno que respondería "no". Sin
 * ejemplo es fácil que alguien interprete el texto legal a su manera
 * y conteste mal sin darse cuenta.
 */

export const Q_ES_SISTEMA_IA: Question = {
  id: "es_sistema_ia",
  text: "¿El sistema aprende, infiere o razona a partir de datos para generar predicciones, contenido, recomendaciones o decisiones que influyen en entornos físicos o virtuales?",
  helpExample:
    "Sí: un modelo que predice si concederte una ayuda a partir de tus datos. No: una hoja de cálculo con una fórmula fija (si ingresos < X, entonces rechazar) — un sistema basado únicamente en reglas explícitas puede quedar fuera de esta definición.",
  legalRef: "art. 3.1",
};

/**
 * Las 9 prácticas prohibidas del artículo 5, una por una en vez de
 * una sola pregunta con las 9 seguidas. Con las 9 en un párrafo es
 * fácil leerlo por encima y contestar "no" sin darse cuenta de que
 * una de ellas sí aplica — separarlas reduce ese riesgo, aunque
 * alargue el wizard.
 *
 * Nota de procedencia: las letras (a)-(h) del art. 5.1 son estructura
 * estable y bien documentada del Reglamento (UE) 2024/1689. La 9ª
 * (contenido íntimo no consentido) no está en el art. 5 original —
 * se añade con el Reglamento (UE) 2026/1744, ver la tabla de fechas
 * del post del blog. Si se consigue el texto consolidado oficial en
 * `sources/`, verificar las letras contra él.
 */
export const Q_PROHIBIDO_MANIPULACION: Question = {
  id: "prohibido_manipulacion",
  text: "¿El sistema usa técnicas subliminales (imperceptibles para la persona) o manipuladoras/engañosas, con el objetivo o el efecto de alterar de forma relevante su comportamiento y causarle (o poder causarle) un perjuicio significativo?",
  helpExample:
    "Sí: una app que inserta estímulos imperceptibles para empujar a una persona vulnerable a una compra perjudicial. No: publicidad normal, persuasiva pero transparente sobre su intención.",
  legalRef: "art. 5.1.a",
};

export const Q_PROHIBIDO_VULNERABILIDADES: Question = {
  id: "prohibido_vulnerabilidades",
  text: "¿El sistema explota la edad, una discapacidad o una situación social o económica concreta de una persona o grupo para alterar su comportamiento y causarle un perjuicio?",
  helpExample:
    "Sí: un asistente dirigido a menores que usa su edad para inducir compras repetidas. No: un producto pensado para personas mayores que simplemente simplifica la interfaz.",
  legalRef: "art. 5.1.b",
};

export const Q_PROHIBIDO_SCORING_SOCIAL: Question = {
  id: "prohibido_scoring_social",
  text: "¿El sistema puntúa o clasifica a personas por su comportamiento o características personales, y esa puntuación se usa para darles un trato perjudicial o desproporcionado en un contexto distinto de aquel en el que se generaron los datos?",
  helpExample:
    "Sí: limitar el acceso a un servicio público por conductas observadas en redes sociales. No: un scoring de riesgo crediticio limitado al propio contexto financiero y proporcionado (puede tener otras obligaciones, pero no es esta prohibición).",
  legalRef: "art. 5.1.c",
};

export const Q_PROHIBIDO_PREDICCION_DELICTIVA: Question = {
  id: "prohibido_prediccion_delictiva",
  text: "¿El sistema estima que una persona cometerá un delito basándose únicamente en su perfil o rasgos de personalidad, sin hechos objetivos y verificables relacionados con una actividad delictiva?",
  helpExample:
    "Sí: señalar a alguien como probable autor solo por su personalidad y situación personal. No: un sistema que apoya la evaluación humana de pruebas objetivas ya existentes de un caso concreto.",
  legalRef: "art. 5.1.d",
};

export const Q_PROHIBIDO_RECONOCIMIENTO_FACIAL: Question = {
  id: "prohibido_reconocimiento_facial",
  text: "¿El sistema crea o amplía una base de datos de reconocimiento facial extrayendo imágenes de internet o de cámaras de videovigilancia de forma indiscriminada (sin un criterio específico dirigido a esas personas)?",
  helpExample:
    "Sí: descargar fotos de redes sociales en masa para ampliar una base de identificación. No: una base de datos con el consentimiento explícito de cada persona incluida.",
  legalRef: "art. 5.1.e",
};

export const Q_PROHIBIDO_INFERENCIA_EMOCIONAL: Question = {
  id: "prohibido_inferencia_emocional",
  text: "¿El sistema infiere emociones de personas en el trabajo o en centros educativos, sin que sea por razones médicas o de seguridad?",
  helpExample:
    "Sí: analizar por webcam si una persona parece motivada durante una entrevista de trabajo. No: un sistema médico que detecta signos de fatiga en personal sanitario por seguridad.",
  legalRef: "art. 5.1.f",
};

export const Q_PROHIBIDO_CATEGORIZACION_BIOMETRICA: Question = {
  id: "prohibido_categorizacion_biometrica",
  text: "¿El sistema usa datos biométricos para inferir o deducir origen racial o étnico, opiniones políticas, afiliación sindical, creencias religiosas o filosóficas, vida sexual u orientación sexual de una persona?",
  helpExample:
    "Sí: clasificar las creencias religiosas de alguien a partir de sus rasgos faciales. No: verificar biométricamente que una persona es quien dice ser, sin inferir ninguno de esos aspectos.",
  legalRef: "art. 5.1.g",
};

export const Q_PROHIBIDO_BIOMETRIA_REMOTA_TIEMPO_REAL: Question = {
  id: "prohibido_biometria_remota_tiempo_real",
  text: "¿El sistema hace identificación biométrica remota EN TIEMPO REAL en espacios de acceso público, con fines de actuación policial (fuera de los supuestos y garantías tasados por el Reglamento)?",
  helpExample:
    "Sí: identificar en directo a todas las personas que pasan por una plaza pública para fines policiales generales. No: control de acceso biométrico en la entrada de una oficina privada.",
  legalRef: "art. 5.1.h",
};

export const Q_PROHIBIDO_CONTENIDO_INTIMO: Question = {
  id: "prohibido_contenido_intimo",
  text: "¿El sistema genera o manipula contenido íntimo no consentido de una persona real, o material de abuso sexual infantil?",
  helpExample:
    "Sí: una aplicación de \"desnudo\" generado a partir de la fotografía de una persona real sin su consentimiento. Prohibido desde el 2 de diciembre de 2026.",
  legalRef: "Reglamento (UE) 2026/1744",
};

/** Las 9 preguntas de prácticas prohibidas, en el orden en que se recorren. */
export const PROHIBITED_PRACTICE_QUESTIONS: Question[] = [
  Q_PROHIBIDO_MANIPULACION,
  Q_PROHIBIDO_VULNERABILIDADES,
  Q_PROHIBIDO_SCORING_SOCIAL,
  Q_PROHIBIDO_PREDICCION_DELICTIVA,
  Q_PROHIBIDO_RECONOCIMIENTO_FACIAL,
  Q_PROHIBIDO_INFERENCIA_EMOCIONAL,
  Q_PROHIBIDO_CATEGORIZACION_BIOMETRICA,
  Q_PROHIBIDO_BIOMETRIA_REMOTA_TIEMPO_REAL,
  Q_PROHIBIDO_CONTENIDO_INTIMO,
];

export const Q_ANEXO_I_O_III: Question = {
  id: "anexo_i_o_iii",
  text: "¿El sistema es (o es componente de seguridad de) un producto ya regulado por legislación europea de seguridad (Anexo I), o su finalidad encaja en uno de los ámbitos del Anexo III (biometría, infraestructuras críticas, educación, empleo, servicios esenciales, actuación policial, migración/fronteras, justicia/procesos democráticos)?",
  helpExample:
    "Sí: una bomba de insulina que ajusta la dosis con IA (Anexo I, producto sanitario), o un sistema que filtra currículos o decide promociones (Anexo III, empleo). No: una herramienta interna de IA que resume actas de reuniones, sin encajar en ningún ámbito regulado.",
  legalRef: "Anexo I / Anexo III",
};

export const Q_PERFILADO: Question = {
  id: "realiza_perfilado",
  text: "¿El sistema realiza perfilado de personas físicas (evalúa aspectos de su personalidad, comportamiento, situación económica, salud, intereses o comportamiento)?",
  helpExample:
    "Sí: un sistema que evalúa parámetros de una persona empleada para decidir su promoción, o los datos de una unidad familiar para valorar una ayuda. No: un sistema que solo convierte formatos de documento sin analizar a ninguna persona.",
  legalRef: "art. 6.3, párrafo final",
};

export const Q_INFLUYE_MATERIALMENTE: Question = {
  id: "influye_materialmente",
  text: "¿El resultado del sistema puede influir de forma relevante en la decisión final, más allá de una función procedimental o preparatoria? (obsérvalo en el funcionamiento real, no en el nombre de la herramienta)",
  helpExample:
    "Sí: una recomendación que el equipo sigue casi siempre, aunque formalmente la decisión la firme una persona. No: una alerta que un equipo humano investiga y descarta habitualmente, sin que determine el resultado.",
  legalRef: "art. 6.3",
};

export const Q_TAREA_LIMITADA: Question = {
  id: "tarea_procedimental_limitada",
  text: "¿El sistema ejecuta una tarea procedimental limitada (por ejemplo, convertir documentos a un formato común antes de que una persona examine su contenido), sin usarse para descartar solicitudes?",
  helpExample:
    "Sí: digitalizar y estructurar formularios en papel para que una persona los revise después. No: el mismo proceso, pero si además descarta automáticamente los formularios incompletos.",
  legalRef: "art. 6.3.a",
};

export const Q_MEJORA_TRABAJO_HUMANO: Question = {
  id: "mejora_resultado_humano_terminado",
  text: "¿El sistema mejora el resultado de una actividad humana ya terminada, sin modificar la conclusión ni recomendar una decisión distinta?",
  helpExample:
    "Sí: corregir el formato y la redacción de una resolución que una persona ya redactó y aprobó. No: un sistema que revisa esa misma resolución y sugiere cambiar la decisión de fondo.",
  legalRef: "art. 6.3.b",
};

export const Q_DETECTA_PATRONES: Question = {
  id: "detecta_patrones_sin_sustituir",
  text: "¿El sistema detecta patrones o desviaciones para que una persona los investigue, sin que la señal decida un rechazo ni pese en la evaluación?",
  helpExample:
    "Sí: señalar posibles duplicados en una lista para que alguien los compruebe. No: la misma señal, pero si una solicitud marcada se rechaza automáticamente sin revisión humana real.",
  legalRef: "art. 6.3.c",
};

export const Q_TAREA_PREPARATORIA: Question = {
  id: "tarea_preparatoria",
  text: "¿El sistema realiza una tarea preparatoria (por ejemplo clasificar expedientes por idioma), sin que su resultado condicione la revisión posterior?",
  helpExample:
    "Sí: repartir expedientes por idioma al equipo correspondiente. No: ordenarlos por probabilidad de obtener una ayuda, si esa puntuación condiciona qué se revisa antes o con más atención.",
  legalRef: "art. 6.3.d",
};

export const Q_OBLIGACIONES_TRANSPARENCIA: Question = {
  id: "obligaciones_transparencia",
  text: "¿El sistema interactúa directamente con personas (p. ej. un chatbot) o genera/manipula contenido sintético (texto, imagen, audio, vídeo)?",
  helpExample:
    "Sí: un chatbot de atención al cliente, o una herramienta que genera imágenes realistas. No: un sistema interno que solo procesa datos sin generar contenido ni hablar con nadie.",
  legalRef: "art. 50",
};

/** Preguntas del árbol principal, en orden de recorrido por defecto. */
export const CORE_QUESTIONS: Question[] = [
  Q_ES_SISTEMA_IA,
  ...PROHIBITED_PRACTICE_QUESTIONS,
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
