/** Enlace al cuestionario, válido en la raíz de un dominio y en subrutas (GitHub Pages). */
export function buildQuizUrl(quizId: string, params?: Record<string, string | number>): string {
  const base = `${window.location.origin}${window.location.pathname}`;
  const entries = params ? Object.entries(params).map(([k, v]): [string, string] => [k, String(v)]) : [];
  const query = entries.length > 0 ? `?${new URLSearchParams(entries).toString()}` : '';
  return `${base}#/quiz/${quizId}${query}`;
}

/** Copia al portapapeles; si la API moderna no está disponible, prueba el método clásico. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* continúa con el método clásico */
  }
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

export type ShareOutcome = 'shared' | 'cancelled' | 'unsupported' | 'failed';

export async function nativeShare(data: ShareData): Promise<ShareOutcome> {
  if (typeof navigator.share !== 'function') return 'unsupported';
  try {
    if (typeof navigator.canShare === 'function' && !navigator.canShare(data)) return 'unsupported';
    await navigator.share(data);
    return 'shared';
  } catch (error) {
    return error instanceof DOMException && error.name === 'AbortError' ? 'cancelled' : 'failed';
  }
}

export function canShareNatively(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

export function canShareFiles(): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.canShare !== 'function') return false;
  try {
    return navigator.canShare({ files: [new File([''], 'retoloop.png', { type: 'image/png' })] });
  } catch {
    return false;
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
