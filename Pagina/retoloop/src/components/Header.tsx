import { Link, NavLink } from 'react-router-dom';
import { useI18n } from '../i18n';
import { LANGS } from '../types/quiz';
import { Logo } from './Logo';

export function Header() {
  const { t, lang, setLang } = useI18n();
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-header__brand">
          <Logo />
        </Link>
        <nav className="site-nav" aria-label={t('nav.main')}>
          <NavLink to="/" end>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/quizzes">{t('nav.catalog')}</NavLink>
          <NavLink to="/about">{t('nav.about')}</NavLink>
        </nav>
        <div className="lang" role="group" aria-label={t('lang.label')}>
          {LANGS.map((code) => (
            <button
              key={code}
              type="button"
              className="lang__btn"
              lang={code}
              aria-label={t(`lang.${code}`)}
              aria-pressed={lang === code}
              onClick={() => setLang(code)}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
