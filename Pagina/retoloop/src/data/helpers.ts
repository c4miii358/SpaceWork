import type { L10n, TriviaOutcome } from '../types/quiz';

/** Atajo para escribir textos localizados: L('hola', 'hello'). */
export const L = (es: string, en?: string): L10n => (en === undefined ? { es } : { es, en });

/** Texto que es igual en todos los idiomas (números, nombres propios). */
export const N = (text: string): L10n => ({ es: text, en: text });

/** Resultados de trivia compartidos por todos los cuestionarios de aciertos. */
export const STANDARD_OUTCOMES: TriviaOutcome[] = [
  {
    minPercent: 0,
    title: L('Calentando motores', 'Warming up'),
    description: L(
      'Todavía hay margen para crecer. Repasa las explicaciones y vuelve a intentarlo.',
      'There is room to grow. Review the explanations and try again.',
    ),
  },
  {
    minPercent: 50,
    title: L('Buen nivel', 'Solid level'),
    description: L(
      'Acertaste más de la mitad. Un repaso rápido y subes de categoría.',
      'You got more than half right. A quick review and you move up.',
    ),
  },
  {
    minPercent: 80,
    title: L('Casi imbatible', 'Almost unbeatable'),
    description: L(
      'Dominas el tema. Solo un descuido te separa de la puntuación perfecta.',
      'You know your stuff. One slip keeps you from a perfect score.',
    ),
  },
  {
    minPercent: 100,
    title: L('Puntuación perfecta', 'Perfect score'),
    description: L(
      'No fallaste ninguna. Reta a alguien a igualarte.',
      'You did not miss a single one. Challenge someone to match you.',
    ),
  },
];
