import type { Accent, CategoryId } from '../types/quiz';

export interface Category {
  id: CategoryId;
  emoji: string;
  accent: Accent;
}

export const CATEGORIES: readonly Category[] = [
  { id: 'culture', emoji: '🎓', accent: 'violet' },
  { id: 'logic', emoji: '🧩', accent: 'lime' },
  { id: 'music', emoji: '🎧', accent: 'pink' },
  { id: 'science', emoji: '🔬', accent: 'cyan' },
  { id: 'fun', emoji: '🎉', accent: 'amber' },
];

export function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === 'string' && CATEGORIES.some((c) => c.id === value);
}
