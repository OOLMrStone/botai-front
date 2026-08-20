'use client';

import { X } from 'lucide-react';

import { TaskStatusScrubber } from '@/components/tasks/TaskStatusScrubber';
import { TrainingControls } from '@/components/tasks/TrainingControls';
import { TrainingExitDialog } from '@/components/tasks/TrainingExitDialog';
import { TrainingReview } from '@/components/tasks/TrainingReview';
import { TrainingTaskCard } from '@/components/tasks/TrainingTaskCard';
import { Button } from '@/components/ui/button';
import { layout } from '@/config/layout';
import { TASK_COPY, type TrainingTask } from '@/config/tasks';
import { useTrainingShell } from '@/hooks/use-training-shell';

export function TrainingShell({ tasks }: { tasks: TrainingTask[] }) {
  const training = useTrainingShell(tasks);
  const { session } = training;

  if (!session) return null;

  return (
    <div className={layout.training.shell}>
      <header className={layout.training.header}>
        <div className={layout.training.headerRow}>
          <Button
            variant="ghost"
            size="icon"
            className={layout.training.closeButton}
            aria-label={TASK_COPY.training.exit}
            onClick={training.exit}
          >
            <X className={layout.training.actionIcon} />
          </Button>
          <div className={layout.training.scrubber}>
            <TaskStatusScrubber
              taskIds={session.taskIds}
              answers={session.answers}
              statuses={session.statuses}
              currentIndex={Math.min(session.currentIndex, tasks.length - 1)}
              reviewActive={training.review}
              onSelect={training.setCurrentIndex}
              onReview={() => training.setCurrentIndex(training.reviewIndex)}
            />
          </div>
        </div>
      </header>

      <main className={layout.training.cardArea}>
        {training.review ? (
          <TrainingReview
            taskCount={session.taskIds.length}
            missing={training.missing}
            onSelect={training.setCurrentIndex}
          />
        ) : training.task ? (
          <TrainingTaskCard
            task={training.task}
            position={session.currentIndex + 1}
            status={training.status}
            solutionRevealed={session.revealedSolutions.includes(training.task.id)}
            onToggleSolution={() => training.task && training.toggleSolution(training.task.id)}
          />
        ) : null}
      </main>

      <footer className={layout.training.controls}>
        <TrainingControls
          session={session}
          taskId={training.task?.id}
          taskCount={tasks.length}
          review={training.review}
          reviewIndex={training.reviewIndex}
          status={training.status}
          unverified={training.unverified}
          allCorrect={training.allCorrect}
          onSelect={training.setCurrentIndex}
          onAnswer={training.setAnswer}
          onCheck={() => training.checkAnswers(tasks)}
          onContinue={training.continueTraining}
        />
      </footer>

      <TrainingExitDialog
        open={training.exitDialogOpen}
        onOpenChange={training.setExitDialogOpen}
        onFinish={(remove) => void training.finishFavoriteExit(remove)}
      />
    </div>
  );
}
