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

export interface QuestionLink {
  label: string;
  url: string;
}

/**
 * Ejemplos que responderían "sí" y ejemplos que responderían "no",
 * en listas separadas (no un párrafo) para que la diferencia se vea
 * de un vistazo. Más de un ejemplo por lado ayuda cuando un solo caso
 * no basta para distinguir el matiz legal de la pregunta.
 */
export interface QuestionExamples {
  si: string[];
  no: string[];
}

export interface Question {
  id: string;
  /** Texto de la pregunta, en lenguaje sencillo, para el wizard. */
  text: string;
  /** Ejemplos de caso "sí" y caso "no", opcional. */
  examples?: QuestionExamples;
  /** Artículo, anexo o apartado del Reglamento que motiva esta pregunta. */
  legalRef: string;
  /**
   * Enlaces externos para profundizar en el artículo/anexo concreto
   * (artificialintelligenceact.eu, principalmente) — no la fuente de
   * la clasificación (eso es `legalRef` + el propio árbol), sino
   * ayuda para quien quiera leer el texto real antes de responder.
   */
  links?: QuestionLink[];
}

export type ClassificationLabel =
  | "fuera_de_ambito"
  | "uso_prohibido"
  | "alto_riesgo"
  | "modelo_uso_general"
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
