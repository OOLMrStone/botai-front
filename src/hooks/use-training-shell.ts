'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAttemptActivity } from '@/hooks/use-attempt-activity';
import { useAttempt } from '@/hooks/use-attempt';
import { useKeyboardViewport } from '@/hooks/use-keyboard-viewport';
import { useTaskKeyboardNavigation } from '@/hooks/use-task-keyboard-navigation';
import { ROUTES } from '@/config/onboarding-steps';
import { itemAnswered, itemStatus } from '@/lib/attempt';
import { fetchSolution } from '@/lib/api/learning';
import type { Solution } from '@/lib/api/learning-types';
import { LEARNING_COPY as C } from '@/config/integration';
export function useTrainingShell(id: string) {
  const router = useRouter();
  const training = useAttempt(id);
  const attempt = training.attempt;
  const [solutions, setSolutions] = useState<Record<string, Solution>>({});
  const [revealed, setRevealed] = useState<string[]>([]);
  const [revealError, setRevealError] = useState<string | null>(null);
  useAttemptActivity(id, Boolean(attempt));
  const currentIndex = attempt?.currentIndex ?? 0;
  const reviewIndex = attempt?.items.length ?? 0;
  useKeyboardViewport();
  useTaskKeyboardNavigation({
    currentIndex,
    lastIndex: reviewIndex,
    enabled: Boolean(attempt) && !training.busy,
    onSelect: (index) => {
      void training.select(index);
    },
  });
  const item = attempt?.items[currentIndex];
  const statuses = Object.fromEntries(
    (attempt?.items ?? []).map((item) => [item.id, itemStatus(item)]),
  );
  const answeredTaskIds = (attempt?.items ?? [])
    .filter((item) => itemAnswered({ ...item, answer: training.answers[item.id] ?? item.answer }))
    .map((item) => item.id);
  const missing = (attempt?.items ?? []).flatMap((item, index) =>
    answeredTaskIds.includes(item.id) ? [] : [index],
  );
  const toggleSolution = async (itemId: string) => {
    if (!attempt) return;
    setRevealError(null);
    if (revealed.includes(itemId)) {
      setRevealed((items) => items.filter((id) => id !== itemId));
      return;
    }
    try {
      const solution = solutions[itemId] ?? (await fetchSolution(attempt.id, itemId));
      setSolutions((current) => ({ ...current, [itemId]: solution }));
      setRevealed((items) => [...items, itemId]);
    } catch (cause) {
      setRevealError(cause instanceof Error ? cause.message : C.loadError);
    }
  };
  const exit = async () => {
    const saved = await training.save();
    if (saved) router.push(ROUTES.home);
  };
  return {
    ...training,
    item,
    currentIndex,
    reviewIndex,
    review: currentIndex === reviewIndex,
    statuses,
    answeredTaskIds,
    missing,
    solutions,
    revealed,
    revealError,
    toggleSolution,
    exit,
  };
}
