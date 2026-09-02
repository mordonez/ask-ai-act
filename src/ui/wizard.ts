import { classify } from "../rules/classify";
import {
  CORE_QUESTIONS,
  FILTER_6_3_QUESTIONS,
  TRANSPARENCY_QUESTIONS,
} from "../rules/questions";
import type { Answer, Answers, ClassificationLabel } from "../rules/types";

/**
 * Wizard mínimo: pinta la siguiente pregunta que `classify()` diga
 * que falta, hasta llegar a un resultado. No guarda estado entre
 * sesiones (Fase 1: sin cuentas, sin base de datos).
 */

const ALL_QUESTIONS = [...CORE_QUESTIONS, ...FILTER_6_3_QUESTIONS, ...TRANSPARENCY_QUESTIONS];
const QUESTIONS_BY_ID = new Map(ALL_QUESTIONS.map((q) => [q.id, q]));

const LABEL_TEXT: Record<ClassificationLabel, string> = {
  fuera_de_ambito: "Fuera del ámbito del Reglamento",
  uso_prohibido: "Uso prohibido",
  alto_riesgo: "Sistema de alto riesgo",
  obligaciones_transparencia: "Obligaciones de transparencia",
  sin_obligaciones_especificas: "Sin obligaciones específicas identificadas",
  no_determinado: "No determinado",
};

let answers: Answers = {};

function render() {
  const app = document.getElementById("app");
  if (!app) return;

  const result = classify(answers);

  if (result.label !== "no_determinado") {
    app.innerHTML = `
      <div id="result" class="${result.label}">
        <strong>${LABEL_TEXT[result.label]}</strong>
        <p>${result.summary}</p>
        ${result.legalRefs.length ? `<p class="legal-ref">Base: ${result.legalRefs.join(", ")}</p>` : ""}
      </div>
      <button id="restart">Empezar de nuevo</button>
    `;
    document.getElementById("restart")?.addEventListener("click", () => {
      answers = {};
      render();
    });
    return;
  }

  const nextId = result.missingQuestions?.[0];
  if (!nextId) {
    // no_determinado sin más preguntas que hacer: necesita revisión manual.
    app.innerHTML = `
      <div id="result" class="no_determinado">
        <strong>No determinado — necesita revisión manual</strong>
        <p>${result.summary}</p>
      </div>
      <button id="restart">Empezar de nuevo</button>
    `;
    document.getElementById("restart")?.addEventListener("click", () => {
      answers = {};
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
