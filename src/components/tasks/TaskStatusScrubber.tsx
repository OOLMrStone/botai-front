'use client';

import { CheckCheck } from 'lucide-react';

import { layout } from '@/config/layout';
import { TASK_COPY, type TaskStatus } from '@/config/tasks';
import { useTaskScrubber } from '@/hooks/use-task-scrubber';
import { cn } from '@/lib/utils';

interface Props {
  taskIds: string[];
  answers: Record<string, string>;
  statuses: Record<string, TaskStatus>;
  currentIndex: number;
  reviewActive: boolean;
  onSelect: (index: number) => void;
  onReview: () => void;
}

export function TaskStatusScrubber({
  taskIds,
  answers,
  statuses,
  currentIndex,
  reviewActive,
  onSelect,
  onReview,
}: Props) {
  const {
    scrubberRef,
    precise,
    previewIndex,
    lensIndices,
    onKeyDown,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  } = useTaskScrubber({ taskCount: taskIds.length, currentIndex, onSelect });

  return (
    <div className={layout.training.scrubberFrame}>
      <div
        ref={scrubberRef}
        role="slider"
        aria-label={TASK_COPY.training.navigation}
        aria-valuemin={1}
        aria-valuemax={taskIds.length}
        aria-valuenow={currentIndex + 1}
        tabIndex={0}
        className={cn(layout.training.scrubberTrack, layout.focusRing)}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        {taskIds.map((id, index) => {
          const status = statuses[id] ?? 'unverified';
          const answered = Boolean(answers[id]?.trim());
          return (
            <span
              key={id}
              className={cn(
                layout.training.scrubberSegment,
                status === 'correct' && layout.training.segmentCorrect,
                status === 'incorrect' && layout.training.segmentIncorrect,
                status === 'unverified' && answered && layout.training.segmentAnswered,
                status === 'unverified' && !answered && layout.training.segmentEmpty,
                !reviewActive && currentIndex === index && layout.training.segmentCurrent,
              )}
            >
              {!reviewActive && currentIndex === index ? (
                <span className={layout.training.scrubberIndicator} />
              ) : null}
            </span>
          );
        })}
        {precise ? (
          <div className={layout.training.scrubberLens}>
            {lensIndices.map((index) => {
              const selected = index === previewIndex;
              const status = statuses[taskIds[index]] ?? 'unverified';

              return (
                <span
                  key={taskIds[index]}
                  className={cn(
                    layout.training.scrubberLensSegment,
                    layout.training.lensItem,
                    !selected && status === 'correct' && layout.training.lensItemCorrect,
                    !selected && status === 'incorrect' && layout.training.lensItemIncorrect,
                    selected && layout.training.lensItemActive,
                  )}
                >
                  {index + 1}
                </span>
              );
            })}
          </div>
        ) : null}
      </div>
      <button
        type="button"
        aria-label={TASK_COPY.review.title}
        className={cn(
          layout.training.reviewIndicator,
          layout.focusRing,
          reviewActive ? layout.training.reviewActive : layout.training.reviewInactive,
        )}
        onClick={onReview}
      >
        <CheckCheck className={layout.training.reviewIcon} />
      </button>
    </div>
  );
}
