// Данные для тестирования приложения. Одно место и для мок-бэкенда (он заводит
// этот аккаунт), и для dev-панели (она им логинится).

import {
  ONBOARDING_STEPS,
  onboardingPath,
  REGISTER_STEPS,
  registerPath,
  ROUTES,
} from '@/config/onboarding-steps';

export const DEMO_ACCOUNT = {
  email: 'test@botai.ru',
  password: 'password123',
  displayName: 'Тест Тестов',
} as const;

// Тексты dev-панели. Живут отдельно от COPY: это инструмент разработчика,
// а не интерфейс продукта - в проде их не существует.
export const DEV_COPY = {
  title: 'Dev-панель',
  open: 'Открыть dev-панель',
  close: 'Закрыть',
  envTitle: 'Сборка',
  apiMock: 'мок-бэкенд',
  apiReal: 'реальный бэкенд',
  accountTitle: 'Аккаунт',
  accountAnonymous: 'сессии нет',
  login: 'Войти тестовым',
  logout: 'Выйти',
  planTitle: 'Тариф',
  screensTitle: 'Экраны',
  resetTitle: 'Состояние',
  resetAction: 'Сбросить онбординг и профиль',
  resetDone: 'Сброшено',
  loginDone: 'Вошли тестовым аккаунтом',
  logoutDone: 'Сессия закрыта',
  planDone: 'Тариф переключён',
  actionFailed: 'Не получилось - смотри консоль',
} as const;

export interface DevScreen {
  label: string;
  href: string;
}

// Список экранов для быстрых прыжков. Выводится из тех же конфигов, что и сам
// флоу, - новый шаг появляется здесь сам.
export const DEV_SCREENS: DevScreen[] = [
  ...ONBOARDING_STEPS.map((slug) => ({ label: slug, href: onboardingPath(slug) })),
  ...REGISTER_STEPS.map((slug) => ({ label: slug, href: registerPath(slug) })),
  ...Object.entries(ROUTES).map(([label, href]) => ({ label, href })),
];
