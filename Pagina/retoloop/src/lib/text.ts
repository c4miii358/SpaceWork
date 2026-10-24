import type { L10n, Lang } from '../types/quiz';

/** Devuelve el texto en el idioma pedido, o el español si aún no existe traducción. */
export function pick(text: L10n, lang: Lang): string {
  return lang === 'en' && text.en !== undefined ? text.en : text.es;
}
