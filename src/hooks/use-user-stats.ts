'use client';

import { useCallback, useEffect, useState } from 'react';

import { fetchUserStats, type UserStats } from '@/lib/api/stats';
import { useProfileStore } from '@/stores/profile-store';

// Кэш «на сессию»: базу тянем один раз, дальше отдаём из памяти - переключения
// вкладок мгновенные, без повторной загрузки и мигания. Сбрасывается на
// перезагрузке страницы. С реальным бэком здесь появится инвалидция / SWR.
let cache: UserStats | null = null;
let inflight: Promise<UserStats> | null = null;

function loadStats(): Promise<UserStats> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = fetchUserStats()
      .then((data) => {
        cache = data;
        return data;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export interface UserStatsState {
  // null - ещё грузится или запрос упал: экран показывает скелетон или плашку.
  stats: UserStats | null;
  failed: boolean;
  retry: () => void;
}

// Статистика для хаба, профиля и настроек. База - из кэша (мок); поверх
// накладываем правки пользователя из profile-store (цель, цель дня), чтобы
// экраны совпадали.
export function useUserStats(): UserStatsState {
  const [base, setBase] = useState<UserStats | null>(cache);
  const [failed, setFailed] = useState(false);
  const goalId = useProfileStore((s) => s.goalId);
  const dailyGoalMinutes = useProfileStore((s) => s.dailyGoalMinutes);

  useEffect(() => {
    if (base || failed) return;

    let alive = true;
    void loadStats().then(
      (data) => {
        if (alive) setBase(data);
      },
      () => {
        if (alive) setFailed(true);
      },
    );

    return () => {
      alive = false;
    };
  }, [base, failed]);

  const retry = useCallback(() => setFailed(false), []);

  const stats = base
    ? {
        ...base,
        goalId: goalId ?? base.goalId,
        dailyGoalMinutes: dailyGoalMinutes ?? base.dailyGoalMinutes,
      }
    : null;

  return { stats, failed, retry };
}
