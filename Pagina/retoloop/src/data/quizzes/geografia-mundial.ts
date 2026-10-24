import type { TriviaQuiz } from '../../types/quiz';
import { L, STANDARD_OUTCOMES } from '../helpers';

export const geografiaMundial: TriviaQuiz = {
  kind: 'trivia',
  id: 'geografia-mundial',
  category: 'culture',
  accent: 'cyan',
  emoji: '🌍',
  title: L('Geografía del mundo'),
  description: L('Capitales, ríos, desiertos y montañas: ¿cuánto sabes del planeta?'),
  minutes: 3,
  languages: ['es'],
  outcomes: STANDARD_OUTCOMES,
  questions: [
    {
      id: 'australia',
      prompt: L('¿Cuál es la capital de Australia?'),
      options: [L('Sídney'), L('Melbourne'), L('Canberra'), L('Brisbane')],
      correct: 2,
      explanation: L('Canberra se eligió como capital en 1908 como punto intermedio entre Sídney y Melbourne.'),
    },
    {
      id: 'rio',
      prompt: L('¿Cuál es el río más caudaloso del mundo?'),
      options: [L('Nilo'), L('Misisipi'), L('Yangtsé'), L('Amazonas')],
      correct: 3,
      explanation: L('El Amazonas lleva más agua que cualquier otro río del planeta.'),
    },
    {
      id: 'pais-grande',
      prompt: L('¿Qué país tiene la mayor superficie del mundo?'),
      options: [L('Canadá'), L('China'), L('Rusia'), L('Estados Unidos')],
      correct: 2,
      explanation: L('Rusia es el país más extenso, con unos 17 millones de km².'),
    },
    {
      id: 'cordillera',
      prompt: L('¿Cuál es la cordillera continental más larga del mundo?'),
      options: [L('Himalaya'), L('Andes'), L('Alpes'), L('Montañas Rocosas')],
      correct: 1,
      explanation: L('Los Andes recorren unos 7.000 km a lo largo de Sudamérica.'),
    },
    {
      id: 'canada',
      prompt: L('¿Cuál es la capital de Canadá?'),
      options: [L('Toronto'), L('Ottawa'), L('Montreal'), L('Vancouver')],
      correct: 1,
      explanation: L('La capital es Ottawa, no Toronto, que es la ciudad más poblada.'),
    },
    {
      id: 'mediterraneo',
      prompt: L('¿Cuál de estos países NO tiene costa en el mar Mediterráneo?'),
      options: [L('Egipto'), L('Italia'), L('Portugal'), L('Grecia')],
      correct: 2,
      explanation: L('Portugal solo tiene costa en el océano Atlántico.'),
    },
    {
      id: 'sahara',
      prompt: L('¿En qué continente está el desierto del Sahara?'),
      options: [L('Asia'), L('África'), L('Oceanía'), L('América')],
      correct: 1,
      explanation: L('El Sahara ocupa el norte de África y es el mayor desierto cálido del mundo.'),
    },
    {
      id: 'brasil',
      prompt: L('¿Cuál es el país más poblado de Sudamérica?'),
      options: [L('Argentina'), L('Colombia'), L('Perú'), L('Brasil')],
      correct: 3,
      explanation: L('Brasil supera los 200 millones de habitantes, más que cualquier otro país sudamericano.'),
    },
  ],
};
