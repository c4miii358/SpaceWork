import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../config/site';
import { usePageMeta } from '../hooks/usePageMeta';
import { useI18n } from '../i18n';
import { clearAllData } from '../lib/storage';

export default function Privacy() {
  const { t, lang } = useI18n();
  const [cleared, setCleared] = useState(false);
  usePageMeta(`${t('privacy.title')} · RetoLoop`, t('privacy.p.data'));

  const date = new Intl.DateTimeFormat(lang, { dateStyle: 'long' }).format(new Date(`${SITE.privacyUpdated}T12:00:00`));

  return (
    <article className="container page page--narrow prose">
      <h1 className="page__title">{t('privacy.title')}</h1>
      <p className="muted">{t('privacy.updated', { date })}</p>

      <h2>{t('privacy.h.data')}</h2>
      <p>{t('privacy.p.data')}</p>
      <h2>{t('privacy.h.notdo')}</h2>
      <p>{t('privacy.p.notdo')}</p>
      <h2>{t('privacy.h.links')}</h2>
      <p>{t('privacy.p.links')}</p>

      <h2>{t('privacy.h.delete')}</h2>
      <p>{t('privacy.p.delete')}</p>
      <p>
        <button
          type="button"
          className="btn"
          onClick={() => {
            clearAllData();
            setCleared(true);
          }}
        >
          {t('privacy.clear')}
        </button>
      </p>
      <p role="status" className="notice-inline">
        {cleared ? t('privacy.cleared') : ''}
      </p>

      <h2>{t('privacy.h.contact')}</h2>
      <p>
        {t('privacy.p.contact')}{' '}
        <Link className="text-link" to="/contact">
          {t('nav.contact')}
        </Link>
      </p>
    </article>
  );
}
