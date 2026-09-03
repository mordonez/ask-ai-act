import { buildActionPlan } from "../rules/actionPlan";
import { classify } from "../rules/classify";
import { buildCsv } from "../rules/exportCsv";
import {
  CORE_QUESTIONS,
  FILTER_6_3_QUESTIONS,
  ROLE_LABELS,
  TRANSPARENCY_QUESTIONS,
} from "../rules/questions";
import type { Role } from "../rules/questions";
import type { Answer, Answers, ClassificationLabel, ClassificationResult } from "../rules/types";

/**
 * Wizard mínimo: pinta la siguiente pregunta que `classify()` diga
 * que falta, hasta llegar a un resultado; luego pregunta el rol y
 * muestra el plan de acción. No guarda estado entre sesiones (Fase 1:
 * sin cuentas, sin base de datos).
 */

const ALL_QUESTIONS = [...CORE_QUESTIONS, ...FILTER_6_3_QUESTIONS, ...TRANSPARENCY_QUESTIONS];
const QUESTIONS_BY_ID = new Map(ALL_QUESTIONS.map((q) => [q.id, q]));

const LABEL_TEXT: Record<ClassificationLabel, string> = {
  fuera_de_ambito: "Fuera del ámbito del Reglamento",
  uso_prohibido: "Uso prohibido",
  alto_riesgo: "Sistema de alto riesgo",
  modelo_uso_general: "Modelo de IA de uso general (GPAI)",
  obligaciones_transparencia: "Obligaciones de transparencia",
  sin_obligaciones_especificas: "Sin obligaciones específicas identificadas",
  no_determinado: "No determinado",
};

/** Etiquetas que tienen algo que ganar preguntando el rol antes del plan de acción. */
const LABELS_THAT_NEED_ROLE: ClassificationLabel[] = ["alto_riesgo"];

let answers: Answers = {};
let role: Role | undefined;
let roleAsked = false;

function resetAll() {
  answers = {};
  role = undefined;
  roleAsked = false;
}

function downloadCsv(result: ClassificationResult, plan: ReturnType<typeof buildActionPlan>) {
  const csv = buildCsv(result, plan);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ask-ai-act-${result.label}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function renderResult(result: ClassificationResult) {
  const app = document.getElementById("app");
  if (!app) return;

  const plan = buildActionPlan(result, role);
  const itemsHtml = plan.items.length
    ? `<ul>${plan.items.map((i) => `<li>${i.obligation} <span class="legal-ref">(${i.guide})</span></li>`).join("")}</ul>`
    : "";

  app.innerHTML = `
    <div id="result" class="${result.label}">
      <strong>${LABEL_TEXT[result.label]}</strong>
      <p>${result.summary}</p>
      ${result.legalRefs.length ? `<p class="legal-ref">Base: ${result.legalRefs.join(", ")}</p>` : ""}
      <hr />
      <p><strong>Próxima acción:</strong> ${plan.nextAction}</p>
      ${plan.deadlineNote ? `<p class="legal-ref">${plan.deadlineNote}</p>` : ""}
      ${itemsHtml}
    </div>
    <button id="download-csv">Descargar CSV (para tu Excel/Sheets de seguimiento)</button>
    <button id="restart">Empezar de nuevo</button>
  `;
  document.getElementById("download-csv")?.addEventListener("click", () => {
    downloadCsv(result, plan);
  });
  document.getElementById("restart")?.addEventListener("click", () => {
    resetAll();
    render();
  });
}

function renderRoleQuestion() {
  const app = document.getElementById("app");
  if (!app) return;

  const options = Object.entries(ROLE_LABELS) as [Role, string][];
  app.innerHTML = `
    <div class="question">
      <p>¿Qué papel tiene tu organización en este sistema? El plan de acción cambia según el rol.</p>
      ${options
        .map(([value, label]) => `<button data-role="${value}" style="display:block;margin:0.4rem 0;">${label}</button>`)
        .join("")}
      <button data-role="__skip__" style="margin-top:0.8rem;">No lo sé todavía</button>
    </div>
  `;

  app.querySelectorAll<HTMLButtonElement>("button[data-role]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.role;
      role = value === "__skip__" ? undefined : (value as Role);
      roleAsked = true;
      render();
    });
  });
}

function render() {
  const app = document.getElementById("app");
  if (!app) return;

  const result = classify(answers);

  if (result.label !== "no_determinado") {
    if (LABELS_THAT_NEED_ROLE.includes(result.label) && !roleAsked) {
      renderRoleQuestion();
      return;
    }
    renderResult(result);
    return;
  }

  const nextId = result.missingQuestions?.[0];
  if (!nextId) {
    app.innerHTML = `
      <div id="result" class="no_determinado">
        <strong>No determinado — necesita revisión manual</strong>
        <p>${result.summary}</p>
      </div>
      <button id="restart">Empezar de nuevo</button>
    `;
    document.getElementById("restart")?.addEventListener("click", () => {
      resetAll();
      render();
    });
    return;
  }

  const question = QUESTIONS_BY_ID.get(nextId);
  if (!question) {
    app.innerHTML = `<p>Error: no se encontró la siguiente pregunta (${nextId}).</p>`;
    return;
  }

  app.innerHTML = `
    <div class="question">
      <p>${question.text}</p>
      ${question.helpExample ? `<p class="help">${question.helpExample}</p>` : ""}
      <p class="legal-ref">${question.legalRef}</p>
      <button data-answer="si">Sí</button>
      <button data-answer="no">No</button>
      <button data-answer="no_se">No lo sé</button>
    </div>
  `;

  app.querySelectorAll<HTMLButtonElement>("button[data-answer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const answer = btn.dataset.answer as Answer;
      answers = { ...answers, [question.id]: answer };
      render();
    });
  });
}

render();
