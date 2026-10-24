import type { TriviaQuiz } from '../../types/quiz';
import { L, STANDARD_OUTCOMES } from '../helpers';

export const cienciaCotidiana: TriviaQuiz = {
  kind: 'trivia',
  id: 'ciencia-cotidiana',
  category: 'science',
  accent: 'amber',
  emoji: '🔬',
  title: L('Ciencia de todos los días'),
  description: L('Química, cuerpo humano y espacio con preguntas que ya has oído alguna vez.'),
  minutes: 3,
  languages: ['es'],
  outcomes: STANDARD_OUTCOMES,
  questions: [
    {
      id: 'oro',
      prompt: L('¿Cuál es el símbolo químico del oro?'),
      options: [L('Ag'), L('Au'), L('Go'), L('Or')],
      correct: 1,
      explanation: L('Au viene del latín aurum. Ag es la plata.'),
    },
    {
      id: 'corazon',
      prompt: L('¿Qué órgano bombea la sangre por todo el cuerpo?'),
      options: [L('Hígado'), L('Pulmón'), L('Corazón'), L('Riñón')],
      correct: 2,
      explanation: L('El corazón impulsa la sangre a través de arterias y venas sin descanso.'),
    },
    {
      id: 'ebullicion',
      prompt: L('¿A qué temperatura hierve el agua a nivel del mar?'),
      options: [L('90 °C'), L('100 °C'), L('110 °C'), L('212 °C')],
      correct: 1,
      explanation: L('Hierve a 100 °C (212 °F). A más altitud, hierve a una temperatura menor.'),
    },
    {
      id: 'marte',
      prompt: L('¿Qué planeta se conoce como «el planeta rojo»?'),
      options: [L('Venus'), L('Júpiter'), L('Saturno'), L('Marte')],
      correct: 3,
      explanation: L('Su color rojizo se debe al óxido de hierro presente en su superficie.'),
    },
    {
      id: 'bateria',
      prompt: L('¿Qué tipo de energía almacena una batería?'),
      options: [L('Nuclear'), L('Química'), L('Cinética'), L('Gravitatoria')],
      correct: 1,
      explanation: L('Una batería guarda energía química y la convierte en energía eléctrica.'),
    },
    {
      id: 'luz',
      prompt: L('¿A qué velocidad aproximada viaja la luz en el vacío?'),
      options: [L('3.000 km/s'), L('30.000 km/s'), L('300.000 km/s'), L('3.000.000 km/s')],
      correct: 2,
      explanation: L('La luz recorre unos 299.792 km cada segundo en el vacío.'),
    },
  ],
};
