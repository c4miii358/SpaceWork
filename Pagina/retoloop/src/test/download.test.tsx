import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { answerTrivia, clickStart, openApp, trivia } from './helpers';

const { renderCard } = vi.hoisted(() => ({ renderCard: vi.fn() }));
vi.mock('../lib/resultCard', () => ({ renderCard }));

const LOGICA = 'logica-patrones';

async function reachResult(user: ReturnType<typeof userEvent.setup>) {
  const quiz = trivia(LOGICA);
  openApp(`#/quiz/${LOGICA}`);
  await clickStart(user);
  await answerTrivia(user, quiz, (i) => quiz.questions[i].correct);
  await screen.findByText('6 de 6 aciertos');
}

describe('tarjeta de resultado', () => {
  beforeEach(() => {
    renderCard.mockReset();
    URL.createObjectURL = vi.fn(() => 'blob:retoloop-test');
    URL.revokeObjectURL = vi.fn();
  });

  it('descarga la tarjeta como PNG con un nombre claro', async () => {
    const user = userEvent.setup();
    renderCard.mockResolvedValue(new Blob(['png'], { type: 'image/png' }));
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    await reachResult(user);

    await user.click(screen.getByRole('button', { name: 'Descargar tarjeta' }));

    await vi.waitFor(() => expect(click).toHaveBeenCalledTimes(1));
    const model = renderCard.mock.calls[0][0];
    expect(model).toMatchObject({ big: '6/6', headline: 'Puntuación perfecta', quizTitle: 'Lógica y patrones' });
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Descargar tarjeta' })).toBeEnabled();
  });

  it('si no se puede crear la imagen, lo dice y deja reintentar', async () => {
    const user = userEvent.setup();
    renderCard.mockRejectedValue(new Error('canvas no disponible'));
    await reachResult(user);

    await user.click(screen.getByRole('button', { name: 'Descargar tarjeta' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo crear la tarjeta. Inténtalo de nuevo.');
    expect(screen.getByRole('button', { name: 'Descargar tarjeta' })).toBeEnabled();
  });

  it('ofrece compartir la tarjeta como archivo solo si el navegador lo permite', async () => {
    const user = userEvent.setup();
    await reachResult(user);
    expect(screen.queryByRole('button', { name: 'Compartir tarjeta' })).not.toBeInTheDocument();
  });
});
