import type {
  Answers,
  PersonalityQuiz,
  Quiz,
  QuizResult,
  TriviaOutcome,
  TriviaQuiz,
} from '../types/quiz';

type TriviaResult = Extract<QuizResult, { kind: 'trivia' }>;
type PersonalityResult = Extract<QuizResult, { kind: 'personality' }>;

/**
 * Índice del resultado con mayor `minPercent` que no supere el porcentaje obtenido.
 * Si el porcentaje queda por debajo de todos, devuelve el de menor `minPercent`.
 */
export function outcomeIndexFor(outcomes: readonly TriviaOutcome[], percent: number): number {
  let best = -1;
  let lowest = 0;
  outcomes.forEach((outcome, i) => {
    if (outcome.minPercent < outcomes[lowest].minPercent) lowest = i;
    if (percent >= outcome.minPercent && (best === -1 || outcome.minPercent > outcomes[best].minPercent)) best = i;
  });
  return best === -1 ? lowest : best;
}

export function scoreTrivia(quiz: TriviaQuiz, answers: Answers): TriviaResult {
  const total = quiz.questions.length;
  const correct = quiz.questions.reduce((n, q, i) => n + (answers[i] === q.correct ? 1 : 0), 0);
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { kind: 'trivia', correct, total, percent, outcomeIndex: outcomeIndexFor(quiz.outcomes, percent) };
}

/** Suma puntos por perfil; en caso de empate gana el primero de `quiz.profiles`. */
export function scorePersonality(quiz: PersonalityQuiz, answers: Answers): PersonalityResult {
  const totals: Record<string, number> = {};
  for (const profile of quiz.profiles) totals[profile.id] = 0;

  quiz.questions.forEach((question, i) => {
    const chosen = answers[i];
    if (chosen === null || chosen === undefined) return;
    const option = question.options[chosen];
    if (!option) return;
    for (const [profileId, points] of Object.entries(option.points)) {
      if (Object.prototype.hasOwnProperty.call(totals, profileId)) totals[profileId] += points;
    }
  });

  let winner = quiz.profiles[0].id;
  for (const profile of quiz.profiles) {
    if (totals[profile.id] > totals[winner]) winner = profile.id;
  }
  return { kind: 'personality', profileId: winner, totals };
}

export function computeResult(quiz: Quiz, answers: Answers): QuizResult {
  return quiz.kind === 'trivia' ? scoreTrivia(quiz, answers) : scorePersonality(quiz, answers);
}

export function blankAnswers(quiz: Quiz): Answers {
  return quiz.questions.map(() => null);
}

/** Las respuestas son válidas si hay una por pregunta y cada índice existe (o es null). */
export function areAnswersValid(quiz: Quiz, answers: unknown): answers is Answers {
  if (!Array.isArray(answers) || answers.length !== quiz.questions.length) return false;
  return answers.every((a, i) => {
    if (a === null) return true;
    return typeof a === 'number' && Number.isInteger(a) && a >= 0 && a < quiz.questions[i].options.length;
  });
}
