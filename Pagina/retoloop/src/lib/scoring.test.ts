import { describe, expect, it } from 'vitest';
import { QUIZZES } from '../data/quizzes';
import { logicaPatrones } from '../data/quizzes/logica-patrones';
import { oyenteMusical } from '../data/quizzes/oyente-musical';
import type { Answers, PersonalityQuiz } from '../types/quiz';
import { areAnswersValid, blankAnswers, computeResult, outcomeIndexFor, scorePersonality, scoreTrivia } from './scoring';

const allCorrect: Answers = logicaPatrones.questions.map((q) => q.correct);
const allWrong: Answers = logicaPatrones.questions.map((q) => (q.correct + 1) % q.options.length);

/** Respuestas que siempre eligen la opción que da puntos a `profileId`. */
const answersFor = (quiz: PersonalityQuiz, profileId: string): Answers =>
  quiz.questions.map((q) => q.options.findIndex((o) => (o.points[profileId] ?? 0) > 0));

describe('scoreTrivia', () => {
  it('da 100 % y el último resultado cuando todo es correcto', () => {
    const r = scoreTrivia(logicaPatrones, allCorrect);
    expect(r).toMatchObject({ correct: 6, total: 6, percent: 100, outcomeIndex: 3 });
  });

  it('da 0 % y el primer resultado cuando todo es incorrecto', () => {
    const r = scoreTrivia(logicaPatrones, allWrong);
    expect(r).toMatchObject({ correct: 0, percent: 0, outcomeIndex: 0 });
  });

  it('cuenta las preguntas sin responder como no acertadas', () => {
    expect(scoreTrivia(logicaPatrones, blankAnswers(logicaPatrones)).correct).toBe(0);
  });

  it('redondea el porcentaje', () => {
    const four = allCorrect.map((a, i) => (i < 4 ? a : (a! + 1) % 4));
    expect(scoreTrivia(logicaPatrones, four)).toMatchObject({ correct: 4, percent: 67, outcomeIndex: 1 });
  });
});

describe('outcomeIndexFor', () => {
  const outcomes = logicaPatrones.outcomes;
  it.each([
    [0, 0],
    [49, 0],
    [50, 1],
    [79, 1],
    [80, 2],
    [99, 2],
    [100, 3],
  ])('%i %% → resultado %i', (percent, expected) => {
    expect(outcomeIndexFor(outcomes, percent)).toBe(expected);
  });

  it('no depende del orden de la lista', () => {
    const shuffled = [outcomes[3], outcomes[0], outcomes[2], outcomes[1]];
    expect(shuffled[outcomeIndexFor(shuffled, 85)].minPercent).toBe(80);
  });

  it('si el porcentaje queda por debajo de todos, usa el de menor mínimo', () => {
    const fromTwenty = outcomes.map((o) => ({ ...o, minPercent: o.minPercent + 20 }));
    expect(fromTwenty[outcomeIndexFor(fromTwenty, 5)].minPercent).toBe(20);
  });
});

describe('scorePersonality', () => {
  it.each(oyenteMusical.profiles.map((p) => p.id))('el perfil %s se puede obtener', (id) => {
    const r = scorePersonality(oyenteMusical, answersFor(oyenteMusical, id));
    expect(r.profileId).toBe(id);
    expect(r.totals[id]).toBe(oyenteMusical.questions.length);
  });

  it('en caso de empate gana el primer perfil de la lista', () => {
    const half = oyenteMusical.questions.length / 2;
    const exp = answersFor(oyenteMusical, 'explorador');
    const calm = answersFor(oyenteMusical, 'calmado');
    const a = [...exp.slice(0, half), ...calm.slice(half)];
    const b = [...calm.slice(0, half), ...exp.slice(half)];
    expect(scorePersonality(oyenteMusical, a).profileId).toBe('explorador');
    expect(scorePersonality(oyenteMusical, b).profileId).toBe('explorador');
  });

  it('ignora respuestas nulas o fuera de rango', () => {
    const r = scorePersonality(oyenteMusical, [99, null, -1, null, 7, null]);
    expect(Object.values(r.totals).every((v) => v === 0)).toBe(true);
    expect(r.profileId).toBe(oyenteMusical.profiles[0].id);
  });

  it('la suma de puntos coincide con las preguntas respondidas', () => {
    const r = scorePersonality(oyenteMusical, [0, 0, 0, null, null, null]);
    expect(Object.values(r.totals).reduce((a, b) => a + b, 0)).toBe(3);
  });
});

describe('areAnswersValid', () => {
  it('acepta una respuesta por pregunta (o null)', () => {
    expect(areAnswersValid(logicaPatrones, allCorrect)).toBe(true);
    expect(areAnswersValid(logicaPatrones, blankAnswers(logicaPatrones))).toBe(true);
  });

  it.each([
    ['longitud incorrecta', [0, 1]],
    ['índice fuera de rango', [9, 0, 0, 0, 0, 0]],
    ['índice negativo', [-1, 0, 0, 0, 0, 0]],
    ['decimal', [0.5, 0, 0, 0, 0, 0]],
    ['texto', ['1', 0, 0, 0, 0, 0]],
    ['no es un arreglo', { 0: 1 }],
  ])('rechaza %s', (_name, value) => {
    expect(areAnswersValid(logicaPatrones, value)).toBe(false);
  });
});

describe('computeResult', () => {
  it('resuelve todos los cuestionarios del catálogo sin errores', () => {
    for (const quiz of QUIZZES) {
      const answers = quiz.questions.map(() => 0);
      expect(computeResult(quiz, answers).kind).toBe(quiz.kind);
    }
  });
});
