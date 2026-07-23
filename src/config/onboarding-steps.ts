// Single source of truth для флоу онбординга + регистрации.
// Порядок шагов, слаги и тексты живут здесь — экраны читают отсюда.

import type { ComponentType } from 'react';

import {
  Clock,
  Coffee,
  Crown,
  Flame,
  Globe,
  Medal,
  MoreHorizontal,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  Star,
  Target,
  ThumbsUp,
  Users,
  Zap,
} from 'lucide-react';

import {
  InstagramIcon,
  TelegramIcon,
  TikTokIcon,
  YoutubeIcon,
} from '@/components/onboarding/brand-icons';
import { AGE_LIMITS, PASSWORD_MIN_LENGTH } from '@/lib/validation';

export type OnboardingSlug =
  | 'welcome'
  | 'intro'
  | 'source'
  | 'intro-questions'
  | 'goal'
  | 'goal-result'
  | 'level'
  | 'level-result'
  | 'daily-goal'
  | 'daily-goal-result'
  | 'building'
  | 'notifications'
  | 'thank-you'
  | 'commitment'
  | 'ready';

export type RegisterSlug = 'age' | 'name' | 'email' | 'password';

export const ONBOARDING_STEPS: OnboardingSlug[] = [
  'welcome',
  'intro',
  'source',
  'intro-questions',
  'goal',
  'goal-result',
  'level',
  'level-result',
  'daily-goal',
  'daily-goal-result',
  'building',
  'notifications',
  // 'thank-you' временно отключён - экран и тексты сохранены, вернуть строкой сюда.
  'commitment',
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

// Роуты вне нумерованных сегментов: развилки, отдельные экраны и раздел (app).
export const ROUTES = {
  login: '/login',
  lesson: '/lesson',
  streak: '/streak',
  saveProgress: '/register/save-progress',
  done: '/register/done',
  home: '/home',
  tasks: '/tasks',
  profile: '/profile',
  settings: '/settings',
} as const;

// --- Варианты вопросов -------------------------------------------------------

export interface Option {
  id: string;
  label: string;
  description?: string;
  icon: ComponentType<{ className?: string }>;
}

// Откуда узнали про нас - каналы под РФ. Иконки - бренд-лого + общие.
export const SOURCE_OPTIONS: Option[] = [
  { id: 'telegram', label: 'Telegram', icon: TelegramIcon },
  { id: 'tiktok', label: 'TikTok', icon: TikTokIcon },
  { id: 'instagram', label: 'Instagram', icon: InstagramIcon },
  { id: 'youtube', label: 'YouTube', icon: YoutubeIcon },
  { id: 'friends', label: 'Друзья', icon: Users },
  { id: 'web', label: 'Реклама на сайтах', icon: Globe },
  { id: 'other', label: 'Другое', icon: MoreHorizontal },
];

// В1 — цель по баллам ЕГЭ (когорты из SCOPE). Иконки — по возрастанию престижа.
export const GOAL_OPTIONS: Option[] = [
  { id: 'norm', label: 'Норм', description: '60-70 баллов', icon: Target },
  { id: 'good', label: 'Хороший', description: '70-80 баллов', icon: ThumbsUp },
  { id: 'good-plus', label: 'Джентльменский', description: '80-86 баллов', icon: Star },
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
    description: 'Джентльменский делаю',
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
    subtitle: 'Твой успех начинается здесь',
    primary: 'Начать',
    secondary: 'У меня уже есть аккаунт',
  },
  intro: {
    title: 'Привет! Я botai',
    subtitle: 'Помогу разобраться во всём, будем ботать вместе!',
    action: 'Дальше',
  },
  source: {
    title: 'Откуда узнал про нас?',
    subtitle: 'Интересно, как ты нас нашёл',
    action: 'Продолжить',
  },
  introQuestions: {
    title: 'Ответь всего на \n *три* вопроса',
    subtitle: 'Так я соберу курс именно под тебя',
    action: 'Поехали',
  },
  goal: {
    title: 'Какая цель по баллам?',
    subtitle: 'От неё зависит план подготовки',
    action: 'Продолжить',
  },
  goalResult: {
    title: 'Отлично!\nПо статистике с botai 84% достигают цели',
    action: 'Дальше',
  },
  building: {
    title: 'Строим курс…',
    subtitle: 'Подбираем темы и порядок под твою цель',
  },
  level: {
    title: 'Как у тебя сейчас с профматом?',
    subtitle: 'Ответь честно - подстроим сложность',
    action: 'Продолжить',
  },
  levelResultLow: {
    title: 'Начнём с нуля - это ок',
    subtitle: 'Разберём базу по полочкам, без спешки',
    action: 'Дальше',
  },
  levelResultMid: {
    title: 'База есть - подтянем до цели',
    subtitle: 'Закроем пробелы и уверенно возьмёмся за вторую часть',
    action: 'Дальше',
  },
  levelResultHigh: {
    title: 'Крутой уровень!',
    subtitle: 'Сразу дам задачи посложнее -\n будет интересно',
    action: 'Дальше',
  },
  dailyGoal: {
    title: 'Сколько занимаемся в день?',
    subtitle: 'Небольшая, но регулярная практика работает лучше всего',
    action: 'Продолжить',
  },
  dailyGoalResult: {
    title: '+5 баллов к пробникам через неделю',
    subtitle: 'Главное - ботать регулярно',
    action: 'Дальше',
  },
  notifications: {
    title: 'Напоминать о занятиях?',
    subtitle: 'Чтобы ты не забывал ботать!',
    primary: 'Напоминать мне',
    secondary: 'Не сейчас',
  },
  thankYou: {
    title: 'Спасибо за доверие',
    cardTitle: 'Твоя безопасность - наш приоритет',
    cardText: 'Мы гарантируем защиту\nлюбых твоих личных данных',
    action: 'Продолжить',
  },
  commitment: {
    title: 'Давай закрепим это официально',
    subtitle: 'Обещаю заниматься каждый день, чтобы сдать профиль на высокий балл',
    signHint: 'Распишись, чтобы закрепить',
    signedPrefix: 'Подписано',
    action: 'Продолжить',
  },
  ready: {
    title: 'Вот твой первый урок',
    subtitle: 'Всё готово. Начнём?',
    action: 'Окей',
  },
  lesson: {
    title: 'Урок будет здесь',
    subtitle: 'Первый урок - заглушка. Сам урок вне текущего этапа',
    action: 'Завершить урок',
  },
  streak: {
    unit: 'день в ударе',
    hint: 'Занимайся каждый день и поддерживай пламя знаний',
    action: 'Продолжить',
  },
  login: {
    title: 'С возвращением',
    subtitle: 'Войди, чтобы продолжить подготовку',
    action: 'Войти',
    forgot: 'Забыли пароль?',
    noAccount: 'Ещё нет аккаунта? Начать',
    badCredentials: 'Неверная почта или пароль',
    error: 'Не получилось войти. Попробуй ещё раз',
  },
  // --- Раздел (app): нижняя навигация + хаб + задачи + профиль ---
  nav: {
    home: 'Главная',
    tasks: 'Задачи',
    profile: 'Профиль',
  },
  home: {
    greeting: 'Привет',
    tagline: 'Готов ботать сегодня?',
    streakUnit: 'дней в ударе',
    xpUnit: 'XP',
    dailyGoalTitle: 'Цель дня',
    dailyGoalUnit: 'мин',
    dailyGoalDone: 'Цель дня выполнена - красавчик!',
    continueTitle: 'Продолжить урок',
    continueSubtitle: 'Первый урок уже ждёт',
    continueAction: 'Поехали',
    dailyTaskTitle: 'Задача дня',
    dailyTaskReveal: 'Показать ответ',
    dailyTaskAnswerPrefix: 'Ответ',
    aiReviewTitle: 'Разбор с ИИ',
    aiReviewSubtitle: 'Объясняю решение любой задачи по шагам',
    aiReviewOn: 'Включён - спроси прямо в уроке',
  },
  // Тарифы: подпись гейта и карточка тарифа в профиле.
  plan: {
    locked: 'Доступно в Pro',
    cardTitle: 'Твой тариф',
  },
  tasks: {
    title: 'Задачи',
    subtitle: 'Скоро здесь появятся задачи по всем темам профиля\nСобираем - загляни попозже',
  },
  profile: {
    loading: 'Проверяем сессию…',
    settingsRow: 'Настройки',
    overviewTitle: 'Обзор',
    overviewStreak: 'Стрик',
    overviewXp: 'Опыт',
    overviewGoal: 'Цель',
    overviewDailyGoal: 'Цель дня',
    streakWeekTitle: 'Неделя в ударе',
    goalTitle: 'Твоя цель',
    nameTitle: 'Как тебя называть',
    namePlaceholder: 'Твоё имя',
    dailyGoalTitle: 'Цель дня',
    dailyGoalUnit: 'мин',
    streakUnit: 'дней',
    toLesson: 'К обучению',
    logout: 'Выйти',
  },
  settings: {
    title: 'Настройки',
    save: 'Сохранить',
    back: 'Назад',
  },
  // Ошибки запросов - один источник для всех экранов (плашка ErrorNote).
  errors: {
    retry: 'Повторить',
    stats: 'Не удалось загрузить данные',
    save: 'Не получилось сохранить. Попробуй ещё раз',
    logout: 'Не получилось выйти. Попробуй ещё раз',
    plan: 'Не получилось сменить тариф',
  },
  // Тексты ошибок валидации - один источник для всех полей регистрации.
  validation: {
    email: 'Неправильный адрес почты',
    password: `Пароль должен содержать не менее ${PASSWORD_MIN_LENGTH} символов`,
    age: `Возраст от ${AGE_LIMITS.min} до ${AGE_LIMITS.max} лет`,
    name: 'Заполни это поле',
  },
  register: {
    age: { title: 'Сколько тебе лет?', action: 'Продолжить' },
    name: { title: 'Как тебя зовут?', action: 'Продолжить' },
    email: { title: 'Твоя почта', action: 'Продолжить' },
    password: {
      title: 'Придумай пароль',
      action: 'Создать профиль',
      emailTaken: 'Эта почта уже занята. Попробуй войти',
      error: 'Не получилось создать профиль. Попробуй ещё раз',
    },
    saveProgress: {
      title: 'Сохрани свой прогресс',
      subtitle: 'Чтобы не потерять пройденное - создай профиль',
      emailCta: 'Зарегистрироваться по почте',
      loginCta: 'Уже есть аккаунт? Войти',
    },
    done: {
      title: 'Готово!',
      subtitle: 'Профиль создан, прогресс сохранён',
      action: 'К обучению',
    },
  },
} as const;
