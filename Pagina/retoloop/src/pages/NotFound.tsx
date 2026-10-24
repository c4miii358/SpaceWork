import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { usePageMeta } from '../hooks/usePageMeta';
import { useI18n } from '../i18n';

export default function NotFound() {
  const { t } = useI18n();
  usePageMeta(`${t('error.notFound.title')} · RetoLoop`, t('error.notFound.text'));
  return (
    <div className="container page">
      <EmptyState emoji="🧭" level={1} title={t('error.notFound.title')} text={t('error.notFound.text')}>
        <Link className="btn btn--primary" to="/">
          {t('error.home')}
        </Link>
        <Link className="btn" to="/quizzes">
          {t('error.catalog')}
        </Link>
      </EmptyState>
    </div>
  );
}
