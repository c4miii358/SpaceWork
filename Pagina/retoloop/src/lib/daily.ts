/** Número de día calendario (según la fecha local) contado desde 1970. */
export function dayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

/** Índice estable para un día: el mismo día da siempre el mismo reto y los días consecutivos rotan. */
export function dailyIndex(date: Date, length: number): number {
  if (length <= 0) return -1;
  return ((dayNumber(date) % length) + length) % length;
}

export function dailyPick<T>(items: readonly T[], date: Date = new Date()): T | null {
  const index = dailyIndex(date, items.length);
  return index < 0 ? null : items[index];
}
