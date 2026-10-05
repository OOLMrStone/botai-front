'use client';

import { ErrorNote } from '@/components/common/ErrorNote';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { TrainingSetupExperience } from '@/components/tasks/TrainingSetupExperience';
import { Skeleton } from '@/components/ui/skeleton';
import { layout } from '@/config/layout';
import { COPY } from '@/config/onboarding-steps';
import { SessionStatus } from '@/components/common/SessionStatus';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useTasks } from '@/hooks/use-tasks';

export default function TrainingSetupPage() {
  const { status, retry: retrySession } = useRequireAuth();
  const { tasks, failed, retry } = useTasks();

  if (status !== 'authenticated') return <SessionStatus status={status} retry={retrySession} />;
  if (tasks) return <TrainingSetupExperience tasks={tasks} />;

  return (
    <div className={layout.quiz.root}>
      <ScreenShell>
        {failed ? (
          <ErrorNote message={COPY.errors.tasks} onRetry={retry} />
        ) : (
          <Skeleton className={layout.tasks.skeleton} />
        )}
      </ScreenShell>
    </div>
  );
}
