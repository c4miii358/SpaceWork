import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import { QUIZZES } from '../data/quizzes';
import { useI18n } from '../i18n';
import { usePageMeta } from '../hooks/usePageMeta';
import { QuizCard } from '../components/QuizCard';
import { dailyPick } from '../lib/daily';
import { pick } from '../lib/text';

export default function Home() {
  const { t, lang } = useI18n();
  usePageMeta(t('site.title'), t('site.description'));

  const daily = dailyPick(QUIZZES);
  const featured = QUIZZES.filter((q) => q.featured).slice(0, 3);
  const featuredList = featured.length > 0 ? featured : QUIZZES.slice(0, 3);

  return (
    <>
      <section className="hero container">
        <div className="hero__copy">
          <h1 className="hero__title">
            {t('home.title.a')} {t('home.title.b')}
          </h1>
          <p className="hero__subtitle">{t('home.subtitle')}</p>
          <Link className="btn btn--primary btn--lg" to="/quizzes">
            {t('home.cta.browse')}
          </Link>
        </div>

        {daily && (
          <article className="daily" data-accent={daily.accent} aria-labelledby="daily-title">
            <div className="daily__main">
              <p className="daily__kicker">{t('home.daily.kicker')}</p>
              <div className="daily__emoji" aria-hidden="true">
                {daily.emoji}
              </div>
              <h2 id="daily-title" className="daily__title">
                {pick(daily.title, lang)}
              </h2>
              <p className="daily__desc">{pick(daily.description, lang)}</p>
            </div>
            <div className="daily__stub">
              <ul className="chips">
                <li className="chip chip--kind">{t(`type.${daily.kind}`)}</li>
                <li className="chip">{t('card.questions', { n: daily.questions.length })}</li>
                <li className="chip">{t('card.minutes', { n: daily.minutes })}</li>
                {!daily.languages.includes(lang) && <li className="chip chip--warn">{t('card.spanishOnly')}</li>}
              </ul>
              <Link className="btn btn--primary" to={`/quiz/${daily.id}`}>
                {t('home.daily.cta')}
              </Link>
              <p className="daily__note">{t('home.daily.note')}</p>
            </div>
          </article>
        )}
      </section>

      <section className="section container" aria-labelledby="featured-title">
        <h2 id="featured-title" className="section__title">
          {t('home.featured.title')}
        </h2>
        <div className="grid">
          {featuredList.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
        <p className="section__more">
          <Link className="text-link" to="/quizzes">
            {t('home.all')}
          </Link>
        </p>
      </section>

      <section className="section container" aria-labelledby="cats-title">
        <h2 id="cats-title" className="section__title">
          {t('home.categories.title')}
        </h2>
        <ul className="categories">
          {CATEGORIES.map((category) => {
            const n = QUIZZES.filter((q) => q.category === category.id).length;
            return (
              <li key={category.id}>
                <Link className="category" data-accent={category.accent} to={`/quizzes?cat=${category.id}`}>
                  <span className="category__emoji" aria-hidden="true">
                    {category.emoji}
                  </span>
                  <span className="category__name">{t(`cat.${category.id}`)}</span>
                  <span className="category__count">{n === 1 ? t('catalog.count.one') : t('catalog.count', { n })}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="section container" aria-labelledby="how-title">
        <h2 id="how-title" className="section__title">
          {t('home.how.title')}
        </h2>
        <ol className="steps">
          <li>
            <h3>{t('home.how.1.title')}</h3>
            <p>{t('home.how.1.text')}</p>
          </li>
          <li>
            <h3>{t('home.how.2.title')}</h3>
            <p>{t('home.how.2.text')}</p>
          </li>
          <li>
            <h3>{t('home.how.3.title')}</h3>
            <p>{t('home.how.3.text')}</p>
          </li>
        </ol>
      </section>
    </>
  );
}
