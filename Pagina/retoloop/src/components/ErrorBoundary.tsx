import { Component, type ReactNode } from 'react';
import { useI18n } from '../i18n';
import { EmptyState } from './EmptyState';

function ErrorFallback() {
  const { t } = useI18n();
  return (
    <div className="container page">
      <EmptyState emoji="🛠️" level={1} title={t('error.generic.title')} text={t('error.generic.text')}>
        <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
          {t('error.reload')}
        </button>
      </EmptyState>
    </div>
  );
}

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error('RetoLoop: error de renderizado', error);
  }

  render() {
    return this.state.failed ? <ErrorFallback /> : this.props.children;
  }
}
