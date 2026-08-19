export interface Event {
  id: string;
  date: string;
  scene: string;
  location: string;
  status: 'УТВЕРЖДЕНО' | 'ОЖИДАЕТ' | 'НЕ_ПРИЕМЛЕМО';
  notes: string;
  comments: Comment[];
  addedBy: 'NIK';  // ← ТОЛЬКО NIK
}

export interface Comment {
  id: string;
  author: 'NIK';  // ← ТОЛЬКО NIK
  text: string;
  timestamp: number;
}

export interface AppState {
  isUnlocked: boolean;
  events: Event[];
}

export const MENEGER_PHRASES = [
  "Эмм, нет",
  "It's f*cking shit don't working!",
  'Роберт Паттинсон уходит из кино',
] as const;

export const DEFAULT_EVENTS: Event[] = [
  {
    id: '1',
    date: '18.12.2026',
    scene: 'Дюна 3 🟠',
    location: 'Люксовый, престижный - IMAX 😎',
    status: 'УТВЕРЖДЕНО',
    notes: '✋😮🤚 Абсолют синема - сигма момент',
    comments: [],
    addedBy: 'NIK'
  },
  {
    id: '2',
    date: 'TBD',
    scene: 'Непокой',
    location: 'Абсурд-студия',
    status: 'ОЖИДАЕТ',
    notes: 'Абсурдистский анимационный триллер',
    comments: [],
    addedBy: 'NIK'
  }
];

export interface EasterEgg {
  id: string;
  message: string;
  signature: string;
  emoji: string;
  trigger: 'unlock' | 'firstEvent' | 'thirdComment' | 'allConfirmed';
  shown: boolean;
}

export const EASTER_EGGS: EasterEgg[] = [
  {
    id: 'unlock_1',
    message: '✨ ТЫ РАЗБЛОКИРОВАЛ АБСУРД ✨',
    signature: '— НЕПОКОЙ',
    emoji: '🌀',
    trigger: 'unlock',
    shown: false
  },
  {
    id: 'unlock_2',
    message: '🌌 ДОБРО ПОЖАЛОВАТЬ В БЕЗУМИЕ',
    signature: '— РЕЖИССЁР',
    emoji: '🎭',
    trigger: 'unlock',
    shown: false
  },
  {
    id: 'first_event_1',
    message: '🎬 ПЕРВАЯ СЦЕНА ЗАПЛАНИРОВАНА',
    signature: '— НАЧАЛО ПУТИ',
    emoji: '🎥',
    trigger: 'firstEvent',
    shown: false
  },
  {
    id: 'third_comment_1',
    message: '💬 ТРЕТИЙ КОММЕНТАРИЙ — МАГИЯ',
    signature: '— ТЫ НАШЁЛ СКРЫТЫЙ УРОВЕНЬ',
    emoji: '🔮',
    trigger: 'thirdComment',
    shown: false
  },
  {
    id: 'all_confirmed_1',
    message: '✅ ВСЕ СЦЕНЫ УТВЕРЖДЕНЫ',
    signature: '— ИДЕАЛЬНЫЙ СЦЕНАРИЙ',
    emoji: '🏆',
    trigger: 'allConfirmed',
    shown: false
  }
];

export const ONBOARDING_STEPS = [
  {
    target: '.add-button',
    title: 'ДОБАВИТЬ СЦЕНУ',
    content: 'Здесь можно запланировать новую встречу. Не забудь указать локацию!'
  },
  {
    target: '.status-select',
    title: 'СТАТУС',
    content: 'Меняй статус когда сцена подтверждена или отменена.'
  },
  {
    target: '.comment-section',
    title: 'ЗАМЕТКИ',
    content: 'Обсуждай детали сцены с командой.'
  },
  {
    target: '.add-AutoGenerate',
    title: 'АВТОГЕНЕРАЦИЯ',
    content: 'Нейронка. "в разработке"'
  }
];