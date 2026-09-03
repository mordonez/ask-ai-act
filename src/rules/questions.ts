import type { Question } from "./types";

/**
 * Preguntas del árbol de clasificación, en el orden en que debe
 * recorrerlas el wizard. `classify()` en classify.ts es la única
 * fuente de verdad sobre qué hacer con las respuestas — este fichero
 * solo describe qué preguntar y por qué (con su cita legal).
 *
 * Cada pregunta lleva `examples` con casos que responderían "sí" y
 * casos que responderían "no", en listas separadas — más de uno por
 * lado cuando un solo ejemplo no basta para ver el matiz. Sin
 * ejemplos es fácil que alguien interprete el texto legal a su
 * manera y conteste mal sin darse cuenta.
 */

/**
 * Puerta de entrada del artículo 2 (ámbito de aplicación) — verificado
 * apartado por apartado contra artificialintelligenceact.eu/article/2/
 * el 3 de septiembre de 2026 (EUR-Lex no era accesible por fetch
 * directo en ese momento — un curl/WebFetch automatizado recibe un
 * challenge de AWS WAF; solo carga con un navegador real. Desde
 * entonces el texto oficial completo vive en
 * `sources/reglamento_ue_2024_1689_es.txt`, la fuente a usar para
 * revisar esta nota). Antes de este árbol, un sistema militar o un modelo
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
  examples: {
    si: [
      "Un sistema de puntería usado solo por las fuerzas armadas.",
      "Software de mando y control militar, sin ninguna aplicación fuera del ejército.",
    ],
    no: [
      "El mismo sistema de puntería, si además tiene un uso civil — ahí sí entra en el ámbito del Reglamento.",
      "Un sistema de vigilancia usado tanto por el ejército como por seguridad privada civil.",
    ],
  },
  legalRef: "art. 2.3",
  links: [{ label: "Texto del artículo 2 — ámbito de aplicación", url: "https://artificialintelligenceact.eu/article/2/" }],
};

export const Q_EXCLUSION_INVESTIGACION_DESARROLLO: Question = {
  id: "exclusion_investigacion_desarrollo",
  text: "¿El sistema se desarrolla y pone en servicio únicamente con fines de investigación científica y desarrollo, y todavía no se ha introducido en el mercado ni puesto en servicio para su finalidad prevista (las pruebas en condiciones reales YA NO entran en esta exclusión)?",
  examples: {
    si: [
      "Un prototipo de laboratorio que aún no ha salido del entorno de investigación.",
      "Un modelo académico que solo se usa en un paper y en un entorno de pruebas cerrado.",
    ],
    no: [
      "El mismo sistema en cuanto empieza a probarse en condiciones reales fuera del laboratorio, o se pone en servicio para su uso previsto.",
      "El mismo prototipo, una vez integrado en un producto que ya se vende a clientes.",
    ],
  },
  legalRef: "art. 2.6 / 2.8",
  links: [{ label: "Texto del artículo 2 — ámbito de aplicación", url: "https://artificialintelligenceact.eu/article/2/" }],
};

export const Q_EXCLUSION_USO_PERSONAL: Question = {
  id: "exclusion_uso_personal",
  text: "¿Lo usa una persona física, en su vida privada, por motivos puramente personales y no profesionales?",
  examples: {
    si: [
      "Alguien usa un asistente de IA para gestionar su propio correo personal.",
      "Una persona usa una app de IA para planificar sus vacaciones.",
    ],
    no: [
      "Una organización lo usa para su actividad, aunque sea solo a nivel interno.",
      "Un autónomo lo usa para gestionar los pedidos de su negocio — ya es un uso profesional.",
    ],
  },
  legalRef: "art. 2.10",
  links: [{ label: "Texto del artículo 2 — ámbito de aplicación", url: "https://artificialintelligenceact.eu/article/2/" }],
};

export const Q_ES_CODIGO_ABIERTO: Question = {
  id: "es_codigo_abierto",
  text: "¿El sistema (o el modelo en el que se basa) se publica bajo una licencia libre y de código abierto?",
  examples: {
    si: [
      "Un modelo publicado con pesos, código y documentación accesibles bajo una licencia abierta.",
      "Un modelo en un repositorio público con licencia tipo Apache 2.0 y pesos descargables.",
    ],
    no: [
      "Un sistema propietario o de acceso restringido, aunque sea gratuito.",
      "Una API de pago con modelo cerrado, aunque el uso sea gratuito en un plan básico.",
    ],
  },
  legalRef: "art. 2.12",
  links: [{ label: "Texto del artículo 2 — ámbito de aplicación", url: "https://artificialintelligenceact.eu/article/2/" }],
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
  examples: {
    si: [
      "Un modelo que predice si concederte una ayuda a partir de tus datos.",
      "Un chatbot que genera respuestas distintas según el contexto de la conversación.",
    ],
    no: [
      "Una hoja de cálculo con una fórmula fija (si ingresos < X, entonces rechazar) — un sistema basado únicamente en reglas explícitas puede quedar fuera de esta definición.",
      "Un script que ordena una lista alfabéticamente, sin inferir nada a partir de datos.",
    ],
  },
  legalRef: "art. 3.1",
  links: [{ label: "Definiciones del Reglamento (art. 3)", url: "https://artificialintelligenceact.eu/article/3/" }],
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
  examples: {
    si: [
      "Una app que inserta estímulos imperceptibles para empujar a una persona vulnerable a una compra perjudicial.",
      "Un videojuego con mensajes subliminales diseñados para inducir gasto.",
    ],
    no: [
      "Publicidad normal, persuasiva pero transparente sobre su intención.",
      "Un descuento visible y claro por tiempo limitado.",
    ],
  },
  legalRef: "art. 5.1.a",
  links: [{ label: "Texto del artículo 5 — prácticas prohibidas", url: "https://artificialintelligenceact.eu/article/5/" }],
};

export const Q_PROHIBIDO_VULNERABILIDADES: Question = {
  id: "prohibido_vulnerabilidades",
  text: "¿El sistema explota la edad, una discapacidad o una situación social o económica concreta de una persona o grupo para alterar su comportamiento y causarle un perjuicio?",
  examples: {
    si: [
      "Un asistente dirigido a menores que usa su edad para inducir compras repetidas.",
      "Una app que detecta dificultades económicas y ofrece préstamos abusivos de forma insistente.",
    ],
    no: [
      "Un producto pensado para personas mayores que simplemente simplifica la interfaz.",
      "Un servicio de asesoría financiera gratuita dirigido a personas en dificultades económicas.",
    ],
  },
  legalRef: "art. 5.1.b",
  links: [{ label: "Texto del artículo 5 — prácticas prohibidas", url: "https://artificialintelligenceact.eu/article/5/" }],
};

export const Q_PROHIBIDO_SCORING_SOCIAL: Question = {
  id: "prohibido_scoring_social",
  text: "¿El sistema puntúa o clasifica a personas por su comportamiento o características personales, y esa puntuación se usa para darles un trato perjudicial o desproporcionado en un contexto distinto de aquel en el que se generaron los datos?",
  examples: {
    si: [
      "Limitar el acceso a un servicio público por conductas observadas en redes sociales.",
      "Negar una plaza en un centro educativo por el comportamiento de un familiar en otro ámbito.",
    ],
    no: [
      "Un scoring de riesgo crediticio limitado al propio contexto financiero y proporcionado (puede tener otras obligaciones, pero no es esta prohibición).",
      "Un programa de puntos de fidelidad de una tienda, limitado a esa misma tienda.",
    ],
  },
  legalRef: "art. 5.1.c",
  links: [{ label: "Texto del artículo 5 — prácticas prohibidas", url: "https://artificialintelligenceact.eu/article/5/" }],
};

export const Q_PROHIBIDO_PREDICCION_DELICTIVA: Question = {
  id: "prohibido_prediccion_delictiva",
  text: "¿El sistema estima que una persona cometerá un delito basándose únicamente en su perfil o rasgos de personalidad, sin hechos objetivos y verificables relacionados con una actividad delictiva?",
  examples: {
    si: [
      "Señalar a alguien como probable autor solo por su personalidad y situación personal.",
      "Predecir reincidencia basándose solo en el barrio de residencia.",
    ],
    no: [
      "Un sistema que apoya la evaluación humana de pruebas objetivas ya existentes de un caso concreto.",
      "Un sistema que ayuda a priorizar casos según pruebas forenses ya recogidas.",
    ],
  },
  legalRef: "art. 5.1.d",
  links: [{ label: "Texto del artículo 5 — prácticas prohibidas", url: "https://artificialintelligenceact.eu/article/5/" }],
};

export const Q_PROHIBIDO_RECONOCIMIENTO_FACIAL: Question = {
  id: "prohibido_reconocimiento_facial",
  text: "¿El sistema crea o amplía una base de datos de reconocimiento facial extrayendo imágenes de internet o de cámaras de videovigilancia de forma indiscriminada (sin un criterio específico dirigido a esas personas)?",
  examples: {
    si: [
      "Descargar fotos de redes sociales en masa para ampliar una base de identificación.",
      "Extraer capturas de cámaras de tráfico para ampliar una base de reconocimiento facial.",
    ],
    no: [
      "Una base de datos con el consentimiento explícito de cada persona incluida.",
      "Una base de datos de empleados de una empresa, creada con su consentimiento para control de acceso.",
    ],
  },
  legalRef: "art. 5.1.e",
  links: [{ label: "Texto del artículo 5 — prácticas prohibidas", url: "https://artificialintelligenceact.eu/article/5/" }],
};

export const Q_PROHIBIDO_INFERENCIA_EMOCIONAL: Question = {
  id: "prohibido_inferencia_emocional",
  text: "¿El sistema infiere emociones de personas en el trabajo o en centros educativos, sin que sea por razones médicas o de seguridad?",
  examples: {
    si: [
      "Analizar por webcam si una persona parece motivada durante una entrevista de trabajo.",
      "Medir el nivel de estrés de estudiantes durante un examen para puntuarlos.",
    ],
    no: [
      "Un sistema médico que detecta signos de fatiga en personal sanitario por seguridad.",
      "Un sistema que detecta fatiga en conductores profesionales por razones de seguridad vial.",
    ],
  },
  legalRef: "art. 5.1.f",
  links: [{ label: "Texto del artículo 5 — prácticas prohibidas", url: "https://artificialintelligenceact.eu/article/5/" }],
};

export const Q_PROHIBIDO_CATEGORIZACION_BIOMETRICA: Question = {
  id: "prohibido_categorizacion_biometrica",
  text: "¿El sistema usa datos biométricos para inferir o deducir origen racial o étnico, opiniones políticas, afiliación sindical, creencias religiosas o filosóficas, vida sexual u orientación sexual de una persona?",
  examples: {
    si: [
      "Clasificar las creencias religiosas de alguien a partir de sus rasgos faciales.",
      "Inferir la orientación sexual de una persona a partir de su voz.",
    ],
    no: [
      "Verificar biométricamente que una persona es quien dice ser, sin inferir ninguno de esos aspectos.",
      "Un sistema de reconocimiento facial que solo confirma si dos fotos son la misma persona.",
    ],
  },
  legalRef: "art. 5.1.g",
  links: [{ label: "Texto del artículo 5 — prácticas prohibidas", url: "https://artificialintelligenceact.eu/article/5/" }],
};

export const Q_PROHIBIDO_BIOMETRIA_REMOTA_TIEMPO_REAL: Question = {
  id: "prohibido_biometria_remota_tiempo_real",
  text: "¿El sistema hace identificación biométrica remota EN TIEMPO REAL en espacios de acceso público, con fines de actuación policial (fuera de los supuestos y garantías tasados por el Reglamento)?",
  examples: {
    si: [
      "Identificar en directo a todas las personas que pasan por una plaza pública para fines policiales generales.",
      "Cámaras policiales que identifican en tiempo real a los asistentes a una manifestación.",
    ],
    no: [
      "Control de acceso biométrico en la entrada de una oficina privada.",
      "Identificación biométrica diferida (horas o días después, no en directo) para investigar un delito grave: no la cubre este artículo por no ser \"en tiempo real\" — cae, en su caso, bajo el Anexo III como sistema de alto riesgo, no bajo una excepción del art. 5.",
    ],
  },
  legalRef: "art. 5.1.h",
  links: [{ label: "Texto del artículo 5 — prácticas prohibidas", url: "https://artificialintelligenceact.eu/article/5/" }],
};

export const Q_PROHIBIDO_CONTENIDO_INTIMO: Question = {
  id: "prohibido_contenido_intimo",
  text: "¿El sistema genera o manipula contenido íntimo no consentido de una persona real, o material de abuso sexual infantil?",
  examples: {
    si: [
      "Una aplicación de \"desnudo\" generado a partir de la fotografía de una persona real sin su consentimiento. Prohibido desde el 2 de diciembre de 2026.",
      "Crear un vídeo íntimo falso de una persona real y difundirlo sin su consentimiento.",
    ],
    no: ["Generar una imagen de una persona completamente ficticia, sin base en ninguna persona real."],
  },
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
  examples: {
    si: [
      "Una empresa que entrena y publica un modelo fundacional de texto o imagen para que terceros construyan aplicaciones encima.",
      "Un laboratorio que libera un modelo de lenguaje propio para que otros lo integren en sus productos.",
    ],
    no: [
      "Una organización que solo usa la API de un modelo de terceros (como GPT o Claude) dentro de su propia aplicación — ahí no es proveedora del modelo, es usuaria.",
      "Una startup que construye un producto encima de un modelo ya publicado por otra empresa.",
    ],
  },
  legalRef: "art. 3.63",
  links: [
    { label: "Definiciones del Reglamento (art. 3)", url: "https://artificialintelligenceact.eu/article/3/" },
    { label: "Resumen del régimen GPAI", url: "https://artificialintelligenceact.eu/high-level-summary/" },
  ],
};

export const Q_GPAI_RIESGO_SISTEMICO: Question = {
  id: "gpai_riesgo_sistemico",
  text: "¿El modelo tiene capacidades de alto impacto — por ejemplo, se ha entrenado con más de 10^25 FLOP de cómputo, o la Comisión Europea lo ha designado como de riesgo sistémico?",
  examples: {
    si: [
      "Modelos frontera de gran escala de los grandes laboratorios de IA.",
      "Un modelo entrenado con recursos de cómputo comparables a los mayores modelos conocidos del mercado.",
    ],
    no: [
      "Modelos de tamaño medio o pequeño, sin ese nivel de cómputo ni designación de la Comisión.",
      "Un modelo afinado (fine-tuned) sobre uno pequeño, sin entrenamiento desde cero a esa escala.",
    ],
  },
  legalRef: "art. 51",
  links: [{ label: "Texto del artículo 51 — riesgo sistémico", url: "https://artificialintelligenceact.eu/article/51/" }],
};

export const Q_ANEXO_I_O_III: Question = {
  id: "anexo_i_o_iii",
  text: "¿El sistema es (o es componente de seguridad de) un producto ya regulado por legislación europea de seguridad (Anexo I), o su finalidad encaja en uno de los ámbitos del Anexo III (biometría, infraestructuras críticas, educación, empleo, servicios esenciales, actuación policial, migración/fronteras, justicia/procesos democráticos)?",
  examples: {
    si: [
      "Una bomba de insulina que ajusta la dosis con IA (Anexo I, producto sanitario), o un sistema que filtra currículos o decide promociones (Anexo III, empleo).",
      "Un sistema que decide qué solicitudes de asilo se priorizan (Anexo III, migración).",
    ],
    no: [
      "Una herramienta interna de IA que resume actas de reuniones, sin encajar en ningún ámbito regulado.",
      "Una herramienta de traducción automática de documentos internos, que no decide nada sobre personas.",
    ],
  },
  legalRef: "Anexo I / Anexo III",
  links: [
    { label: "Texto del Anexo I — productos regulados", url: "https://artificialintelligenceact.eu/annex/1/" },
    { label: "Texto del Anexo III — casos de alto riesgo", url: "https://artificialintelligenceact.eu/annex/3/" },
  ],
};

export const Q_PERFILADO: Question = {
  id: "realiza_perfilado",
  text: "¿El sistema realiza perfilado de personas físicas (evalúa aspectos de su personalidad, comportamiento, situación económica, salud, intereses o comportamiento)?",
  examples: {
    si: [
      "Un sistema que evalúa parámetros de una persona empleada para decidir su promoción, o los datos de una unidad familiar para valorar una ayuda.",
      "Un sistema que infiere hábitos de consumo de un cliente a partir de su historial de compras.",
    ],
    no: [
      "Un sistema que solo convierte formatos de documento sin analizar a ninguna persona.",
      "Un sistema que solo cuenta cuántos documentos hay en una carpeta.",
    ],
  },
  legalRef: "art. 6.3, párrafo final",
  links: [{ label: "Texto del artículo 6 — reglas de clasificación", url: "https://artificialintelligenceact.eu/article/6/" }],
};

export const Q_INFLUYE_MATERIALMENTE: Question = {
  id: "influye_materialmente",
  text: "¿El resultado del sistema puede influir de forma relevante en la decisión final, más allá de una función procedimental o preparatoria? (obsérvalo en el funcionamiento real, no en el nombre de la herramienta)",
  examples: {
    si: [
      "Una recomendación que el equipo sigue casi siempre, aunque formalmente la decisión la firme una persona.",
      "Una puntuación que determina automáticamente el orden de atención, sin revisión real.",
    ],
    no: [
      "Una alerta que un equipo humano investiga y descarta habitualmente, sin que determine el resultado.",
      "Un resumen informativo que la persona lee, pero no usa para decidir.",
    ],
  },
  legalRef: "art. 6.3",
  links: [{ label: "Texto del artículo 6 — reglas de clasificación", url: "https://artificialintelligenceact.eu/article/6/" }],
};

export const Q_TAREA_LIMITADA: Question = {
  id: "tarea_procedimental_limitada",
  text: "¿El sistema ejecuta una tarea procedimental limitada (por ejemplo, convertir documentos a un formato común antes de que una persona examine su contenido), sin usarse para descartar solicitudes?",
  examples: {
    si: [
      "Digitalizar y estructurar formularios en papel para que una persona los revise después.",
      "Convertir un PDF escaneado en texto editable para que alguien lo lea.",
    ],
    no: [
      "El mismo proceso, pero si además descarta automáticamente los formularios incompletos.",
      "Extraer datos del PDF y usarlos para aprobar o denegar automáticamente una solicitud.",
    ],
  },
  legalRef: "art. 6.3.a",
  links: [{ label: "Texto del artículo 6 — reglas de clasificación", url: "https://artificialintelligenceact.eu/article/6/" }],
};

export const Q_MEJORA_TRABAJO_HUMANO: Question = {
  id: "mejora_resultado_humano_terminado",
  text: "¿El sistema mejora el resultado de una actividad humana ya terminada, sin modificar la conclusión ni recomendar una decisión distinta?",
  examples: {
    si: [
      "Corregir el formato y la redacción de una resolución que una persona ya redactó y aprobó.",
      "Traducir a otro idioma un informe ya finalizado y aprobado.",
    ],
    no: [
      "Un sistema que revisa esa misma resolución y sugiere cambiar la decisión de fondo.",
      "Un sistema que reescribe las conclusiones de ese informe.",
    ],
  },
  legalRef: "art. 6.3.b",
  links: [{ label: "Texto del artículo 6 — reglas de clasificación", url: "https://artificialintelligenceact.eu/article/6/" }],
};

export const Q_DETECTA_PATRONES: Question = {
  id: "detecta_patrones_sin_sustituir",
  text: "¿El sistema detecta patrones o desviaciones para que una persona los investigue, sin que la señal decida un rechazo ni pese en la evaluación?",
  examples: {
    si: [
      "Señalar posibles duplicados en una lista para que alguien los compruebe.",
      "Marcar transacciones inusuales para que un analista las revise.",
    ],
    no: [
      "La misma señal, pero si una solicitud marcada se rechaza automáticamente sin revisión humana real.",
      "Bloquear automáticamente una cuenta por esa misma señal, sin intervención humana.",
    ],
  },
  legalRef: "art. 6.3.c",
  links: [{ label: "Texto del artículo 6 — reglas de clasificación", url: "https://artificialintelligenceact.eu/article/6/" }],
};

export const Q_TAREA_PREPARATORIA: Question = {
  id: "tarea_preparatoria",
  text: "¿El sistema realiza una tarea preparatoria (por ejemplo clasificar expedientes por idioma), sin que su resultado condicione la revisión posterior?",
  examples: {
    si: [
      "Repartir expedientes por idioma al equipo correspondiente.",
      "Agrupar correos entrantes por departamento antes de que alguien los lea.",
    ],
    no: [
      "Ordenarlos por probabilidad de obtener una ayuda, si esa puntuación condiciona qué se revisa antes o con más atención.",
      "Priorizar solicitudes según una puntuación que determina cuáles se atienden antes.",
    ],
  },
  legalRef: "art. 6.3.d",
  links: [{ label: "Texto del artículo 6 — reglas de clasificación", url: "https://artificialintelligenceact.eu/article/6/" }],
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
  examples: {
    si: [
      "Un chatbot de atención al cliente que conversa con usuarios.",
      "Un asistente de voz que responde preguntas de usuarios en tiempo real.",
    ],
    no: [
      "Una herramienta que redacta borradores de texto para que alguien los revise y publique por su cuenta, sin que nadie converse con ella.",
      "Un sistema de back-office que solo procesa pedidos, sin hablar con nadie.",
    ],
  },
  legalRef: "art. 50.1",
  links: [{ label: "Texto del artículo 50 — transparencia", url: "https://artificialintelligenceact.eu/article/50/" }],
};

/**
 * Corregido tras auditoría de cobertura (ver eval/README.md): antes
 * exigía "que se publica o distribuye" como condición para la
 * pregunta entera, pero esa condición es del art. 50.4 (divulgación
 * al publicarse), no del 50.2 (marcado técnico), que se aplica al
 * generar el contenido, se publique o no. Alguien con contenido
 * generado pero sin publicar podía concluir que no tenía ninguna
 * obligación del art. 50, cuando el marcado técnico seguía aplicando.
 * Ahora esta pregunta solo cubre el 50.2; `Q_CONTENIDO_PUBLICADO`
 * decide aparte si además se activa el 50.4.
 */
export const Q_GENERA_CONTENIDO_SINTETICO: Question = {
  id: "genera_contenido_sintetico",
  text: "¿El sistema genera o manipula contenido sintético (texto, imagen, audio o vídeo), se publique o no?",
  examples: {
    si: [
      "Un asistente que redacta borradores de texto, aunque solo se usen internamente.",
      "Un sistema que genera imágenes o narra vídeos con voz sintética.",
    ],
    no: [
      "Un sistema que solo clasifica o procesa datos existentes, sin producir contenido nuevo.",
      "Un sistema que solo hace ediciones estándar (recorte, corrección de color) sin alterar sustancialmente el contenido original.",
    ],
  },
  legalRef: "art. 50.2",
  links: [{ label: "Texto del artículo 50 — transparencia", url: "https://artificialintelligenceact.eu/article/50/" }],
};

/**
 * Gate del art. 50.4 (obligación del responsable del despliegue de
 * divulgar al público), separado del 50.2 (marcado técnico del
 * proveedor, ya cubierto por `Q_GENERA_CONTENIDO_SINTETICO` sin
 * condición de publicación). Solo tiene sentido preguntarlo si la
 * respuesta anterior fue "sí".
 */
export const Q_CONTENIDO_PUBLICADO: Question = {
  id: "contenido_publicado",
  text: "¿Ese contenido generado o manipulado se hace público o se distribuye fuera del entorno interno de quien lo genera?",
  examples: {
    si: [
      "Se publica en la web, en redes sociales o se envía a personas fuera de la organización.",
      "Un vídeo generado que se sube a una plataforma pública.",
    ],
    no: [
      "Se usa solo internamente (borradores, pruebas, entrenamiento de otro modelo) y nunca sale de la organización.",
      "Un informe generado por IA que solo circula dentro del equipo, sin publicarse.",
    ],
  },
  legalRef: "art. 50.4",
  links: [{ label: "Texto del artículo 50 — transparencia", url: "https://artificialintelligenceact.eu/article/50/" }],
};

/**
 * El art. 50.4 tiene dos párrafos con excepciones distintas según el
 * tipo de contenido: para imagen/audio/vídeo (posibles
 * ultrasuplantaciones), la excepción es que la obra sea manifiestamente
 * creativa/satírica/artística/de ficción (y aun así solo reduce la
 * obligación, no la elimina). Para TEXTO sobre un asunto de interés
 * público, la excepción es la revisión editorial sustantiva (ver
 * `Q_REVISION_EDITORIAL`), y esa sí elimina la obligación por completo.
 * Aplicar la excepción de revisión editorial a un vídeo/imagen sería
 * incorrecto — de ahí esta pregunta, que decide qué rama aplica.
 * Corregido tras auditoría de cobertura (ver eval/README.md).
 */
export const Q_CONTENIDO_ES_TEXTO: Question = {
  id: "contenido_es_texto",
  text: "¿Ese contenido publicado es texto (no imagen, audio ni vídeo)?",
  examples: {
    si: [
      "Un artículo, una noticia o un resumen generado por IA que se publica como texto.",
      "Una publicación de blog institucional redactada por IA.",
    ],
    no: [
      "Una imagen o un vídeo generado o manipulado (posible ultrasuplantación / deepfake) — la excepción aplicable es distinta, ver el artículo.",
      "Un audio con voz sintética publicado como pieza sonora.",
    ],
  },
  legalRef: "art. 50.4",
  links: [{ label: "Texto del artículo 50 — transparencia", url: "https://artificialintelligenceact.eu/article/50/" }],
};

/**
 * Excepción del art. 50.4 (párrafo del texto): si el contenido pasa
 * por revisión humana sustantiva y hay una persona (física o
 * jurídica) que asume la responsabilidad editorial, no hace falta
 * divulgar que es generado por IA. Verificado contra el texto oficial
 * (`sources/reglamento_ue_2024_1689_es.txt`) — un matiz importante:
 * una revisión meramente ortográfica o formal NO cuenta como revisión
 * editorial a estos efectos. Solo se pregunta cuando el contenido
 * publicado es texto (`Q_CONTENIDO_ES_TEXTO` = "sí") — para
 * imagen/audio/vídeo esta excepción no existe en el texto legal (la
 * suya es la de obra creativa/satírica, no modelada aquí: por
 * seguridad, si se publica imagen/audio/vídeo generado se asume que
 * el 50.4 aplica, sin ofrecer una exención que el Reglamento no prevé
 * para ese caso).
 */
export const Q_REVISION_EDITORIAL: Question = {
  id: "revision_editorial_sustantiva",
  text: "Antes de publicarse, ¿ese texto pasa por una revisión humana sustantiva (no solo ortográfica o de formato) y hay una persona física o jurídica que asume la responsabilidad editorial de lo que se publica?",
  examples: {
    si: [
      "Alguien del equipo revisa el fondo del contenido, decide si se publica y asume esa responsabilidad.",
      "Un editor que reescribe partes del texto y firma la publicación con su nombre.",
    ],
    no: [
      "Se publica automáticamente, o la única revisión es corregir ortografía/gramática — eso NO cuenta como revisión editorial a estos efectos.",
      "\"Revisar\" significa solo pasar el corrector ortográfico antes de publicar automáticamente.",
    ],
  },
  legalRef: "art. 50.4",
  links: [{ label: "Texto del artículo 50 — transparencia", url: "https://artificialintelligenceact.eu/article/50/" }],
};

/**
 * Art. 50.3: obligación independiente de las anteriores — no depende
 * de si el sistema conversa con nadie (50.1) ni de si genera
 * contenido (50.2/50.4). Hueco real encontrado en la auditoría de
 * cobertura del 3 de septiembre de 2026 (ver eval/README.md): un
 * sistema de categorización biométrica de clientes en una tienda, o
 * de reconocimiento de emociones en un contact center, no disparaba
 * ninguna pregunta de transparencia antes de esta.
 */
export const Q_TRANSPARENCIA_BIOMETRICA_EMOCIONES: Question = {
  id: "transparencia_biometria_emociones",
  text: "¿El sistema es de categorización biométrica o de reconocimiento de emociones, y hay personas físicas expuestas a su funcionamiento (fuera de los usos ya prohibidos por el art. 5 y sin ser un uso policial autorizado por ley)?",
  examples: {
    si: [
      "Cámaras en una tienda que categorizan a los clientes por edad o género para estadísticas, sin inferir categorías protegidas.",
      "Un sistema de reconocimiento de emociones en un contact center para priorizar llamadas, fuera del contexto laboral/educativo prohibido.",
    ],
    no: [
      "Verificación biométrica 1:1 (¿eres quien dices ser?) para desbloquear un dispositivo o acceder a un servicio.",
      "Uso policial de categorización biométrica autorizado por ley para detectar o investigar delitos, con las garantías correspondientes.",
    ],
  },
  legalRef: "art. 50.3",
  links: [{ label: "Texto del artículo 50 — transparencia", url: "https://artificialintelligenceact.eu/article/50/" }],
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

/**
 * Preguntas de transparencia (art. 50), para sistemas que no son de
 * alto riesgo. `Q_CONTENIDO_PUBLICADO`, `Q_CONTENIDO_ES_TEXTO` y
 * `Q_REVISION_EDITORIAL` solo se preguntan condicionalmente (ver
 * `evaluateTransparency` en classify.ts) — su presencia aquí es para
 * que `QUESTIONS_BY_ID` en el wizard las encuentre por id.
 */
export const TRANSPARENCY_QUESTIONS: Question[] = [
  Q_INTERACTUA_CON_PERSONAS,
  Q_GENERA_CONTENIDO_SINTETICO,
  Q_CONTENIDO_PUBLICADO,
  Q_CONTENIDO_ES_TEXTO,
  Q_REVISION_EDITORIAL,
  Q_TRANSPARENCIA_BIOMETRICA_EMOCIONES,
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
