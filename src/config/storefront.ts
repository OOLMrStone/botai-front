import type { CSSProperties } from 'react';

import { BILLING_COPY, TRIAL_OFFER } from '@/config/storefront-pricing';
import { BRAND } from '@/config/brand';
import { LEGAL_OPERATOR } from '@/config/legal-operator';
import { LEGAL_COPY } from '@/config/legal';
import { onboardingPath, ROUTES } from '@/config/onboarding-steps';

const email = LEGAL_OPERATOR.email;

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
  features: { heroMascot: false, workflow: false, example: false, trial: TRIAL_OFFER.available },
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
  {
    label: 'Как это работает',
    href: `#${STOREFRONT.sections.workflow}`,
    enabled: STOREFRONT.features.workflow,
  },
  {
    label: 'Пример проверки',
    href: `#${STOREFRONT.sections.example}`,
    enabled: STOREFRONT.features.example,
  },
  { label: 'Тарифы', href: `#${STOREFRONT.sections.pricing}` },
  { label: 'Вопросы', href: `#${STOREFRONT.sections.questions}` },
  { label: LEGAL_COPY.title, href: ROUTES.legal },
].filter((item) => item.enabled !== false);

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
  trial: `${TRIAL_OFFER.days} дня бесплатно`,
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
  pricing: {
    eyebrow: 'Тарифы',
    title: 'Больше практики.\nМеньше непонятных ошибок',
    description: 'Выбери количество проверок под свой темп подготовки',
    free: 'Практика и готовые решения - бесплатно',
    trial: `${TRIAL_OFFER.checks} бесплатные проверки за ${TRIAL_OFFER.days} дня`,
    trialStatus: 'Скоро',
    action: 'Купить',
    ...BILLING_COPY,
    recommendation: 'Рекомендуемый',
    details: 'Разбор решения по критериям ЕГЭ с объяснением ошибок',
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
    legal: LEGAL_OPERATOR.name,
    taxId: `ИНН ${LEGAL_OPERATOR.taxId}`,
  },
} as const;

export const STOREFRONT_THEME = {
  '--sf-paper': 'var(--palette-paper)',
  '--sf-warm': 'var(--palette-surface)',
  '--sf-ink': 'var(--palette-ink)',
  '--sf-muted': 'var(--palette-muted)',
  '--sf-orange': 'var(--palette-yellow)',
  '--sf-pale': 'var(--palette-pale)',
  colorScheme: 'light',
} as CSSProperties;
