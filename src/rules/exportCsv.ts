import type { ActionPlan } from "./actionPlan";
import type { ClassificationResult } from "./types";

/**
 * Convierte un resultado + plan de acción en un CSV importable a
 * Google Sheets/Excel, con las mismas columnas que el checklist
 * manual que ya se usaba antes de tener el clasificador: una fila
 * por obligación, lista para que alguien la copie a su propio
 * seguimiento (Fase 2 no existe todavía — esto no sustituye el
 * seguimiento, solo evita rellenarlo a mano desde cero).
 */

const CSV_HEADER = ["Tipo", "Descripción", "Guía", "Estado", "Responsable", "Evidencia"];

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function row(fields: string[]): string {
  return fields.map(escapeCsvField).join(",");
}

export function buildCsv(result: ClassificationResult, plan: ActionPlan): string {
  const lines: string[] = [row(CSV_HEADER)];

  lines.push(
    row(["Resultado", result.summary, result.legalRefs.join(" / "), "", "", ""])
  );
  lines.push(row(["Próxima acción", plan.nextAction, plan.deadlineNote ?? "", "", "", ""]));

  for (const item of plan.items) {
    lines.push(row(["Obligación", item.obligation, item.guide, "Pendiente", "", ""]));
  }

  return lines.join("\r\n") + "\r\n";
}
