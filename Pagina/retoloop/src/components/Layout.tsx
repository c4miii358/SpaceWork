import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n';
import { Footer } from './Footer';
import { Header } from './Header';

export function Layout() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // Al navegar: vuelve arriba y lleva el foco al contenido para lectores de pantalla y teclado.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      {/* Con rutas por hash, un enlace «#main» cambiaría la ruta: se mueve el foco a mano. */}
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
          mainRef.current?.scrollIntoView?.();
        }}
      >
        {t('nav.skip')}
      </a>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1} className="site-main">
        <Suspense fallback={<p className="loading container" role="status">{t('common.loading')}</p>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
