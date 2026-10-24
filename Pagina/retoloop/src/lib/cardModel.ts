import type { Accent, Lang, Quiz, QuizResult } from '../types/quiz';
import { translate } from '../i18n/translate';
import { pick } from './text';

/**
 * Contenido de la tarjeta de resultado. Solo incluye datos del cuestionario y de la
 * puntuación: nunca nombres, identificadores de dispositivo ni información personal.
 */
export interface CardModel {
  accent: Accent;
  emoji: string;
  kicker: string;
  /** Texto grande (p. ej. «6/8»). Vacío en los cuestionarios de perfil. */
  big: string;
  /** Porcentaje de aciertos para dibujar el anillo, o null. */
  percent: number | null;
  headline: string;
  caption: string;
  quizTitle: string;
  footnote: string;
  invite: string;
}

export function buildCardModel(quiz: Quiz, result: QuizResult, lang: Lang): CardModel {
  const t = (key: Parameters<typeof translate>[1]) => translate(lang, key);

  if (quiz.kind === 'trivia' && result.kind === 'trivia') {
    const outcome = quiz.outcomes[result.outcomeIndex] ?? quiz.outcomes[0];
    return {
      accent: quiz.accent,
      emoji: quiz.emoji,
      kicker: t('card.kicker'),
      big: `${result.correct}/${result.total}`,
      percent: result.percent,
      headline: pick(outcome.title, lang),
      caption: pick(outcome.description, lang),
      quizTitle: pick(quiz.title, lang),
      footnote: '',
      invite: t('card.invite'),
    };
  }

  if (quiz.kind === 'personality' && result.kind === 'personality') {
    const profile = quiz.profiles.find((p) => p.id === result.profileId) ?? quiz.profiles[0];
    return {
      accent: quiz.accent,
      emoji: profile.emoji,
      kicker: t('card.kicker'),
      big: '',
      percent: null,
      headline: pick(profile.title, lang),
      caption: pick(profile.description, lang),
      quizTitle: pick(quiz.title, lang),
      footnote: t('card.recreational'),
      invite: t('card.invite'),
    };
  }

  throw new Error('El resultado no corresponde al tipo de cuestionario');
}
