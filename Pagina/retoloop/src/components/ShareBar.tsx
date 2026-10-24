import { useId, useState } from 'react';
import { useI18n } from '../i18n';
import { canShareNatively, copyToClipboard, nativeShare } from '../lib/share';

interface Props {
  url: string;
  title: string;
  text: string;
}

type Status = 'idle' | 'copied' | 'copyFailed' | 'shared';

/** Enlace seleccionable + «Compartir» (si el navegador lo permite) + «Copiar enlace». */
export function ShareBar({ url, title, text }: Props) {
  const { t } = useI18n();
  const inputId = useId();
  const [status, setStatus] = useState<Status>('idle');
  const nativeAvailable = canShareNatively();

  async function copy() {
    setStatus((await copyToClipboard(url)) ? 'copied' : 'copyFailed');
  }

  async function share() {
    const outcome = await nativeShare({ title, text, url });
    if (outcome === 'shared') setStatus('shared');
    else if (outcome === 'unsupported' || outcome === 'failed') await copy();
  }

  const message =
    status === 'copied' ? t('share.copied') : status === 'shared' ? t('share.shared') : status === 'copyFailed' ? t('share.copyFailed') : '';

  return (
    <div className="share">
      <label className="share__label" htmlFor={inputId}>
        {t('share.linkLabel')}
      </label>
      <input
        id={inputId}
        className="share__input"
        type="text"
        readOnly
        value={url}
        onFocus={(event) => event.currentTarget.select()}
      />
      <div className="share__actions">
        {nativeAvailable && (
          <button type="button" className="btn btn--primary" onClick={share}>
            {t('share.share')}
          </button>
        )}
        <button type="button" className={nativeAvailable ? 'btn' : 'btn btn--primary'} onClick={copy}>
          {t('share.copy')}
        </button>
      </div>
      <p className={status === 'copyFailed' ? 'share__status field-error' : 'share__status'} role="status">
        {message}
      </p>
    </div>
  );
}
