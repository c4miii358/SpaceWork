import { useSearchParams } from 'react-router-dom';
import { CATEGORIES, isCategoryId } from '../data/categories';
import { QUIZZES } from '../data/quizzes';
import { EmptyState } from '../components/EmptyState';
import { QuizCard } from '../components/QuizCard';
import { usePageMeta } from '../hooks/usePageMeta';
import { useI18n } from '../i18n';
import { EMPTY_FILTERS, filterQuizzes, type Filters } from '../lib/catalog';

const MAX_QUERY = 60;

/** Los filtros viven en la URL, así que se validan antes de usarlos. */
function readFilters(params: URLSearchParams): Filters {
  const category = params.get('cat');
  const kind = params.get('type');
  return {
    category: isCategoryId(category) ? category : 'all',
    kind: kind === 'trivia' || kind === 'personality' ? kind : 'all',
    query: (params.get('q') ?? '').slice(0, MAX_QUERY),
  };
}

export default function Catalog() {
  const { t, lang } = useI18n();
  const [params, setParams] = useSearchParams();
  usePageMeta(`${t('catalog.title')} · RetoLoop`, t('catalog.subtitle'));

  const filters = readFilters(params);
  const results = filterQuizzes(QUIZZES, filters, lang);
  const hasFilters = filters.category !== 'all' || filters.kind !== 'all' || filters.query !== '';

  function update(patch: Partial<Filters>) {
    const next = { ...filters, ...patch };
    const search = new URLSearchParams();
    if (next.category !== 'all') search.set('cat', next.category);
    if (next.kind !== 'all') search.set('type', next.kind);
    if (next.query !== '') search.set('q', next.query);
    setParams(search, { replace: true });
  }

  return (
    <div className="container page">
      <h1 className="page__title">{t('catalog.title')}</h1>
      <p className="page__lead">{t('catalog.subtitle')}</p>

      <form className="filters" role="search" onSubmit={(event) => event.preventDefault()}>
        <div className="field">
          <label htmlFor="catalog-search">{t('catalog.search')}</label>
          <input
            id="catalog-search"
            type="search"
            value={filters.query}
            maxLength={MAX_QUERY}
            placeholder={t('catalog.searchPlaceholder')}
            onChange={(event) => update({ query: event.target.value })}
          />
        </div>

        <div className="field">
          <label htmlFor="catalog-type">{t('catalog.type')}</label>
          <select id="catalog-type" value={filters.kind} onChange={(event) => update({ kind: event.target.value as Filters['kind'] })}>
            <option value="all">{t('catalog.allTypes')}</option>
            <option value="trivia">{t('type.trivia')}</option>
            <option value="personality">{t('type.personality')}</option>
          </select>
        </div>

        <fieldset className="field field--chips">
          <legend>{t('catalog.category')}</legend>
          <div className="filter-chips">
            <button type="button" className="filter-chip" aria-pressed={filters.category === 'all'} onClick={() => update({ category: 'all' })}>
              {t('catalog.allCategories')}
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                className="filter-chip"
                data-accent={category.accent}
                aria-pressed={filters.category === category.id}
                onClick={() => update({ category: category.id })}
              >
                <span aria-hidden="true">{category.emoji}</span> {t(`cat.${category.id}`)}
              </button>
            ))}
          </div>
        </fieldset>
      </form>

      <p className="catalog__count" role="status">
        {results.length === 1 ? t('catalog.count.one') : t('catalog.count', { n: results.length })}
      </p>

      {results.length > 0 ? (
        <div className="grid">
          {results.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      ) : (
        <EmptyState emoji="🔎" title={t('catalog.empty.title')} text={t('catalog.empty.text')}>
          {hasFilters && (
            <button type="button" className="btn btn--primary" onClick={() => update(EMPTY_FILTERS)}>
              {t('catalog.reset')}
            </button>
          )}
        </EmptyState>
      )}
    </div>
  );
}
