// Single source of truth для флоу онбординга + регистрации.
// Порядок шагов, слаги и тексты живут здесь — экраны читают отсюда.

import {
  Clock,
  Coffee,
  Crown,
  Flame,
  type LucideIcon,
  Medal,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  Star,
  Target,
  ThumbsUp,
  Zap,
} from 'lucide-react';

export type OnboardingSlug =
  | 'welcome'
  | 'intro'
  | 'intro-questions'
  | 'goal'
  | 'goal-result'
  | 'building'
  | 'level'
  | 'level-result'
  | 'daily-goal'
  | 'daily-goal-result'
  | 'notifications'
  | 'ready';

export type RegisterSlug = 'age' | 'name' | 'email' | 'password';

export const ONBOARDING_STEPS: OnboardingSlug[] = [
  'welcome',
  'intro',
  'intro-questions',
  'goal',
  'goal-result',
  'building',
  'level',
  'level-result',
  'daily-goal',
  'daily-goal-result',
  'notifications',
  'ready',
];

export const REGISTER_STEPS: RegisterSlug[] = ['age', 'name', 'email', 'password'];

// Следующий шаг в последовательности (или null в конце сегмента).
function nextStep<T>(steps: readonly T[], current: T): T | null {
  const i = steps.indexOf(current);
  return i >= 0 && i < steps.length - 1 ? steps[i + 1] : null;
}

export const nextOnboardingSlug = (slug: OnboardingSlug) => nextStep(ONBOARDING_STEPS, slug);
export const nextRegisterSlug = (slug: RegisterSlug) => nextStep(REGISTER_STEPS, slug);

// Пути шагов выводим из слага - не хардкодим строками.
export const onboardingPath = (slug: OnboardingSlug) => `/onboarding/${slug}`;
export const registerPath = (slug: RegisterSlug) => `/register/${slug}`;

// Роуты вне нумерованных сегментов: развилки и отдельные экраны.
export const ROUTES = {
  login: '/login',
  lesson: '/lesson',
  streak: '/streak',
  saveProgress: '/register/save-progress',
  done: '/register/done',
} as const;

// --- Варианты вопросов -------------------------------------------------------

export interface Option {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
}

// В1 — цель по баллам ЕГЭ (когорты из SCOPE). Иконки — по возрастанию престижа.
export const GOAL_OPTIONS: Option[] = [
  { id: 'norm', label: 'Норм', description: '60-70 баллов', icon: Target },
  { id: 'good', label: 'Хороший', description: '70-80 баллов', icon: ThumbsUp },
  { id: 'good-plus', label: 'Джентельменский', description: '80-86 баллов', icon: Star },
  { id: 'excellent', label: 'Отличный', description: '86-94 балла', icon: Medal },
  { id: 'flawless', label: 'Безупречный', description: '94+ балла', icon: Crown },
];

// В2 — текущая готовность к профмату. Иконки — растущие сигнальные полоски.
export const LEVEL_OPTIONS: Option[] = [
  { id: 'zero', label: 'Начинаю с нуля', description: 'Профмат пока тёмный лес', icon: SignalZero },
  { id: 'basics', label: 'Знаю базу', description: 'Простые задачи решаю сам', icon: SignalLow },
  {
    id: 'middle',
    label: 'Средний уровень',
    description: 'Первая часть даётся',
    icon: SignalMedium,
  },
  {
    id: 'confident',
    label: 'Уверенно',
    description: 'Джентельменский делаю',
    icon: SignalHigh,
  },
  { id: 'strong', label: 'Сильный', description: 'Мне нужны только гробники', icon: Signal },
];

export type LevelBand = 'low' | 'mid' | 'high';

const LEVEL_BANDS: Record<string, LevelBand> = {
  zero: 'low',
  basics: 'mid',
  middle: 'mid',
  confident: 'high',
  strong: 'high',
};

export function levelBand(levelId: string): LevelBand {
  return LEVEL_BANDS[levelId] ?? 'mid';
}

// В3 — ежедневная цель.
export interface DailyGoalOption extends Option {
  minutes: number;
}

export const DAILY_GOAL_OPTIONS: DailyGoalOption[] = [
  { id: '5', minutes: 5, label: '5 минут', description: 'Чиловый старт', icon: Coffee },
  { id: '10', minutes: 10, label: '10 минут', description: 'Рекомендуем', icon: Clock },
  { id: '15', minutes: 15, label: '15 минут', description: 'Серьёзный настрой', icon: Flame },
  { id: '20', minutes: 20, label: '20 минут', description: 'Интенсив', icon: Zap },
];

// --- Тексты экранов ----------------------------------------------------------

export const COPY = {
  welcome: {
    title: 'botai',
    subtitle: 'здесь ты подготовишься к ЕГЭ по профмату.',
    primary: 'Начать',
    secondary: 'У меня уже есть аккаунт',
  },
  intro: {
    title: 'Привет! Я <имя>',
    subtitle: 'Помогу разобраться во всем, будем ботать вместе!',
    action: 'Дальше',
  },
  introQuestions: {
    lead: 'Ответь на',
    highlight: 'всего 3 вопроса',
    subtitle: 'Так я соберу курс именно под тебя.',
    action: 'Поехали',
  },
  goal: {
    title: 'Какая цель по баллам?',
    subtitle: 'От неё зависит план подготовки.',
    action: 'Продолжить',
  },
  goalResult: {
    title: 'Отлично! \n С botai 84% пользователей достигают цели',
    action: 'Дальше',
  },
  building: {
    title: 'Строим курс…',
    subtitle: 'Подбираем темы и порядок под твою цель.',
  },
  level: {
    title: 'Как у тебя сейчас с профматом?',
    subtitle: 'Ответь честно - подстроим сложность.',
    action: 'Продолжить',
  },
  levelResultLow: {
    title: 'Начнём с нуля - это ок',
    subtitle: 'Разберём базу по полочкам, без спешки.',
    action: 'Дальше',
  },
  levelResultMid: {
    title: 'База есть - подтянем до цели',
    subtitle: 'Закроем пробелы и уверенно возьмёмся за вторую часть.',
    action: 'Дальше',
  },
  levelResultHigh: {
    title: 'Крутой уровень!',
    subtitle: 'Сразу дам задачи посложнее - будет интересно.',
    action: 'Дальше',
  },
  dailyGoal: {
    title: 'Сколько занимаемся в день?',
    subtitle: 'Небольшая, но регулярная цель работает лучше всего.',
    action: 'Продолжить',
  },
  dailyGoalResult: {
    title: '+5 баллов к пробникам через неделю',
    subtitle: 'Главное - ботать регулярно.',
    action: 'Дальше',
  },
  notifications: {
    title: 'Напоминать о занятиях?',
    subtitle: 'Чтобы ты не забывал ботать!',
    primary: 'Напоминать мне',
    secondary: 'Не сейчас',
  },
  ready: {
    title: 'Вот твой первый урок',
    subtitle: 'Всё готово. Начнём?',
    action: 'Окей',
  },
  lesson: {
    title: 'Урок будет здесь',
    subtitle: 'Первый урок - заглушка. Сам урок вне текущего этапа.',
    action: 'Завершить урок',
  },
  streak: {
    unit: 'день в ударе',
    hint: 'Занимайся каждый день и поддерживай пламя знаний',
    action: 'Продолжить',
  },
  login: {
    title: 'С возвращением',
    subtitle: 'Войди, чтобы продолжить подготовку.',
    action: 'Войти',
    noAccount: 'Ещё нет аккаунта? Начать',
  },
  register: {
    age: { title: 'Сколько тебе лет?', action: 'Продолжить' },
    name: { title: 'Как тебя зовут?', action: 'Продолжить' },
    email: { title: 'Твоя почта', action: 'Продолжить' },
    password: { title: 'Придумай пароль', action: 'Создать профиль' },
    saveProgress: {
      title: 'Сохрани свой прогресс',
      subtitle: 'Чтобы не потерять пройденное - создай профиль.',
      emailCta: 'Зарегистрироваться по почте',
      loginCta: 'Уже есть аккаунт? Войти',
    },
    done: {
      title: 'Готово!',
      subtitle: 'Профиль создан, прогресс сохранён.',
      action: 'К обучению',
    },
  },
} as const;
