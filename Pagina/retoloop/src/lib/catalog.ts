import type { CategoryId, Lang, Quiz, QuizKind } from '../types/quiz';
import { pick } from './text';

export interface Filters {
  category: CategoryId | 'all';
  kind: QuizKind | 'all';
  query: string;
}

export const EMPTY_FILTERS: Filters = { category: 'all', kind: 'all', query: '' };

/** Minúsculas y sin acentos, para que «musica» encuentre «música». */
export const fold = (text: string): string =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function filterQuizzes(quizzes: readonly Quiz[], filters: Filters, lang: Lang): Quiz[] {
  const query = fold(filters.query.trim());
  return quizzes.filter((quiz) => {
    if (filters.category !== 'all' && quiz.category !== filters.category) return false;
    if (filters.kind !== 'all' && quiz.kind !== filters.kind) return false;
    if (query === '') return true;
    const haystack = fold(`${pick(quiz.title, lang)} ${pick(quiz.description, lang)} ${quiz.title.es}`);
    return haystack.includes(query);
  });
}
