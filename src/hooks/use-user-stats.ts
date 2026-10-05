'use client';

import { useAsyncData, type AsyncData } from '@/hooks/use-async-data';
import { fetchUserStats, type UserStats } from '@/lib/api/stats';
import { cachedResource } from '@/lib/cached-resource';
import { formatStudyHours } from '@/lib/study-time';
import { useProfileStore } from '@/stores/profile-store';

const statsResource = cachedResource(fetchUserStats);

export interface UserStatsState extends Omit<AsyncData<UserStats>, 'data'> {
  // null - ещё грузится или запрос упал: экран показывает скелетон или плашку.
  stats: (UserStats & { studyHours: string }) | null;
}

// Статистика для хаба, профиля и настроек. База - с бэкенда; поверх накладываем
// правки пользователя из profile-store (цель, цель дня), чтобы экраны совпадали.
export function useUserStats(): UserStatsState {
  const { data, failed, retry } = useAsyncData(statsResource);
  const goalId = useProfileStore((s) => s.goalId);
  const dailyGoalMinutes = useProfileStore((s) => s.dailyGoalMinutes);

  const stats = data
    ? {
        ...data,
        studyHours: formatStudyHours(data.totalStudyMinutes),
        goalId: goalId ?? data.goalId,
        dailyGoalMinutes: dailyGoalMinutes ?? data.dailyGoalMinutes,
      }
    : null;

  return { stats, failed, retry };
}
