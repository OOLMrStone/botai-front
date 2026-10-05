import { STUDY_TIME } from '@/config/user-stats';

export function formatStudyHours(totalMinutes: number) {
  return STUDY_TIME.hoursFormat.format(totalMinutes / STUDY_TIME.minutesPerHour);
}
