'use client';

import { PLANS, type FeatureId, type Plan } from '@/config/plans';
import { hasFeature, normalizePlan } from '@/lib/plan';
import { useAuthStore } from '@/stores/auth-store';

// Тариф текущего пользователя. Истина - на бэкенде (приходит вместе с юзером),
// стор авторизации лишь кэширует её.
export function usePlan(): Plan {
  const plan = useAuthStore((s) => s.user?.plan);
  return PLANS[normalizePlan(plan)];
}

// Единственный способ гейтить платное в UI.
export function useHasFeature(feature: FeatureId): boolean {
  return hasFeature(usePlan().id, feature);
}
