import { TIMINGS } from '@/config/constants';
import { sleep } from '@/lib/api/client';

export interface OnboardingPayload {
  goal: string | null;
  level: string | null;
  dailyGoalMinutes: number | null;
  notificationsEnabled: boolean;
}

export interface BuildCourseResult {
  courseId: string;
  topicsCount: number;
}

// Лоадер «Строим курс…» — держим courseBuildMs, затем авто-переход.
export async function buildCourse(_payload: OnboardingPayload): Promise<BuildCourseResult> {
  await sleep(TIMINGS.courseBuildMs);

  // TODO: реальный расчёт курса на бэкенде по ответам пользователя (_payload).
  return { courseId: 'mock-course', topicsCount: 24 };
}

export async function saveOnboarding(_payload: OnboardingPayload): Promise<{ ok: true }> {
  await sleep(TIMINGS.mockLatencyMs);

  // TODO: PATCH /onboarding — сохранить ответы онбординга.
  return { ok: true };
}
