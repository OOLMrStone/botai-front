import { Check, ChevronDown, ChevronUp } from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import { layout } from '@/config/layout';
import { EXAM_NUMBERS, TASK_COPY, type TaskHistoryStatus, type TrainingTask } from '@/config/tasks';
import { taskProgress } from '@/lib/task-training';
import { cn } from '@/lib/utils';

type ExamNumber = (typeof EXAM_NUMBERS)[number];

interface Props {
  number: ExamNumber;
  tasks: TrainingTask[];
  expanded: boolean;
  history: Record<string, TaskHistoryStatus>;
  onToggle: () => void;
  onOpenTasks: (tasks: TrainingTask[]) => void;
}

function ProgressMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className={layout.tasks.metric}>
      <span className={layout.tasks.metricHeader}>
        <span className={layout.tasks.metricLabel}>{label}</span>
        <span className={layout.tasks.metricValue}>{value}%</span>
      </span>
      <Progress value={value} className={layout.tasks.progress} />
    </div>
  );
}

export function ExamNumberCard({ number, tasks, expanded, history, onToggle, onOpenTasks }: Props) {
  const active = tasks.length > 0;
  const progress = taskProgress(tasks, history);

  return (
    <article
      data-exam-number={number.number}
      className={cn(layout.tasks.card, expanded ? layout.tasks.expanded : layout.tasks.compactCard)}
    >
      <div
        data-reflow-surface
        aria-hidden="true"
        className={cn(
          layout.tasks.cardSurface,
          active ? layout.tasks.activeCard : layout.tasks.disabledCard,
        )}
      />
      <div className={cn(layout.tasks.cardContent, !active && layout.tasks.disabledCardContent)}>
        <button
          type="button"
          disabled={!active}
          aria-expanded={expanded}
          className={cn(
            layout.tasks.numberHeader,
            expanded && layout.tasks.numberHeaderExpanded,
            layout.focusRing,
          )}
          onClick={onToggle}
        >
          <span className={layout.tasks.numberHeaderGrid}>
            <span data-reflow-shared="number" className={layout.tasks.numberLabel}>
              {TASK_COPY.examNumberPrefix}
              {number.number}
            </span>
            <span
              data-reflow-shared="title"
              className={cn(
                layout.tasks.numberHeadingTitle,
                expanded ? layout.tasks.numberTitleExpanded : layout.tasks.numberTitleCompact,
              )}
            >
              {number.title}
            </span>
            <span data-reflow-detail className={layout.tasks.numberHeaderMeta}>
              {!active ? null : expanded ? (
                <ChevronUp className={layout.tasks.icon} />
              ) : progress === 100 ? (
                <Check className={layout.tasks.icon} />
              ) : (
                <ChevronDown className={layout.tasks.icon} />
              )}
            </span>
            {active && !expanded ? (
              <>
                <span data-reflow-detail className={layout.tasks.compactMetricValue}>
                  {progress}%
                </span>
                <Progress
                  data-reflow-detail
                  value={progress}
                  className={layout.tasks.compactProgress}
                />
              </>
            ) : null}
            {!active ? <span className={layout.tasks.soon}>{TASK_COPY.soon}</span> : null}
          </span>
        </button>

        {expanded ? (
          <div data-reflow-detail className={layout.tasks.expandedContent}>
            <div className={layout.tasks.topicList}>
              <button
                type="button"
                className={cn(layout.tasks.topic, layout.focusRing)}
                onClick={() => onOpenTasks(tasks)}
              >
                <ProgressMetric label={TASK_COPY.allTasks} value={progress} />
              </button>
              {number.topics.map((topic) => {
                const topicTasks = tasks.filter((task) => task.topicIds.includes(topic.id));
                const topicProgress = taskProgress(topicTasks, history);
                return (
                  <button
                    key={topic.id}
                    type="button"
                    className={cn(layout.tasks.topic, layout.focusRing)}
                    onClick={() => onOpenTasks(topicTasks)}
                  >
                    <ProgressMetric label={topic.title} value={topicProgress} />
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
