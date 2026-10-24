import { Link, useParams, useSearchParams } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { QuestionView } from '../components/QuestionView';
import { QuizIntro } from '../components/QuizIntro';
import { ResultView } from '../components/ResultView';
import { getQuizById } from '../data/quizzes';
import { useQuizSession } from '../hooks/useQuizSession';
import { usePageMeta } from '../hooks/usePageMeta';
import { useI18n } from '../i18n';
import { pick } from '../lib/text';
import { isValidQuizId, parseChallengeProfile, parseChallengeScore } from '../lib/validation';
import type { Quiz } from '../types/quiz';

export default function QuizPage() {
  const { quizId } = useParams();
  const [params] = useSearchParams();
  const { t, lang } = useI18n();

  // El id viene de la URL: se valida el formato y después se busca en el catálogo cerrado.
  const quiz = isValidQuizId(quizId) ? getQuizById(quizId) : undefined;

  usePageMeta(
    quiz ? `${pick(quiz.title, lang)} · RetoLoop` : `${t('error.quizMissing.title')} · RetoLoop`,
    quiz ? pick(quiz.description, lang) : t('error.quizMissing.text'),
  );

  if (!quiz) {
    return (
      <div className="container page">
        <EmptyState emoji="🧭" level={1} title={t('error.quizMissing.title')} text={t('error.quizMissing.text')}>
          <Link className="btn btn--primary" to="/quizzes">
            {t('error.catalog')}
          </Link>
        </EmptyState>
      </div>
    );
  }

  // `key` reinicia el estado al pasar de un cuestionario a otro.
  return <QuizRunner key={quiz.id} quiz={quiz} params={params} />;
}

function QuizRunner({ quiz, params }: { quiz: Quiz; params: URLSearchParams }) {
  const session = useQuizSession(quiz);

  // Parámetros de reto: solo se aceptan si son coherentes con este cuestionario.
  const challengeScore = quiz.kind === 'trivia' ? parseChallengeScore(params.get('c'), quiz.questions.length) : null;
  const challengeProfileId = quiz.kind === 'personality' ? parseChallengeProfile(params.get('r'), quiz) : null;

  if (session.phase === 'intro') {
    return (
      <QuizIntro
        quiz={quiz}
        hasSaved={session.hasSaved}
        challengeScore={challengeScore}
        challengeProfileId={challengeProfileId}
        onStart={session.start}
      />
    );
  }

  if (session.phase === 'done' && session.result) {
    return (
      <ResultView
        quiz={quiz}
        result={session.result}
        challengeScore={challengeScore}
        challengeProfileId={challengeProfileId}
        onRetry={() => session.start(false)}
      />
    );
  }

  return (
    <div className="container page page--narrow" data-accent={quiz.accent}>
      <QuestionView
        quiz={quiz}
        step={session.step}
        answers={session.answers}
        locked={session.locked}
        needsAnswer={session.needsAnswer}
        onSelect={session.select}
        onNext={session.next}
        onPrev={session.prev}
      />
    </div>
  );
}
