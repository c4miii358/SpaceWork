import type { Lang, PersonalityQuiz } from '../types/quiz';

const QUIZ_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Los ids de cuestionario y de perfil: minúsculas, números y guiones; máximo 64 caracteres. */
export function isValidQuizId(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 64 && QUIZ_ID.test(value);
}

/** Puntuación de reto recibida por URL: entero entre 0 y el número de preguntas, o null. */
export function parseChallengeScore(raw: string | null, total: number): number | null {
  if (raw === null || !/^\d{1,3}$/.test(raw)) return null;
  const value = Number(raw);
  return value <= total ? value : null;
}

/** Perfil de reto recibido por URL: solo si existe en el cuestionario. */
export function parseChallengeProfile(raw: string | null, quiz: PersonalityQuiz): string | null {
  if (raw === null || !isValidQuizId(raw)) return null;
  return quiz.profiles.some((p) => p.id === raw) ? raw : null;
}

export function parseLang(value: unknown): Lang | null {
  return value === 'es' || value === 'en' ? value : null;
}
