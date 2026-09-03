import { describe, expect, it } from "vitest";
import { classify } from "../src/rules/classify";
import { IN_SCOPE_NOT_GPAI, KNOWN_CASES, NOT_PROHIBITED } from "../src/rules/cases";

describe("classify — casos reales de la guía 2 de AESIA", () => {
  for (const knownCase of KNOWN_CASES) {
    it(`clasifica "${knownCase.title}" como alto riesgo (${knownCase.source})`, () => {
      const result = classify(knownCase.answers);
      expect(result.label).toBe(knownCase.expectedLabel);
      expect(result.legalRefs.join(" ")).toContain(knownCase.expectedLegalRefContains);
    });
  }
});

describe("classify — puerta de entrada del art. 2 (exclusiones de ámbito)", () => {
  it("sin ninguna respuesta, pide la primera pregunta: la exclusión militar", () => {
    const result = classify({});
    expect(result.label).toBe("no_determinado");
    expect(result.missingQuestions).toContain("exclusion_militar");
  });

  it("fin exclusivamente militar/defensa -> fuera de ámbito, sin llegar a preguntar nada más", () => {
    const result = classify({ exclusion_militar: "si" });
    expect(result.label).toBe("fuera_de_ambito");
    expect(result.legalRefs).toEqual(["art. 2.3"]);
  });

  it("investigación y desarrollo antes de introducir en el mercado -> fuera de ámbito", () => {
    const result = classify({
      exclusion_militar: "no",
      exclusion_investigacion_desarrollo: "si",
    });
    expect(result.label).toBe("fuera_de_ambito");
    expect(result.legalRefs).toEqual(["art. 2.6 / 2.8"]);
  });

  it("uso personal no profesional -> fuera de ámbito", () => {
    const result = classify({
      exclusion_militar: "no",
      exclusion_investigacion_desarrollo: "no",
      exclusion_uso_personal: "si",
    });
    expect(result.label).toBe("fuera_de_ambito");
    expect(result.legalRefs).toEqual(["art. 2.10"]);
  });

  it("ninguna exclusión absoluta aplica -> sigue preguntando por código abierto antes de es_sistema_ia", () => {
    const result = classify({
      exclusion_militar: "no",
      exclusion_investigacion_desarrollo: "no",
      exclusion_uso_personal: "no",
    });
    expect(result.label).toBe("no_determinado");
    expect(result.missingQuestions).toEqual(["es_codigo_abierto"]);
  });

  it("no es un sistema de IA (tras pasar la puerta del art. 2) -> fuera de ámbito por el art. 3.1", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "no",
    });
    expect(result.label).toBe("fuera_de_ambito");
    expect(result.legalRefs).toEqual(["art. 3.1"]);
  });
});

describe("classify — código abierto (art. 2.12): nota añadida, nunca sustituye la clasificación", () => {
  it("código abierto + sin obligaciones específicas -> la nota se añade al resumen", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_codigo_abierto: "si",
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      es_modelo_uso_general: "no",
      anexo_i_o_iii: "no",
      interactua_con_personas: "no",
      genera_contenido_sintetico: "no",
      transparencia_biometria_emociones: "no",
    });
    expect(result.label).toBe("sin_obligaciones_especificas");
    expect(result.summary).toContain("código abierto");
  });

  it("código abierto pero alto riesgo -> la nota NO se añade (2.12 no exime del alto riesgo)", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_codigo_abierto: "si",
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      es_modelo_uso_general: "no",
      anexo_i_o_iii: "si",
      realiza_perfilado: "si",
    });
    expect(result.label).toBe("alto_riesgo");
    expect(result.summary).not.toContain("código abierto");
  });
});

describe("classify — modelos de IA de uso general (GPAI)", () => {
  it("proveedor de GPAI sin riesgo sistémico -> modelo_uso_general, obligaciones base (art. 53)", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_codigo_abierto: "no",
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      es_modelo_uso_general: "si",
      gpai_riesgo_sistemico: "no",
    });
    expect(result.label).toBe("modelo_uso_general");
    expect(result.legalRefs).toEqual(["art. 53"]);
  });

  it("proveedor de GPAI con riesgo sistémico -> obligaciones adicionales (art. 51 y 55)", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_codigo_abierto: "no",
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      es_modelo_uso_general: "si",
      gpai_riesgo_sistemico: "si",
    });
    expect(result.label).toBe("modelo_uso_general");
    expect(result.legalRefs).toEqual(["art. 51", "art. 55"]);
  });

  it("no es proveedor de GPAI -> sigue por Anexo I/III como antes, no se desvía a modelo_uso_general", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_codigo_abierto: "no",
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      es_modelo_uso_general: "no",
      anexo_i_o_iii: "si",
      realiza_perfilado: "si",
    });
    expect(result.label).toBe("alto_riesgo");
  });

  it("es GPAI pero falta responder si tiene riesgo sistémico -> no_determinado, no asume que no lo tiene", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_codigo_abierto: "no",
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      es_modelo_uso_general: "si",
    });
    expect(result.label).toBe("no_determinado");
    expect(result.missingQuestions).toEqual(["gpai_riesgo_sistemico"]);
  });
});

describe("classify — casos límite del árbol (tras la puerta del art. 2)", () => {
  it("realiza una práctica prohibida -> uso prohibido, aunque no esté en ningún anexo", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      prohibido_manipulacion: "si",
    });
    expect(result.label).toBe("uso_prohibido");
  });

  it("una sola práctica prohibida en 'sí' basta, sin necesidad de responder las otras 8", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      prohibido_manipulacion: "no",
      prohibido_vulnerabilidades: "no",
      prohibido_scoring_social: "si", // esta ya decide, aunque falten las 6 siguientes
    });
    expect(result.label).toBe("uso_prohibido");
    expect(result.legalRefs).toContain("art. 5.1.c");
  });

  it("faltan preguntas de prácticas prohibidas -> pide la siguiente sin contestar, en orden", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      prohibido_manipulacion: "no",
    });
    expect(result.label).toBe("no_determinado");
    expect(result.missingQuestions).toEqual(["prohibido_vulnerabilidades"]);
  });

  it("no está en Anexo I/III y no tiene obligaciones de transparencia -> sin obligaciones específicas", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no",
      interactua_con_personas: "no",
      genera_contenido_sintetico: "no",
      transparencia_biometria_emociones: "no",
    });
    expect(result.label).toBe("sin_obligaciones_especificas");
  });

  it("no está en Anexo I/III pero interactúa con personas -> obligaciones de transparencia, solo la de interacción", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no",
      interactua_con_personas: "si",
      genera_contenido_sintetico: "no",
      transparencia_biometria_emociones: "no",
    });
    expect(result.label).toBe("obligaciones_transparencia");
    expect(result.legalRefs).toEqual(["art. 50.1"]);
  });

  it("genera contenido sintético sin publicarlo -> igualmente obligado a marcarlo técnicamente (art. 50.2 no depende de publicación, corregido tras auditoría de cobertura)", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no",
      interactua_con_personas: "no",
      genera_contenido_sintetico: "si",
      contenido_publicado: "no",
      transparencia_biometria_emociones: "no",
    });
    expect(result.label).toBe("obligaciones_transparencia");
    expect(result.legalRefs).toEqual(["art. 50.2"]);
  });

  it("genera contenido sintético y lo publica, sin revisión editorial -> marcado (50.2) Y divulgación (50.4) a la vez", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no",
      interactua_con_personas: "no",
      genera_contenido_sintetico: "si",
      contenido_publicado: "si",
      contenido_es_texto: "si",
      revision_editorial_sustantiva: "no",
      transparencia_biometria_emociones: "no",
    });
    expect(result.label).toBe("obligaciones_transparencia");
    expect(result.legalRefs).toEqual(["art. 50.2", "art. 50.4"]);
  });

  it("genera texto publicado CON revisión editorial sustantiva -> excepción del art. 50.4 (divulgación), pero el marcado técnico del 50.2 sigue aplicando (caso real de la universidad que redacta artículos con IA, encontrado en una prueba ciega — la excepción de revisión editorial es del 50.4, no del 50.2)", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no",
      interactua_con_personas: "no",
      genera_contenido_sintetico: "si",
      contenido_publicado: "si",
      contenido_es_texto: "si",
      revision_editorial_sustantiva: "si",
      transparencia_biometria_emociones: "no",
    });
    expect(result.label).toBe("obligaciones_transparencia");
    expect(result.legalRefs).toEqual(["art. 50.2"]);
  });

  it("publica imagen/vídeo generado (no texto) -> divulgación del 50.4 aplica siempre, sin ofrecer la excepción de revisión editorial (esa excepción no existe para este tipo de contenido)", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no",
      interactua_con_personas: "no",
      genera_contenido_sintetico: "si",
      contenido_publicado: "si",
      contenido_es_texto: "no",
      transparencia_biometria_emociones: "no",
    });
    expect(result.label).toBe("obligaciones_transparencia");
    expect(result.legalRefs).toEqual(["art. 50.2", "art. 50.4"]);
    // No debería pedir revision_editorial_sustantiva: esa excepción no aplica a imagen/audio/vídeo.
    expect(result.missingQuestions ?? []).not.toContain("revision_editorial_sustantiva");
  });

  it("no se pregunta si se publica ni el resto de la cadena del 50.4 si no genera contenido -> no bloquea el árbol", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no",
      interactua_con_personas: "no",
      genera_contenido_sintetico: "no",
      transparencia_biometria_emociones: "no",
    });
    expect(result.label).toBe("sin_obligaciones_especificas");
  });

  it("interactúa Y genera contenido publicado sin revisión editorial -> las tres obligaciones a la vez (50.1, 50.2 y 50.4)", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no",
      interactua_con_personas: "si",
      genera_contenido_sintetico: "si",
      contenido_publicado: "si",
      contenido_es_texto: "si",
      revision_editorial_sustantiva: "no",
      transparencia_biometria_emociones: "no",
    });
    expect(result.label).toBe("obligaciones_transparencia");
    expect(result.legalRefs).toEqual(["art. 50.1", "art. 50.2", "art. 50.4"]);
  });

  it("interactúa Y genera contenido, pero con revisión editorial -> sobreviven la interacción (50.1) y el marcado (50.2), no la divulgación (50.4)", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no",
      interactua_con_personas: "si",
      genera_contenido_sintetico: "si",
      contenido_publicado: "si",
      contenido_es_texto: "si",
      revision_editorial_sustantiva: "si",
      transparencia_biometria_emociones: "no",
    });
    expect(result.label).toBe("obligaciones_transparencia");
    expect(result.legalRefs).toEqual(["art. 50.1", "art. 50.2"]);
  });

  it("categorización biométrica o reconocimiento de emociones expuestos a personas -> obligación de transparencia del art. 50.3, independiente de que interactúe o genere contenido (hueco encontrado en la auditoría de cobertura)", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no",
      interactua_con_personas: "no",
      genera_contenido_sintetico: "no",
      transparencia_biometria_emociones: "si",
    });
    expect(result.label).toBe("obligaciones_transparencia");
    expect(result.legalRefs).toEqual(["art. 50.3"]);
  });

  it("está en Anexo III, encaja en tarea limitada del art. 6.3 y no perfila ni influye -> excluido de alto riesgo", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "si",
      realiza_perfilado: "no",
      influye_materialmente: "no",
      tarea_procedimental_limitada: "si",
      mejora_resultado_humano_terminado: "no",
      detecta_patrones_sin_sustituir: "no",
      tarea_preparatoria: "no",
      interactua_con_personas: "no",
      genera_contenido_sintetico: "no",
      transparencia_biometria_emociones: "no",
    });
    expect(result.label).toBe("sin_obligaciones_especificas");
  });

  it("está en Anexo III, encaja en tarea limitada pero SÍ realiza perfilado -> sigue siendo alto riesgo", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "si",
      realiza_perfilado: "si",
      influye_materialmente: "no",
      tarea_procedimental_limitada: "si",
    });
    expect(result.label).toBe("alto_riesgo");
  });

  it("está en Anexo III, ninguna tarea limitada aplica -> alto riesgo sin necesidad de más preguntas del filtro", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
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
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "si",
    });
    expect(result.label).toBe("no_determinado");
    expect(result.missingQuestions).toBeDefined();
  });
});

describe("classify — 'no lo sé' nunca se trata como 'sí' (regresión)", () => {
  it("exclusion_militar = no_se -> no_determinado, no asume que no aplica", () => {
    const result = classify({ exclusion_militar: "no_se" });
    expect(result.label).toBe("no_determinado");
    expect(result.missingQuestions).toEqual([]);
  });

  it("es_codigo_abierto = no_se -> no_determinado", () => {
    const result = classify({
      exclusion_militar: "no",
      exclusion_investigacion_desarrollo: "no",
      exclusion_uso_personal: "no",
      es_codigo_abierto: "no_se",
    });
    expect(result.label).toBe("no_determinado");
  });

  it("es_sistema_ia = no_se -> no_determinado, NO fuera_de_ambito ni alto_riesgo", () => {
    const result = classify({ ...IN_SCOPE_NOT_GPAI, es_sistema_ia: "no_se" });
    expect(result.label).toBe("no_determinado");
    expect(result.missingQuestions).toEqual([]);
  });

  it("una práctica prohibida = no_se -> no_determinado, NO uso_prohibido", () => {
    const result = classify({ ...IN_SCOPE_NOT_GPAI, es_sistema_ia: "si", prohibido_manipulacion: "no_se" });
    expect(result.label).toBe("no_determinado");
  });

  it("una práctica prohibida = no_se, pero otra posterior = sí -> sigue siendo uso_prohibido (el 'sí' no espera a que se aclare el 'no lo sé')", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      prohibido_manipulacion: "no_se",
      prohibido_vulnerabilidades: "no",
      prohibido_scoring_social: "si",
    });
    expect(result.label).toBe("uso_prohibido");
  });

  it("es_modelo_uso_general = no_se -> no_determinado, no asume que no es GPAI", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_codigo_abierto: "no",
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      es_modelo_uso_general: "no_se",
    });
    expect(result.label).toBe("no_determinado");
  });

  it("anexo_i_o_iii = no_se -> no_determinado, no continúa el árbol", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no_se",
    });
    expect(result.label).toBe("no_determinado");
  });

  it("realiza_perfilado = no_se dentro del filtro 6.3 -> no_determinado, no concluye alto_riesgo ni lo excluye", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "si",
      realiza_perfilado: "no_se",
    });
    expect(result.label).toBe("no_determinado");
  });

  it("una tarea limitada = no_se, pero ya hay otra = sí -> el filtro igualmente excluye (el 'no_se' no bloquea si ya hay 'sí')", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "si",
      realiza_perfilado: "no",
      influye_materialmente: "no",
      tarea_procedimental_limitada: "si",
      mejora_resultado_humano_terminado: "no_se",
      interactua_con_personas: "no",
      genera_contenido_sintetico: "no",
      transparencia_biometria_emociones: "no",
    });
    expect(result.label).toBe("sin_obligaciones_especificas");
  });

  it("interactua_con_personas = no_se -> no_determinado, no concluye ni obligaciones_transparencia ni sin_obligaciones", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no",
      interactua_con_personas: "no_se",
    });
    expect(result.label).toBe("no_determinado");
  });

  it("interactua_con_personas = no, genera_contenido_sintetico = no_se -> no_determinado (no basta con que la primera sea 'no')", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no",
      interactua_con_personas: "no",
      genera_contenido_sintetico: "no_se",
    });
    expect(result.label).toBe("no_determinado");
  });

  it("genera contenido sintético = sí, pero falta responder si se publica -> no_determinado, no asume que no se publica", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no",
      interactua_con_personas: "no",
      genera_contenido_sintetico: "si",
    });
    expect(result.label).toBe("no_determinado");
    expect(result.missingQuestions).toEqual(["contenido_publicado"]);
  });

  it("contenido_publicado = no_se -> no_determinado, no asume ni que se publica ni que no", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no",
      interactua_con_personas: "no",
      genera_contenido_sintetico: "si",
      contenido_publicado: "no_se",
    });
    expect(result.label).toBe("no_determinado");
  });

  it("se publica, pero falta responder si es texto -> no_determinado, no asume el tipo de contenido", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no",
      interactua_con_personas: "no",
      genera_contenido_sintetico: "si",
      contenido_publicado: "si",
    });
    expect(result.label).toBe("no_determinado");
    expect(result.missingQuestions).toEqual(["contenido_es_texto"]);
  });

  it("contenido_es_texto = no_se -> no_determinado", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no",
      interactua_con_personas: "no",
      genera_contenido_sintetico: "si",
      contenido_publicado: "si",
      contenido_es_texto: "no_se",
    });
    expect(result.label).toBe("no_determinado");
  });

  it("es texto publicado, pero falta responder la revisión editorial -> no_determinado, no asume que no hay revisión", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no",
      interactua_con_personas: "no",
      genera_contenido_sintetico: "si",
      contenido_publicado: "si",
      contenido_es_texto: "si",
    });
    expect(result.label).toBe("no_determinado");
    expect(result.missingQuestions).toEqual(["revision_editorial_sustantiva"]);
  });

  it("revision_editorial_sustantiva = no_se -> no_determinado, no asume ni que hay revisión ni que no la hay", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no",
      interactua_con_personas: "no",
      genera_contenido_sintetico: "si",
      contenido_publicado: "si",
      contenido_es_texto: "si",
      revision_editorial_sustantiva: "no_se",
    });
    expect(result.label).toBe("no_determinado");
  });

  it("no es texto (imagen/audio/vídeo) publicado -> no pide revisión editorial, esa excepción no existe para este tipo de contenido; falta transparencia_biometria_emociones para concluir", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no",
      interactua_con_personas: "no",
      genera_contenido_sintetico: "si",
      contenido_publicado: "si",
      contenido_es_texto: "no",
    });
    expect(result.label).toBe("no_determinado");
    expect(result.missingQuestions).toEqual(["transparencia_biometria_emociones"]);
  });

  it("transparencia_biometria_emociones = no_se -> no_determinado", () => {
    const result = classify({
      ...IN_SCOPE_NOT_GPAI,
      es_sistema_ia: "si",
      ...NOT_PROHIBITED,
      anexo_i_o_iii: "no",
      interactua_con_personas: "no",
      genera_contenido_sintetico: "no",
      transparencia_biometria_emociones: "no_se",
    });
    expect(result.label).toBe("no_determinado");
  });
});
