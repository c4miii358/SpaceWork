import { lazy } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { I18nProvider } from './i18n';
import Home from './pages/Home';

// La portada se carga de inmediato; el resto de rutas se descargan al visitarlas.
const Catalog = lazy(() => import('./pages/Catalog'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const About = lazy(() => import('./pages/About'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

/**
 * HashRouter: las rutas viven tras el «#», así que los enlaces compartidos funcionan
 * en cualquier hosting estático sin configurar reescrituras en el servidor.
 */
export default function App() {
  return (
    <I18nProvider>
      <ErrorBoundary>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="quizzes" element={<Catalog />} />
              <Route path="quiz/:quizId" element={<QuizPage />} />
              <Route path="about" element={<About />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </HashRouter>
      </ErrorBoundary>
    </I18nProvider>
  );
}
