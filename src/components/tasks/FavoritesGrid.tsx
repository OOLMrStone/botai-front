import { Button } from '@/components/ui/button';
import { layout } from '@/config/layout';
import { TASK_COPY, type TrainingTask } from '@/config/tasks';
import { cn } from '@/lib/utils';

interface Props {
  tasks: TrainingTask[];
  onOpenAll: () => void;
  onOpenTask: (task: TrainingTask) => void;
}

export function FavoritesGrid({ tasks, onOpenAll, onOpenTask }: Props) {
  if (!tasks.length) return <p className={layout.tasks.empty}>{TASK_COPY.favorites.empty}</p>;

  return (
    <div className={layout.tasks.grid}>
      <Button
        variant="outline"
        className={cn(layout.tasks.favoriteAll, layout.tasks.card)}
        onClick={onOpenAll}
      >
        {TASK_COPY.favorites.all}
      </Button>
      {tasks.map((task) => (
        <Button
          key={task.id}
          variant="outline"
          className={cn(layout.tasks.favoriteCard, layout.tasks.card)}
          onClick={() => onOpenTask(task)}
        >
          <span className={layout.tasks.favoriteNumber}>
            {TASK_COPY.examNumberPrefix}
            {task.examNumber}
          </span>
          <span className={layout.tasks.favoriteId}>
            {TASK_COPY.idPrefix}
            {task.id}
          </span>
        </Button>
      ))}
    </div>
  );
}
