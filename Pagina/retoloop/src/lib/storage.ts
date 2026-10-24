import type { Answers, Lang, Quiz, QuizResult } from '../types/quiz';
import { areAnswersValid } from './scoring';
import { isValidQuizId, parseLang } from './validation';

const PREFIX = 'retoloop:v1:';
const KEYS = ['prefs', 'progress', 'results'] as const;

/** Respaldo en memoria para cuando localStorage está bloqueado o lleno. */
const memory = new Map<string, string>();

function rawGet(key: string): string | null {
  const fromMemory = memory.get(key);
  if (fromMemory !== undefined) return fromMemory;
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

function rawSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(PREFIX + key, value);
    memory.delete(key);
  } catch {
    memory.set(key, value);
  }
}

function rawRemove(key: string): void {
  memory.delete(key);
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* sin almacenamiento: nada que borrar */
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const getOwn = (record: Record<string, unknown>, key: string): unknown =>
  Object.prototype.hasOwnProperty.call(record, key) ? record[key] : undefined;

function readRecord(key: string): Record<string, unknown> {
  const raw = rawGet(key);
  if (raw === null) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

// --- Preferencias -----------------------------------------------------------

export const prefsStore = {
  load(): { lang: Lang } | null {
    const lang = parseLang(readRecord('prefs').lang);
    return lang ? { lang } : null;
  },
  save(prefs: { lang: Lang }): void {
    rawSet('prefs', JSON.stringify({ lang: prefs.lang }));
  },
};

// --- Progreso de un cuestionario en curso -----------------------------------

export interface Progress {
  answers: Answers;
  step: number;
}

export const progressStore = {
  load(quizId: string, quiz: Quiz): Progress | null {
    if (!isValidQuizId(quizId)) return null;
    const entry = getOwn(readRecord('progress'), quizId);
    if (!isRecord(entry)) return null;
    const { answers, step } = entry;
    if (!areAnswersValid(quiz, answers)) return null;
    if (typeof step !== 'number' || !Number.isInteger(step) || step < 0 || step >= quiz.questions.length) return null;
    return { answers, step };
  },
  save(quizId: string, progress: Progress): void {
    if (!isValidQuizId(quizId)) return;
    rawSet('progress', JSON.stringify({ ...readRecord('progress'), [quizId]: progress }));
  },
  clear(quizId: string): void {
    const all = readRecord('progress');
    delete all[quizId];
    rawSet('progress', JSON.stringify(all));
  },
};

// --- Últimos resultados -----------------------------------------------------

export interface StoredResult {
  result: QuizResult;
  /** Mejor número de aciertos (solo trivia). */
  best: number | null;
  at: number;
}

const isCount = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0;

function parseResult(value: unknown): QuizResult | null {
  if (!isRecord(value)) return null;
  if (value.kind === 'trivia') {
    const { correct, total, percent, outcomeIndex } = value;
    if (isCount(correct) && isCount(total) && isCount(percent) && isCount(outcomeIndex) && correct <= total && percent <= 100) {
      return { kind: 'trivia', correct, total, percent, outcomeIndex };
    }
    return null;
  }
  if (value.kind === 'personality') {
    const { profileId, totals } = value;
    if (!isValidQuizId(profileId) || !isRecord(totals)) return null;
    const clean: Record<string, number> = {};
    for (const [id, points] of Object.entries(totals)) {
      if (!isValidQuizId(id) || typeof points !== 'number' || !Number.isFinite(points)) return null;
      clean[id] = points;
    }
    return { kind: 'personality', profileId, totals: clean };
  }
  return null;
}

export const resultsStore = {
  get(quizId: string): StoredResult | null {
    if (!isValidQuizId(quizId)) return null;
    const entry = getOwn(readRecord('results'), quizId);
    if (!isRecord(entry)) return null;
    const result = parseResult(entry.result);
    if (!result) return null;
    return {
      result,
      best: isCount(entry.best) ? entry.best : null,
      at: typeof entry.at === 'number' && Number.isFinite(entry.at) ? entry.at : 0,
    };
  },
  save(quizId: string, result: QuizResult): void {
    if (!isValidQuizId(quizId)) return;
    const previous = this.get(quizId);
    const best = result.kind === 'trivia' ? Math.max(previous?.best ?? 0, result.correct) : null;
    const entry: StoredResult = { result, best, at: Date.now() };
    rawSet('results', JSON.stringify({ ...readRecord('results'), [quizId]: entry }));
  },
};

/** Borra todo lo que RetoLoop guarda en este dispositivo. */
export function clearAllData(): void {
  for (const key of KEYS) rawRemove(key);
}
