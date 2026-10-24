import { describe, expect, it, vi } from 'vitest';
import { prefsStore } from '../lib/storage';
import { en } from './en';
import { es } from './es';
import { detectLang, translate } from './translate';

const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort();

describe('diccionarios', () => {
  it('es y en tienen exactamente las mismas claves', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(es).sort());
  });

  it('no hay textos vacíos y los marcadores {variable} coinciden', () => {
    for (const key of Object.keys(es) as (keyof typeof es)[]) {
      expect(es[key].trim(), key).not.toBe('');
      expect(en[key].trim(), key).not.toBe('');
      expect(placeholders(en[key]), key).toEqual(placeholders(es[key]));
    }
  });
});

describe('translate', () => {
  it('interpola variables', () => {
    expect(translate('es', 'quiz.progress', { current: 2, total: 8 })).toBe('Pregunta 2 de 8');
    expect(translate('en', 'quiz.progress', { current: 2, total: 8 })).toBe('Question 2 of 8');
  });

  it('deja intacto el marcador si falta la variable', () => {
    expect(translate('es', 'quiz.progress', { current: 2 })).toBe('Pregunta 2 de {total}');
  });
});

describe('detectLang', () => {
  it('usa español por defecto', () => {
    expect(detectLang()).toBe('es');
  });

  it('usa inglés si el navegador está en inglés', () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('en-US');
    expect(detectLang()).toBe('en');
  });

  it('usa español para otros idiomas', () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('fr-FR');
    expect(detectLang()).toBe('es');
  });

  it('la preferencia guardada gana al idioma del navegador', () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('en-US');
    prefsStore.save({ lang: 'es' });
    expect(detectLang()).toBe('es');
  });
});
