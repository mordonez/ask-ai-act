import type { Answer, Answers, ClassificationResult } from "./types";
import {
  PROHIBITED_PRACTICE_QUESTIONS,
  Q_ANEXO_I_O_III,
  Q_DETECTA_PATRONES,
  Q_ES_SISTEMA_IA,
  Q_GENERA_CONTENIDO_SINTETICO,
  Q_INFLUYE_MATERIALMENTE,
  Q_INTERACTUA_CON_PERSONAS,
  Q_MEJORA_TRABAJO_HUMANO,
  Q_PERFILADO,
  Q_TAREA_LIMITADA,
  Q_TAREA_PREPARATORIA,
} from "./questions";

/**
 * Árbol de reglas de la Fase 1. Implementa el recorrido descrito en
 * "El Reglamento europeo de IA: por dónde empezar"
 * (miguelordonez.com/blog/reglamento-europeo-ia-que-debe-comprobar-tu-empresa/)
 * y en las guías 1 y 2 de AESIA.
 *
 * Nota de procedencia sobre el filtro del art. 6.3 (Q_TAREA_LIMITADA,
 * Q_MEJORA_TRABAJO_HUMANO, Q_DETECTA_PATRONES, Q_TAREA_PREPARATORIA,
 * Q_PERFILADO): las guías de AESIA en sources/aesia/guias-txt/ no
 * desarrollan este filtro con detalle (solo se menciona de pasada en
 * la guía 15). Las cuatro letras a-d y el párrafo de perfilado están
 * verificados contra el texto del propio artículo 6(3) del
 * Reglamento (UE) 2024/1689 (confirmado vía espejo de
 * artificialintelligenceact.eu/article/6/, no vía guías AESIA — EUR-Lex
 * no es accesible por fetch directo). Si se consigue el texto
 * consolidado oficial en `sources/`, revisar esta nota contra él.
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

/**
 * El art. 50 agrupa obligaciones distintas: interactuar con personas
 * (50.1) y generar/manipular contenido sintético que se publica
 * (50.2/50.4) son disparadores independientes, cada uno con su propia
 * obligación. Se preguntan las dos (no hay atajo de "una sí basta")
 * porque ambas pueden aplicar a la vez y el plan de acción necesita
 * saber cuáles exactamente, no solo si "alguna" aplica.
 */
function evaluateTransparency(answers: Answers): TransparencyResult {
  const interactua: Answer | undefined = answers[Q_INTERACTUA_CON_PERSONAS.id];
  if (interactua === undefined) return { status: "missing", id: Q_INTERACTUA_CON_PERSONAS.id };
  if (interactua === "no_se") return { status: "unclear", question: Q_INTERACTUA_CON_PERSONAS };

  const genera: Answer | undefined = answers[Q_GENERA_CONTENIDO_SINTETICO.id];
  if (genera === undefined) return { status: "missing", id: Q_GENERA_CONTENIDO_SINTETICO.id };
  if (genera === "no_se") return { status: "unclear", question: Q_GENERA_CONTENIDO_SINTETICO };

  const applicable = [
    interactua === "si" ? Q_INTERACTUA_CON_PERSONAS : null,
    genera === "si" ? Q_GENERA_CONTENIDO_SINTETICO : null,
  ].filter((q): q is typeof Q_INTERACTUA_CON_PERSONAS => q !== null);

  if (applicable.length === 0) return { status: "none" };
  return { status: "applies", questions: applicable };
}

export function classify(answers: Answers): ClassificationResult {
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
    const obligations = transparencia.questions
      .map((q) =>
        q.id === Q_INTERACTUA_CON_PERSONAS.id
          ? "informar de la interacción con una IA"
          : "marcar y etiquetar el contenido generado o manipulado"
      )
      .join(" y ");
    return {
      label: "obligaciones_transparencia",
      summary: `No es de alto riesgo, pero tiene obligaciones de transparencia: ${obligations}.`,
      legalRefs: refs,
    };
  }

  return {
    label: "sin_obligaciones_especificas",
    summary:
      "No es de alto riesgo ni tiene obligaciones específicas de transparencia identificadas en este árbol. Comprueba igualmente las obligaciones generales (alfabetización en IA, GPAI si aplica).",
    legalRefs: ["art. 4"],
  };
}
