# RetoLoop

Tests y retos interactivos para compartir: cultura general, lógica, música y cuestionarios recreativos.
Sin registro, sin servidor propio, sin claves privadas. React + TypeScript + Vite, CSS moderno.

## Requisitos

- Node.js 20.19 o superior (se recomienda 22; hay un `.nvmrc`).
- Git y una cuenta de GitHub para publicar.

## Instalar y ejecutar

```bash
npm install
npm run dev          # servidor local en http://localhost:5173
npm test             # pruebas (Vitest)
npm run typecheck    # comprobación de tipos
npm run build        # compilación de producción en dist/
npm run preview      # sirve dist/ localmente para probar la versión compilada
```

## Variables opcionales

Copia `.env.example` a `.env`. Ninguna es secreta (las `VITE_*` quedan visibles en el navegador).

| Variable | Para qué sirve |
| --- | --- |
| `VITE_SITE_URL` | URL pública sin barra final. Activa `canonical` y la imagen para redes sociales. |
| `VITE_CONTACT_EMAIL` | Correo que muestra la página de contacto. |
| `VITE_REPO_URL` | Repositorio público (`https://…`); la página de contacto enlaza a sus incidencias. |

Si no defines ni correo ni repositorio, la página de contacto lo dice abiertamente en lugar de mostrar un botón roto.

## Estructura

```
src/
  types/        tipos del dominio (Quiz, Question, QuizResult…)
  data/         categories.ts y quizzes/*.ts (un archivo por cuestionario)
  lib/          scoring, validation, storage, share, cardModel, resultCard, daily, catalog
  i18n/         es.ts (fuente de claves), en.ts, translate.ts, proveedor
  hooks/        useQuizSession, usePageMeta
  components/   Layout, Header, Footer, QuizCard, QuestionView, ResultView, ShareBar…
  pages/        Home, Catalog, QuizPage, About, Privacy, Contact, NotFound
  styles/       tokens.css, base.css, components.css
  test/         pruebas de flujos completos
```

## Añadir un cuestionario

1. Crea `src/data/quizzes/mi-quiz.ts` copiando uno existente. Hay dos tipos:
   - `trivia`: cada pregunta tiene `correct` (índice de la opción acertada) y los resultados salen por porcentaje.
   - `personality`: cada opción suma puntos a uno o más perfiles; en caso de empate gana el primer perfil de la lista.
2. El `id` va en minúsculas y guiones (forma parte de la URL).
3. Añádelo a la lista de `src/data/quizzes/index.ts`.
4. Ejecuta `npm test`: las pruebas de `quizzes.test.ts` comprueban ids únicos, respuestas correctas válidas,
   perfiles alcanzables y que los idiomas declarados estén completos.

## Añadir un idioma

1. Amplía `Lang` y `LANGS` en `src/types/quiz.ts`.
2. Crea el diccionario nuevo con el tipo `Record<MessageKey, string>`: TypeScript no compila si falta una clave.
3. Regístralo en `src/i18n/translate.ts`.
4. En los cuestionarios, añade el texto nuevo y agrega el idioma a `languages` solo cuando todo esté traducido.
   Mientras tanto la interfaz muestra el español con el aviso «Solo en español».

## Publicar gratis en GitHub Pages

1. Crea un repositorio **público** en GitHub (Pages gratis lo requiere en cuentas personales) y sube el código:
   ```bash
   git init -b main
   git add .
   git commit -m "RetoLoop MVP"
   git remote add origin https://github.com/TU_USUARIO/retoloop.git
   git push -u origin main
   ```
2. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Opcional: en **Settings → Secrets and variables → Actions → Variables** crea `VITE_SITE_URL`
   (`https://TU_USUARIO.github.io/retoloop`), `VITE_CONTACT_EMAIL` y `VITE_REPO_URL`.
4. Cada `push` a `main` ejecuta `.github/workflows/deploy.yml`: instala, comprueba tipos, ejecuta las pruebas,
   compila y publica. La URL aparece en la pestaña **Actions** y en **Settings → Pages**.

Funciona igual en Cloudflare Pages o Netlify: comando `npm run build`, directorio de salida `dist`, Node 22.
No hace falta configurar reescrituras porque las rutas usan `#`.

## Comprobar que los enlaces compartidos funcionan

Con el sitio publicado (o con `npm run build && npm run preview`):

1. Completa un cuestionario de trivia hasta el resultado y copia el enlace (termina en `#/quiz/<id>?c=<aciertos>`).
2. Ábrelo en una ventana de incógnito o en otro dispositivo: debe mostrar la portada del cuestionario con el aviso del reto.
3. Prueba enlaces manipulados; deben degradar sin errores:
   - `#/quiz/no-existe` → «Ese cuestionario no existe».
   - `#/quiz/<id>?c=999` → el parámetro se ignora.
   - `#/ruta/falsa` → página 404 con salidas.
4. En el móvil, pulsa **Compartir** (usa el menú nativo) y comprueba que «Copiar enlace» funciona como alternativa.
5. Recarga la página en mitad de un cuestionario: debe ofrecer «Continuar donde lo dejaste».

## Limitaciones conocidas

- **Vistas previas en redes sociales:** como las rutas viven tras el `#`, los rastreadores no ven los metadatos de cada
  cuestionario; todos los enlaces muestran la tarjeta general del sitio. Para vistas previas por cuestionario haría falta
  prerenderizar páginas, o un hosting con funciones, y queda fuera del MVP.
- **Fecha de la política de privacidad:** actualiza `privacyUpdated` en `src/config/site.ts` cuando cambie.
- **Contenido:** revisa las preguntas antes de publicarlas; la corrección de los datos es responsabilidad de quien edita el sitio.
