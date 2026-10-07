'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ROUTES } from '@/config/onboarding-steps';
import { TASK_DIFFICULTY_SLIDER, TRAINING_SETUP } from '@/config/tasks';
import { useAsyncData } from '@/hooks/use-async-data';
import { useTrainingLaunch } from '@/hooks/use-training-launch';
import type { Task } from '@/lib/api/learning-types';
import { catalogResource, favoritesResource } from '@/lib/learning-resources';
import { favoriteTrainingBatch } from '@/lib/favorite-training';
import { useTasksStore } from '@/stores/tasks-store';

export function useTaskCatalog(tasks: Task[]) {
  const router = useRouter();
  const view = useTasksStore((state) => state.view);
  const setView = useTasksStore((state) => state.setView);
  const catalog = useAsyncData(catalogResource);
  const favorites = useAsyncData(favoritesResource);
  const launch = useTrainingLaunch();
  const [openingNumber, setOpeningNumber] = useState<number | null>(null);
  const numbers = (catalog.data?.numbers ?? [])
    .filter((item) => (view === 'part-1' ? item.part === 1 : item.part === 2))
    .map((number) => ({
      number,
      tasks: tasks.filter((task) => task.examNumber === number.examNumber),
    }));

  const openSetup = () => {
    useTasksStore.setState({
      setupExamNumber: null,
      setupSource: 'catalog',
      setupTaskIds: [],
    });
    router.push(ROUTES.trainingSetup);
  };
  const openNumber = async (examNumber: number) => {
    if (!catalog.data || launch.busy) return;

    setOpeningNumber(examNumber);
    await launch.start({
      formatId: catalog.data.format.id,
      selections: [{ examNumber, count: TRAINING_SETUP.quickStartCount }],
      difficultyPreference: TASK_DIFFICULTY_SLIDER.defaultValue,
      source: 'catalog',
    });
  };
  const openFavorites = async (selectedTasks: Task[]) => {
    if (!selectedTasks.length || !catalog.data) return;

    await launch.start({
      formatId: catalog.data.format.id,
      selections: [],
      source: 'favorites',
      taskIds: favoriteTrainingBatch(selectedTasks).tasks.map((task) => task.id),
    });
  };

  return {
    view,
    setView,
    numbers,
    favoriteTasks: favorites.data,
    openSetup,
    openNumber,
    openFavorites,
    catalog,
    favorites,
    openingNumber,
    busy: launch.busy,
    error: launch.error,
  };
}
