import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { getQuizById } from '../data/quizzes';
import { pick } from '../lib/text';
import type { Lang, PersonalityQuiz, TriviaQuiz } from '../types/quiz';

export type User = ReturnType<typeof userEvent.setup>;

/** Abre la app en una ruta con hash, como lo haría un enlace compartido. */
export function openApp(hash = '') {
  window.history.replaceState(null, '', `/${hash}`);
  return render(<App />);
}

export function trivia(id: string): TriviaQuiz {
  const quiz = getQuizById(id);
  if (!quiz || quiz.kind !== 'trivia') throw new Error(`${id} no es de trivia`);
  return quiz;
}

export function personality(id: string): PersonalityQuiz {
  const quiz = getQuizById(id);
  if (!quiz || quiz.kind !== 'personality') throw new Error(`${id} no es recreativo`);
  return quiz;
}

export async function clickStart(user: User) {
  await user.click(await screen.findByRole('button', { name: 'Empezar' }));
}

const BUTTONS = {
  es: { next: 'Siguiente', finish: 'Ver resultado' },
  en: { next: 'Next', finish: 'See result' },
} as const;

/** Responde todas las preguntas de una trivia eligiendo la opción que indique `choose`. */
export async function answerTrivia(user: User, quiz: TriviaQuiz, choose: (questionIndex: number) => number, lang: Lang = 'es') {
  const last = quiz.questions.length - 1;
  for (let i = 0; i <= last; i++) {
    const option = quiz.questions[i].options[choose(i)];
    await user.click(await screen.findByRole('radio', { name: pick(option, lang) }));
    await user.click(screen.getByRole('button', { name: i === last ? BUTTONS[lang].finish : BUTTONS[lang].next }));
  }
}

/** Responde un cuestionario recreativo eligiendo siempre la opción que puntúa a `profileId`. */
export async function answerPersonality(user: User, quiz: PersonalityQuiz, profileId: string) {
  const last = quiz.questions.length - 1;
  for (let i = 0; i <= last; i++) {
    const option = quiz.questions[i].options.find((o) => (o.points[profileId] ?? 0) > 0);
    if (!option) throw new Error(`Sin opción para ${profileId}`);
    await user.click(await screen.findByRole('radio', { name: pick(option.text, 'es') }));
    await user.click(screen.getByRole('button', { name: i === last ? 'Ver resultado' : 'Siguiente' }));
  }
}

export const shareInput = () => screen.getByLabelText('Enlace para compartir') as HTMLInputElement;
