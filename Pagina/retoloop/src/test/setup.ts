import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { clearAllData } from '../lib/storage';

beforeEach(() => {
  // Idioma del navegador determinista: las pruebas parten en español.
  vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('es-CO');
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
});

afterEach(() => {
  cleanup();
  clearAllData();
  window.localStorage.clear();
  window.history.replaceState(null, '', '/');
  vi.restoreAllMocks();
});
