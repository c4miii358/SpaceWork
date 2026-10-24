import { useEffect, useId, useRef } from 'react';
import { useI18n } from '../i18n';
import { pick } from '../lib/text';
import type { Answers, Quiz } from '../types/quiz';
import { ProgressBar } from './ProgressBar';

interface Props {
  quiz: Quiz;
  step: number;
  answers: Answers;
  locked: boolean;
  needsAnswer: boolean;
  onSelect: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function QuestionView({ quiz, step, answers, locked, needsAnswer, onSelect, onNext, onPrev }: Props) {
  const { t, lang } = useI18n();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingId = useId();
  const errorId = useId();

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const total = quiz.questions.length;
  const selected = answers[step];
  const answeredCount = answers.filter((a) => a !== null).length;
  const isLast = step === total - 1;

  const question = quiz.questions[step];
  const optionTexts =
    quiz.kind === 'trivia'
      ? quiz.questions[step].options.map((o) => pick(o, lang))
      : quiz.questions[step].options.map((o) => pick(o.text, lang));
  const correctIndex = quiz.kind === 'trivia' ? quiz.questions[step].correct : -1;
  const explanation = quiz.kind === 'trivia' ? quiz.questions[step].explanation : undefined;
  const revealed = quiz.kind === 'trivia' && selected !== null;
  const showError = needsAnswer && selected === null;

  return (
    <section className="question" aria-labelledby={headingId}>
      <ProgressBar value={answeredCount} max={total} label={t('quiz.progressLabel')} />
      <p className="question__count" aria-live="polite">
        {t('quiz.progress', { current: step + 1, total })}
      </p>

      <h1 id={headingId} ref={headingRef} tabIndex={-1} className="question__prompt">
        {pick(question.prompt, lang)}
      </h1>

      <div
        className="options"
        role="radiogroup"
        aria-labelledby={headingId}
        aria-describedby={showError ? errorId : undefined}
      >
        {optionTexts.map((text, i) => {
          const isSelected = selected === i;
          const isCorrect = revealed && i === correctIndex;
          const isWrong = revealed && isSelected && i !== correctIndex;
          const className = ['option', isSelected && 'is-selected', isCorrect && 'is-correct', isWrong && 'is-wrong', locked && 'is-locked']
            .filter(Boolean)
            .join(' ');
          return (
            <label key={`${question.id}-${i}`} className={className}>
              <input
                type="radio"
                name={`q-${question.id}`}
                value={i}
                checked={isSelected}
                onChange={() => onSelect(i)}
              />
              <span className="option__key" aria-hidden="true">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="option__text">{text}</span>
              <span className="option__mark" aria-hidden="true">
                {isCorrect ? '✓' : isWrong ? '✗' : ''}
              </span>
            </label>
          );
        })}
      </div>

      <div className="feedback" role="status">
        {revealed && (
          <>
            <p className={selected === correctIndex ? 'feedback__verdict is-correct' : 'feedback__verdict is-wrong'}>
              {selected === correctIndex ? t('quiz.correct') : t('quiz.wrong', { answer: optionTexts[correctIndex] })}
            </p>
            {explanation && <p className="feedback__explanation">{pick(explanation, lang)}</p>}
          </>
        )}
      </div>

      {showError && (
        <p id={errorId} className="field-error" role="alert">
          {t('quiz.pickOne')}
        </p>
      )}

      <div className="question__nav">
        {step > 0 ? (
          <button type="button" className="btn btn--ghost" onClick={onPrev}>
            {t('quiz.prev')}
          </button>
        ) : (
          <span />
        )}
        <button type="button" className="btn btn--primary" onClick={onNext}>
          {isLast ? t('quiz.finish') : t('quiz.next')}
        </button>
      </div>
    </section>
  );
}
