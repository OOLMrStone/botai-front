'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { layout } from '@/config/layout';
import { ROUTES } from '@/config/onboarding-steps';
import { EXAM_NUMBERS, type TrainingSettings, type TrainingTask } from '@/config/tasks';
import { useCatalogReflow } from '@/hooks/use-catalog-reflow';
import { selectTrainingTasks } from '@/lib/task-training';
import { useTasksStore } from '@/stores/tasks-store';

import { ExamNumberCard } from './ExamNumberCard';
import { FavoritesGrid } from './FavoritesGrid';
import { TaskCatalogTabs } from './TaskCatalogTabs';
import { TrainingSetupSheet } from './TrainingSetupSheet';

interface SetupTarget {
  tasks: TrainingTask[];
  source: 'catalog' | 'favorites';
}

export function TaskCatalog({ tasks }: { tasks: TrainingTask[] }) {
  const router = useRouter();
  const { gridRef, runReflow } = useCatalogReflow();
  const pendingSetup = useTasksStore.getState();
  const [target, setTarget] = useState<SetupTarget | null>(() =>
    pendingSetup.setupRequested
      ? {
          tasks: pendingSetup.setupTaskIds.flatMap((id) => tasks.filter((task) => task.id === id)),
          source: pendingSetup.setupSource,
        }
      : null,
  );
  const view = useTasksStore((state) => state.view);
  const expandedNumber = useTasksStore((state) => state.expandedNumber);
  const favorites = useTasksStore((state) => state.favorites);
  const history = useTasksStore((state) => state.history);
  const settings = useTasksStore((state) => state.settings);
  const setupRequested = useTasksStore((state) => state.setupRequested);
  const setView = useTasksStore((state) => state.setView);
  const toggleNumber = useTasksStore((state) => state.toggleNumber);
  const setSettings = useTasksStore((state) => state.setSettings);
  const startSession = useTasksStore((state) => state.startSession);
  const consumeSetupRequest = useTasksStore((state) => state.consumeSetupRequest);

  useEffect(() => {
    if (!setupRequested) return;
    consumeSetupRequest();
  }, [consumeSetupRequest, setupRequested]);

  const start = (nextSettings: TrainingSettings) => {
    if (!target) return;
    const selected = selectTrainingTasks({
      tasks: target.tasks,
      difficulties: nextSettings.difficulties,
      count: nextSettings.count,
      history,
    });
    if (!selected.length) return;
    setSettings(nextSettings);
    startSession(selected, target.source);
    router.push(ROUTES.training);
  };

  const openTarget = (nextTarget: SetupTarget) => {
    if (nextTarget.source === 'favorites' && nextTarget.tasks.length <= 5) {
      startSession(nextTarget.tasks, 'favorites');
      router.push(ROUTES.training);
      return;
    }
    setTarget(nextTarget);
  };

  const visibleNumbers = EXAM_NUMBERS.filter((item) =>
    view === 'part-1' ? item.part === 1 : item.part === 2,
  );
  const favoriteTasks = favorites.flatMap((id) => tasks.filter((task) => task.id === id));

  return (
    <>
      <div className={layout.tasks.catalogStack}>
        <TaskCatalogTabs view={view} onChange={setView} />

        {view === 'favorites' ? (
          <FavoritesGrid
            tasks={favoriteTasks}
            onOpenAll={() => openTarget({ tasks: favoriteTasks, source: 'favorites' })}
            onOpenTask={(task) => {
              startSession([task], 'favorites');
              router.push(ROUTES.training);
            }}
          />
        ) : (
          <div ref={gridRef} className={layout.tasks.grid}>
            {visibleNumbers.map((number) => {
              const numberTasks = tasks.filter((task) => task.examNumber === number.number);
              return (
                <ExamNumberCard
                  key={number.number}
                  number={number}
                  tasks={numberTasks}
                  expanded={expandedNumber === number.number}
                  history={history}
                  onToggle={() => runReflow(() => toggleNumber(number.number))}
                  onOpenTasks={(selectedTasks) =>
                    setTarget({ tasks: selectedTasks, source: 'catalog' })
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      {target ? (
        <TrainingSetupSheet
          tasks={target.tasks}
          initial={settings}
          onClose={() => setTarget(null)}
          onStart={start}
        />
      ) : null}
    </>
  );
}
