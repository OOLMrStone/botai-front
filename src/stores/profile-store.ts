import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { normalizeDailyGoalMinutes } from '@/lib/daily-goal';

// Пользовательские переопределения базовых настроек профиля.
// null у поля - использовать значение с бэкенда (обращение - displayName,
// цель/цель дня - из stats). Правки редактируются в профиле и переживают
// перезагрузку (persist), пока бэкенд их не хранит.
interface ProfileState {
  name: string | null;
  goalId: string | null;
  dailyGoalMinutes: number | null;

  update: (patch: Partial<Pick<ProfileState, 'name' | 'goalId' | 'dailyGoalMinutes'>>) => void;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: null,
      goalId: null,
      dailyGoalMinutes: null,

      update: (patch) => set(patch),
      reset: () => set({ name: null, goalId: null, dailyGoalMinutes: null }),
    }),
    {
      name: 'botai-profile',
      version: 1,
      migrate: (persisted) => {
        const saved = persisted as Partial<ProfileState>;
        return {
          ...saved,
          dailyGoalMinutes:
            saved.dailyGoalMinutes === null || saved.dailyGoalMinutes === undefined
              ? null
              : normalizeDailyGoalMinutes(saved.dailyGoalMinutes),
        } as ProfileState;
      },
    },
  ),
);
