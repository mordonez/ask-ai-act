import { describe, expect, it } from "vitest";
import { classify } from "../src/rules/classify";
import { KNOWN_CASES } from "../src/rules/cases";

describe("classify — casos reales de la guía 2 de AESIA", () => {
  for (const knownCase of KNOWN_CASES) {
    it(`clasifica "${knownCase.title}" como alto riesgo (${knownCase.source})`, () => {
      const result = classify(knownCase.answers);
      expect(result.label).toBe(knownCase.expectedLabel);
      expect(result.legalRefs.join(" ")).toContain(knownCase.expectedLegalRefContains);
    });
  }
});

describe("classify — casos límite del árbol", () => {
  it("sin ninguna respuesta, pide la primera pregunta", () => {
    const result = classify({});
    expect(result.label).toBe("no_determinado");
    expect(result.missingQuestions).toContain("es_sistema_ia");
  });

  it("no es un sistema de IA -> fuera de ámbito", () => {
    const result = classify({ es_sistema_ia: "no" });
    expect(result.label).toBe("fuera_de_ambito");
  });

  it("realiza una práctica prohibida -> uso prohibido, aunque no esté en ningún anexo", () => {
    const result = classify({
      es_sistema_ia: "si",
      practica_prohibida: "si",
    });
    expect(result.label).toBe("uso_prohibido");
  });

  it("no está en Anexo I/III y no tiene obligaciones de transparencia -> sin obligaciones específicas", () => {
    const result = classify({
      es_sistema_ia: "si",
      practica_prohibida: "no",
      anexo_i_o_iii: "no",
      obligaciones_transparencia: "no",
    });
    expect(result.label).toBe("sin_obligaciones_especificas");
  });

  it("no está en Anexo I/III pero interactúa con personas -> obligaciones de transparencia", () => {
    const result = classify({
      es_sistema_ia: "si",
      practica_prohibida: "no",
      anexo_i_o_iii: "no",
      obligaciones_transparencia: "si",
    });
    expect(result.label).toBe("obligaciones_transparencia");
  });

  it("está en Anexo III, encaja en tarea limitada del art. 6.3 y no perfila ni influye -> excluido de alto riesgo", () => {
    const result = classify({
      es_sistema_ia: "si",
      practica_prohibida: "no",
      anexo_i_o_iii: "si",
      realiza_perfilado: "no",
      influye_materialmente: "no",
      tarea_procedimental_limitada: "si",
      mejora_resultado_humano_terminado: "no",
      detecta_patrones_sin_sustituir: "no",
      tarea_preparatoria: "no",
      obligaciones_transparencia: "no",
    });
    expect(result.label).toBe("sin_obligaciones_especificas");
  });

  it("está en Anexo III, encaja en tarea limitada pero SÍ realiza perfilado -> sigue siendo alto riesgo", () => {
    const result = classify({
      es_sistema_ia: "si",
      practica_prohibida: "no",
      anexo_i_o_iii: "si",
      realiza_perfilado: "si",
      influye_materialmente: "no",
      tarea_procedimental_limitada: "si",
    });
    expect(result.label).toBe("alto_riesgo");
  });

  it("está en Anexo III, ninguna tarea limitada aplica -> alto riesgo sin necesidad de más preguntas del filtro", () => {
    const result = classify({
      es_sistema_ia: "si",
      practica_prohibida: "no",
      anexo_i_o_iii: "si",
      realiza_perfilado: "no",
      influye_materialmente: "no",
      tarea_procedimental_limitada: "no",
      mejora_resultado_humano_terminado: "no",
      detecta_patrones_sin_sustituir: "no",
      tarea_preparatoria: "no",
    });
    expect(result.label).toBe("alto_riesgo");
  });

  it("faltan respuestas del filtro 6.3 -> no_determinado, no inventa una clasificación", () => {
    const result = classify({
      es_sistema_ia: "si",
      practica_prohibida: "no",
      anexo_i_o_iii: "si",
    });
    expect(result.label).toBe("no_determinado");
    expect(result.missingQuestions).toBeDefined();
  });
});

describe("classify — 'no lo sé' nunca se trata como 'sí' (regresión)", () => {
  it("es_sistema_ia = no_se -> no_determinado, NO fuera_de_ambito ni alto_riesgo", () => {
    const result = classify({ es_sistema_ia: "no_se" });
    expect(result.label).toBe("no_determinado");
    expect(result.missingQuestions).toEqual([]);
  });

  it("practica_prohibida = no_se -> no_determinado, NO uso_prohibido", () => {
    const result = classify({ es_sistema_ia: "si", practica_prohibida: "no_se" });
    expect(result.label).toBe("no_determinado");
  });

  it("anexo_i_o_iii = no_se -> no_determinado, no continúa el árbol", () => {
    const result = classify({
      es_sistema_ia: "si",
      practica_prohibida: "no",
      anexo_i_o_iii: "no_se",
    });
    expect(result.label).toBe("no_determinado");
  });

  it("realiza_perfilado = no_se dentro del filtro 6.3 -> no_determinado, no concluye alto_riesgo ni lo excluye", () => {
    const result = classify({
      es_sistema_ia: "si",
      practica_prohibida: "no",
      anexo_i_o_iii: "si",
      realiza_perfilado: "no_se",
    });
    expect(result.label).toBe("no_determinado");
  });

  it("una tarea limitada = no_se, pero ya hay otra = sí -> el filtro igualmente excluye (el 'no_se' no bloquea si ya hay 'sí')", () => {
    const result = classify({
      es_sistema_ia: "si",
      practica_prohibida: "no",
      anexo_i_o_iii: "si",
      realiza_perfilado: "no",
      influye_materialmente: "no",
      tarea_procedimental_limitada: "si",
      mejora_resultado_humano_terminado: "no_se",
      obligaciones_transparencia: "no",
    });
    expect(result.label).toBe("sin_obligaciones_especificas");
  });
});
