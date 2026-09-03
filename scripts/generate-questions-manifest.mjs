#!/usr/bin/env node
// Genera eval/context/arbol-preguntas.md a partir de src/rules/questions.ts —
// nunca al revés. Es la única fuente de verdad (Question[] tipado); este
// script solo la vuelca en un formato legible para pegar en el contexto de
// un modelo que audite si el árbol cubre toda la especificación del
// Reglamento (UE) 2024/1689 (ver eval/README.md, sección "Auditoría de
// cobertura").
//
// Uso: node scripts/generate-questions-manifest.mjs   (o `npm run manifest`)
// Requiere Node ≥ 22.6 (type-stripping nativo de .ts, sin dependencias).

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const questionsModule = await import("../src/rules/questions.ts");
const { CORE_QUESTIONS, FILTER_6_3_QUESTIONS, TRANSPARENCY_QUESTIONS, ROLE_LABELS } =
  questionsModule;

const GROUPS = [
  ["Núcleo (ámbito, art. 5, GPAI, Anexo I/III)", CORE_QUESTIONS],
  ["Filtro del art. 6.3 (solo si aplica Anexo III)", FILTER_6_3_QUESTIONS],
  ["Transparencia (art. 50, sistemas que no son de alto riesgo)", TRANSPARENCY_QUESTIONS],
];

function questionEntry(q) {
  const lines = [`### \`${q.id}\` — ${q.legalRef}`, "", q.text.trim()];
  if (q.examples) {
    if (q.examples.si?.length) {
      lines.push("", "Ejemplos que responden **sí**:");
      for (const e of q.examples.si) lines.push(`- ${e}`);
    }
    if (q.examples.no?.length) {
      lines.push("", "Ejemplos que responden **no**:");
      for (const e of q.examples.no) lines.push(`- ${e}`);
    }
  }
  if (q.links?.length) {
    lines.push("", "Enlaces:");
    for (const l of q.links) lines.push(`- ${l.label}: ${l.url}`);
  }
  return lines.join("\n");
}

const allIds = new Set();
let body = `# Árbol de preguntas — ask-ai-act (generado, no editar a mano)

Generado por \`scripts/generate-questions-manifest.mjs\` a partir de
\`src/rules/questions.ts\`. Vuelve a generarlo (\`npm run manifest\`) después de
tocar ese fichero — no lo edites aquí directamente, se sobrescribe.

Pensado para pegarse junto con \`sources/reglamento_ue_2024_1689_es.txt\` en el
contexto de un modelo al que se le pida auditar cobertura: "¿hay alguna
obligación del Reglamento para la que este árbol no tiene pregunta?". Ver
\`eval/README.md\`, sección "Auditoría de cobertura".

Total de preguntas: ${CORE_QUESTIONS.length + FILTER_6_3_QUESTIONS.length + TRANSPARENCY_QUESTIONS.length}.
`;

for (const [title, questions] of GROUPS) {
  body += `\n## ${title} (${questions.length})\n\n`;
  for (const q of questions) {
    allIds.add(q.id);
    body += questionEntry(q) + "\n\n";
  }
}

body += `## Rol en la cadena (tras la clasificación, no parte del árbol de preguntas sí/no)\n\n`;
for (const [role, label] of Object.entries(ROLE_LABELS)) {
  body += `- \`${role}\`: ${label}\n`;
}

const outPath = fileURLToPath(new URL("../eval/context/arbol-preguntas.md", import.meta.url));
await writeFile(outPath, body, "utf-8");
console.log(`Generado ${outPath} (${allIds.size} preguntas).`);
