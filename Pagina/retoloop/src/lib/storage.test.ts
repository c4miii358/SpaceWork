import { afterEach, describe, expect, it, vi } from 'vitest';
import { logicaPatrones } from '../data/quizzes/logica-patrones';
import { oyenteMusical } from '../data/quizzes/oyente-musical';
import { clearAllData, prefsStore, progressStore, resultsStore } from './storage';

const KEY = (name: string) => `retoloop:v1:${name}`;

afterEach(() => clearAllData());

describe('prefsStore', () => {
  it('guarda y recupera el idioma', () => {
    prefsStore.save({ lang: 'en' });
    expect(prefsStore.load()).toEqual({ lang: 'en' });
  });

  it('ignora datos corruptos o con valores no válidos', () => {
    localStorage.setItem(KEY('prefs'), '{no es json');
    expect(prefsStore.load()).toBeNull();
    localStorage.setItem(KEY('prefs'), JSON.stringify({ lang: 'fr' }));
    expect(prefsStore.load()).toBeNull();
    localStorage.setItem(KEY('prefs'), '[1,2]');
    expect(prefsStore.load()).toBeNull();
  });
});

describe('progressStore', () => {
  const quiz = logicaPatrones;

  it('guarda y recupera el progreso', () => {
    progressStore.save(quiz.id, { answers: [2, 1, null, null, null, null], step: 2 });
    expect(progressStore.load(quiz.id, quiz)).toEqual({ answers: [2, 1, null, null, null, null], step: 2 });
  });

  it('descarta progreso que ya no encaja con el cuestionario', () => {
    const bad = [
      { answers: [1, 2], step: 0 },
      { answers: [9, 0, 0, 0, 0, 0], step: 0 },
      { answers: [0, 0, 0, 0, 0, 0], step: 6 },
      { answers: [0, 0, 0, 0, 0, 0], step: -1 },
      { answers: [0, 0, 0, 0, 0, 0], step: 1.5 },
      { answers: 'texto', step: 0 },
    ];
    for (const entry of bad) {
      localStorage.setItem(KEY('progress'), JSON.stringify({ [quiz.id]: entry }));
      expect(progressStore.load(quiz.id, quiz)).toBeNull();
    }
  });

  it('no falla con JSON corrupto', () => {
    localStorage.setItem(KEY('progress'), 'xxx');
    expect(progressStore.load(quiz.id, quiz)).toBeNull();
  });

  it('clear borra solo el cuestionario indicado', () => {
    progressStore.save(quiz.id, { answers: [0, null, null, null, null, null], step: 0 });
    progressStore.save(oyenteMusical.id, { answers: [0, null, null, null, null, null], step: 0 });
    progressStore.clear(quiz.id);
    expect(progressStore.load(quiz.id, quiz)).toBeNull();
    expect(progressStore.load(oyenteMusical.id, oyenteMusical)).not.toBeNull();
  });

  it('no guarda ids con formato inválido', () => {
    progressStore.save('../x', { answers: [], step: 0 });
    expect(localStorage.getItem(KEY('progress'))).toBeNull();
  });
});

describe('resultsStore', () => {
  it('conserva la mejor puntuación de trivia', () => {
    const trivia = (correct: number) => ({ kind: 'trivia' as const, correct, total: 6, percent: Math.round((correct / 6) * 100), outcomeIndex: 1 });
    resultsStore.save('logica-patrones', trivia(5));
    resultsStore.save('logica-patrones', trivia(3));
    const stored = resultsStore.get('logica-patrones');
    expect(stored?.best).toBe(5);
    expect(stored?.result).toMatchObject({ kind: 'trivia', correct: 3 });
  });

  it('guarda el último perfil de un cuestionario recreativo', () => {
    resultsStore.save('oyente-musical', { kind: 'personality', profileId: 'bailador', totals: { bailador: 6 } });
    expect(resultsStore.get('oyente-musical')?.result).toMatchObject({ kind: 'personality', profileId: 'bailador' });
  });

  it('descarta resultados manipulados', () => {
    const tampered = [
      { result: { kind: 'otro' } },
      { result: { kind: 'trivia', correct: 9, total: 6, percent: 100, outcomeIndex: 0 } },
      { result: { kind: 'trivia', correct: -1, total: 6, percent: 0, outcomeIndex: 0 } },
      { result: { kind: 'personality', profileId: '<b>x</b>', totals: {} } },
      { result: { kind: 'personality', profileId: 'ok', totals: { ok: 'mucho' } } },
      'texto',
    ];
    for (const entry of tampered) {
      localStorage.setItem(KEY('results'), JSON.stringify({ 'logica-patrones': entry }));
      expect(resultsStore.get('logica-patrones')).toBeNull();
    }
  });
});

describe('clearAllData', () => {
  it('borra preferencias, progreso y resultados', () => {
    prefsStore.save({ lang: 'en' });
    progressStore.save('logica-patrones', { answers: [0, null, null, null, null, null], step: 0 });
    resultsStore.save('oyente-musical', { kind: 'personality', profileId: 'bailador', totals: { bailador: 1 } });
    clearAllData();
    expect(prefsStore.load()).toBeNull();
    expect(progressStore.load('logica-patrones', logicaPatrones)).toBeNull();
    expect(resultsStore.get('oyente-musical')).toBeNull();
  });
});

describe('sin localStorage disponible', () => {
  it('sigue funcionando en memoria durante la sesión', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('cuota superada', 'QuotaExceededError');
    });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('bloqueado', 'SecurityError');
    });
    prefsStore.save({ lang: 'en' });
    expect(setItem).toHaveBeenCalled();
    expect(prefsStore.load()).toEqual({ lang: 'en' });
  });
});
