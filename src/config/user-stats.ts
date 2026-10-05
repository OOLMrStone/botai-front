export const USER_STATS_MOCK = {
  streakDays: 7,
  totalStudyMinutes: 132,
  dailyGoalMinutes: 30,
  dailyProgressMinutes: 12,
  goalId: 'good-plus',
  levelId: 'middle',
} as const;

export const STUDY_TIME = {
  minutesPerHour: 60,
  hoursFormat: new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }),
} as const;
