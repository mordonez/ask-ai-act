import type { Role } from "../rules/questions";
import type { Answers, ClassificationResult } from "../rules/types";

/**
 * Persistencia solo en el navegador de quien lo usa — sin servidor,
 * sin cuentas. No es la Fase 2 (backend compartido entre varias
 * personas de una organización): esto solo evita que un refresco
 * borre el progreso, y guarda un histórico local de evaluaciones ya
 * completadas para poder consultarlas sin repetir el wizard.
 *
 * `localStorage` puede lanzar (modo privado, cuota agotada, cookies
 * bloqueadas) — cada función va envuelta en try/catch y la app sigue
 * funcionando sin persistencia si eso pasa, solo pierde la memoria
 * entre sesiones.
 */

const PROGRESS_KEY = "ask-ai-act:progress:v1";
const HISTORY_KEY = "ask-ai-act:history:v1";
const MAX_HISTORY_ENTRIES = 20;

export interface Progress {
  answers: Answers;
  role: Role | undefined;
  /** Nombre de empresa/sistema, opcional — solo para identificar la evaluación en el histórico local. No entra en `classify()`. */
  companyName?: string;
}

export interface HistoryEntry {
  id: string;
  date: string; // ISO
  result: ClassificationResult;
  role: Role | undefined;
  companyName?: string;
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Sin persistencia disponible — el wizard sigue funcionando en memoria.
  }
}

export function loadProgress(): Progress | null {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Progress;
  } catch {
    return null;
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch {
    // no-op
  }
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function addToHistory(entry: HistoryEntry): void {
  try {
    const history = loadHistory();
    history.unshift(entry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY_ENTRIES)));
  } catch {
    // no-op
  }
}
