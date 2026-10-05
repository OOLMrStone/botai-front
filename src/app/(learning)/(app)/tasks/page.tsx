'use client';

import { useLayoutEffect, useRef } from 'react';

import { ErrorNote } from '@/components/common/ErrorNote';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { TaskCatalog } from '@/components/tasks/TaskCatalog';
import { Skeleton } from '@/components/ui/skeleton';
import { layout } from '@/config/layout';
import { COPY } from '@/config/onboarding-steps';
import { useTasks } from '@/hooks/use-tasks';
import { cn } from '@/lib/utils';
import { useTasksStore } from '@/stores/tasks-store';

export default function TasksPage() {
  const { tasks, failed, retry } = useTasks();
  const scrollRef = useRef<HTMLDivElement>(null);
  const restoredScroll = useRef(false);
  const scrollTop = useTasksStore((state) => state.catalogScrollTop);
  const setScrollTop = useTasksStore((state) => state.setCatalogScrollTop);

  useLayoutEffect(() => {
    if (!tasks || !scrollRef.current || restoredScroll.current) return;

    scrollRef.current.scrollTop = scrollTop;
    restoredScroll.current = true;
  }, [scrollTop, tasks]);

  return (
    <ScreenShell bottomNavigation className={layout.tasks.content}>
      <ScreenHeading variant="app" title={COPY.tasks.title} />
      <div
        ref={scrollRef}
        className={cn(layout.scroll, layout.tasks.catalogScroll)}
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      >
        {failed ? (
          <ErrorNote message={COPY.errors.tasks} onRetry={retry} />
        ) : tasks ? (
          <TaskCatalog tasks={tasks} />
        ) : (
          <div className={layout.tasks.grid}>
            {Array.from({ length: 8 }, (_, index) => (
              <Skeleton key={index} className={layout.tasks.skeleton} />
            ))}
          </div>
        )}
      </div>
    </ScreenShell>
  );
}
