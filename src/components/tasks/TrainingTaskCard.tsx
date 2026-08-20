import { Bookmark, Eraser, Pencil, ScanLine, Skull } from 'lucide-react';

import { TaskBlockRenderer } from '@/components/tasks/TaskBlockRenderer';
import { Button } from '@/components/ui/button';
import { layout } from '@/config/layout';
import { TASK_COPY, type TaskStatus, type TrainingTask } from '@/config/tasks';
import { useTaskFavorite } from '@/hooks/use-task-favorite';
import { cn } from '@/lib/utils';

interface TrainingTaskCardProps {
  task: TrainingTask;
  position: number;
  status: TaskStatus;
  solutionRevealed: boolean;
  onToggleSolution: () => void;
}

export function TrainingTaskCard({
  task,
  position,
  status,
  solutionRevealed,
  onToggleSolution,
}: TrainingTaskCardProps) {
  const favorite = useTaskFavorite(task.id);

  return (
    <article className={cn(layout.training.taskCard, layout.training.card)}>
      <div className={layout.training.cardHeader}>
        <h2 className={layout.training.cardTitle}>
          {TASK_COPY.training.task} {position}
        </h2>
        <div className={layout.training.actions}>
          {task.difficulty === 'hard' ? (
            <Skull aria-hidden="true" className={layout.training.actionIcon} />
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            className={layout.training.actionButton}
            aria-label={TASK_COPY.training.favorite}
            disabled={favorite.saving}
            onClick={() => void favorite.toggle()}
          >
            <Bookmark
              className={cn(layout.training.actionIcon, favorite.favorite && 'fill-current')}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={layout.training.actionButton}
            disabled
            aria-label={TASK_COPY.training.pencil}
          >
            <Pencil className={layout.training.actionIcon} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={layout.training.actionButton}
            disabled
            aria-label={TASK_COPY.training.eraser}
          >
            <Eraser className={layout.training.actionIcon} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={layout.training.actionButton}
            disabled
            aria-label={TASK_COPY.training.objectEraser}
          >
            <ScanLine className={layout.training.actionIcon} />
          </Button>
        </div>
      </div>
      <TaskBlockRenderer blocks={task.content} />
      {status !== 'unverified' ? (
        <Button
          variant="ghost"
          className={layout.training.solutionButton}
          onClick={onToggleSolution}
        >
          {TASK_COPY.training.solution}
        </Button>
      ) : null}
      {solutionRevealed ? (
        <div className={layout.training.solution}>
          <TaskBlockRenderer blocks={task.solution} />
        </div>
      ) : null}
    </article>
  );
}
