import { EmptyState } from '../components/EmptyState';
import { SITE } from '../config/site';
import { usePageMeta } from '../hooks/usePageMeta';
import { useI18n } from '../i18n';

export default function Contact() {
  const { t } = useI18n();
  usePageMeta(`${t('contact.title')} · RetoLoop`, t('contact.intro'));

  const hasChannel = SITE.contactEmail !== '' || SITE.repoUrl !== '';

  return (
    <div className="container page page--narrow">
      <h1 className="page__title">{t('contact.title')}</h1>
      {hasChannel ? (
        <>
          <p className="page__lead">{t('contact.intro')}</p>
          <div className="contact__actions">
            {SITE.contactEmail !== '' && (
              <a className="btn btn--primary" href={`mailto:${SITE.contactEmail}`}>
                {t('contact.email')}
              </a>
            )}
            {SITE.repoUrl !== '' && (
              <a className="btn" href={`${SITE.repoUrl}/issues`} target="_blank" rel="noopener noreferrer">
                {t('contact.repo')}
              </a>
            )}
          </div>
          {SITE.contactEmail !== '' && <p className="muted">{SITE.contactEmail}</p>}
        </>
      ) : (
        <EmptyState emoji="📭" title={t('contact.none.title')} text={t('contact.none.text')} />
      )}
    </div>
  );
}
