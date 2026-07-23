import { TIMINGS } from '@/config/constants';
import { sleep } from '@/lib/api/client';

export interface ProfileSettingsPayload {
  name: string | null;
  goalId: string;
  dailyGoalMinutes: number;
}

// Сохранение базовых настроек профиля. Сейчас мок - позже PATCH на бэкенд
// (обращение, цель по ЕГЭ, цель дня хранятся на сервере).
export async function updateProfileSettings(
  _payload: ProfileSettingsPayload,
): Promise<{ ok: true }> {
  await sleep(TIMINGS.mockLatencyMs);

  // TODO: реальный PATCH настроек профиля на бэкенд.
  return { ok: true };
}
