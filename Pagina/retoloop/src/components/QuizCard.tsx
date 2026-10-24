import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { resultsStore } from '../lib/storage';
import { pick } from '../lib/text';
import type { Quiz } from '../types/quiz';

export function QuizCard({ quiz }: { quiz: Quiz }) {
  const { t, lang } = useI18n();
  const done = resultsStore.get(quiz.id) !== null;
  const missingLang = !quiz.languages.includes(lang);

  return (
    <article className="quiz-card" data-accent={quiz.accent}>
      <div className="quiz-card__cover" aria-hidden="true">
        <span>{quiz.emoji}</span>
      </div>
      <h3 className="quiz-card__title">
        <Link className="quiz-card__link" to={`/quiz/${quiz.id}`}>
          {pick(quiz.title, lang)}
        </Link>
      </h3>
      <p className="quiz-card__desc">{pick(quiz.description, lang)}</p>
      <ul className="chips">
        <li className="chip chip--kind">{t(`type.${quiz.kind}`)}</li>
        <li className="chip">{t('card.questions', { n: quiz.questions.length })}</li>
        <li className="chip">{t('card.minutes', { n: quiz.minutes })}</li>
        {missingLang && <li className="chip chip--warn">{t('card.spanishOnly')}</li>}
        {done && <li className="chip chip--ok">{t('card.done')}</li>}
      </ul>
    </article>
  );
}
