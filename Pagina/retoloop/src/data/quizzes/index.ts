import type { Quiz } from '../../types/quiz';
import { culturaGeneral } from './cultura-general';
import { logicaPatrones } from './logica-patrones';
import { oyenteMusical } from './oyente-musical';
import { geografiaMundial } from './geografia-mundial';
import { cienciaCotidiana } from './ciencia-cotidiana';
import { tuFinDeSemana } from './tu-fin-de-semana';

/** Para añadir un cuestionario: crea su archivo en esta carpeta y agrégalo a la lista. */
export const QUIZZES: readonly Quiz[] = [
  culturaGeneral,
  oyenteMusical,
  logicaPatrones,
  geografiaMundial,
  cienciaCotidiana,
  tuFinDeSemana,
];

// Map evita que ids como "constructor" o "__proto__" se resuelvan contra Object.prototype.
const byId = new Map<string, Quiz>(QUIZZES.map((q) => [q.id, q]));

export function getQuizById(id: string): Quiz | undefined {
  return byId.get(id);
}
