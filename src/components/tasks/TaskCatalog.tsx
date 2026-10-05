'use client';

import { layout } from '@/config/layout';
import type { Task } from '@/lib/api/learning-types';
import { LEARNING_COPY as C, LEARNING_ROUTES } from '@/config/integration';
import { Button } from '@/components/ui/button';
import { ErrorNote } from '@/components/common/ErrorNote';
import Link from 'next/link';
import { useTaskCatalog } from '@/hooks/use-task-catalog';

import { ExamNumberCard } from './ExamNumberCard';
import { FavoritesGrid } from './FavoritesGrid';
import { TaskCatalogTabs } from './TaskCatalogTabs';

export function TaskCatalog({ tasks }: { tasks: Task[] }) {
  const catalog = useTaskCatalog(tasks);

  return (
    <div className={layout.tasks.catalogStack}>
      <Button variant="outline" onClick={() => catalog.openNumber()}>
        {C.selection}
      </Button>
      <Link href={LEARNING_ROUTES.history} className={layout.typography.description}>
        {C.history}
      </Link>
      {catalog.catalog.failed ? (
        <ErrorNote message={C.loadError} onRetry={catalog.catalog.retry} />
      ) : null}
      {catalog.favorites.failed && catalog.view === 'favorites' ? (
        <ErrorNote message={C.loadError} onRetry={catalog.favorites.retry} />
      ) : null}
      {catalog.error ? <ErrorNote message={catalog.error} /> : null}
      <TaskCatalogTabs view={catalog.view} onChange={catalog.setView} />

      {catalog.view === 'favorites' ? (
        <FavoritesGrid
          tasks={catalog.favoriteTasks ?? []}
          onOpenAll={() => void catalog.openFavorites(catalog.favoriteTasks ?? [])}
          onOpenTask={(task) => void catalog.openFavorites([task])}
        />
      ) : (
        <div className={layout.tasks.grid}>
          {catalog.numbers.map(({ number, tasks: numberTasks }) => (
            <ExamNumberCard
              key={number.examNumber}
              number={number}
              tasks={numberTasks}
              onOpen={() => catalog.openNumber(number.examNumber)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
