'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { ErrorNote } from '@/components/common/ErrorNote';
import { TrainingShell } from '@/components/tasks/TrainingShell';
import { Skeleton } from '@/components/ui/skeleton';
import { layout } from '@/config/layout';
import { COPY, ROUTES } from '@/config/onboarding-steps';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useTasks } from '@/hooks/use-tasks';
import { resolveTrainingTasks } from '@/lib/task-training';
import { cn } from '@/lib/utils';
import { useTasksStore } from '@/stores/tasks-store';

export default function TrainingPage() {
  const router = useRouter();
  const status = useRequireAuth();
  const session = useTasksStore((state) => state.session);
  const finishSession = useTasksStore((state) => state.finishSession);
  const { tasks, failed, retry } = useTasks();
  const sessionTasks = session && tasks ? resolveTrainingTasks(session.taskIds, tasks) : null;

  useEffect(() => {
    if (status !== 'authenticated' || failed || !tasks) return;
    if (session && sessionTasks) return;

    if (session) finishSession();
    router.replace(ROUTES.tasks);
  }, [failed, finishSession, router, session, sessionTasks, status, tasks]);

  if (status !== 'authenticated') return null;
  if (failed) {
    return (
      <main className={layout.training.shell}>
        <div className={layout.training.cardArea}>
          <ErrorNote message={COPY.errors.tasks} onRetry={retry} />
        </div>
      </main>
    );
  }
  if (!tasks) {
    return (
      <main className={layout.training.shell}>
        <div className={layout.training.cardArea}>
          <Skeleton className={cn(layout.training.card, layout.training.taskCard)} />
        </div>
      </main>
    );
  }
  if (!session || !sessionTasks) return null;

  return <TrainingShell tasks={sessionTasks} />;
}
