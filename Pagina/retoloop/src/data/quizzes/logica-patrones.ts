import type { TriviaQuiz } from '../../types/quiz';
import { L, N, STANDARD_OUTCOMES } from '../helpers';

export const logicaPatrones: TriviaQuiz = {
  kind: 'trivia',
  id: 'logica-patrones',
  category: 'logic',
  accent: 'lime',
  emoji: '🧩',
  featured: true,
  title: L('Lógica y patrones', 'Logic and patterns'),
  description: L(
    'Series numéricas, deducciones y un par de trampas para pensar dos veces.',
    'Number series, deductions and a couple of traps that make you think twice.',
  ),
  minutes: 4,
  languages: ['es', 'en'],
  outcomes: STANDARD_OUTCOMES,
  questions: [
    {
      id: 'dobles',
      prompt: L('¿Qué número sigue? 2, 4, 8, 16, …', 'What number comes next? 2, 4, 8, 16, …'),
      options: [N('24'), N('30'), N('32'), N('64')],
      correct: 2,
      explanation: L('Cada número es el doble del anterior: 16 × 2 = 32.', 'Each number is double the previous one: 16 × 2 = 32.'),
    },
    {
      id: 'fibonacci',
      prompt: L('¿Qué número sigue? 1, 1, 2, 3, 5, 8, …', 'What number comes next? 1, 1, 2, 3, 5, 8, …'),
      options: [N('11'), N('12'), N('13'), N('15')],
      correct: 2,
      explanation: L(
        'Es la serie de Fibonacci: cada número es la suma de los dos anteriores (5 + 8 = 13).',
        'This is the Fibonacci sequence: each number is the sum of the previous two (5 + 8 = 13).',
      ),
    },
    {
      id: 'gatos',
      prompt: L(
        'Todos los gatos son animales y algunos animales son negros. ¿Qué se puede afirmar con certeza?',
        'All cats are animals and some animals are black. What can be stated with certainty?',
      ),
      options: [
        L('Algunos gatos son negros', 'Some cats are black'),
        L('Todos los gatos son negros', 'All cats are black'),
        L('Todos los gatos son animales', 'All cats are animals'),
        L('Ningún animal es gato', 'No animal is a cat'),
      ],
      correct: 2,
      explanation: L(
        'La primera premisa lo dice directamente. De la segunda no se deduce nada sobre los gatos: los animales negros podrían no ser gatos.',
        'The first premise says it directly. The second tells us nothing about cats: the black animals might not be cats.',
      ),
    },
    {
      id: 'reloj',
      prompt: L(
        'Un reloj marca las 3:15. ¿Qué ángulo forman las manecillas?',
        'A clock reads 3:15. What angle do the hands form?',
      ),
      options: [N('0°'), L('7,5°', '7.5°'), N('15°'), N('90°')],
      correct: 1,
      explanation: L(
        'El minutero está en 90°, pero el horario ya avanzó un cuarto de hora desde el 3: 90° + 7,5° = 97,5°. La diferencia es 7,5°.',
        'The minute hand is at 90°, but the hour hand has moved a quarter of an hour past the 3: 90° + 7.5° = 97.5°. The difference is 7.5°.',
      ),
    },
    {
      id: 'manzanas',
      prompt: L(
        'Hay 3 manzanas sobre la mesa y tú te llevas 2. ¿Cuántas manzanas tienes tú?',
        'There are 3 apples on the table and you take 2. How many apples do you have?',
      ),
      options: [N('1'), N('2'), N('3'), N('5')],
      correct: 1,
      explanation: L(
        'Tienes las 2 que te llevaste; en la mesa queda 1.',
        'You have the 2 you took; 1 is left on the table.',
      ),
    },
    {
      id: 'cuadrados',
      prompt: L('¿Qué número sigue? 3, 6, 11, 18, 27, …', 'What number comes next? 3, 6, 11, 18, 27, …'),
      options: [N('36'), N('38'), N('40'), N('45')],
      correct: 1,
      explanation: L(
        'Las diferencias son 3, 5, 7 y 9 (impares consecutivos), así que la siguiente es 11: 27 + 11 = 38.',
        'The differences are 3, 5, 7 and 9 (consecutive odd numbers), so the next one is 11: 27 + 11 = 38.',
      ),
    },
  ],
};
