'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import {
  MockExamAttachments,
  MockExamAttachmentStrip,
} from '@/components/mock-exams/MockExamAttachments';
import { AnswerInput } from '@/components/tasks/AnswerInput';
import { TaskStatusScrubber } from '@/components/tasks/TaskStatusScrubber';
import { TrainingReview } from '@/components/tasks/TrainingReview';
import { TrainingTaskCard } from '@/components/tasks/TrainingTaskCard';
import { Button } from '@/components/ui/button';
import { MOCK_EXAM_COPY, MOCK_EXAM_LAYOUT } from '@/config/mock-exams';
import { layout } from '@/config/layout';
import { TASK_ANSWER_INPUT_ID, type TaskStatus, type TrainingTask } from '@/config/tasks';
import { useMockExamTraining } from '@/hooks/use-mock-exam-training';
import { cn } from '@/lib/utils';

export function MockExamTrainingShell({
  examId,
  taskBank,
}: {
  examId: string;
  taskBank: TrainingTask[];
}) {
  const training = useMockExamTraining(examId, taskBank);
  const { exam, session, tasks, task, taskRef } = training;

  if (!exam || !session || !tasks) return null;

  const statuses = exam.tasks.reduce<Record<string, TaskStatus>>((current, { taskId }) => {
    current[taskId] = session.statuses?.[taskId] ?? 'unverified';
    return current;
  }, {});
  const missing = exam.tasks.flatMap((item, index) => {
    const filled =
      item.responseType === 'answer'
        ? Boolean(session.answers[item.taskId]?.trim())
        : Boolean(session.attachments[item.taskId]?.length);
    return filled ? [] : [index];
  });
  const isLast = training.currentIndex === tasks.length - 1;
  const attachmentNames = taskRef ? (session.attachments[taskRef.taskId] ?? []) : [];

  return (
    <div className={layout.training.shell}>
      <header className={layout.training.header}>
        <div className={layout.training.headerRow}>
          <Button
            variant="ghost"
            size="icon"
            className={layout.training.closeButton}
            aria-label={MOCK_EXAM_COPY.exit}
            onClick={training.exit}
          >
            <X className={layout.training.actionIcon} />
          </Button>
          <div className={layout.training.scrubber}>
            <TaskStatusScrubber
              taskIds={exam.tasks.map((item) => item.taskId)}
              answers={training.answers}
              statuses={statuses}
              currentIndex={training.currentIndex}
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
            taskCount={tasks.length}
            missing={missing}
            onSelect={training.setCurrentIndex}
          />
        ) : task && taskRef ? (
          <TrainingTaskCard
            task={task}
            favoriteTaskId={taskRef.taskId}
            position={training.currentIndex + 1}
            status={statuses[taskRef.taskId]}
            solutionRevealed={false}
            onToggleSolution={() => undefined}
          />
        ) : null}
      </main>

      {taskRef?.responseType === 'attachment' && attachmentNames.length > 0 ? (
        <MockExamAttachmentStrip
          names={attachmentNames}
          onRemove={(name) => training.removeAttachment(taskRef.taskId, name)}
        />
      ) : null}

      <footer
        className={cn(
          layout.training.controls,
          !training.review && isLast ? layout.training.controlsEqual : layout.training.controlsRow,
        )}
      >
        <Button
          variant="outline"
          size="icon"
          className={layout.training.controlButton}
          aria-label={MOCK_EXAM_COPY.previous}
          disabled={training.currentIndex === 0 && !training.review}
          onClick={() => training.setCurrentIndex(training.currentIndex - 1)}
        >
          <ChevronLeft />
        </Button>
        {training.review ? (
          <Button className={MOCK_EXAM_LAYOUT.footerAction} onClick={training.checkAnswers}>
            {MOCK_EXAM_COPY.check}
          </Button>
        ) : taskRef?.responseType === 'answer' ? (
          <AnswerInput
            id={TASK_ANSWER_INPUT_ID}
            value={session.answers[taskRef.taskId] ?? ''}
            validationState={
              statuses[taskRef.taskId] === 'unverified'
                ? 'neutral'
                : statuses[taskRef.taskId] === 'correct'
                  ? 'success'
                  : 'error'
            }
            placeholder={MOCK_EXAM_COPY.answer}
            onValueChange={(answer) => training.setAnswer(taskRef.taskId, answer)}
          />
        ) : taskRef ? (
          <MockExamAttachments onAdd={(names) => training.addAttachments(taskRef.taskId, names)} />
        ) : null}
        {training.review ? null : isLast ? (
          <Button
            className={MOCK_EXAM_LAYOUT.footerAction}
            onClick={() => training.setCurrentIndex(training.reviewIndex)}
          >
            {MOCK_EXAM_COPY.toCheck}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon"
            className={layout.training.controlButton}
            aria-label={MOCK_EXAM_COPY.next}
            onClick={() => training.setCurrentIndex(training.currentIndex + 1)}
          >
            <ChevronRight />
          </Button>
        )}
      </footer>
    </div>
  );
}
