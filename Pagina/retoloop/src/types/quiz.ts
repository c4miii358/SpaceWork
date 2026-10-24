export type Lang = 'es' | 'en';
export const LANGS: readonly Lang[] = ['es', 'en'];

/** Texto localizado. El español es obligatorio; el resto de idiomas se puede añadir después. */
export type L10n = { es: string; en?: string };

export type CategoryId = 'culture' | 'logic' | 'music' | 'science' | 'fun';
export type Accent = 'violet' | 'lime' | 'pink' | 'cyan' | 'amber';
export type QuizKind = 'trivia' | 'personality';

interface QuizBase {
  /** Identificador en minúsculas y guiones; forma parte de la URL. */
  id: string;
  category: CategoryId;
  accent: Accent;
  emoji: string;
  title: L10n;
  description: L10n;
  minutes: number;
  /** Idiomas con traducción completa. 'es' siempre está. */
  languages: Lang[];
  featured?: boolean;
}

export interface TriviaQuestion {
  id: string;
  prompt: L10n;
  options: L10n[];
  /** Índice de la opción correcta. */
  correct: number;
  explanation?: L10n;
}

export interface TriviaOutcome {
  /** Porcentaje mínimo de aciertos (0-100) para obtener este resultado. */
  minPercent: number;
  title: L10n;
  description: L10n;
}

export interface TriviaQuiz extends QuizBase {
  kind: 'trivia';
  questions: TriviaQuestion[];
  outcomes: TriviaOutcome[];
}

export interface PersonalityOption {
  text: L10n;
  /** Puntos por perfil. Los ids deben existir en `profiles`. */
  points: Record<string, number>;
}

export interface PersonalityQuestion {
  id: string;
  prompt: L10n;
  options: PersonalityOption[];
}

export interface Profile {
  id: string;
  emoji: string;
  title: L10n;
  description: L10n;
}

export interface PersonalityQuiz extends QuizBase {
  kind: 'personality';
  questions: PersonalityQuestion[];
  /** En caso de empate gana el primero de la lista. */
  profiles: Profile[];
}

export type Quiz = TriviaQuiz | PersonalityQuiz;

/** Una posición por pregunta: índice elegido o null si aún no se respondió. */
export type Answers = (number | null)[];

export type QuizResult =
  | { kind: 'trivia'; correct: number; total: number; percent: number; outcomeIndex: number }
  | { kind: 'personality'; profileId: string; totals: Record<string, number> };
