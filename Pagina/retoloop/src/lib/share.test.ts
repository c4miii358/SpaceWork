import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildQuizUrl, copyToClipboard, nativeShare } from './share';

function define(target: object, key: string, value: unknown) {
  Object.defineProperty(target, key, { value, configurable: true, writable: true });
}

afterEach(() => {
  Reflect.deleteProperty(navigator, 'clipboard');
  Reflect.deleteProperty(navigator, 'share');
  Reflect.deleteProperty(navigator, 'canShare');
  Reflect.deleteProperty(document, 'execCommand');
});

describe('buildQuizUrl', () => {
  it('usa la ruta con # para funcionar en hosting estático', () => {
    const url = buildQuizUrl('logica-patrones');
    expect(url).toBe(`${window.location.origin}${window.location.pathname}#/quiz/logica-patrones`);
  });

  it('añade parámetros de reto', () => {
    expect(buildQuizUrl('logica-patrones', { c: 5 })).toMatch(/#\/quiz\/logica-patrones\?c=5$/);
    expect(buildQuizUrl('oyente-musical', { r: 'bailador' })).toMatch(/\?r=bailador$/);
  });

  it('codifica los valores', () => {
    expect(buildQuizUrl('x', { r: 'a b&c' })).toMatch(/\?r=a\+b%26c$/);
  });
});

describe('copyToClipboard', () => {
  it('usa la API del portapapeles cuando existe', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    define(navigator, 'clipboard', { writeText });
    await expect(copyToClipboard('hola')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('hola');
  });

  it('recurre al método clásico si la API falla', async () => {
    define(navigator, 'clipboard', { writeText: vi.fn().mockRejectedValue(new Error('denegado')) });
    const exec = vi.fn().mockReturnValue(true);
    define(document, 'execCommand', exec);
    await expect(copyToClipboard('hola')).resolves.toBe(true);
    expect(exec).toHaveBeenCalledWith('copy');
  });

  it('devuelve false si no hay forma de copiar', async () => {
    define(navigator, 'clipboard', { writeText: vi.fn().mockRejectedValue(new Error('denegado')) });
    define(document, 'execCommand', vi.fn().mockReturnValue(false));
    await expect(copyToClipboard('hola')).resolves.toBe(false);
  });
});

describe('nativeShare', () => {
  it('informa cuando el navegador no lo soporta', async () => {
    await expect(nativeShare({ url: 'https://x.test' })).resolves.toBe('unsupported');
  });

  it('distingue compartido, cancelado y fallido', async () => {
    define(navigator, 'share', vi.fn().mockResolvedValue(undefined));
    await expect(nativeShare({ url: 'https://x.test' })).resolves.toBe('shared');

    define(navigator, 'share', vi.fn().mockRejectedValue(new DOMException('cancelado', 'AbortError')));
    await expect(nativeShare({ url: 'https://x.test' })).resolves.toBe('cancelled');

    define(navigator, 'share', vi.fn().mockRejectedValue(new Error('otro')));
    await expect(nativeShare({ url: 'https://x.test' })).resolves.toBe('failed');
  });

  it('respeta canShare', async () => {
    define(navigator, 'share', vi.fn());
    define(navigator, 'canShare', () => false);
    await expect(nativeShare({ url: 'https://x.test' })).resolves.toBe('unsupported');
  });
});
