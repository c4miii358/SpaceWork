import { describe, expect, it } from 'vitest';
import { logicaPatrones } from '../data/quizzes/logica-patrones';
import { oyenteMusical } from '../data/quizzes/oyente-musical';
import { buildCardModel } from './cardModel';
import { wrapLines } from './resultCard';
import { scorePersonality, scoreTrivia } from './scoring';

const EXPECTED_KEYS = ['accent', 'big', 'caption', 'emoji', 'footnote', 'headline', 'invite', 'kicker', 'percent', 'quizTitle'];

describe('buildCardModel', () => {
  it('describe un resultado de trivia', () => {
    const result = scoreTrivia(logicaPatrones, logicaPatrones.questions.map((q) => q.correct));
    const model = buildCardModel(logicaPatrones, result, 'es');
    expect(model).toMatchObject({ big: '6/6', percent: 100, headline: 'Puntuación perfecta', quizTitle: 'Lógica y patrones', footnote: '' });
  });

  it('describe un resultado recreativo e incluye el aviso de que no es científico', () => {
    const result = scorePersonality(oyenteMusical, oyenteMusical.questions.map(() => 0));
    const model = buildCardModel(oyenteMusical, result, 'es');
    expect(model.big).toBe('');
    expect(model.percent).toBeNull();
    expect(model.footnote).toBe('Resultado recreativo, no científico');
  });

  it('respeta el idioma', () => {
    const result = scoreTrivia(logicaPatrones, logicaPatrones.questions.map((q) => q.correct));
    expect(buildCardModel(logicaPatrones, result, 'en')).toMatchObject({ headline: 'Perfect score', quizTitle: 'Logic and patterns' });
  });

  it('solo contiene los campos previstos: nada de datos personales', () => {
    const trivia = scoreTrivia(logicaPatrones, []);
    const personality = scorePersonality(oyenteMusical, []);
    expect(Object.keys(buildCardModel(logicaPatrones, trivia, 'es')).sort()).toEqual(EXPECTED_KEYS);
    expect(Object.keys(buildCardModel(oyenteMusical, personality, 'es')).sort()).toEqual(EXPECTED_KEYS);
  });

  it('rechaza un resultado que no corresponde al cuestionario', () => {
    const personality = scorePersonality(oyenteMusical, []);
    expect(() => buildCardModel(logicaPatrones, personality, 'es')).toThrow();
  });
});

describe('wrapLines', () => {
  const measure = (text: string) => text.length * 10;

  it('parte el texto en líneas que caben', () => {
    expect(wrapLines(measure, 'uno dos tres cuatro', 100)).toEqual(['uno dos', 'tres', 'cuatro']);
  });

  it('no pierde palabras más largas que el ancho', () => {
    expect(wrapLines(measure, 'supercalifragilistico y ya', 50)).toEqual(['supercalifragilistico', 'y ya']);
  });

  it('recorta con puntos suspensivos al superar el máximo de líneas', () => {
    expect(wrapLines(measure, 'uno dos tres cuatro', 100, 2)).toEqual(['uno dos', 'tres…']);
  });

  it('maneja texto vacío', () => {
    expect(wrapLines(measure, '   ', 100)).toEqual([]);
  });
});
