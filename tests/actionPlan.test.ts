import { describe, expect, it } from "vitest";
import { buildActionPlan } from "../src/rules/actionPlan";
import { classify } from "../src/rules/classify";
import { KNOWN_CASES } from "../src/rules/cases";
import type { ClassificationResult } from "../src/rules/types";

const ALTO_RIESGO: ClassificationResult = {
  label: "alto_riesgo",
  summary: "Sistema de alto riesgo.",
  legalRefs: ["Anexo I / Anexo III"],
};

describe("buildActionPlan — alto riesgo, por rol", () => {
  it("proveedor recibe las obligaciones de calidad, riesgos, datos, conformidad y documentación técnica", () => {
    const plan = buildActionPlan(ALTO_RIESGO, "proveedor");
    const obligations = plan.items.map((i) => i.obligation).join(" | ");
    expect(obligations).toContain("gestión de la calidad");
    expect(obligations).toContain("Documentación técnica");
    expect(obligations).toContain("Evaluación de conformidad");
    expect(plan.items.length).toBeGreaterThan(0);
  });

  it("responsable del despliegue recibe supervisión humana y EIDF/FRIA, no el sistema de calidad del proveedor", () => {
    const plan = buildActionPlan(ALTO_RIESGO, "responsable_despliegue");
    const obligations = plan.items.map((i) => i.obligation).join(" | ");
    expect(obligations).toContain("Supervisión humana");
    expect(obligations).toContain("derechos fundamentales");
    expect(obligations).not.toContain("Documentación técnica completa");
  });

  it("importador recibe obligaciones de verificación, no las de desarrollo del proveedor", () => {
    const plan = buildActionPlan(ALTO_RIESGO, "importador");
    const obligations = plan.items.map((i) => i.obligation).join(" | ");
    expect(obligations).toContain("Verificar que el proveedor");
  });

  it("sin rol conocido, da un conjunto combinado en vez de nada", () => {
    const plan = buildActionPlan(ALTO_RIESGO, undefined);
    expect(plan.items.length).toBeGreaterThan(0);
    expect(plan.nextAction).toContain("rol");
  });

  it("siempre incluye la nota de plazo (Anexo III vs Anexo I)", () => {
    const plan = buildActionPlan(ALTO_RIESGO, "proveedor");
    expect(plan.deadlineNote).toBeDefined();
    expect(plan.deadlineNote).toContain("2027");
    expect(plan.deadlineNote).toContain("2028");
  });
});

describe("buildActionPlan — otras clasificaciones", () => {
  it("uso_prohibido: la próxima acción es detener y consultar legal, no una checklist técnica", () => {
    const plan = buildActionPlan(
      { label: "uso_prohibido", summary: "Uso prohibido.", legalRefs: ["art. 5"] },
      undefined
    );
    expect(plan.nextAction).toMatch(/detén|consulta/i);
  });

  it("fuera_de_ambito: no exige ninguna obligación", () => {
    const plan = buildActionPlan(
      { label: "fuera_de_ambito", summary: "Fuera de ámbito.", legalRefs: ["art. 3.1"] },
      undefined
    );
    expect(plan.items).toHaveLength(0);
  });
});

describe("buildActionPlan — coherente con los 5 casos reales de AESIA", () => {
  for (const knownCase of KNOWN_CASES) {
    it(`"${knownCase.title}" con rol proveedor da un plan con obligaciones de alto riesgo`, () => {
      const result = classify(knownCase.answers);
      const plan = buildActionPlan(result, "proveedor");
      expect(plan.items.length).toBeGreaterThan(5);
    });
  }
});
