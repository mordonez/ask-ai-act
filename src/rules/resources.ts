import type { QuestionLink } from "./types";

/**
 * Recursos generales — no ligados a una pregunta concreta, sino
 * material de fondo para quien quiera profundizar en el Reglamento
 * más allá de lo que este árbol resuelve. Se muestran de forma
 * permanente en la UI (no solo mientras se responde una pregunta).
 */
export const GENERAL_RESOURCES: QuestionLink[] = [
  {
    label: "AI Act Explorer — el Reglamento artículo por artículo",
    url: "https://artificialintelligenceact.eu/ai-act-explorer/",
  },
  {
    label: "Comprobador de cumplimiento (artificialintelligenceact.eu)",
    url: "https://artificialintelligenceact.eu/assessment/eu-ai-act-compliance-checker/",
  },
  {
    label: "Resumen de alto nivel del Reglamento",
    url: "https://artificialintelligenceact.eu/high-level-summary/",
  },
  {
    label: "Comisión Europea — gobernanza y aplicación del Reglamento",
    url: "https://digital-strategy.ec.europa.eu/en/policies/ai-act-governance-and-enforcement",
  },
  {
    label: "Comisión Europea — plan de acción de ciberseguridad e IA",
    url: "https://digital-strategy.ec.europa.eu/en/library/eu-action-plan-cybersecurity-and-artificial-intelligence",
  },
  {
    label: "CGPJ — informe sobre el anteproyecto de ley española de gobernanza de la IA",
    url: "https://www.poderjudicial.es/stfls/CGPJ/COMISI%C3%93N%20DE%20ESTUDIOS%20E%20INFORMES/INFORMES%20DE%20LEY/FICHERO/20260325%20Informe%20APL%20para%20el%20buen%20uso%20y%20la%20gobernanza%20de%20la%20IA.pdf",
  },
];
