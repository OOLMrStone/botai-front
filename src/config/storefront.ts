import type { CSSProperties } from 'react';

import { BRAND } from '@/config/brand';
import { onboardingPath, ROUTES } from '@/config/onboarding-steps';

const email = 'botai.ege@gmail.com';

export const STOREFRONT = {
  metadata: {
    title: `${BRAND.name} - проверка решений ЕГЭ по математике`,
    description:
      'Проверка решений ЕГЭ по профильной математике: фотография работы, разбор ошибок и рекомендации',
  },
  home: ROUTES.storefront,
  start: onboardingPath('welcome'),
  login: ROUTES.login,
  account: ROUTES.home,
  email,
  mailto: `mailto:${email}`,
  contacts: [
    { label: '+7 985 202-64-97', href: 'tel:+79852026497' },
    { label: '@oolmrstone', href: 'https://t.me/oolmrstone' },
    { label: email, href: `mailto:${email}` },
  ],
  logo: { src: '/icons/site-192.png', width: 192, height: 192 },
  mascot: {
    src: '/storefront/lemur.webp',
    width: 960,
    height: 775,
    sizes: '(min-width: 1024px) 440px, 80vw',
  },
  sections: {
    workflow: 'how-it-works',
    example: 'example',
    pricing: 'pricing',
    questions: 'questions',
    contacts: 'contacts',
  },
  mobileMenu: 'storefront-menu',
  main: 'storefront-content',
} as const;

export const STOREFRONT_NAV = [
  { label: 'Как это работает', href: `#${STOREFRONT.sections.workflow}` },
  { label: 'Пример проверки', href: `#${STOREFRONT.sections.example}` },
  { label: 'Тарифы', href: `#${STOREFRONT.sections.pricing}` },
  { label: 'Вопросы', href: `#${STOREFRONT.sections.questions}` },
] as const;

export const STOREFRONT_COPY = {
  nav: 'Навигация по сайту',
  openMenu: 'Открыть меню',
  closeMenu: 'Закрыть меню',
  skip: 'К содержанию',
  home: `${BRAND.name} - на главную`,
  check: 'Проверить решение',
  login: 'Войти',
  continue: 'Продолжить подготовку',
  account: 'Мой кабинет',
  sessionError: 'Не удалось проверить вход. Можно повторить проверку или войти заново',
  trial: '3 дня бесплатно',
  trialDetails: 'Без карты и автопродления',
  hero: {
    eyebrow: 'ЕГЭ · Профильная математика',
    title: 'Проверка решений\nпо математике',
    description:
      'Сфотографируй решение. Получи разбор по критериям ЕГЭ: где допущена ошибка, за что теряются баллы и как это исправить',
    mascotAlt: `Лемур ${BRAND.mascotName}`,
    artLabel: 'От твоего решения к понятному разбору',
    artTitle: `Знакомься, ${BRAND.mascotName}`,
  },
  workflow: {
    eyebrow: 'Как это работает',
    title: 'Твоя работа.\nПонятный разбор',
    description: 'Покажем путь одного решения: от фотографии тетради до объяснения ошибки',
    placeholder: 'Здесь появится короткая демонстрация',
    note: 'Готовим наглядный рассказ о проверке',
    before: 'Твоё решение',
    after: 'Разбор по шагам',
  },
  example: {
    eyebrow: 'Пример проверки',
    title: 'Посмотри, что ты получишь',
    description: 'Одна работа целиком: исходное решение, замечания и рекомендации',
    placeholder: 'Пример разбора скоро появится здесь',
    note: 'Добавим настоящую работу с пояснениями к каждому замечанию',
    label: 'Пример готовится',
  },
  comparison: {
    eyebrow: 'Почему ботать с нами',
    title: 'Создан для проверки\nтвоих решений',
    description: 'Готовый сценарий для ЕГЭ: от фотографии тетради до разбора ошибок',
    scrollLabel:
      'Сравнение сервиса, нейросети и репетитора. Листай вправо, чтобы увидеть все варианты',
    scrollHint: 'Листай таблицу вправо →',
    headers: ['Что важно', BRAND.name, 'Нейросеть', 'Репетитор'],
    rows: [
      {
        label: 'Подготовка к проверке',
        values: [
          'Просто фото решения',
          'Фото и запрос с объяснением задачи',
          'Нужно найти преподавателя и договориться',
        ],
      },
      {
        label: 'Критерии ЕГЭ',
        values: [
          'В основе разбора',
          'Нужно задать в запросе',
          'Зависят от специализации преподавателя',
        ],
      },
      {
        label: 'Разбор ошибок',
        values: ['Замечания к шагам решения', 'Ответ в свободном диалоге', 'Обсуждение на занятии'],
      },
      {
        label: 'Практика после разбора',
        values: [
          'Задачи и готовые решения в одном месте',
          'Нужно попросить дополнительные задания',
          'По программе преподавателя',
        ],
      },
    ],
  },
  pricing: {
    eyebrow: 'Тарифы',
    title: 'Больше практики.\nМеньше непонятных ошибок',
    description: 'Выбери количество проверок под свой темп подготовки',
    free: 'Практика и готовые решения - бесплатно',
    action: 'Начать подготовку',
    periodLabel: 'Период оплаты',
    quota: 'проверок развёрнутых заданий в месяц',
    monthUnit: 'за месяц',
    seasonUnit: 'за 8 месяцев',
    seasonNote: 'Лимит проверок указан на каждый месяц сезона',
    recommendation: 'Для регулярной практики',
  },
  about: {
    eyebrow: 'Вопросы и ответы',
    title: 'Что важно знать',
    questions: [
      {
        question: 'Как отправить решение на проверку?',
        answer: 'Сфотографируй свою работу и загрузи снимок. Перепечатывать решение не нужно',
      },
      {
        question: 'Как лучше сфотографировать тетрадь?',
        answer:
          'Снимай при хорошем свете, держи камеру прямо над листом. В кадр должны попасть условие и все шаги решения, а текст и формулы должны быть чёткими',
      },
      {
        question: 'Что я получу после проверки?',
        answer:
          'Разбор по критериям ЕГЭ: замечания к шагам решения, объяснение ошибок и рекомендации, что исправить',
      },
      {
        question: 'Что доступно бесплатно?',
        answer:
          'Практика и готовые решения. Для проверки развёрнутых заданий выбери подходящий тариф',
      },
      {
        question: 'Можно попробовать бесплатно?',
        answer: 'Да, первые 3 дня бесплатны. Карта не нужна, автопродления нет',
      },
      {
        question: 'Какой тариф выбрать?',
        answer:
          'Ориентируйся на количество работ, которые хочешь проверять каждый месяц. Во всех тарифах один формат разбора, отличается лимит проверок',
      },
      {
        question: 'Остались вопросы?',
        answer: 'Напиши нам в Telegram или на почту. Контакты находятся внизу страницы',
      },
    ],
  },
  footer: {
    description: 'ЕГЭ по профильной математике',
    contactTitle: 'Контакты',
    legal: 'Самозанятый Слобожанов Василий Николаевич',
    taxId: 'ИНН 771701858219',
  },
} as const;

export const STOREFRONT_THEME = {
  '--sf-paper': '#faf9f6',
  '--sf-warm': '#f0efeb',
  '--sf-ink': '#242422',
  '--sf-muted': '#65655f',
  '--sf-orange': '#e8b931',
  '--sf-pale': '#f4f1e7',
  colorScheme: 'light',
} as CSSProperties;
