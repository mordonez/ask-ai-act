import { describe, expect, it } from "vitest";
import {
  CORE_QUESTIONS,
  FILTER_6_3_QUESTIONS,
  Q_PROHIBIDO_CONTENIDO_INTIMO,
  TRANSPARENCY_QUESTIONS,
} from "../src/rules/questions";
import { GENERAL_RESOURCES } from "../src/rules/resources";

const ALL_QUESTIONS = [...CORE_QUESTIONS, ...FILTER_6_3_QUESTIONS, ...TRANSPARENCY_QUESTIONS];

describe("preguntas — enlaces bien formados", () => {
  it("toda pregunta salvo prohibido_contenido_intimo tiene al menos un enlace (no hay página dedicada para el Reglamento 2026/1744)", () => {
    const sinEnlaces = ALL_QUESTIONS.filter((q) => !q.links || q.links.length === 0);
    expect(sinEnlaces.map((q) => q.id)).toEqual([Q_PROHIBIDO_CONTENIDO_INTIMO.id]);
  });

  it("cada enlace tiene label no vacío y url https:// válida", () => {
    for (const question of ALL_QUESTIONS) {
      for (const link of question.links ?? []) {
        expect(link.label.length).toBeGreaterThan(0);
        expect(link.url).toMatch(/^https:\/\/.+/);
      }
    }
  });

  it("no hay urls duplicadas con label distinto dentro de la misma pregunta", () => {
    for (const question of ALL_QUESTIONS) {
      const urls = (question.links ?? []).map((l) => l.url);
      expect(new Set(urls).size).toBe(urls.length);
    }
  });
});

describe("preguntas — ejemplos de sí/no", () => {
  it("toda pregunta tiene al menos un ejemplo de 'sí'", () => {
    const sinSi = ALL_QUESTIONS.filter((q) => !q.examples || q.examples.si.length === 0);
    expect(sinSi.map((q) => q.id)).toEqual([]);
  });

  it("toda pregunta tiene al menos un ejemplo de 'no'", () => {
    const sinNo = ALL_QUESTIONS.filter((q) => !q.examples || q.examples.no.length === 0);
    expect(sinNo.map((q) => q.id)).toEqual([]);
  });

  it("la mayoría de preguntas tiene 2 o más ejemplos por lado, no solo uno", () => {
    const conUnSoloSi = ALL_QUESTIONS.filter((q) => q.examples && q.examples.si.length < 2).length;
    const conUnSoloNo = ALL_QUESTIONS.filter((q) => q.examples && q.examples.no.length < 2).length;
    // Solo prohibido_contenido_intimo debería quedarse corto (un "sí" real distinto no siempre existe para las 8 letras del art. 5, pero sí debería haberlo para casi todas).
    expect(conUnSoloSi).toBeLessThanOrEqual(1);
    expect(conUnSoloNo).toBeLessThanOrEqual(1);
  });
});

describe("recursos generales", () => {
  it("6 recursos, todos con label y url https:// válidos", () => {
    expect(GENERAL_RESOURCES).toHaveLength(6);
    for (const link of GENERAL_RESOURCES) {
      expect(link.label.length).toBeGreaterThan(0);
      expect(link.url).toMatch(/^https:\/\/.+/);
    }
  });
});
