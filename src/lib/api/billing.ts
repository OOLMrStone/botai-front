import { IS_MOCK_API } from '@/config/env';
import { ApiError, apiFetch } from '@/lib/api/client';
import type { User } from '@/lib/api/auth';
import type { PlanId } from '@/config/plans';

// Смена тарифа. Сейчас бэкенд меняет его сразу (оплаты нет) - когда появятся
// платежи, здесь будет создание платёжной сессии, экраны не поменяются.
export async function changePlan(plan: PlanId): Promise<User> {
  if (!IS_MOCK_API) throw new ApiError(403, 'Изменение тарифа недоступно');
  return apiFetch<User>('/api/billing/plan', { json: { plan } });
}
