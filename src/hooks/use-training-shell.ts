'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAttemptActivity } from '@/hooks/use-attempt-activity';
import { useAttempt } from '@/hooks/use-attempt';
import { useKeyboardViewport } from '@/hooks/use-keyboard-viewport';
import { useTaskKeyboardNavigation } from '@/hooks/use-task-keyboard-navigation';
import { ROUTES } from '@/config/onboarding-steps';
import { itemAnswered, itemStatus } from '@/lib/attempt';
import { fetchSolution, revealSolution } from '@/lib/api/learning';
import type { Solution } from '@/lib/api/learning-types';
import { solutionInputKey } from '@/lib/task-content';
import { LEARNING_COPY as C } from '@/config/integration';
export function useTrainingShell(id: string) {
  const router = useRouter();
  const training = useAttempt(id);
  const attempt = training.attempt;
  const [cachedSolutions, setSolutions] = useState<
    Record<string, { value: Solution; inputKey: string }>
  >({});
  const [revealed, setRevealed] = useState<string[]>([]);
  const [revealError, setRevealError] = useState<string | null>(null);
  const [revealBusy, setRevealBusy] = useState(false);
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
  const solutions = Object.fromEntries(
    (attempt?.items ?? []).flatMap((item) => {
      const cached = cachedSolutions[item.id];
      return !training.unsaved && !training.busy && cached?.inputKey === solutionInputKey(item)
        ? [[item.id, cached.value]]
        : [];
    }),
  );
  const visibleRevealed = revealed.filter((id) => Boolean(solutions[id]));
  const toggleSolution = async (itemId: string) => {
    if (!attempt) return;
    setRevealError(null);
    if (visibleRevealed.includes(itemId)) {
      setRevealed((items) => items.filter((id) => id !== itemId));
      return;
    }
    setRevealBusy(true);
    try {
      const saved = await training.save();
      const item = saved?.items.find((item) => item.id === itemId);
      if (!saved || !item) return;
      const unsupported = item.task.part === 2 && item.task.gradingCapability === 'unsupported';
      const solution = unsupported
        ? await revealSolution(
            saved.id,
            itemId,
            item.answerRevision,
            item.submission?.id ?? null,
            item.submission?.revision ?? null,
          )
        : await fetchSolution(saved.id, itemId);
      setSolutions((current) => ({
        ...current,
        [itemId]: { value: solution, inputKey: solutionInputKey(item) },
      }));
      setRevealed((items) => [...items.filter((id) => id !== itemId), itemId]);
    } catch (cause) {
      setRevealError(cause instanceof Error ? cause.message : C.loadError);
    } finally {
      setRevealBusy(false);
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
    revealed: visibleRevealed,
    busy: training.busy || revealBusy,
    editingBusy: training.editingBusy || revealBusy,
    revealBusy,
    revealError,
    toggleSolution,
    exit,
  };
}
