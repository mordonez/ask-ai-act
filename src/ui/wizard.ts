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
import { GENERAL_RESOURCES } from "../rules/resources";
import type {
  Answer,
  Answers,
  ClassificationLabel,
  ClassificationResult,
  QuestionExamples,
  QuestionLink,
} from "../rules/types";
import { addToHistory, clearProgress, loadHistory, loadProgress, saveProgress } from "./storage";
import type { HistoryEntry } from "./storage";

/**
 * Wizard mínimo: pinta la siguiente pregunta que `classify()` diga
 * que falta, hasta llegar a un resultado; luego pregunta el rol y
 * muestra el plan de acción. El progreso y el histórico de
 * evaluaciones se guardan en `localStorage` (ver `storage.ts`) — solo
 * en el navegador de quien lo usa, sin cuentas ni backend.
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

const restored = loadProgress();
let answers: Answers = restored?.answers ?? {};
let role: Role | undefined = restored?.role;
let roleAsked = role !== undefined;
let resultSaved = false;
/** undefined = todavía no se ha preguntado; "" = se preguntó y se saltó. */
let companyName: string | undefined = restored?.companyName;

function resetAll() {
  answers = {};
  role = undefined;
  roleAsked = false;
  resultSaved = false;
  companyName = undefined;
  clearProgress();
}

function persist() {
  saveProgress({ answers, role, companyName });
}

/** Escapa texto libre antes de insertarlo en innerHTML — companyName lo escribe quien usa el wizard. */
function escapeHtml(value: string): string {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
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

function examplesHtml(examples: QuestionExamples | undefined): string {
  if (!examples || (examples.si.length === 0 && examples.no.length === 0)) return "";
  const list = (items: string[]) => `<ul>${items.map((e) => `<li>${e}</li>`).join("")}</ul>`;
  return `
    <div class="examples">
      ${examples.si.length ? `<div class="examples-col examples-si"><span class="examples-label">Sí</span>${list(examples.si)}</div>` : ""}
      ${examples.no.length ? `<div class="examples-col examples-no"><span class="examples-label">No</span>${list(examples.no)}</div>` : ""}
    </div>
  `;
}

function linksHtml(links: QuestionLink[] | undefined): string {
  if (!links || links.length === 0) return "";
  const items = links
    .map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.label} ↗</a></li>`)
    .join("");
  return `<ul class="links">${items}</ul>`;
}

function renderResources() {
  const container = document.getElementById("resources");
  if (!container) return;
  container.innerHTML = `
    <h2>Para profundizar</h2>
    ${linksHtml(GENERAL_RESOURCES)}
  `;
}

function renderHistory() {
  const container = document.getElementById("history");
  if (!container) return;

  const history = loadHistory();
  if (history.length === 0) {
    container.innerHTML = "";
    return;
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return iso;
    }
  };

  container.innerHTML = `
    <h2>Evaluaciones anteriores en este navegador</h2>
    <ul>
      ${history
        .map((entry) => {
          const label = LABEL_TEXT[entry.result.label];
          const title = entry.companyName ? `${escapeHtml(entry.companyName)} — ${label}` : label;
          return `<li><span>${title}</span><span class="h-date">${formatDate(entry.date)}</span></li>`;
        })
        .join("")}
    </ul>
  `;
}

function renderResult(result: ClassificationResult) {
  const app = document.getElementById("app");
  if (!app) return;

  if (!resultSaved) {
    const entry: HistoryEntry = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      date: new Date().toISOString(),
      result,
      role,
      companyName: companyName || undefined,
    };
    addToHistory(entry);
    resultSaved = true;
    clearProgress();
    renderHistory();
  }

  const plan = buildActionPlan(result, role);
  const itemsHtml = plan.items.length
    ? `<ul>${plan.items.map((i) => `<li>${i.obligation} <span class="legal-ref">(${i.guide})</span></li>`).join("")}</ul>`
    : "";

  app.innerHTML = `
    <div id="result" class="${result.label}">
      ${companyName ? `<p class="eval-subject">${escapeHtml(companyName)}</p>` : ""}
      <strong>${LABEL_TEXT[result.label]}</strong>
      <p>${result.summary}</p>
      ${result.legalRefs.length ? `<p class="legal-ref">Base: ${result.legalRefs.join(", ")}</p>` : ""}
      <hr />
      <p><strong>Próxima acción:</strong> ${plan.nextAction}</p>
      ${plan.deadlineNote ? `<p class="legal-ref">${plan.deadlineNote}</p>` : ""}
      ${itemsHtml}
    </div>
    <div class="actions">
      <button id="download-csv">Descargar CSV (para tu Excel/Sheets de seguimiento)</button>
      <button id="restart">Empezar de nuevo</button>
    </div>
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
      <div class="actions" style="flex-direction:column;align-items:flex-start;">
        ${options.map(([value, label]) => `<button data-role="${value}">${label}</button>`).join("")}
        <button data-role="__skip__">No lo sé todavía</button>
      </div>
    </div>
  `;

  app.querySelectorAll<HTMLButtonElement>("button[data-role]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.role;
      role = value === "__skip__" ? undefined : (value as Role);
      roleAsked = true;
      persist();
      render();
    });
  });
}

/**
 * Bloque de contexto plegable, antes de la primera pregunta. Los 6
 * resultados listados son literalmente `ClassificationLabel` de
 * `../rules/types` — no se inventan categorías nuevas aquí. La única
 * fecha (art. 113) está verificada contra
 * `sources/reglamento_ue_2024_1689_es.txt`.
 */
function introHtml(): string {
  return `
    <details class="intro">
      <summary>¿Qué es el Reglamento de IA en 2 minutos?</summary>
      <div class="intro-body">
        <p>
          El Reglamento (UE) 2024/1689 clasifica cada sistema de IA según el
          <strong>riesgo</strong> que supone para la salud, la seguridad o los
          derechos de las personas, y asigna obligaciones distintas a cada
          nivel. Este wizard recorre esa clasificación por ti, pregunta a
          pregunta, y te dice exactamente qué artículo o anexo sustenta cada
          respuesta.
        </p>
        <p>Puedes acabar en uno de estos resultados:</p>
        <ul>
          <li><strong>Fuera de ámbito.</strong> El Reglamento no te aplica (uso militar, investigación antes de salir al mercado, uso personal no profesional, o similar).</li>
          <li><strong>Uso prohibido (art. 5).</strong> El sistema hace algo que la UE prohíbe sin excepción — por ejemplo, puntuación social o manipulación subliminal que cause perjuicio.</li>
          <li><strong>Alto riesgo (Anexo I o Anexo III).</strong> El grueso del Reglamento: obligaciones de gestión de riesgos, documentación técnica, supervisión humana y registro antes de salir al mercado. Aplica a ámbitos como empleo, crédito, educación, sanidad, biometría o justicia.</li>
          <li><strong>Obligaciones de transparencia (art. 50).</strong> El sistema no es de alto riesgo, pero interactúa con personas o genera contenido — y hay que decírselo a quien lo usa.</li>
          <li><strong>Modelo de uso general (GPAI, capítulo V).</strong> Vía aparte para quien desarrolla modelos de propósito general (no quien simplemente los usa), con obligaciones propias si además tiene riesgo sistémico.</li>
          <li><strong>Sin obligaciones específicas.</strong> La mayoría de la IA en uso hoy cae aquí.</li>
        </ul>
        <p>
          <strong>Lo que esta herramienta no hace:</strong> no sustituye
          asesoría legal, y si a una pregunta le falta información para
          responder con seguridad, el resultado es "no se puede determinar
          todavía" — nunca una clasificación inventada.
        </p>
        <p class="intro-note">
          La mayor parte del Reglamento ya es de aplicación obligatoria desde
          el 2 de agosto de 2026 (art. 113); solo quedan pendientes hasta el 2
          de agosto de 2027 las obligaciones de alto riesgo para sistemas que
          son componentes de seguridad de productos ya regulados (máquinas,
          dispositivos médicos, aviación...).
          <a href="https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=OJ:L_202401689" target="_blank" rel="noopener noreferrer">Texto oficial del Reglamento en EUR-Lex ↗</a>
        </p>
      </div>
    </details>
  `;
}

function renderCompanyStep() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    ${introHtml()}
    <div class="question">
      <p>¿Cómo se llama la empresa o el sistema que vas a evaluar?</p>
      <p class="help">Opcional — solo sirve para identificar esta evaluación en tu lista de "evaluaciones anteriores". Se guarda únicamente en tu navegador, no se envía a ningún servidor.</p>
      <input type="text" id="company-name" placeholder="Ej. Mi Empresa S.L. — sistema de selección de personal" maxlength="120" />
      <div class="actions">
        <button id="company-continue" data-answer="si">Continuar</button>
        <button id="company-skip">Prefiero no decirlo</button>
      </div>
    </div>
  `;

  const input = document.getElementById("company-name") as HTMLInputElement | null;
  input?.focus();

  const submit = (value: string) => {
    companyName = value.trim();
    persist();
    render();
  };

  document.getElementById("company-continue")?.addEventListener("click", () => submit(input?.value ?? ""));
  document.getElementById("company-skip")?.addEventListener("click", () => submit(""));
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submit(input.value);
  });
}

function render() {
  const app = document.getElementById("app");
  if (!app) return;

  if (companyName === undefined && Object.keys(answers).length === 0) {
    renderCompanyStep();
    return;
  }

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
      ${examplesHtml(question.examples)}
      <p class="legal-ref">${question.legalRef}</p>
      ${linksHtml(question.links)}
      <div class="actions">
        <button data-answer="si">Sí</button>
        <button data-answer="no">No</button>
        <button data-answer="no_se">No lo sé</button>
      </div>
    </div>
  `;

  app.querySelectorAll<HTMLButtonElement>("button[data-answer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const answer = btn.dataset.answer as Answer;
      answers = { ...answers, [question.id]: answer };
      persist();
      render();
    });
  });
}

render();
renderHistory();
renderResources();
