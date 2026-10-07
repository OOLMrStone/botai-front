'use client';

import { useState } from 'react';

import {
  STOREFRONT_PERIODS,
  STOREFRONT_PLANS,
  STOREFRONT_PRICE_FORMAT,
  type StorefrontPeriod,
} from '@/config/storefront-pricing';

const money = new Intl.NumberFormat(STOREFRONT_PRICE_FORMAT.locale, {
  style: 'currency',
  currency: STOREFRONT_PRICE_FORMAT.currency,
  maximumFractionDigits: 0,
});

export function useStorefrontPricing() {
  const [period, setPeriod] = useState<StorefrontPeriod>(STOREFRONT_PERIODS[0].id);
  const plans = STOREFRONT_PLANS.map((plan) => ({
    ...plan,
    price: money.format(plan[period]),
    quota: period === 'season' ? plan.seasonQuota : plan.quota,
  }));
  return { period, setPeriod, plans };
}
