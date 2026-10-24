import type { PersonalityOption, PersonalityQuiz } from '../../types/quiz';
import { L } from '../helpers';

const o = (es: string, en: string, profile: string): PersonalityOption => ({ text: L(es, en), points: { [profile]: 1 } });

export const oyenteMusical: PersonalityQuiz = {
  kind: 'personality',
  id: 'oyente-musical',
  category: 'music',
  accent: 'pink',
  emoji: '🎧',
  featured: true,
  title: L('¿Qué tipo de oyente eres?', 'What kind of listener are you?'),
  description: L(
    'Seis preguntas sobre cómo descubres, repites y vives la música.',
    'Six questions about how you discover, replay and live music.',
  ),
  minutes: 2,
  languages: ['es', 'en'],
  profiles: [
    {
      id: 'explorador',
      emoji: '🔭',
      title: L('Mente exploradora', 'Curious explorer'),
      description: L(
        'Siempre estás buscando el siguiente descubrimiento. Te gustan los artistas poco conocidos, las mezclas de géneros y compartir un hallazgo antes que nadie.',
        'You are always hunting for the next discovery. You like lesser-known artists, genre blends and sharing a find before anyone else.',
      ),
    },
    {
      id: 'nostalgico',
      emoji: '📼',
      title: L('Alma nostálgica', 'Nostalgic soul'),
      description: L(
        'Para ti la música es una máquina del tiempo. Tus canciones favoritas guardan recuerdos y vuelves a ellas una y otra vez.',
        'For you, music is a time machine. Your favorite songs hold memories and you come back to them again and again.',
      ),
    },
    {
      id: 'bailador',
      emoji: '🪩',
      title: L('Alma de pista', 'Dance-floor soul'),
      description: L(
        'Si el ritmo no te mueve, no es para ti. Disfrutas la música con energía y en compañía.',
        'If the beat does not move you, it is not for you. You enjoy music with energy and with other people.',
      ),
    },
    {
      id: 'calmado',
      emoji: '🌙',
      title: L('Oyente en calma', 'Calm listener'),
      description: L(
        'Usas la música para crear ambiente: concentrarte, desconectar o acompañar el momento. Valoras las listas que fluyen sin sobresaltos.',
        'You use music to set the mood: to focus, unwind or soundtrack the moment. You value playlists that flow without surprises.',
      ),
    },
  ],
  questions: [
    {
      id: 'descubrir',
      prompt: L('¿Cómo descubres música nueva?', 'How do you discover new music?'),
      options: [
        o('Escarbo en listas y artistas poco conocidos', 'I dig through lists and little-known artists', 'explorador'),
        o('Vuelvo a discos y canciones que ya conozco', 'I go back to albums and songs I already know', 'nostalgico'),
        o('Me entero por lo que suena en fiestas y con amigos', 'I pick it up from parties and friends', 'bailador'),
        o('Dejo que me recomienden playlists tranquilas', 'I let calm playlists recommend things to me', 'calmado'),
      ],
    },
    {
      id: 'momento',
      prompt: L('¿Cuándo escuchas más música?', 'When do you listen to the most music?'),
      options: [
        o('Mientras estudio o trabajo', 'While studying or working', 'calmado'),
        o('Antes de salir', 'Before heading out', 'bailador'),
        o('En un viaje largo', 'On a long trip', 'explorador'),
        o('Cuando miro fotos o recuerdos', 'When I look at old photos', 'nostalgico'),
      ],
    },
    {
      id: 'cancion',
      prompt: L('¿Qué buscas en una canción?', 'What do you look for in a song?'),
      options: [
        o('Un ritmo que me ponga a bailar', 'A beat that gets me dancing', 'bailador'),
        o('Un sonido que no haya oído antes', 'A sound I have never heard before', 'explorador'),
        o('Una atmósfera que me relaje', 'An atmosphere that relaxes me', 'calmado'),
        o('Una letra que me devuelva a otra época', 'Lyrics that take me back to another time', 'nostalgico'),
      ],
    },
    {
      id: 'concierto',
      prompt: L('¿Cuál sería tu concierto ideal?', 'What would your ideal concert be?'),
      options: [
        o('Clásicos que me sé de memoria', 'Classics I know by heart', 'nostalgico'),
        o('Una banda emergente que casi nadie conoce', 'An up-and-coming band hardly anyone knows', 'explorador'),
        o('Una sala pequeña e íntima, sentado', 'A small, intimate venue, seated', 'calmado'),
        o('Un lugar donde bailar toda la noche', 'A place to dance all night', 'bailador'),
      ],
    },
    {
      id: 'repetir',
      prompt: L('¿Con qué frecuencia repites una canción?', 'How often do you replay a song?'),
      options: [
        o('En bucle mientras me concentro', 'On a loop while I focus', 'calmado'),
        o('Casi nunca: prefiero seguir descubriendo', 'Almost never: I prefer to keep discovering', 'explorador'),
        o('Mis favoritas de siempre, muchas veces', 'My all-time favorites, many times', 'nostalgico'),
        o('Hasta aprenderme cada movimiento', 'Until I know every move', 'bailador'),
      ],
    },
    {
      id: 'lista',
      prompt: L('Tu lista de reproducción más larga es…', 'Your longest playlist is…'),
      options: [
        o('Una mezcla de géneros que nadie esperaría', 'A mix of genres nobody would expect', 'explorador'),
        o('Música instrumental o suave de fondo', 'Instrumental or soft background music', 'calmado'),
        o('La que anima cualquier reunión', 'The one that livens up any get-together', 'bailador'),
        o('Canciones de otra etapa de mi vida', 'Songs from another chapter of my life', 'nostalgico'),
      ],
    },
  ],
};
