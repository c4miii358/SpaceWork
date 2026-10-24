import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { useI18n } from '../i18n';

export default function About() {
  const { t } = useI18n();
  usePageMeta(`${t('about.title')} · RetoLoop`, t('about.p1'));
  return (
    <article className="container page page--narrow prose">
      <h1 className="page__title">{t('about.title')}</h1>
      <p>{t('about.p1')}</p>
      <h2>{t('about.h.how')}</h2>
      <p>{t('about.p2')}</p>
      <h2>{t('about.h.limits')}</h2>
      <p>{t('about.p3')}</p>
      <h2>{t('about.h.content')}</h2>
      <p>{t('about.p4')}</p>
      <p>
        <Link className="text-link" to="/contact">
          {t('nav.contact')}
        </Link>
      </p>
    </article>
  );
}
