import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p className="site-footer__note">{t('footer.disclaimer')}</p>
        <ul className="site-footer__links">
          <li>
            <Link to="/about">{t('nav.about')}</Link>
          </li>
          <li>
            <Link to="/privacy">{t('nav.privacy')}</Link>
          </li>
          <li>
            <Link to="/contact">{t('nav.contact')}</Link>
          </li>
        </ul>
        <p className="site-footer__copy">{t('footer.copy', { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
