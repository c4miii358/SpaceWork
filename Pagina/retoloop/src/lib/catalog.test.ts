import { describe, expect, it } from 'vitest';
import { QUIZZES } from '../data/quizzes';
import { EMPTY_FILTERS, filterQuizzes, fold } from './catalog';

describe('filterQuizzes', () => {
  it('sin filtros devuelve todo', () => {
    expect(filterQuizzes(QUIZZES, EMPTY_FILTERS, 'es')).toHaveLength(QUIZZES.length);
  });

  it('filtra por categoría y por tipo', () => {
    const music = filterQuizzes(QUIZZES, { ...EMPTY_FILTERS, category: 'music' }, 'es');
    expect(music.length).toBeGreaterThan(0);
    expect(music.every((q) => q.category === 'music')).toBe(true);

    const personality = filterQuizzes(QUIZZES, { ...EMPTY_FILTERS, kind: 'personality' }, 'es');
    expect(personality.every((q) => q.kind === 'personality')).toBe(true);
  });

  it('busca sin distinguir mayúsculas ni acentos', () => {
    const found = filterQuizzes(QUIZZES, { ...EMPTY_FILTERS, query: '  MUSICA ' }, 'es');
    expect(found.map((q) => q.id)).toContain('oyente-musical');
  });

  it('busca en el idioma activo', () => {
    const query = { ...EMPTY_FILTERS, query: 'listener' };
    expect(filterQuizzes(QUIZZES, query, 'en').map((q) => q.id)).toContain('oyente-musical');
    expect(filterQuizzes(QUIZZES, query, 'es')).toHaveLength(0);
  });

  it('combina filtros y puede devolver vacío', () => {
    expect(filterQuizzes(QUIZZES, { category: 'logic', kind: 'personality', query: '' }, 'es')).toHaveLength(0);
    expect(filterQuizzes(QUIZZES, { ...EMPTY_FILTERS, query: 'zzzz' }, 'es')).toHaveLength(0);
  });
});

describe('fold', () => {
  it('quita acentos y pasa a minúsculas', () => {
    expect(fold('Música ÁÉÍÓÚ ñ')).toBe('musica aeiou n');
  });
});
