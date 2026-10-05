import { apiFetch } from '@/lib/api/client';
import { fetchProfile } from '@/lib/api/profile';
export interface Stats {
  xp: number;
  streakDays: number;
  dailyGoalMinutes: number;
  dailyProgressMinutes: number;
  date: string;
  timeZone: string;
  week: { date: string; qualified: boolean; minutes: number }[];
  resumeAttempt: string | null;
}
export interface UserStats extends Stats {
  totalStudyMinutes: number;
  goalId: string;
  levelId: string;
}
export async function fetchUserStats(): Promise<UserStats> {
  const [stats, profile] = await Promise.all([apiFetch<Stats>('/api/stats'), fetchProfile()]);
  return {
    ...stats,
    totalStudyMinutes: stats.week.reduce((minutes, day) => minutes + day.minutes, 0),
    goalId: profile.goalId ?? '',
    levelId: profile.levelId ?? '',
  };
}
export const sendActivity = (attemptId: string, seconds: number) =>
  apiFetch<Stats>('/api/activity-events', {
    json: { id: crypto.randomUUID(), attemptId, seconds },
  });
