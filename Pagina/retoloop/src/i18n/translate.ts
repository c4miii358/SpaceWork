import type { Lang } from '../types/quiz';
import { en } from './en';
import { es, type MessageKey } from './es';
import { prefsStore } from '../lib/storage';

export type { MessageKey };
export type Vars = Record<string, string | number>;

const dictionaries: Record<Lang, Record<MessageKey, string>> = { es, en };

/** Traduce una clave e interpola variables con la sintaxis {nombre}. */
export function translate(lang: Lang, key: MessageKey, vars?: Vars): string {
  const template = dictionaries[lang][key] ?? es[key];
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match,
  );
}

/** Idioma inicial: el guardado por la persona, o el del navegador si es inglés; si no, español. */
export function detectLang(): Lang {
  const saved = prefsStore.load();
  if (saved) return saved.lang;
  const browser = typeof navigator !== 'undefined' ? navigator.language : '';
  return browser.toLowerCase().startsWith('en') ? 'en' : 'es';
}
