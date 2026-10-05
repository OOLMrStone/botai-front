'use client';
import { useRouter } from 'next/navigation';
import { useAsyncData } from '@/hooks/use-async-data';
import { ROUTES } from '@/config/onboarding-steps';
import { LEARNING_ROUTES } from '@/config/integration';
import type { Task } from '@/lib/api/learning-types';
import { createTraining } from '@/lib/api/learning';
import { catalogResource, favoritesResource, invalidateAttempts } from '@/lib/learning-resources';
import { useTasksStore } from '@/stores/tasks-store';
import { useState } from 'react';
export function useTaskCatalog(tasks: Task[]) {
  const router = useRouter();
  const view = useTasksStore((state) => state.view);
  const setView = useTasksStore((state) => state.setView);
  const catalog = useAsyncData(catalogResource);
  const favorites = useAsyncData(favoritesResource);
  const [error, setError] = useState<string | null>(null);
  const numbers = (catalog.data?.numbers ?? [])
    .filter((item) => (view === 'part-1' ? item.part === 1 : item.part === 2))
    .map((number) => ({
      number,
      tasks: tasks.filter((task) => task.examNumber === number.examNumber),
    }));
  const openNumber = (number?: number) => {
    useTasksStore.setState({
      setupExamNumber: number ?? null,
      setupSource: 'catalog',
      setupTaskIds: [],
    });
    router.push(ROUTES.trainingSetup);
  };
  const openFavorites = async (selectedTasks: Task[]) => {
    if (!selectedTasks.length) return;
    try {
      const attempt = await createTraining(
        {
          formatId: catalog.data!.format.id,
          selections: [],
          source: 'favorites',
          taskIds: selectedTasks.map((task) => task.id),
        },
        crypto.randomUUID(),
      );
      invalidateAttempts();
      router.push(LEARNING_ROUTES.attempt(attempt.id));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : null);
    }
  };
  return {
    view,
    setView,
    numbers,
    favoriteTasks: favorites.data,
    openNumber,
    openFavorites,
    catalog,
    favorites,
    error,
  };
}
