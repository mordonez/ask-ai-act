/**
 * Tipos del árbol de reglas de la Fase 1 (clasificador sin estado).
 *
 * Cada pregunta y cada conclusión debe citar el artículo/anexo del
 * Reglamento (UE) 2024/1689 que la sustenta — es el principio de
 * trazabilidad de AGENTS.md. No añadas una pregunta o un resultado
 * sin su cita.
 */

export type Answer = "si" | "no" | "no_se";

/** Respuestas acumuladas por id de pregunta. */
export type Answers = Record<string, Answer | undefined>;

export interface Question {
  id: string;
  /** Texto de la pregunta, en lenguaje sencillo, para el wizard. */
  text: string;
  /** Ejemplo breve para ayudar a responder, opcional. */
  helpExample?: string;
  /** Artículo, anexo o apartado del Reglamento que motiva esta pregunta. */
  legalRef: string;
}

export type ClassificationLabel =
  | "fuera_de_ambito"
  | "uso_prohibido"
  | "alto_riesgo"
  | "obligaciones_transparencia"
  | "sin_obligaciones_especificas"
  | "no_determinado";

export interface ClassificationResult {
  label: ClassificationLabel;
  /** Frase corta para mostrar como veredicto. */
  summary: string;
  /** Artículo(s) o anexo(s) que sustentan la conclusión. */
  legalRefs: string[];
  /**
   * Si la conclusión es "no_determinado", qué preguntas faltan por
   * responder para poder concluir. Principio 2 de AGENTS.md: nunca
   * inventar una clasificación cuando faltan datos.
   */
  missingQuestions?: string[];
}
