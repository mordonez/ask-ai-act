import { describe, expect, it } from "vitest";
import { buildActionPlan } from "../src/rules/actionPlan";
import { buildCsv } from "../src/rules/exportCsv";
import type { ClassificationResult } from "../src/rules/types";

const ALTO_RIESGO: ClassificationResult = {
  label: "alto_riesgo",
  summary: "Sistema de alto riesgo.",
  legalRefs: ["Anexo I / Anexo III"],
};

describe("buildCsv", () => {
  it("incluye la cabecera con las columnas del checklist manual", () => {
    const plan = buildActionPlan(ALTO_RIESGO, "proveedor");
    const csv = buildCsv(ALTO_RIESGO, plan);
    expect(csv.split("\r\n")[0]).toBe("Tipo,Descripción,Guía,Estado,Responsable,Evidencia");
  });

  it("una fila 'Obligación' por cada item del plan, con Estado Pendiente", () => {
    const plan = buildActionPlan(ALTO_RIESGO, "proveedor");
    const csv = buildCsv(ALTO_RIESGO, plan);
    const obligationRows = csv.split("\r\n").filter((l) => l.startsWith("Obligación,"));
    expect(obligationRows).toHaveLength(plan.items.length);
    expect(obligationRows[0]).toContain("Pendiente");
  });

  it("escapa correctamente un campo con comas y comillas", () => {
    const plan = { nextAction: 'Texto con, coma y "comillas"', items: [] };
    const csv = buildCsv(
      { label: "sin_obligaciones_especificas", summary: "resumen", legalRefs: [] },
      plan
    );
    expect(csv).toContain('"Texto con, coma y ""comillas"""');
  });

  it("sin obligaciones (p. ej. fuera de ámbito), sigue produciendo un CSV válido con resultado y próxima acción", () => {
    const plan = buildActionPlan(
      { label: "fuera_de_ambito", summary: "Fuera de ámbito.", legalRefs: ["art. 3.1"] },
      undefined
    );
    const csv = buildCsv(
      { label: "fuera_de_ambito", summary: "Fuera de ámbito.", legalRefs: ["art. 3.1"] },
      plan
    );
    const lines = csv.trim().split("\r\n");
    expect(lines).toHaveLength(3); // cabecera + Resultado + Próxima acción, sin filas de Obligación
  });
});
