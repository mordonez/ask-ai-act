import type { Answer, Answers, ClassificationResult } from "./types";
import {
  Q_ANEXO_I_O_III,
  Q_DETECTA_PATRONES,
  Q_ES_SISTEMA_IA,
  Q_INFLUYE_MATERIALMENTE,
  Q_MEJORA_TRABAJO_HUMANO,
  Q_OBLIGACIONES_TRANSPARENCIA,
  Q_PERFILADO,
  Q_PRACTICA_PROHIBIDA,
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

  const practicaProhibida = answers[Q_PRACTICA_PROHIBIDA.id];
  if (practicaProhibida === undefined) return notDetermined([Q_PRACTICA_PROHIBIDA.id]);
  if (practicaProhibida === "no_se") return needsReview(Q_PRACTICA_PROHIBIDA);
  if (practicaProhibida === "si") {
    return {
      label: "uso_prohibido",
      summary:
        "Uso prohibido. No puede clasificarse como sistema de alto riesgo: no puede comercializarse ni ponerse en servicio, salvo excepción expresa del propio Reglamento.",
      legalRefs: [Q_PRACTICA_PROHIBIDA.legalRef],
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

  const transparencia = answers[Q_OBLIGACIONES_TRANSPARENCIA.id];
  if (transparencia === undefined) return notDetermined([Q_OBLIGACIONES_TRANSPARENCIA.id]);
  if (transparencia === "no_se") return needsReview(Q_OBLIGACIONES_TRANSPARENCIA);
  if (transparencia === "si") {
    return {
      label: "obligaciones_transparencia",
      summary:
        "No es de alto riesgo, pero tiene obligaciones de transparencia: informar de la interacción con una IA y/o marcar y etiquetar el contenido generado o manipulado.",
      legalRefs: [Q_OBLIGACIONES_TRANSPARENCIA.legalRef],
    };
  }

  return {
    label: "sin_obligaciones_especificas",
    summary:
      "No es de alto riesgo ni tiene obligaciones específicas de transparencia identificadas en este árbol. Comprueba igualmente las obligaciones generales (alfabetización en IA, GPAI si aplica).",
    legalRefs: ["art. 4"],
  };
}
