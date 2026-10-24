import { defineConfig } from 'vitest/config';
import { loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/** Inyecta canonical y og:image absolutos solo si VITE_SITE_URL está definida. */
function seoPlugin(siteUrl: string): Plugin {
  return {
    name: 'retoloop-seo',
    transformIndexHtml(html) {
      const base = siteUrl.trim().replace(/\/+$/, '');
      const extra = /^https?:\/\//.test(base)
        ? [
            `<link rel="canonical" href="${base}/" />`,
            `<meta property="og:url" content="${base}/" />`,
            `<meta property="og:image" content="${base}/og.png" />`,
            `<meta name="twitter:image" content="${base}/og.png" />`,
          ].join('\n    ')
        : '';
      return html.replace('<!--seo-extra-->', extra);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // Ruta relativa: funciona en la raíz de un dominio y en subrutas (GitHub Pages).
    base: './',
    plugins: [react(), seoPlugin(env.VITE_SITE_URL ?? '')],
    build: { target: 'es2022' },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      css: false,
    },
  };
});
