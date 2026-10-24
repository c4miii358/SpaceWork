import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { QUIZZES } from '../data/quizzes';
import { dailyPick } from '../lib/daily';
import { answerPersonality, answerTrivia, clickStart, openApp, personality, shareInput, trivia } from './helpers';

const LOGICA = 'logica-patrones';
const MUSICA = 'oyente-musical';

describe('portada', () => {
  it('muestra título, reto del día, destacados, categorías y pasos', async () => {
    openApp();
    expect(await screen.findByRole('heading', { level: 1, name: 'Juega un rato. Reta a tus amigos.' })).toBeInTheDocument();

    const daily = dailyPick(QUIZZES)!;
    expect(screen.getByText('Reto del día')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Jugar el reto de hoy' })).toHaveAttribute('href', `#/quiz/${daily.id}`);

    const featured = screen.getByRole('region', { name: 'Retos destacados' });
    expect(within(featured).getAllByRole('article').length).toBeGreaterThanOrEqual(1);

    const categories = screen.getByRole('region', { name: 'Explora por categoría' });
    expect(within(categories).getAllByRole('link')).toHaveLength(5);
    expect(screen.getByRole('region', { name: 'Cómo funciona' })).toBeInTheDocument();
  });

  it('los enlaces principales llevan a donde dicen', async () => {
    const user = userEvent.setup();
    openApp();
    await user.click(await screen.findByRole('link', { name: 'Explorar el catálogo' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Catálogo de cuestionarios' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Inicio' }));
    await user.click(await screen.findByRole('link', { name: 'Jugar el reto de hoy' }));
    expect(await screen.findByRole('button', { name: 'Empezar' })).toBeInTheDocument();
  });

  it('la categoría de la portada abre el catálogo ya filtrado', async () => {
    const user = userEvent.setup();
    openApp();
    await user.click(await screen.findByRole('link', { name: /Música/ }));
    expect(await screen.findByRole('button', { name: 'Música', pressed: true })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('1 cuestionario');
  });
});

describe('catálogo', () => {
  it('lista todo y filtra por categoría', async () => {
    const user = userEvent.setup();
    openApp('#/quizzes');
    expect(await screen.findByRole('heading', { level: 1, name: 'Catálogo de cuestionarios' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(QUIZZES.length);

    await user.click(screen.getByRole('button', { name: 'Lógica' }));
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Lógica y patrones' })).toBeInTheDocument();
    expect(window.location.hash).toContain('cat=logic');
  });

  it('filtra por tipo y busca por texto sin acentos', async () => {
    const user = userEvent.setup();
    openApp('#/quizzes');
    await user.selectOptions(await screen.findByLabelText('Tipo'), 'personality');
    expect(screen.getAllByRole('article')).toHaveLength(QUIZZES.filter((q) => q.kind === 'personality').length);

    await user.selectOptions(screen.getByLabelText('Tipo'), 'all');
    await user.type(screen.getByRole('searchbox', { name: 'Buscar' }), 'geografia');
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Geografía del mundo' })).toBeInTheDocument();
  });

  it('muestra un estado vacío y permite quitar los filtros', async () => {
    const user = userEvent.setup();
    openApp('#/quizzes');
    await user.type(await screen.findByRole('searchbox', { name: 'Buscar' }), 'zzzz');
    expect(screen.getByRole('heading', { name: 'Ningún cuestionario coincide' })).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Quitar filtros' }));
    expect(screen.getAllByRole('article')).toHaveLength(QUIZZES.length);
  });

  it('ignora parámetros de filtro inválidos en la URL', async () => {
    openApp('#/quizzes?cat=hackeado&type=<script>&q=' + 'a'.repeat(200));
    await screen.findByRole('heading', { level: 1, name: 'Catálogo de cuestionarios' });
    expect(screen.getByRole('button', { name: 'Todas', pressed: true })).toBeInTheDocument();
    expect((screen.getByRole('searchbox', { name: 'Buscar' }) as HTMLInputElement).value).toHaveLength(60);
  });
});

describe('cuestionario de trivia', () => {
  it('se completa de principio a fin y ofrece el enlace para retar', async () => {
    const user = userEvent.setup();
    const quiz = trivia(LOGICA);
    openApp(`#/quiz/${LOGICA}`);

    expect(await screen.findByRole('heading', { level: 1, name: 'Lógica y patrones' })).toBeInTheDocument();
    await clickStart(user);
    expect(screen.getByText('Pregunta 1 de 6')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Progreso del cuestionario' })).toHaveAttribute('aria-valuenow', '0');

    await answerTrivia(user, quiz, (i) => quiz.questions[i].correct);

    expect(await screen.findByRole('heading', { level: 1, name: 'Tu resultado' })).toBeInTheDocument();
    expect(screen.getByText('6 de 6 aciertos')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Puntuación perfecta' })).toBeInTheDocument();
    expect(shareInput().value).toMatch(new RegExp(`#/quiz/${LOGICA}\\?c=6$`));

    // El resultado queda guardado y el progreso se limpia.
    expect(localStorage.getItem('retoloop:v1:results')).toContain(LOGICA);
    expect(JSON.parse(localStorage.getItem('retoloop:v1:progress') ?? '{}')).not.toHaveProperty(LOGICA);
  });

  it('permite quitar el resultado del enlace', async () => {
    const user = userEvent.setup();
    const quiz = trivia(LOGICA);
    openApp(`#/quiz/${LOGICA}`);
    await clickStart(user);
    await answerTrivia(user, quiz, (i) => quiz.questions[i].correct);
    await screen.findByText('6 de 6 aciertos');

    await user.click(screen.getByRole('checkbox', { name: 'Incluir mi resultado en el enlace' }));
    expect(shareInput().value).toMatch(new RegExp(`#/quiz/${LOGICA}$`));
  });

  it('exige elegir una respuesta antes de avanzar', async () => {
    const user = userEvent.setup();
    openApp(`#/quiz/${LOGICA}`);
    await clickStart(user);

    await user.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Elige una respuesta para continuar.');
    expect(screen.getByText('Pregunta 1 de 6')).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: '32' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('muestra si la respuesta fue correcta y la bloquea', async () => {
    const user = userEvent.setup();
    openApp(`#/quiz/${LOGICA}`);
    await clickStart(user);

    await user.click(screen.getByRole('radio', { name: '24' }));
    expect(screen.getByText('No era esa. La respuesta correcta es: 32.')).toBeInTheDocument();
    expect(screen.getByText(/Cada número es el doble del anterior/)).toBeInTheDocument();

    // Una vez respondida, no se puede cambiar.
    await user.click(screen.getByRole('radio', { name: '32' }));
    expect(screen.getByRole('radio', { name: '24' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '32' })).not.toBeChecked();
  });

  it('cuenta los fallos en el resultado', async () => {
    const user = userEvent.setup();
    const quiz = trivia(LOGICA);
    openApp(`#/quiz/${LOGICA}`);
    await clickStart(user);
    await answerTrivia(user, quiz, (i) => (quiz.questions[i].correct + 1) % quiz.questions[i].options.length);
    expect(await screen.findByText('0 de 6 aciertos')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Calentando motores' })).toBeInTheDocument();
  });

  it('permite volver a la pregunta anterior', async () => {
    const user = userEvent.setup();
    openApp(`#/quiz/${LOGICA}`);
    await clickStart(user);
    expect(screen.queryByRole('button', { name: 'Anterior' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: '32' }));
    await user.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(screen.getByText('Pregunta 2 de 6')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Anterior' }));
    expect(screen.getByText('Pregunta 1 de 6')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '32' })).toBeChecked();
  });

  it('retoma el progreso tras recargar y deja empezar de nuevo', async () => {
    const user = userEvent.setup();
    const first = openApp(`#/quiz/${LOGICA}`);
    await clickStart(user);
    await user.click(screen.getByRole('radio', { name: '32' }));
    await user.click(screen.getByRole('button', { name: 'Siguiente' }));
    first.unmount();

    openApp(`#/quiz/${LOGICA}`);
    await user.click(await screen.findByRole('button', { name: 'Continuar donde lo dejaste' }));
    expect(screen.getByText('Pregunta 2 de 6')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
  });

  it('empezar de nuevo borra el progreso guardado', async () => {
    const user = userEvent.setup();
    const first = openApp(`#/quiz/${LOGICA}`);
    await clickStart(user);
    await user.click(screen.getByRole('radio', { name: '32' }));
    await user.click(screen.getByRole('button', { name: 'Siguiente' }));
    first.unmount();

    openApp(`#/quiz/${LOGICA}`);
    await user.click(await screen.findByRole('button', { name: 'Empezar de nuevo' }));
    expect(screen.getByText('Pregunta 1 de 6')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '32' })).not.toBeChecked();
  });

  it('puede repetirse desde el resultado', async () => {
    const user = userEvent.setup();
    const quiz = trivia(LOGICA);
    openApp(`#/quiz/${LOGICA}`);
    await clickStart(user);
    await answerTrivia(user, quiz, (i) => quiz.questions[i].correct);
    await user.click(await screen.findByRole('button', { name: 'Repetir el cuestionario' }));
    expect(screen.getByText('Pregunta 1 de 6')).toBeInTheDocument();
  });

  it('recuerda el último resultado en la portada del cuestionario', async () => {
    const user = userEvent.setup();
    const quiz = trivia(LOGICA);
    const first = openApp(`#/quiz/${LOGICA}`);
    await clickStart(user);
    await answerTrivia(user, quiz, (i) => quiz.questions[i].correct);
    await screen.findByText('6 de 6 aciertos');
    first.unmount();

    openApp(`#/quiz/${LOGICA}`);
    expect(await screen.findByText('Tu último resultado: 6 de 6 (mejor: 6).')).toBeInTheDocument();
  });
});

describe('cuestionario recreativo', () => {
  it('calcula el perfil, avisa de que es recreativo y no muestra aciertos', async () => {
    const user = userEvent.setup();
    const quiz = personality(MUSICA);
    openApp(`#/quiz/${MUSICA}`);
    expect(await screen.findByText(/no es una evaluación psicológica ni científica/)).toBeInTheDocument();

    await clickStart(user);
    await answerPersonality(user, quiz, 'bailador');

    expect(await screen.findByRole('heading', { name: 'Alma de pista' })).toBeInTheDocument();
    expect(screen.getByText('Resultado recreativo, no científico')).toBeInTheDocument();
    expect(screen.queryByText(/aciertos/)).not.toBeInTheDocument();
    expect(shareInput().value).toMatch(/\?r=bailador$/);
  });

  it('no bloquea las respuestas: se pueden cambiar', async () => {
    const user = userEvent.setup();
    const quiz = personality(MUSICA);
    openApp(`#/quiz/${MUSICA}`);
    await clickStart(user);
    const [first, second] = quiz.questions[0].options.map((o) => o.text.es);
    await user.click(screen.getByRole('radio', { name: first }));
    await user.click(screen.getByRole('radio', { name: second }));
    expect(screen.getByRole('radio', { name: second })).toBeChecked();
    expect(screen.getByRole('radio', { name: first })).not.toBeChecked();
    expect(screen.queryByText('¡Correcto!')).not.toBeInTheDocument();
  });
});

describe('enlaces de reto', () => {
  it('muestra el reto recibido y lo compara con el resultado', async () => {
    const user = userEvent.setup();
    const quiz = trivia(LOGICA);
    openApp(`#/quiz/${LOGICA}?c=4`);
    expect(await screen.findByText('Te han retado: sacaron 4 de 6. ¿Puedes superarlo?')).toBeInTheDocument();

    await clickStart(user);
    await answerTrivia(user, quiz, (i) => quiz.questions[i].correct);
    expect(await screen.findByText('Superaste el reto: 6 aciertos.')).toBeInTheDocument();
  });

  it('reconoce empate y derrota', async () => {
    const user = userEvent.setup();
    const quiz = trivia(LOGICA);
    openApp(`#/quiz/${LOGICA}?c=0`);
    await clickStart(user);
    await answerTrivia(user, quiz, (i) => (quiz.questions[i].correct + 1) % quiz.questions[i].options.length);
    expect(await screen.findByText('Empataste con el reto: 0 aciertos.')).toBeInTheDocument();
  });

  it.each(['?c=99', '?c=-1', '?c=abc', '?c=1e2', '?c='])('ignora un reto inválido (%s)', async (query) => {
    openApp(`#/quiz/${LOGICA}${query}`);
    await screen.findByRole('heading', { level: 1, name: 'Lógica y patrones' });
    expect(screen.queryByText(/Te han retado/)).not.toBeInTheDocument();
  });

  it('muestra el perfil recibido en cuestionarios recreativos y solo si existe', async () => {
    const user = userEvent.setup();
    const quiz = personality(MUSICA);
    const first = openApp(`#/quiz/${MUSICA}?r=nostalgico`);
    expect(await screen.findByText(/Alma nostálgica/)).toBeInTheDocument();
    await clickStart(user);
    await answerPersonality(user, quiz, 'nostalgico');
    expect(await screen.findByText('Os salió el mismo perfil: «Alma nostálgica».')).toBeInTheDocument();
    first.unmount();

    openApp(`#/quiz/${MUSICA}?r=inventado`);
    await screen.findByRole('heading', { level: 1, name: '¿Qué tipo de oyente eres?' });
    expect(screen.queryByText(/A quien te envió el enlace/)).not.toBeInTheDocument();
  });

  it('un parámetro de trivia no afecta a un cuestionario recreativo', async () => {
    openApp(`#/quiz/${MUSICA}?c=3`);
    await screen.findByRole('heading', { level: 1, name: '¿Qué tipo de oyente eres?' });
    expect(screen.queryByText(/Te han retado/)).not.toBeInTheDocument();
  });
});

describe('compartir', () => {
  async function finishLogic(user: ReturnType<typeof userEvent.setup>) {
    const quiz = trivia(LOGICA);
    openApp(`#/quiz/${LOGICA}`);
    await clickStart(user);
    await answerTrivia(user, quiz, (i) => quiz.questions[i].correct);
    await screen.findByText('6 de 6 aciertos');
  }

  it('copia el enlace con la API del portapapeles', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    await finishLogic(user);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    await user.click(screen.getByRole('button', { name: 'Copiar enlace' }));
    expect(writeText).toHaveBeenCalledWith(shareInput().value);
    expect(await screen.findByText('Enlace copiado.')).toBeInTheDocument();
    Reflect.deleteProperty(navigator, 'clipboard');
  });

  it('si no se puede copiar, avisa y deja el enlace seleccionable', async () => {
    const user = userEvent.setup();
    await finishLogic(user);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('denegado')) },
      configurable: true,
    });

    await user.click(screen.getByRole('button', { name: 'Copiar enlace' }));
    expect(await screen.findByText('No se pudo copiar solo. Selecciona el enlace y cópialo.')).toBeInTheDocument();
    expect(shareInput()).toHaveAttribute('readonly');
    Reflect.deleteProperty(navigator, 'clipboard');
  });

  it('no muestra «Compartir» si el navegador no lo soporta', async () => {
    const user = userEvent.setup();
    await finishLogic(user);
    expect(screen.queryByRole('button', { name: 'Compartir' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copiar enlace' })).toBeInTheDocument();
  });

  it('usa el menú de compartir del sistema cuando existe', async () => {
    const user = userEvent.setup();
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { value: share, configurable: true, writable: true });
    await finishLogic(user);

    await user.click(screen.getByRole('button', { name: 'Compartir' }));
    expect(share).toHaveBeenCalledTimes(1);
    const payload = share.mock.calls[0][0] as ShareData;
    expect(payload.url).toMatch(/#\/quiz\/logica-patrones\?c=6$/);
    expect(payload.text).toContain('6 de 6');
    expect(await screen.findByText('Enlace compartido.')).toBeInTheDocument();
    Reflect.deleteProperty(navigator, 'share');
  });

  it('si compartir falla, copia el enlace como alternativa', async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, 'share', { value: vi.fn().mockRejectedValue(new Error('fallo')), configurable: true, writable: true });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    await finishLogic(user);

    await user.click(screen.getByRole('button', { name: 'Compartir' }));
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('Enlace copiado.')).toBeInTheDocument();
    Reflect.deleteProperty(navigator, 'share');
    Reflect.deleteProperty(navigator, 'clipboard');
  });

  it('si la persona cancela el menú de compartir, no copia nada ni muestra errores', async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, 'share', {
      value: vi.fn().mockRejectedValue(new DOMException('cancelado', 'AbortError')),
      configurable: true,
      writable: true,
    });
    const writeText = vi.fn();
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    await finishLogic(user);

    await user.click(screen.getByRole('button', { name: 'Compartir' }));
    expect(writeText).not.toHaveBeenCalled();
    expect(screen.queryByText(/No se pudo copiar/)).not.toBeInTheDocument();
    Reflect.deleteProperty(navigator, 'share');
    Reflect.deleteProperty(navigator, 'clipboard');
  });
});

describe('errores y rutas inexistentes', () => {
  it.each(['#/quiz/no-existe', '#/quiz/constructor', '#/quiz/__proto__', '#/quiz/MAYUSCULAS', '#/quiz/..%2F..%2Fetc'])(
    'avisa de que el cuestionario no existe (%s)',
    async (hash) => {
      openApp(hash);
      expect(await screen.findByRole('heading', { level: 1, name: 'Ese cuestionario no existe' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Ver el catálogo' })).toHaveAttribute('href', '#/quizzes');
    },
  );

  it('muestra una página 404 con salidas útiles', async () => {
    openApp('#/ruta/que/no/existe');
    expect(await screen.findByRole('heading', { level: 1, name: 'No encontramos esa página' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ir al inicio' })).toHaveAttribute('href', '#/');
  });

  it('un error de renderizado no deja la pantalla en blanco', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { default: Boom } = await import('./Boom');
    const { ErrorBoundary } = await import('../components/ErrorBoundary');
    const { I18nProvider } = await import('../i18n');
    const { render } = await import('@testing-library/react');
    render(
      <I18nProvider>
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
      </I18nProvider>,
    );
    expect(screen.getByRole('heading', { name: 'Algo falló al mostrar esta página' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Recargar la página' })).toBeInTheDocument();
  });
});

describe('idioma', () => {
  it('cambia la interfaz a inglés y recuerda la elección', async () => {
    const user = userEvent.setup();
    openApp();
    await user.click(await screen.findByRole('button', { name: 'English' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Play for a while. Challenge your friends.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Catalog' })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('en');
    expect(JSON.parse(localStorage.getItem('retoloop:v1:prefs')!)).toEqual({ lang: 'en' });
  });

  it('recupera el idioma guardado al volver', async () => {
    localStorage.setItem('retoloop:v1:prefs', JSON.stringify({ lang: 'en' }));
    openApp('#/quizzes');
    expect(await screen.findByRole('heading', { level: 1, name: 'Quiz catalog' })).toBeInTheDocument();
  });

  it('detecta inglés en el navegador si no hay preferencia', async () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('en-GB');
    openApp();
    expect(await screen.findByRole('heading', { level: 1, name: /Play for a while/ })).toBeInTheDocument();
  });

  it('un cuestionario traducido se juega completo en inglés', async () => {
    const user = userEvent.setup();
    localStorage.setItem('retoloop:v1:prefs', JSON.stringify({ lang: 'en' }));
    const quiz = trivia(LOGICA);
    openApp(`#/quiz/${LOGICA}`);
    expect(await screen.findByRole('heading', { level: 1, name: 'Logic and patterns' })).toBeInTheDocument();
    expect(screen.queryByText(/only available in Spanish/)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Start' }));
    expect(screen.getByText('Question 1 of 6')).toBeInTheDocument();
    await answerTrivia(user, quiz, (i) => quiz.questions[i].correct, 'en');
    expect(await screen.findByText('6 out of 6 correct')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Perfect score' })).toBeInTheDocument();
  });

  it('avisa de lo que aún no está traducido', async () => {
    const user = userEvent.setup();
    localStorage.setItem('retoloop:v1:prefs', JSON.stringify({ lang: 'en' }));
    openApp('#/quizzes');
    await screen.findByRole('heading', { level: 1, name: 'Quiz catalog' });
    const spanishOnly = QUIZZES.filter((q) => !q.languages.includes('en')).length;
    expect(screen.getAllByText('Spanish only')).toHaveLength(spanishOnly);

    await user.click(screen.getByRole('link', { name: 'Geografía del mundo' }));
    expect(await screen.findByText('This quiz is only available in Spanish for now.')).toBeInTheDocument();
  });
});

describe('páginas informativas', () => {
  it('privacidad: explica qué se guarda y permite borrarlo', async () => {
    const user = userEvent.setup();
    localStorage.setItem('retoloop:v1:prefs', JSON.stringify({ lang: 'es' }));
    localStorage.setItem('retoloop:v1:results', JSON.stringify({}));
    openApp('#/privacy');

    expect(await screen.findByRole('heading', { level: 1, name: 'Política de privacidad' })).toBeInTheDocument();
    expect(screen.getByText(/No pedimos registro ni datos personales/)).toBeInTheDocument();
    expect(screen.getByText(/Última actualización: 21 de octubre de 2026/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Borrar mis datos locales' }));
    expect(screen.getByText(/se borraron los datos de RetoLoop/)).toBeInTheDocument();
    expect(localStorage.getItem('retoloop:v1:prefs')).toBeNull();
    expect(localStorage.getItem('retoloop:v1:results')).toBeNull();
  });

  it('proyecto: aclara que los resultados no son evaluaciones científicas', async () => {
    openApp('#/about');
    expect(await screen.findByRole('heading', { level: 1, name: 'Sobre RetoLoop' })).toBeInTheDocument();
    expect(within(screen.getByRole('main')).getByText(/no son evaluaciones psicológicas ni científicas/)).toBeInTheDocument();
  });

  it('contacto: sin canal configurado, lo dice en lugar de mostrar un botón roto', async () => {
    openApp('#/contact');
    expect(await screen.findByRole('heading', { level: 1, name: 'Contacto' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Aún no hay un canal de contacto público' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /correo|GitHub/ })).not.toBeInTheDocument();
  });

  it('el pie enlaza a privacidad, contacto y proyecto', async () => {
    openApp();
    await screen.findByRole('heading', { level: 1 });
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByRole('link', { name: 'Privacidad' })).toHaveAttribute('href', '#/privacy');
    expect(within(footer).getByRole('link', { name: 'Contacto' })).toHaveAttribute('href', '#/contact');
    expect(within(footer).getByRole('link', { name: 'Proyecto' })).toHaveAttribute('href', '#/about');
  });
});

describe('accesibilidad básica', () => {
  it('tiene enlace para saltar al contenido y navegación con nombre', async () => {
    openApp();
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByRole('link', { name: 'Saltar al contenido' })).toHaveAttribute('href', '#main');
    expect(screen.getByRole('navigation', { name: 'Navegación principal' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Idioma' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
  });

  it('«Saltar al contenido» mueve el foco sin romper la ruta', async () => {
    const user = userEvent.setup();
    openApp('#/quizzes');
    await screen.findByRole('heading', { level: 1, name: 'Catálogo de cuestionarios' });

    await user.click(screen.getByRole('link', { name: 'Saltar al contenido' }));
    expect(window.location.hash).toBe('#/quizzes');
    expect(screen.getByRole('main')).toHaveFocus();
    expect(screen.getByRole('heading', { level: 1, name: 'Catálogo de cuestionarios' })).toBeInTheDocument();
  });

  it('las opciones forman un grupo de radio con la pregunta como nombre', async () => {
    const user = userEvent.setup();
    openApp(`#/quiz/${LOGICA}`);
    await clickStart(user);
    const group = screen.getByRole('radiogroup', { name: /¿Qué número sigue\? 2, 4, 8, 16/ });
    expect(within(group).getAllByRole('radio')).toHaveLength(4);
  });
});
