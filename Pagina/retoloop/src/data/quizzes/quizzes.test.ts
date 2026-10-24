import { describe, expect, it } from 'vitest';
import type { L10n, Quiz } from '../../types/quiz';
import { isValidQuizId } from '../../lib/validation';
import { CATEGORIES, isCategoryId } from '../categories';
import { QUIZZES } from './index';

function collectTexts(quiz: Quiz): L10n[] {
  const texts: L10n[] = [quiz.title, quiz.description];
  if (quiz.kind === 'trivia') {
    for (const q of quiz.questions) {
      texts.push(q.prompt, ...q.options);
      if (q.explanation) texts.push(q.explanation);
    }
    for (const o of quiz.outcomes) texts.push(o.title, o.description);
  } else {
    for (const q of quiz.questions) texts.push(q.prompt, ...q.options.map((o) => o.text));
    for (const p of quiz.profiles) texts.push(p.title, p.description);
  }
  return texts;
}

describe('catálogo de cuestionarios', () => {
  it('tiene ids únicos y con formato válido', () => {
    const ids = QUIZZES.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(isValidQuizId(id)).toBe(true);
  });

  it('usa categorías conocidas y cubre todas', () => {
    for (const quiz of QUIZZES) expect(isCategoryId(quiz.category)).toBe(true);
    for (const category of CATEGORIES) {
      expect(QUIZZES.some((q) => q.category === category.id)).toBe(true);
    }
  });

  it('marca al menos un cuestionario como destacado', () => {
    expect(QUIZZES.some((q) => q.featured)).toBe(true);
  });

  describe.each(QUIZZES.map((q) => [q.id, q] as const))('%s', (_id, quiz) => {
    it('tiene metadatos completos', () => {
      expect(quiz.emoji).not.toBe('');
      expect(Number.isInteger(quiz.minutes) && quiz.minutes > 0).toBe(true);
      expect(quiz.languages).toContain('es');
      expect(quiz.questions.length).toBeGreaterThanOrEqual(3);
    });

    it('declara solo idiomas con traducción completa y no vacía', () => {
      for (const lang of quiz.languages) {
        for (const text of collectTexts(quiz)) {
          const value = lang === 'es' ? text.es : text.en;
          expect(value, `falta ${lang} en «${text.es}»`).toBeTruthy();
        }
      }
    });

    it('tiene ids de pregunta únicos y entre 2 y 6 opciones', () => {
      const ids = quiz.questions.map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const q of quiz.questions) {
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.options.length).toBeLessThanOrEqual(6);
      }
    });

    if (quiz.kind === 'trivia') {
      it('tiene una respuesta correcta válida y opciones distintas', () => {
        for (const q of quiz.questions) {
          expect(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length).toBe(true);
          const texts = q.options.map((o) => o.es);
          expect(new Set(texts).size).toBe(texts.length);
        }
      });

      it('tiene resultados que parten de 0 % y crecen', () => {
        const mins = quiz.outcomes.map((o) => o.minPercent);
        expect(mins[0]).toBe(0);
        expect(mins.every((m, i) => m <= 100 && (i === 0 || m > mins[i - 1]))).toBe(true);
      });
    } else {
      it('solo puntúa perfiles que existen y todos son alcanzables', () => {
        const profileIds = quiz.profiles.map((p) => p.id);
        expect(new Set(profileIds).size).toBe(profileIds.length);
        for (const id of profileIds) expect(isValidQuizId(id)).toBe(true);
        expect(profileIds.length).toBeGreaterThanOrEqual(2);
        for (const q of quiz.questions) {
          for (const option of q.options) {
            for (const key of Object.keys(option.points)) expect(profileIds).toContain(key);
          }
        }
        for (const id of profileIds) {
          const reachable = quiz.questions.some((q) => q.options.some((o) => (o.points[id] ?? 0) > 0));
          expect(reachable, `el perfil ${id} no se puede obtener`).toBe(true);
        }
      });
    }
  });
});
