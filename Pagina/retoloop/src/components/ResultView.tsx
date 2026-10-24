import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { buildCardModel } from '../lib/cardModel';
import { buildQuizUrl, canShareFiles, downloadBlob, nativeShare } from '../lib/share';
import { pick } from '../lib/text';
import type { Quiz, QuizResult } from '../types/quiz';
import { ShareBar } from './ShareBar';

interface Props {
  quiz: Quiz;
  result: QuizResult;
  challengeScore: number | null;
  challengeProfileId: string | null;
  onRetry: () => void;
}

export function ResultView({ quiz, result, challengeScore, challengeProfileId, onRetry }: Props) {
  const { t, lang } = useI18n();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [includeResult, setIncludeResult] = useState(true);
  const [busy, setBusy] = useState(false);
  const [cardError, setCardError] = useState(false);
  const [fileShare] = useState(canShareFiles);

  useEffect(() => {
    window.scrollTo(0, 0);
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  const model = useMemo(() => buildCardModel(quiz, result, lang), [quiz, result, lang]);

  const url = useMemo(() => {
    if (!includeResult) return buildQuizUrl(quiz.id);
    return buildQuizUrl(quiz.id, result.kind === 'trivia' ? { c: result.correct } : { r: result.profileId });
  }, [quiz.id, result, includeResult]);

  const shareText = !includeResult
    ? t('result.shareText.invite', { quiz: model.quizTitle })
    : result.kind === 'trivia'
      ? t('result.shareText.trivia', { correct: result.correct, total: result.total, quiz: model.quizTitle })
      : t('result.shareText.profile', { quiz: model.quizTitle, profile: model.headline });

  let challengeMessage: string | null = null;
  if (result.kind === 'trivia' && challengeScore !== null) {
    challengeMessage =
      result.correct > challengeScore
        ? t('result.challenge.win', { score: result.correct })
        : result.correct === challengeScore
          ? t('result.challenge.tie', { score: result.correct })
          : t('result.challenge.lose', { score: challengeScore });
  } else if (quiz.kind === 'personality' && result.kind === 'personality' && challengeProfileId !== null) {
    const friend = quiz.profiles.find((p) => p.id === challengeProfileId);
    if (friend) {
      const key = friend.id === result.profileId ? 'result.challenge.same' : 'result.challenge.different';
      challengeMessage = t(key, { profile: pick(friend.title, lang) });
    }
  }

  async function makeCard(): Promise<Blob> {
    const { renderCard } = await import('../lib/resultCard');
    return renderCard(model);
  }

  async function download() {
    setBusy(true);
    setCardError(false);
    try {
      downloadBlob(await makeCard(), `retoloop-${quiz.id}.png`);
    } catch {
      setCardError(true);
    } finally {
      setBusy(false);
    }
  }

  async function shareCard() {
    setBusy(true);
    setCardError(false);
    try {
      const blob = await makeCard();
      const file = new File([blob], `retoloop-${quiz.id}.png`, { type: 'image/png' });
      const outcome = await nativeShare({ files: [file], title: model.quizTitle, text: `${shareText} ${url}` });
      if (outcome === 'unsupported' || outcome === 'failed') downloadBlob(blob, file.name);
    } catch {
      setCardError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="result container page" data-accent={quiz.accent}>
      <h1 ref={headingRef} tabIndex={-1} className="result__title">
        {t('result.title')}
      </h1>

      {challengeMessage && (
        <p className="notice notice--challenge" role="status">
          {challengeMessage}
        </p>
      )}

      <div className="result__layout">
        <article className="ticket" data-accent={quiz.accent} aria-label={t('result.cardAlt')}>
          <div className="ticket__main">
            <div className="ticket__emoji" aria-hidden="true">
              {model.emoji}
            </div>
            <p className="ticket__kicker">{model.kicker}</p>
            {result.kind === 'trivia' && (
              <>
                <div className="ring" style={{ '--pct': result.percent } as CSSProperties} aria-hidden="true">
                  <span className="ring__value">{model.big}</span>
                </div>
                <p className="ticket__score">{t('result.scoreOf', { correct: result.correct, total: result.total })}</p>
              </>
            )}
            <h2 className="ticket__headline">{model.headline}</h2>
            <p className="ticket__caption">{model.caption}</p>
          </div>
          <div className="ticket__stub">
            <p className="ticket__quiz">{model.quizTitle}</p>
            {model.footnote && <p className="ticket__footnote">{model.footnote}</p>}
            <p className="ticket__invite">{model.invite}</p>
          </div>
        </article>

        <div className="result__side">
          <div className="result__actions">
            <button type="button" className="btn btn--primary" onClick={download} disabled={busy}>
              {busy ? t('result.downloading') : t('result.download')}
            </button>
            {fileShare && (
              <button type="button" className="btn" onClick={shareCard} disabled={busy}>
                {t('result.shareCard')}
              </button>
            )}
          </div>
          {cardError && (
            <p className="field-error" role="alert">
              {t('result.cardError')}
            </p>
          )}

          <h2 className="result__subtitle">{t('result.share.title')}</h2>
          <label className="check">
            <input type="checkbox" checked={includeResult} onChange={(event) => setIncludeResult(event.target.checked)} />
            <span>{t('result.includeResult')}</span>
          </label>
          <ShareBar url={url} title={model.quizTitle} text={shareText} />

          <div className="result__more">
            <button type="button" className="btn" onClick={onRetry}>
              {t('result.again')}
            </button>
            <Link className="btn btn--ghost" to="/quizzes">
              {t('result.more')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
