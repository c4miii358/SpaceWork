const clean = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const email = clean(import.meta.env.VITE_CONTACT_EMAIL);
const repo = clean(import.meta.env.VITE_REPO_URL);

/** Datos públicos del sitio. Se configuran con variables VITE_* (ver .env.example). */
export const SITE = {
  name: 'RetoLoop',
  contactEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '',
  repoUrl: /^https:\/\/\S+$/.test(repo) ? repo.replace(/\/+$/, '') : '',
  /** Actualiza esta fecha cada vez que cambie la política de privacidad. */
  privacyUpdated: '2026-10-21',
} as const;
