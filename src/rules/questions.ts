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

/**
 * Puerta de entrada del artículo 2 (ámbito de aplicación) — verificado
 * apartado por apartado contra artificialintelligenceact.eu/article/2/
 * el 3 de septiembre de 2026 (EUR-Lex no es accesible por fetch
 * directo). Antes de este árbol, un sistema militar o un modelo
 * open-source podía entrar igual por toda la clasificación y salir
 * "alto riesgo" cuando el Reglamento ni le aplica.
 *
 * Las tres primeras son exclusiones absolutas: si alguna es "sí", el
 * sistema queda fuera del Reglamento sin más preguntas. La de código
 * abierto es distinta — NO excluye por sí sola (el art. 2.12 dice
 * "salvo que se introduzca como sistema de alto riesgo"), así que se
 * pregunta pero no corta el árbol: se aplica al final, solo si el
 * resultado no acaba siendo alto riesgo o uso prohibido.
 */
export const Q_EXCLUSION_MILITAR: Question = {
  id: "exclusion_militar",
  text: "¿El sistema se introduce en el mercado, se pone en servicio o se usa exclusivamente con fines militares, de defensa o de seguridad nacional, sin ningún fin adicional no excluido (como uso civil o de garantía del cumplimiento del Derecho)?",
  helpExample:
    "Sí: un sistema de puntería usado solo por las fuerzas armadas. No: el mismo sistema si además tiene un uso civil — ahí sí entra en el ámbito del Reglamento.",
  legalRef: "art. 2.3",
};

export const Q_EXCLUSION_INVESTIGACION_DESARROLLO: Question = {
  id: "exclusion_investigacion_desarrollo",
  text: "¿El sistema se desarrolla y pone en servicio únicamente con fines de investigación científica y desarrollo, y todavía no se ha introducido en el mercado ni puesto en servicio para su finalidad prevista (las pruebas en condiciones reales YA NO entran en esta exclusión)?",
  helpExample:
    "Sí: un prototipo de laboratorio que aún no ha salido del entorno de investigación. No: el mismo sistema en cuanto empieza a probarse en condiciones reales fuera del laboratorio, o se pone en servicio para su uso previsto.",
  legalRef: "art. 2.6 / 2.8",
};

export const Q_EXCLUSION_USO_PERSONAL: Question = {
  id: "exclusion_uso_personal",
  text: "¿Lo usa una persona física, en su vida privada, por motivos puramente personales y no profesionales?",
  helpExample:
    "Sí: alguien usa un asistente de IA para gestionar su propio correo personal. No: una organización lo usa para su actividad, aunque sea solo a nivel interno.",
  legalRef: "art. 2.10",
};

export const Q_ES_CODIGO_ABIERTO: Question = {
  id: "es_codigo_abierto",
  text: "¿El sistema (o el modelo en el que se basa) se publica bajo una licencia libre y de código abierto?",
  helpExample:
    "Sí: un modelo publicado con pesos, código y documentación accesibles bajo una licencia abierta. No: un sistema propietario o de acceso restringido, aunque sea gratuito.",
  legalRef: "art. 2.12",
};

/** Las 4 preguntas del art. 2, en el orden en que se recorren — primero las 3 exclusiones absolutas, luego código abierto. */
export const SCOPE_EXCLUSION_QUESTIONS: Question[] = [
  Q_EXCLUSION_MILITAR,
  Q_EXCLUSION_INVESTIGACION_DESARROLLO,
  Q_EXCLUSION_USO_PERSONAL,
  Q_ES_CODIGO_ABIERTO,
];

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

/**
 * Modelos de IA de uso general (GPAI, Capítulo V, arts. 51-56): un
 * proveedor de este tipo de modelo tiene sus propias obligaciones,
 * completamente al margen de la clasificación por Anexo I/III — no
 * es "un tipo más de alto riesgo", es una vía distinta. Antes no se
 * preguntaba nada de esto; solo aparecía como una frase de refilón
 * en el resultado "sin obligaciones específicas".
 */
export const Q_ES_GPAI: Question = {
  id: "es_modelo_uso_general",
  text: "¿Tu organización desarrolla y publica (comercializa o pone en servicio) este modelo, y es un modelo de IA de uso general — capaz de realizar con competencia una amplia variedad de tareas distintas, no diseñado para una única finalidad?",
  helpExample:
    "Sí: una empresa que entrena y publica un modelo fundacional de texto o imagen para que terceros construyan aplicaciones encima. No: una organización que solo usa la API de un modelo de terceros (como GPT o Claude) dentro de su propia aplicación — ahí no es proveedora del modelo, es usuaria.",
  legalRef: "art. 3.63",
};

export const Q_GPAI_RIESGO_SISTEMICO: Question = {
  id: "gpai_riesgo_sistemico",
  text: "¿El modelo tiene capacidades de alto impacto — por ejemplo, se ha entrenado con más de 10^25 FLOP de cómputo, o la Comisión Europea lo ha designado como de riesgo sistémico?",
  helpExample:
    "Sí: modelos frontera de gran escala de los grandes laboratorios de IA. No: modelos de tamaño medio o pequeño, sin ese nivel de cómputo ni designación de la Comisión.",
  legalRef: "art. 51",
};

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

/**
 * El art. 50 tiene obligaciones distintas según el disparador: hablar
 * con una persona (50.1) no es lo mismo que generar contenido que se
 * publica (50.2/50.4). Antes era una sola pregunta con "o" en medio
 * — un sistema que solo genera texto para publicar (sin conversar con
 * nadie) contestaba "sí" y el plan de acción le exigía también avisar
 * de la interacción con una IA, que no le aplica. Separadas, cada una
 * activa solo su propia obligación.
 */
export const Q_INTERACTUA_CON_PERSONAS: Question = {
  id: "interactua_con_personas",
  text: "¿El sistema interactúa directamente con personas físicas — por ejemplo un chatbot, un asistente de voz o cualquier interfaz conversacional?",
  helpExample:
    "Sí: un chatbot de atención al cliente que conversa con usuarios. No: una herramienta que redacta borradores de texto para que alguien los revise y publique por su cuenta, sin que nadie converse con ella.",
  legalRef: "art. 50.1",
};

export const Q_GENERA_CONTENIDO_SINTETICO: Question = {
  id: "genera_contenido_sintetico",
  text: "¿El sistema genera o manipula contenido sintético (texto, imagen, audio o vídeo) que se publica o distribuye?",
  helpExample:
    "Sí: artículos, imágenes o vídeos generados por IA que terminan publicados. No: un sistema que solo clasifica o procesa datos internamente, sin producir contenido publicable.",
  legalRef: "art. 50.2 / 50.4",
};

/**
 * Excepción del art. 50.4: si el contenido pasa por revisión humana
 * sustantiva y hay una persona (física o jurídica) que asume la
 * responsabilidad editorial, no hace falta marcarlo como generado
 * por IA. Verificado el 3 de septiembre de 2026 contra fuentes que
 * citan el texto del Reglamento — con un matiz importante: una
 * revisión meramente ortográfica o formal NO cuenta como revisión
 * editorial a estos efectos. Encontrada por un agente en una prueba
 * ciega de clasificación (caso de una universidad redactando
 * artículos institucionales con IA) — el árbol no la tenía hasta
 * ahora y le exigía marcar el contenido aunque hubiera revisión real.
 */
export const Q_REVISION_EDITORIAL: Question = {
  id: "revision_editorial_sustantiva",
  text: "Antes de publicarse, ¿el contenido generado pasa por una revisión humana sustantiva (no solo ortográfica o de formato) y hay una persona física o jurídica que asume la responsabilidad editorial de lo que se publica?",
  helpExample:
    "Sí: alguien del equipo revisa el fondo del contenido, decide si se publica y asume esa responsabilidad. No: se publica automáticamente, o la única revisión es corregir ortografía/gramática — eso NO cuenta como revisión editorial a estos efectos.",
  legalRef: "art. 50.4",
};

/** Preguntas del árbol principal, en orden de recorrido por defecto. */
export const CORE_QUESTIONS: Question[] = [
  ...SCOPE_EXCLUSION_QUESTIONS,
  Q_ES_SISTEMA_IA,
  ...PROHIBITED_PRACTICE_QUESTIONS,
  Q_ES_GPAI,
  Q_GPAI_RIESGO_SISTEMICO,
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

/** Preguntas de transparencia (art. 50), para sistemas que no son de alto riesgo. */
export const TRANSPARENCY_QUESTIONS: Question[] = [
  Q_INTERACTUA_CON_PERSONAS,
  Q_GENERA_CONTENIDO_SINTETICO,
  Q_REVISION_EDITORIAL,
];

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
