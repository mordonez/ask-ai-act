import type { Answers } from "./types";

/**
 * Los 5 casos de ejemplo de la guía 2 de AESIA ("Guía práctica y
 * ejemplos para entender el Reglamento de IA", sección 2). La propia
 * guía dice explícitamente: "Todos los casos de uso presentados en
 * esta sección son de alto riesgo." — así que el resultado esperado
 * es siempre `alto_riesgo`, con el Anexo y apartado citados en la
 * propia guía.
 *
 * `answers` es una reconstrucción razonable de cómo respondería el
 * wizard a partir de la descripción de cada caso en el PDF — no viene
 * literalmente del documento (el documento no rellena un cuestionario
 * como el nuestro). Si en el futuro se detecta que alguna respuesta
 * reconstruida no encaja con el árbol, se corrige el caso, no el
 * árbol, salvo que el árbol esté realmente equivocado.
 */

export interface KnownCase {
  id: string;
  title: string;
  source: string;
  answers: Answers;
  expectedLabel: "alto_riesgo";
  expectedLegalRefContains: string;
}

export const KNOWN_CASES: KnownCase[] = [
  {
    id: "biometria_asistencia_trabajo",
    title: "Identificación biométrica en el trabajo (control de asistencia)",
    source:
      "Guía 2, sección 2.1 — Anexo III, apartado 1 (Biometría), subapartado a (identificación biométrica remota)",
    answers: {
      es_sistema_ia: "si",
      practica_prohibida: "no",
      anexo_i_o_iii: "si",
      realiza_perfilado: "no",
      influye_materialmente: "si", // determina directamente el tiempo trabajado registrado
    },
    expectedLabel: "alto_riesgo",
    expectedLegalRefContains: "Anexo",
  },
  {
    id: "promocion_empleados",
    title: "Gestión de personal — Promoción",
    source: "Guía 2, sección 2.2 — Anexo III, apartado 4 (Empleo, gestión de trabajadores y autoempleo)",
    answers: {
      es_sistema_ia: "si",
      practica_prohibida: "no",
      anexo_i_o_iii: "si",
      realiza_perfilado: "si", // evalúa parámetros de la persona empleada
    },
    expectedLabel: "alto_riesgo",
    expectedLegalRefContains: "Anexo",
  },
  {
    id: "ayudas_sociales",
    title: "Predicción de riesgo de exclusión social y acceso a ayudas",
    source: "Guía 2, sección 2.3 — Anexo III, apartado 5 (Acceso a servicios públicos y privados esenciales)",
    answers: {
      es_sistema_ia: "si",
      practica_prohibida: "no",
      anexo_i_o_iii: "si",
      realiza_perfilado: "si", // datos de la unidad familiar
    },
    expectedLabel: "alto_riesgo",
    expectedLegalRefContains: "Anexo",
  },
  {
    id: "bomba_insulina",
    title: "Bomba de insulina inteligente",
    source: "Guía 2, sección 2.4 — Anexo I, apartado A, subapartado 11 (Productos sanitarios)",
    answers: {
      es_sistema_ia: "si",
      practica_prohibida: "no",
      anexo_i_o_iii: "si",
      realiza_perfilado: "no",
      influye_materialmente: "si", // decide la dosis de insulina administrada
    },
    expectedLabel: "alto_riesgo",
    expectedLegalRefContains: "Anexo",
  },
  {
    id: "denuncias_falsas",
    title: "Detección de denuncias falsas",
    source:
      "Guía 2, sección 2.5 — Anexo III, apartado 6.c (Garantía del cumplimiento del Derecho — evaluar la fiabilidad de pruebas)",
    answers: {
      es_sistema_ia: "si",
      practica_prohibida: "no",
      anexo_i_o_iii: "si",
      realiza_perfilado: "no",
      influye_materialmente: "si", // la probabilidad calculada orienta directamente la investigación
    },
    expectedLabel: "alto_riesgo",
    expectedLegalRefContains: "Anexo",
  },
];
