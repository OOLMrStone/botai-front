'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAsyncData } from '@/hooks/use-async-data';
import { INTEGRATION, LEARNING_COPY as C, LEARNING_ROUTES } from '@/config/integration';
import { ROUTES } from '@/config/onboarding-steps';
import { ALL_TASK_TOPICS, TASK_DIFFICULTY_SLIDER } from '@/config/tasks';
import type { Difficulty } from '@/config/tasks';
import type { Task, TrainingSelection } from '@/lib/api/learning-types';
import { createTraining } from '@/lib/api/learning';
import { catalogResource, invalidateAttempts } from '@/lib/learning-resources';
import { useTasksStore } from '@/stores/tasks-store';
export function useTrainingSetupPage(tasks: Task[]) {
  const router = useRouter();
  const catalog = useAsyncData(catalogResource);
  const initialNumber = useTasksStore((state) => state.setupExamNumber);
  const [selections, setSelections] = useState<TrainingSelection[]>(
    initialNumber ? [{ examNumber: initialNumber, count: 1 }] : [],
  );
  const [difficultyLevel, setDifficultyLevel] = useState<number>(
    TASK_DIFFICULTY_SLIDER.defaultValue,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const difficulty: Difficulty | undefined =
    difficultyLevel === TASK_DIFFICULTY_SLIDER.min
      ? 'easy'
      : difficultyLevel === TASK_DIFFICULTY_SLIDER.max
        ? 'hard'
        : undefined;
  const toggle = (number: number) =>
    setSelections((current) =>
      current.some((s) => s.examNumber === number)
        ? current.filter((s) => s.examNumber !== number)
        : [...current, { examNumber: number, count: 1 }],
    );
  const update = (number: number, patch: Partial<TrainingSelection>) =>
    setSelections((current) =>
      current.map((s) => (s.examNumber === number ? { ...s, ...patch } : s)),
    );
  const available = (selection: TrainingSelection) =>
    tasks.filter(
      (task) =>
        task.examNumber === selection.examNumber &&
        (!difficulty || task.difficulty === difficulty) &&
        (!selection.topicIds?.length ||
          selection.topicIds.some((id) => task.topicIds.includes(id))),
    ).length;
  const total = selections.reduce((n, s) => n + s.count, 0);
  const shortage = selections.some((s) => s.count > available(s));
  const canStart =
    Boolean(catalog.data) &&
    !busy &&
    !shortage &&
    total > 0 &&
    total <= INTEGRATION.maxTasks &&
    selections.every(
      (s) => Number.isInteger(s.count) && s.count >= 1 && s.count <= INTEGRATION.maxPerNumber,
    );
  const start = async () => {
    if (!canStart || !catalog.data) return;
    setBusy(true);
    setError(null);
    try {
      const attempt = await createTraining(
        { formatId: catalog.data.format.id, selections, difficulty, source: 'catalog' },
        crypto.randomUUID(),
      );
      invalidateAttempts();
      router.push(LEARNING_ROUTES.attempt(attempt.id));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : C.saveError);
      setBusy(false);
    }
  };
  return {
    catalog,
    selections,
    toggle,
    update,
    available,
    total,
    shortage,
    canStart,
    difficulty,
    difficultyLevel,
    setDifficultyLevel,
    busy,
    error,
    start,
    close: () => router.push(ROUTES.tasks),
    allTopics: ALL_TASK_TOPICS,
  };
}
