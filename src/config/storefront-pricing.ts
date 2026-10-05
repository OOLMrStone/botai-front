// Цены и лимиты перенесены из согласованного artifacts/paywall-study/app.js.
export const STOREFRONT_PLANS = [
  { id: 'basic', name: 'Базовый минимум', quota: 30, month: 299, season: 1499, recommended: false },
  {
    id: 'balanced',
    name: 'Золотая середина',
    quota: 70,
    month: 699,
    season: 2999,
    recommended: true,
  },
  {
    id: 'max',
    name: 'Роскошный максимум',
    quota: 110,
    month: 899,
    season: 3999,
    recommended: false,
  },
] as const;

export const STOREFRONT_PERIODS = [
  { id: 'month', label: 'Месяц' },
  { id: 'season', label: 'Сезон · 8 месяцев' },
] as const;
export type StorefrontPeriod = (typeof STOREFRONT_PERIODS)[number]['id'];
export const STOREFRONT_PRICE_FORMAT = { locale: 'ru-RU', currency: 'RUB' } as const;
