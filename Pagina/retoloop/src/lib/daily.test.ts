import { describe, expect, it } from 'vitest';
import { dailyIndex, dailyPick, dayNumber } from './daily';

describe('reto del día', () => {
  const items = ['a', 'b', 'c', 'd', 'e', 'f'];

  it('devuelve el mismo reto durante todo el día', () => {
    const morning = new Date(2026, 9, 22, 0, 5);
    const night = new Date(2026, 9, 22, 23, 55);
    expect(dailyPick(items, morning)).toBe(dailyPick(items, night));
  });

  it('rota con los días consecutivos y vuelve a empezar', () => {
    const start = new Date(2026, 9, 22);
    const seen = Array.from({ length: items.length }, (_, i) => dailyPick(items, new Date(2026, 9, 22 + i)));
    expect(new Set(seen).size).toBe(items.length);
    expect(dailyPick(items, new Date(2026, 9, 22 + items.length))).toBe(dailyPick(items, start));
  });

  it('cambia a medianoche según la fecha local', () => {
    expect(dayNumber(new Date(2026, 9, 23))).toBe(dayNumber(new Date(2026, 9, 22)) + 1);
  });

  it('maneja listas vacías y fechas anteriores a 1970', () => {
    expect(dailyPick([], new Date())).toBeNull();
    expect(dailyIndex(new Date(1960, 0, 1), 5)).toBeGreaterThanOrEqual(0);
    expect(dailyIndex(new Date(1960, 0, 1), 5)).toBeLessThan(5);
  });
});
