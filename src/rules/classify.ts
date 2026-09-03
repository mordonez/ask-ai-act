import type { Answer, Answers, ClassificationResult } from "./types";
import {
  PROHIBITED_PRACTICE_QUESTIONS,
  Q_ANEXO_I_O_III,
  Q_CONTENIDO_ES_TEXTO,
  Q_CONTENIDO_PUBLICADO,
  Q_DETECTA_PATRONES,
  Q_ES_CODIGO_ABIERTO,
  Q_ES_GPAI,
  Q_ES_SISTEMA_IA,
  Q_EXCLUSION_INVESTIGACION_DESARROLLO,
  Q_EXCLUSION_MILITAR,
  Q_EXCLUSION_USO_PERSONAL,
  Q_GENERA_CONTENIDO_SINTETICO,
  Q_GPAI_RIESGO_SISTEMICO,
  Q_INFLUYE_MATERIALMENTE,
  Q_INTERACTUA_CON_PERSONAS,
  Q_MEJORA_TRABAJO_HUMANO,
  Q_PERFILADO,
  Q_REVISION_EDITORIAL,
  Q_TAREA_LIMITADA,
  Q_TAREA_PREPARATORIA,
  Q_TRANSPARENCIA_BIOMETRICA_EMOCIONES,
} from "./questions";

/**
 * Árbol de reglas de la Fase 1. Implementa el recorrido descrito en
 * "El Reglamento europeo de IA: por dónde empezar"
 * (miguelordonez.com/blog/reglamento-europeo-ia-que-debe-comprobar-tu-empresa/)
 * y en las guías 1 y 2 de AESIA.
 *
 * Nota de procedencia sobre el filtro del art. 6.3 (Q_TAREA_LIMITADA,
 * Q_MEJORA_TRABAJO_HUMANO, Q_DETECTA_PATRONES, Q_TAREA_PREPARATORIA,
 * Q_PERFILADO) y sobre las exclusiones de ámbito del art. 2
 * (Q_EXCLUSION_*, Q_ES_CODIGO_ABIERTO): verificadas originalmente
 * contra el texto del Reglamento vía espejo de
 * artificialintelligenceact.eu, ya que EUR-Lex no es accesible por
 * fetch directo (un curl/WebFetch automatizado recibe un challenge de
 * AWS WAF; solo carga con un navegador real ejecutando JavaScript).
 * Desde el 3 de septiembre de 2026 el texto oficial completo (texto
 * original de 2024/1689, sin la consolidación de modificaciones
 * posteriores) vive en `sources/reglamento_ue_2024_1689_es.txt` —
 * verificar contra ese fichero al tocar estas reglas.
 *
 * Nota de procedencia sobre Q_REVISION_EDITORIAL (excepción del
 * art. 50.4): verificada el 3 de septiembre de 2026 contra fuentes
 * que citan el texto del Reglamento. Matiz importante confirmado:
 * una revisión meramente ortográfica o de formato NO cuenta como
 * revisión editorial a estos efectos, tiene que ser sustantiva y con
 * responsabilidad editorial real. Esta pregunta se añadió tras
 * encontrarse el hueco en una prueba ciega de clasificación (un
 * agente sin contexto del árbol, evaluando el caso de una universidad
 * que redacta artículos institucionales con IA, señaló la excepción
 * que el árbol no tenía).
 *
 * Principio de AGENTS.md: si falta una respuesta, o la respuesta es
 * "no lo sé" en un punto donde eso impide concluir, el resultado es
 * "no_determinado" — nunca una clasificación inventada. "no lo sé" NO
 * es equivalente a "no": una implementación que lo tratara como "no"
 * por defecto violaría ese principio, así que cada rama lo comprueba
 * explícitamente.
 */

function notDetermined(missingQuestions: string[]): ClassificationResult {
  return {
    label: "no_determinado",
    summary: "No se puede determinar todavía: faltan respuestas.",
    legalRefs: [],
    missingQuestions,
  };
}

function needsReview(question: { text: string; legalRef: string }): ClassificationResult {
  return {
    label: "no_determinado",
    summary: `No se puede determinar de forma automática: la respuesta a "${question.text}" no está clara y esto necesita revisión manual (posiblemente jurídica).`,
    legalRefs: [question.legalRef],
    missingQuestions: [],
  };
}

type AbsoluteExclusionResult =
  | { status: "clear" } // ninguna de las 3 exclusiones absolutas aplica
  | { status: "excluded"; question: { text: string; legalRef: string } }
  | { status: "missing"; id: string }
  | { status: "unclear"; question: { text: string; legalRef: string } };

const ABSOLUTE_EXCLUSION_QUESTIONS = [
  Q_EXCLUSION_MILITAR,
  Q_EXCLUSION_INVESTIGACION_DESARROLLO,
  Q_EXCLUSION_USO_PERSONAL,
];

/**
 * Las 3 exclusiones absolutas del art. 2 (militar/defensa, I+D antes
 * de mercado, uso personal): si alguna es "sí", el sistema queda
 * fuera del Reglamento sin más preguntas — mismo patrón que las 9
 * prácticas prohibidas del art. 5.
 */
function evaluateAbsoluteExclusions(answers: Answers): AbsoluteExclusionResult {
  for (const question of ABSOLUTE_EXCLUSION_QUESTIONS) {
    if (answers[question.id] === "si") return { status: "excluded", question };
  }
  for (const question of ABSOLUTE_EXCLUSION_QUESTIONS) {
    const answer = answers[question.id];
    if (answer === undefined) return { status: "missing", id: question.id };
    if (answer === "no_se") return { status: "unclear", question };
  }
  return { status: "clear" };
}

type ProhibitedResult =
  | { status: "clear" } // ninguna de las 9 prácticas aplica
  | { status: "prohibited"; question: { text: string; legalRef: string } }
  | { status: "missing"; id: string }
  | { status: "unclear"; question: { text: string; legalRef: string } };

/**
 * Recorre las 9 preguntas de prácticas prohibidas del artículo 5, una
 * a una. Una sola "sí" basta para prohibir el sistema; no hace falta
 * responder al resto para concluir eso.
 */
function evaluateProhibitedPractices(answers: Answers): ProhibitedResult {
  for (const question of PROHIBITED_PRACTICE_QUESTIONS) {
    const answer: Answer | undefined = answers[question.id];
    if (answer === "si") return { status: "prohibited", question };
  }
  for (const question of PROHIBITED_PRACTICE_QUESTIONS) {
    const answer: Answer | undefined = answers[question.id];
    if (answer === undefined) return { status: "missing", id: question.id };
    if (answer === "no_se") return { status: "unclear", question };
  }
  return { status: "clear" };
}

type Filter63Result =
  | { status: "excludes" } // el filtro excluye de alto riesgo
  | { status: "includes" } // el sistema sigue siendo de alto riesgo
  | { status: "missing"; ids: string[] }
  | { status: "unclear"; question: { text: string; legalRef: string } };

/**
 * Evalúa el filtro del artículo 6.3: un sistema del Anexo III no se
 * considera de alto riesgo si encaja en una de las cuatro tareas
 * limitadas (6.3.a-d) Y no realiza perfilado Y no influye de forma
 * relevante en el resultado final.
 */
function evaluateFilter63(answers: Answers): Filter63Result {
  const perfilado: Answer | undefined = answers[Q_PERFILADO.id];
  const influye: Answer | undefined = answers[Q_INFLUYE_MATERIALMENTE.id];

  if (perfilado === undefined) return { status: "missing", ids: [Q_PERFILADO.id] };
  if (perfilado === "no_se") return { status: "unclear", question: Q_PERFILADO };
  if (perfilado === "si") return { status: "includes" };

  if (influye === undefined) return { status: "missing", ids: [Q_INFLUYE_MATERIALMENTE.id] };
  if (influye === "no_se") return { status: "unclear", question: Q_INFLUYE_MATERIALMENTE };
  if (influye === "si") return { status: "includes" };

  const tasks = [
    { q: Q_TAREA_LIMITADA, a: answers[Q_TAREA_LIMITADA.id] },
    { q: Q_MEJORA_TRABAJO_HUMANO, a: answers[Q_MEJORA_TRABAJO_HUMANO.id] },
    { q: Q_DETECTA_PATRONES, a: answers[Q_DETECTA_PATRONES.id] },
    { q: Q_TAREA_PREPARATORIA, a: answers[Q_TAREA_PREPARATORIA.id] },
  ];

  // Si alguna tarea limitada ya es "sí", el filtro aplica (excluye de
  // alto riesgo) independientemente de lo que respondan las demás.
  if (tasks.some((t) => t.a === "si")) return { status: "excludes" };

  const firstUnclear = tasks.find((t) => t.a === "no_se");
  const allAnswered = tasks.every((t) => t.a !== undefined);

  if (!allAnswered) {
    const missing = tasks.filter((t) => t.a === undefined).map((t) => t.q.id);
    if (missing.length > 0) return { status: "missing", ids: missing };
  }
  if (firstUnclear) return { status: "unclear", question: firstUnclear.q };

  // Las cuatro son "no": ninguna tarea limitada aplica -> sigue alto riesgo.
  return { status: "includes" };
}

type TransparencyResult =
  | { status: "applies"; questions: { id: string; text: string; legalRef: string }[] }
  | { status: "none" }
  | { status: "missing"; id: string }
  | { status: "unclear"; question: { text: string; legalRef: string } };

/** Marcador de la obligación de divulgación al publicar (art. 50.4) — no es una `Question` real, es una obligación derivada de varias respuestas (`Q_CONTENIDO_PUBLICADO`, `Q_CONTENIDO_ES_TEXTO`, `Q_REVISION_EDITORIAL`). */
const DIVULGACION_PUBLICACION = { id: "divulgacion_publicacion", text: "art. 50.4 (divulgación al publicar)", legalRef: "art. 50.4" };

/**
 * El art. 50 agrupa cuatro obligaciones independientes, cada una con
 * su propio disparador: interactuar con personas (50.1), marcar
 * técnicamente el contenido generado, se publique o no (50.2), y —
 * solo si además se publica — divulgar que es generado por IA (50.4),
 * con dos regímenes de excepción distintos según el tipo de contenido
 * (revisión editorial solo para texto; el Reglamento no ofrece esa
 * excepción para imagen/audio/vídeo, así que ahí el 50.4 se asume
 * aplicable si se publica, sin ofrecer una exención que el texto legal
 * no prevé para ese caso). Y la categorización biométrica o el
 * reconocimiento de emociones expuestos a personas físicas (50.3),
 * independiente de todo lo anterior. Se preguntan por separado porque
 * pueden aplicar varias a la vez y el plan de acción necesita saber
 * cuáles exactamente, no solo si "alguna" aplica.
 */
function evaluateTransparency(answers: Answers): TransparencyResult {
  const interactua: Answer | undefined = answers[Q_INTERACTUA_CON_PERSONAS.id];
  if (interactua === undefined) return { status: "missing", id: Q_INTERACTUA_CON_PERSONAS.id };
  if (interactua === "no_se") return { status: "unclear", question: Q_INTERACTUA_CON_PERSONAS };

  const genera: Answer | undefined = answers[Q_GENERA_CONTENIDO_SINTETICO.id];
  if (genera === undefined) return { status: "missing", id: Q_GENERA_CONTENIDO_SINTETICO.id };
  if (genera === "no_se") return { status: "unclear", question: Q_GENERA_CONTENIDO_SINTETICO };

  // El 50.4 (divulgación) solo se evalúa si además se publica —
  // gate independiente del marcado técnico del 50.2.
  let divulgacionAplica = false;
  if (genera === "si") {
    const publicado: Answer | undefined = answers[Q_CONTENIDO_PUBLICADO.id];
    if (publicado === undefined) return { status: "missing", id: Q_CONTENIDO_PUBLICADO.id };
    if (publicado === "no_se") return { status: "unclear", question: Q_CONTENIDO_PUBLICADO };

    if (publicado === "si") {
      divulgacionAplica = true; // por defecto aplica; solo el texto tiene excepción posible
      const esTexto: Answer | undefined = answers[Q_CONTENIDO_ES_TEXTO.id];
      if (esTexto === undefined) return { status: "missing", id: Q_CONTENIDO_ES_TEXTO.id };
      if (esTexto === "no_se") return { status: "unclear", question: Q_CONTENIDO_ES_TEXTO };

      if (esTexto === "si") {
        // Excepción de revisión editorial: solo existe para texto.
        const revision: Answer | undefined = answers[Q_REVISION_EDITORIAL.id];
        if (revision === undefined) return { status: "missing", id: Q_REVISION_EDITORIAL.id };
        if (revision === "no_se") return { status: "unclear", question: Q_REVISION_EDITORIAL };
        if (revision === "si") divulgacionAplica = false; // excepción del 50.4: no hace falta divulgarlo
      }
      // esTexto === "no" (imagen/audio/vídeo): no se ofrece excepción de revisión
      // editorial — no existe para este tipo de contenido en el texto legal.
    }
  }

  const biometriaEmociones: Answer | undefined = answers[Q_TRANSPARENCIA_BIOMETRICA_EMOCIONES.id];
  if (biometriaEmociones === undefined) return { status: "missing", id: Q_TRANSPARENCIA_BIOMETRICA_EMOCIONES.id };
  if (biometriaEmociones === "no_se") return { status: "unclear", question: Q_TRANSPARENCIA_BIOMETRICA_EMOCIONES };

  const applicable = [
    interactua === "si" ? Q_INTERACTUA_CON_PERSONAS : null,
    genera === "si" ? Q_GENERA_CONTENIDO_SINTETICO : null,
    divulgacionAplica ? DIVULGACION_PUBLICACION : null,
    biometriaEmociones === "si" ? Q_TRANSPARENCIA_BIOMETRICA_EMOCIONES : null,
  ].filter((q): q is typeof Q_INTERACTUA_CON_PERSONAS => q !== null);

  if (applicable.length === 0) return { status: "none" };
  return { status: "applies", questions: applicable };
}

/**
 * El art. 2.12 excluye del Reglamento a los sistemas de código
 * abierto SALVO que acaben siendo de alto riesgo — por eso esta nota
 * solo se añade a resultados que no son alto riesgo ni uso prohibido
 * (ahí la exclusión nunca aplica). No se resuelve del todo aquí: los
 * matices exactos (sobre todo para modelos GPAI open-source, que
 * tienen su propio carve-out parcial) necesitan revisión manual —
 * ver la nota de procedencia al principio del fichero.
 */
function withOpenSourceNote(result: ClassificationResult, codigoAbierto: Answer): ClassificationResult {
  if (codigoAbierto !== "si") return result;
  return {
    ...result,
    summary: `${result.summary} (Es de código abierto: el art. 2.12 puede eximirte total o parcialmente de estas obligaciones — tiene matices distintos si es un modelo GPAI, este árbol no los resuelve del todo; confírmalo.)`,
  };
}

export function classify(answers: Answers): ClassificationResult {
  const exclusion = evaluateAbsoluteExclusions(answers);
  if (exclusion.status === "missing") return notDetermined([exclusion.id]);
  if (exclusion.status === "unclear") return needsReview(exclusion.question);
  if (exclusion.status === "excluded") {
    return {
      label: "fuera_de_ambito",
      summary: `Fuera del ámbito del Reglamento de IA: "${exclusion.question.text}"`,
      legalRefs: [exclusion.question.legalRef],
    };
  }

  const codigoAbierto: Answer | undefined = answers[Q_ES_CODIGO_ABIERTO.id];
  if (codigoAbierto === undefined) return notDetermined([Q_ES_CODIGO_ABIERTO.id]);
  if (codigoAbierto === "no_se") return needsReview(Q_ES_CODIGO_ABIERTO);

  const esSistemaIA = answers[Q_ES_SISTEMA_IA.id];
  if (esSistemaIA === undefined) return notDetermined([Q_ES_SISTEMA_IA.id]);
  if (esSistemaIA === "no_se") return needsReview(Q_ES_SISTEMA_IA);
  if (esSistemaIA === "no") {
    return {
      label: "fuera_de_ambito",
      summary: "Fuera del ámbito del Reglamento de IA.",
      legalRefs: [Q_ES_SISTEMA_IA.legalRef],
    };
  }

  const prohibido = evaluateProhibitedPractices(answers);
  if (prohibido.status === "missing") return notDetermined([prohibido.id]);
  if (prohibido.status === "unclear") return needsReview(prohibido.question);
  if (prohibido.status === "prohibited") {
    return {
      label: "uso_prohibido",
      summary: `Uso prohibido: "${prohibido.question.text}" — no puede clasificarse como sistema de alto riesgo, no puede comercializarse ni ponerse en servicio, salvo excepción expresa del propio Reglamento.`,
      legalRefs: [prohibido.question.legalRef],
    };
  }

  const esGPAI = answers[Q_ES_GPAI.id];
  if (esGPAI === undefined) return notDetermined([Q_ES_GPAI.id]);
  if (esGPAI === "no_se") return needsReview(Q_ES_GPAI);
  if (esGPAI === "si") {
    const riesgoSistemico = answers[Q_GPAI_RIESGO_SISTEMICO.id];
    if (riesgoSistemico === undefined) return notDetermined([Q_GPAI_RIESGO_SISTEMICO.id]);
    if (riesgoSistemico === "no_se") return needsReview(Q_GPAI_RIESGO_SISTEMICO);
    const result: ClassificationResult =
      riesgoSistemico === "si"
        ? {
            label: "modelo_uso_general",
            summary:
              "Modelo de IA de uso general con riesgo sistémico: obligaciones adicionales de evaluación y mitigación de riesgos, ciberseguridad y notificación de incidentes, además de las obligaciones base de todo proveedor de GPAI.",
            legalRefs: ["art. 51", "art. 55"],
          }
        : {
            label: "modelo_uso_general",
            summary:
              "Modelo de IA de uso general (GPAI): documentación técnica del modelo, información para quienes lo integren, política de derechos de autor y resumen del contenido de entrenamiento.",
            legalRefs: ["art. 53"],
          };
    return withOpenSourceNote(result, codigoAbierto);
  }

  const anexoIoIII = answers[Q_ANEXO_I_O_III.id];
  if (anexoIoIII === undefined) return notDetermined([Q_ANEXO_I_O_III.id]);
  if (anexoIoIII === "no_se") return needsReview(Q_ANEXO_I_O_III);

  if (anexoIoIII === "si") {
    const filtro = evaluateFilter63(answers);
    if (filtro.status === "missing") return notDetermined(filtro.ids);
    if (filtro.status === "unclear") return needsReview(filtro.question);
    if (filtro.status === "includes") {
      return {
        label: "alto_riesgo",
        summary: "Sistema de alto riesgo.",
        legalRefs: ["Anexo I / Anexo III"],
      };
    }
    // filtro.status === "excludes": comprobar transparencia igualmente
  }

  const transparencia = evaluateTransparency(answers);
  if (transparencia.status === "missing") return notDetermined([transparencia.id]);
  if (transparencia.status === "unclear") return needsReview(transparencia.question);
  if (transparencia.status === "applies") {
    const refs = transparencia.questions.map((q) => q.legalRef);
    const OBLIGATION_TEXT: Record<string, string> = {
      [Q_INTERACTUA_CON_PERSONAS.id]: "informar de la interacción con una IA",
      [Q_GENERA_CONTENIDO_SINTETICO.id]: "marcar técnicamente el contenido generado o manipulado",
      [DIVULGACION_PUBLICACION.id]: "divulgar al público que el contenido es generado por IA",
      [Q_TRANSPARENCIA_BIOMETRICA_EMOCIONES.id]: "informar del funcionamiento a las personas expuestas a la categorización biométrica o el reconocimiento de emociones",
    };
    const obligations = transparencia.questions.map((q) => OBLIGATION_TEXT[q.id] ?? q.text).join(" y ");
    return withOpenSourceNote(
      {
        label: "obligaciones_transparencia",
        summary: `No es de alto riesgo, pero tiene obligaciones de transparencia: ${obligations}.`,
        legalRefs: refs,
      },
      codigoAbierto
    );
  }

  return withOpenSourceNote(
    {
      label: "sin_obligaciones_especificas",
      summary:
        "No es de alto riesgo ni tiene obligaciones específicas de transparencia identificadas en este árbol. Comprueba igualmente las obligaciones generales de alfabetización en IA (art. 4).",
      legalRefs: ["art. 4"],
    },
    codigoAbierto
  );
}
