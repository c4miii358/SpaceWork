import { describe, expect, it } from 'vitest';
import { getQuizById } from '../data/quizzes';
import { oyenteMusical } from '../data/quizzes/oyente-musical';
import { isValidQuizId, parseChallengeProfile, parseChallengeScore, parseLang } from './validation';

describe('isValidQuizId', () => {
  it.each(['logica-patrones', 'a', 'quiz-2', 'cultura-general-expres'])('acepta %s', (id) => {
    expect(isValidQuizId(id)).toBe(true);
  });

  it.each(['', 'Mayusculas', '../etc/passwd', 'con espacio', 'guion-', '-guion', 'doble--guion', '<script>', 'a'.repeat(65), 'ñandú'])(
    'rechaza %j',
    (id) => {
      expect(isValidQuizId(id)).toBe(false);
    },
  );

  it('rechaza valores que no son texto', () => {
    expect(isValidQuizId(undefined)).toBe(false);
    expect(isValidQuizId(42)).toBe(false);
    expect(isValidQuizId(null)).toBe(false);
  });
});

describe('getQuizById', () => {
  it('encuentra un cuestionario existente', () => {
    expect(getQuizById('logica-patrones')?.id).toBe('logica-patrones');
  });

  it('no resuelve nombres heredados de Object.prototype', () => {
    for (const id of ['constructor', 'toString', '__proto__', 'hasOwnProperty']) {
      expect(getQuizById(id)).toBeUndefined();
    }
  });
});

describe('parseChallengeScore', () => {
  it.each([
    ['0', 8, 0],
    ['5', 8, 5],
    ['8', 8, 8],
  ])('acepta %s de %i', (raw, total, expected) => {
    expect(parseChallengeScore(raw, total)).toBe(expected);
  });

  it.each([null, '', '-1', '9', '999', '1e2', '5.5', 'abc', ' 5', '5 ', '0x5', '1000'])('rechaza %j', (raw) => {
    expect(parseChallengeScore(raw, 8)).toBeNull();
  });
});

describe('parseChallengeProfile', () => {
  it('acepta solo perfiles que existen en el cuestionario', () => {
    expect(parseChallengeProfile('bailador', oyenteMusical)).toBe('bailador');
    expect(parseChallengeProfile('inexistente', oyenteMusical)).toBeNull();
    expect(parseChallengeProfile('constructor', oyenteMusical)).toBeNull();
    expect(parseChallengeProfile('<img src=x>', oyenteMusical)).toBeNull();
    expect(parseChallengeProfile(null, oyenteMusical)).toBeNull();
  });
});

describe('parseLang', () => {
  it('solo acepta idiomas soportados', () => {
    expect(parseLang('es')).toBe('es');
    expect(parseLang('en')).toBe('en');
    expect(parseLang('fr')).toBeNull();
    expect(parseLang(undefined)).toBeNull();
  });
});
