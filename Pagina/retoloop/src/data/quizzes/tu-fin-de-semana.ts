import type { PersonalityOption, PersonalityQuiz } from '../../types/quiz';
import { L } from '../helpers';

const o = (es: string, profile: string): PersonalityOption => ({ text: L(es), points: { [profile]: 1 } });

export const tuFinDeSemana: PersonalityQuiz = {
  kind: 'personality',
  id: 'tu-fin-de-semana',
  category: 'fun',
  accent: 'violet',
  emoji: '🌤️',
  title: L('¿Cómo es tu fin de semana ideal?'),
  description: L('Cinco preguntas para descubrir qué plan te recarga las pilas.'),
  minutes: 2,
  languages: ['es'],
  profiles: [
    {
      id: 'aventurero',
      emoji: '🧭',
      title: L('Espíritu aventurero'),
      description: L('Un plan sin descubrir algo nuevo se te queda corto. Prefieres caminos, rutas y lugares que todavía no conoces.'),
    },
    {
      id: 'hogareno',
      emoji: '🛋️',
      title: L('Alma hogareña'),
      description: L('Tu energía vuelve con calma: manta, comida rica y tus pasatiempos favoritos. Sabes que descansar también es un plan.'),
    },
    {
      id: 'social',
      emoji: '🎉',
      title: L('Alma social'),
      description: L('Un plan es mejor con gente. Te recarga reír, conversar y juntar a todos en la misma mesa.'),
    },
    {
      id: 'creativo',
      emoji: '🎨',
      title: L('Mente creativa'),
      description: L('Los fines de semana son tu taller. Dibujar, escribir, montar o aprender algo con las manos es lo que más te llena.'),
    },
  ],
  questions: [
    {
      id: 'viernes',
      prompt: L('Es viernes por la tarde y no tienes planes. ¿Qué haces?'),
      options: [
        o('Busco una ruta o un sitio nuevo que visitar', 'aventurero'),
        o('Me acomodo con una manta y una serie', 'hogareno'),
        o('Escribo al grupo para armar un plan', 'social'),
        o('Aprovecho para dibujar, escribir o montar algo', 'creativo'),
      ],
    },
    {
      id: 'mochila',
      prompt: L('¿Qué llevarías en tu mochila de fin de semana?'),
      options: [
        o('Cuaderno, cámara o un instrumento', 'creativo'),
        o('Botella de agua y un mapa', 'aventurero'),
        o('Un libro y snacks', 'hogareno'),
        o('Cargador y ganas de quedar con gente', 'social'),
      ],
    },
    {
      id: 'domingo',
      prompt: L('Un domingo perfecto termina con…'),
      options: [
        o('Una mesa larga con amigos', 'social'),
        o('Un proyecto terminado, o casi', 'creativo'),
        o('Un atardecer en un mirador', 'aventurero'),
        o('Cena casera y sofá', 'hogareno'),
      ],
    },
    {
      id: 'energia',
      prompt: L('¿Qué te da más energía?'),
      options: [
        o('Silencio y comodidad', 'hogareno'),
        o('Moverme y descubrir', 'aventurero'),
        o('Crear algo propio', 'creativo'),
        o('Conversar y reír en grupo', 'social'),
      ],
    },
    {
      id: 'dia-extra',
      prompt: L('Si tuvieras un día libre extra, ¿qué harías?'),
      options: [
        o('Un viaje relámpago a un pueblo cercano', 'aventurero'),
        o('Una reunión improvisada con todos', 'social'),
        o('Una clase o taller para aprender un arte nuevo', 'creativo'),
        o('Una maratón de mis pasatiempos en casa', 'hogareno'),
      ],
    },
  ],
};
