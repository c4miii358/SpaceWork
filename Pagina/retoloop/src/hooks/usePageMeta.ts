import { useEffect } from 'react';

function setContent(selector: string, value: string): void {
  document.head.querySelector(selector)?.setAttribute('content', value);
}

/** Actualiza título y metadatos de la página al cambiar de ruta o de idioma. */
export function usePageMeta(title: string, description: string): void {
  useEffect(() => {
    document.title = title;
    setContent('meta[name="description"]', description);
    setContent('meta[property="og:title"]', title);
    setContent('meta[property="og:description"]', description);
  }, [title, description]);
}
