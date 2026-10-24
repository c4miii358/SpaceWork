import type { TriviaQuiz } from '../../types/quiz';
import { L, N, STANDARD_OUTCOMES } from '../helpers';

export const culturaGeneral: TriviaQuiz = {
  kind: 'trivia',
  id: 'cultura-general-expres',
  category: 'culture',
  accent: 'violet',
  emoji: '🧠',
  featured: true,
  title: L('Cultura general exprés', 'Quick general knowledge'),
  description: L(
    'Ocho preguntas rápidas de arte, ciencia, historia y literatura.',
    'Eight quick questions on art, science, history and literature.',
  ),
  minutes: 3,
  languages: ['es', 'en'],
  outcomes: STANDARD_OUTCOMES,
  questions: [
    {
      id: 'oceano',
      prompt: L('¿Cuál es el océano más grande del planeta?', 'Which is the largest ocean on Earth?'),
      options: [L('Atlántico', 'Atlantic'), L('Índico', 'Indian'), L('Pacífico', 'Pacific'), L('Ártico', 'Arctic')],
      correct: 2,
      explanation: L(
        'El océano Pacífico cubre cerca de un tercio de la superficie terrestre.',
        'The Pacific Ocean covers about a third of the Earth’s surface.',
      ),
    },
    {
      id: 'noche-estrellada',
      prompt: L('¿Quién pintó «La noche estrellada»?', 'Who painted “The Starry Night”?'),
      options: [N('Claude Monet'), N('Vincent van Gogh'), N('Pablo Picasso'), N('Salvador Dalí')],
      correct: 1,
      explanation: L(
        'Van Gogh la pintó en 1889 mientras estaba en un sanatorio de Saint-Rémy-de-Provence.',
        'Van Gogh painted it in 1889 while staying at an asylum in Saint-Rémy-de-Provence.',
      ),
    },
    {
      id: 'huesos',
      prompt: L('¿Cuántos huesos tiene el cuerpo de un adulto?', 'How many bones does an adult human body have?'),
      options: [N('106'), N('206'), N('306'), N('406')],
      correct: 1,
      explanation: L(
        'Un adulto tiene 206 huesos. Los bebés nacen con más, porque varios se fusionan al crecer.',
        'An adult has 206 bones. Babies are born with more, since several fuse as they grow.',
      ),
    },
    {
      id: 'luna',
      prompt: L('¿En qué año llegaron los primeros humanos a la Luna?', 'In what year did humans first land on the Moon?'),
      options: [N('1959'), N('1965'), N('1969'), N('1972')],
      correct: 2,
      explanation: L(
        'La misión Apolo 11 llevó a Neil Armstrong y Buzz Aldrin a la superficie lunar el 20 de julio de 1969.',
        'Apollo 11 took Neil Armstrong and Buzz Aldrin to the lunar surface on July 20, 1969.',
      ),
    },
    {
      id: 'idioma',
      prompt: L(
        '¿Qué idioma tiene más hablantes nativos en el mundo?',
        'Which language has the most native speakers in the world?',
      ),
      options: [L('Inglés', 'English'), L('Español', 'Spanish'), L('Chino mandarín', 'Mandarin Chinese'), N('Hindi')],
      correct: 2,
      explanation: L(
        'El chino mandarín es el primero por hablantes nativos; el español ocupa el segundo lugar.',
        'Mandarin Chinese ranks first by native speakers; Spanish is second.',
      ),
    },
    {
      id: 'fotosintesis',
      prompt: L(
        '¿Qué gas absorben las plantas para hacer la fotosíntesis?',
        'Which gas do plants absorb to carry out photosynthesis?',
      ),
      options: [L('Oxígeno', 'Oxygen'), L('Dióxido de carbono', 'Carbon dioxide'), L('Nitrógeno', 'Nitrogen'), L('Hidrógeno', 'Hydrogen')],
      correct: 1,
      explanation: L(
        'Las plantas absorben dióxido de carbono (CO₂) y liberan oxígeno durante la fotosíntesis.',
        'Plants take in carbon dioxide (CO₂) and release oxygen during photosynthesis.',
      ),
    },
    {
      id: 'cien-anos',
      prompt: L('¿Quién escribió «Cien años de soledad»?', 'Who wrote “One Hundred Years of Solitude”?'),
      options: [N('Mario Vargas Llosa'), N('Julio Cortázar'), N('Gabriel García Márquez'), N('Isabel Allende')],
      correct: 2,
      explanation: L(
        'García Márquez publicó la novela en 1967 y recibió el Nobel de Literatura en 1982.',
        'García Márquez published the novel in 1967 and won the Nobel Prize in Literature in 1982.',
      ),
    },
    {
      id: 'mercurio',
      prompt: L('¿Cuál es el planeta más cercano al Sol?', 'Which planet is closest to the Sun?'),
      options: [N('Venus'), L('Marte', 'Mars'), L('Mercurio', 'Mercury'), L('Júpiter', 'Jupiter')],
      correct: 2,
      explanation: L(
        'Mercurio es el más cercano al Sol y también el más pequeño del sistema solar.',
        'Mercury is the closest planet to the Sun and also the smallest in the solar system.',
      ),
    },
  ],
};
