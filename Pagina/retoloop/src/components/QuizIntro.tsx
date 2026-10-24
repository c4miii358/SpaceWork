import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { resultsStore } from '../lib/storage';
import { pick } from '../lib/text';
import type { Quiz } from '../types/quiz';

interface Props {
  quiz: Quiz;
  hasSaved: boolean;
  challengeScore: number | null;
  challengeProfileId: string | null;
  onStart: (resume: boolean) => void;
}

export function QuizIntro({ quiz, hasSaved, challengeScore, challengeProfileId, onStart }: Props) {
  const { t, lang } = useI18n();
  const missingLang = !quiz.languages.includes(lang);
  const last = resultsStore.get(quiz.id);

  let challenge: string | null = null;
  if (quiz.kind === 'trivia' && challengeScore !== null) {
    challenge = t('quiz.challenge.score', { score: challengeScore, total: quiz.questions.length });
  } else if (quiz.kind === 'personality' && challengeProfileId !== null) {
    const profile = quiz.profiles.find((p) => p.id === challengeProfileId);
    if (profile) challenge = t('quiz.challenge.profile', { profile: pick(profile.title, lang) });
  }

  let lastText: string | null = null;
  if (last && quiz.kind === 'trivia' && last.result.kind === 'trivia') {
    lastText = t('quiz.last.trivia', { correct: last.result.correct, total: last.result.total, best: last.best ?? last.result.correct });
  } else if (last && quiz.kind === 'personality' && last.result.kind === 'personality') {
    const profileId = last.result.profileId;
    const profile = quiz.profiles.find((p) => p.id === profileId);
    if (profile) lastText = t('quiz.last.profile', { profile: pick(profile.title, lang) });
  }

  return (
    <section className="intro container page" data-accent={quiz.accent}>
      <Link className="back-link" to="/quizzes">
        {t('quiz.back')}
      </Link>
      <div className="intro__head">
        <div className="intro__emoji" aria-hidden="true">
          {quiz.emoji}
        </div>
        <div>
          <h1 className="intro__title">{pick(quiz.title, lang)}</h1>
          <p className="intro__desc">{pick(quiz.description, lang)}</p>
          <ul className="chips">
            <li className="chip chip--kind">{t(`type.${quiz.kind}`)}</li>
            <li className="chip">{t('card.questions', { n: quiz.questions.length })}</li>
            <li className="chip">{t('card.minutes', { n: quiz.minutes })}</li>
          </ul>
        </div>
      </div>

      {challenge && <p className="notice notice--challenge">{challenge}</p>}
      {missingLang && <p className="notice" role="note">{t('quiz.notTranslated')}</p>}
      {quiz.kind === 'personality' && <p className="notice" role="note">{t('quiz.disclaimer')}</p>}
      {lastText && <p className="intro__last">{lastText}</p>}

      <div className="intro__actions">
        {hasSaved ? (
          <>
            <button type="button" className="btn btn--primary" onClick={() => onStart(true)}>
              {t('quiz.resume')}
            </button>
            <button type="button" className="btn" onClick={() => onStart(false)}>
              {t('quiz.restart')}
            </button>
          </>
        ) : (
          <button type="button" className="btn btn--primary" onClick={() => onStart(false)}>
            {t('quiz.start')}
          </button>
        )}
      </div>
    </section>
  );
}
