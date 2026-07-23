// Пост-логин статистика для хаба и профиля. Сейчас мок (мгновенный) - позже
// реальный GET с бэкенда (прогресс/стрик/XP хранятся на сервере, не в
// onboarding-store, который сбрасывается после регистрации). Кэш «на сессию»
// живёт в use-user-stats, чтобы не тянуть на каждом переходе.
export interface UserStats {
  streakDays: number;
  xp: number;
  dailyGoalMinutes: number;
  dailyProgressMinutes: number;
  goalId: string; // id из GOAL_OPTIONS
  levelId: string; // id из LEVEL_OPTIONS
}

export async function fetchUserStats(): Promise<UserStats> {
  // TODO: реальный запрос статистики пользователя с бэкенда.
  return {
    streakDays: 7,
    xp: 120,
    dailyGoalMinutes: 10,
    dailyProgressMinutes: 4,
    goalId: 'good-plus',
    levelId: 'middle',
  };
}
