import type { TaskStatus } from '@/config/tasks';
import type { AttemptItem } from '@/lib/api/learning-types';
export function itemLocked(item: AttemptItem) {
  return Boolean(
    item.result?.isGraded ||
    ['queued', 'running', 'graded'].includes(item.submission?.status ?? ''),
  );
}
export function itemStatus(item: AttemptItem): TaskStatus {
  const result = item.result ?? item.submission?.result;
  if (!result?.isGraded || result.score === null) return 'unverified';
  if (result.score === result.maxScore) return 'correct';
  return result.score === 0 ? 'incorrect' : 'partial';
}
export function itemAnswered(item: AttemptItem) {
  return Boolean(item.answer?.trim() || item.submission?.images.length);
}
