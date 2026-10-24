import { useCallback, useState } from 'react';
import type { Answers, Quiz, QuizResult } from '../types/quiz';
import { blankAnswers, computeResult } from '../lib/scoring';
import { progressStore, resultsStore } from '../lib/storage';

export type Phase = 'intro' | 'playing' | 'done';

/**
 * Estado de una partida: respuestas, pregunta actual y resultado.
 * El progreso se guarda en cada cambio para poder retomarlo tras recargar.
 */
export function useQuizSession(quiz: Quiz) {
  const [saved] = useState(() => progressStore.load(quiz.id, quiz));
  const hasSaved = saved !== null && saved.answers.some((a) => a !== null);

  const [phase, setPhase] = useState<Phase>('intro');
  const [answers, setAnswers] = useState<Answers>(() => saved?.answers ?? blankAnswers(quiz));
  const [step, setStep] = useState<number>(() => saved?.step ?? 0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [needsAnswer, setNeedsAnswer] = useState(false);

  const total = quiz.questions.length;
  // En trivia, la respuesta queda fijada al elegirla para mostrar si fue correcta.
  const locked = quiz.kind === 'trivia' && answers[step] !== null;

  const start = useCallback(
    (resume: boolean) => {
      if (!(resume && hasSaved)) {
        progressStore.clear(quiz.id);
        setAnswers(blankAnswers(quiz));
        setStep(0);
      }
      setNeedsAnswer(false);
      setResult(null);
      setPhase('playing');
    },
    [quiz, hasSaved],
  );

  const select = useCallback(
    (index: number) => {
      if (locked) return;
      const next = answers.slice();
      next[step] = index;
      setAnswers(next);
      setNeedsAnswer(false);
      progressStore.save(quiz.id, { answers: next, step });
    },
    [locked, answers, step, quiz.id],
  );

  const next = useCallback(() => {
    if (answers[step] === null) {
      setNeedsAnswer(true);
      return;
    }
    if (step < total - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      setNeedsAnswer(false);
      progressStore.save(quiz.id, { answers, step: nextStep });
      return;
    }
    const final = computeResult(quiz, answers);
    resultsStore.save(quiz.id, final);
    progressStore.clear(quiz.id);
    setResult(final);
    setPhase('done');
  }, [answers, step, total, quiz]);

  const prev = useCallback(() => {
    if (step === 0) return;
    const previous = step - 1;
    setStep(previous);
    setNeedsAnswer(false);
    progressStore.save(quiz.id, { answers, step: previous });
  }, [answers, step, quiz.id]);

  return { phase, answers, step, result, needsAnswer, locked, hasSaved, start, select, next, prev };
}
