'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { MOCK_EXAMS, MOCK_EXAM_CATALOG_PATH } from '@/config/mock-exams';
import type { TrainingTask } from '@/config/tasks';
import { useKeyboardViewport } from '@/hooks/use-keyboard-viewport';
import { mockExamScore } from '@/lib/mock-exams';
import { useMockExamsStore } from '@/stores/mock-exams-store';

function normalizedNumber(answer: string) {
  return Number(answer.trim().replace(',', '.'));
}

export function useMockExamTraining(examId: string, taskBank: TrainingTask[]) {
  const router = useRouter();
  const exam = MOCK_EXAMS.find((candidate) => candidate.id === examId);
  const session = useMockExamsStore((state) => state.sessions[examId]);
  const result = useMockExamsStore((state) => state.results[examId]);
  const start = useMockExamsStore((state) => state.start);
  const setCurrentIndex = useMockExamsStore((state) => state.setCurrentIndex);
  const setAnswer = useMockExamsStore((state) => state.setAnswer);
  const addAttachments = useMockExamsStore((state) => state.addAttachments);
  const removeAttachment = useMockExamsStore((state) => state.removeAttachment);
  const check = useMockExamsStore((state) => state.check);
  useKeyboardViewport();

  useEffect(() => {
    if (exam) start(examId);
  }, [exam, examId, start]);

  const taskMap = new Map(taskBank.map((task) => [task.id, task]));
  const tasks = exam?.tasks.flatMap((item, index) => {
    const task = taskMap.get(item.taskId);
    return task
      ? [
          {
            ...task,
            id: `${examId}:${task.id}`,
            examPart: item.responseType === 'attachment' ? (2 as const) : (1 as const),
            examNumber: index + 1,
          },
        ]
      : [];
  });
  const currentIndex = session?.currentIndex ?? 0;
  const task = tasks?.[currentIndex];
  const taskRef = exam?.tasks[currentIndex];
  const reviewIndex = exam?.tasks.length ?? 0;
  const review = currentIndex === reviewIndex;
  const answers = session?.answers ?? {};
  const scrubberAnswers = { ...answers };
  for (const item of exam?.tasks ?? []) {
    if ((session?.attachments[item.taskId]?.length ?? 0) > 0) scrubberAnswers[item.taskId] = 'file';
  }

  const checkAnswers = () => {
    if (!exam || !session || !tasks) return;
    const statuses = exam.tasks.reduce<Record<string, 'correct' | 'incorrect'>>((next, item) => {
      if (item.responseType === 'attachment') {
        next[item.taskId] = session.attachments[item.taskId]?.length ? 'correct' : 'incorrect';
        return next;
      }
      const currentTask = taskMap.get(item.taskId);
      const answer = session.answers[item.taskId];
      next[item.taskId] = Boolean(
        currentTask &&
        answer?.trim() &&
        currentTask.acceptedAnswers.some(
          (accepted) => normalizedNumber(accepted) === normalizedNumber(answer),
        ),
      )
        ? 'correct'
        : 'incorrect';
      return next;
    }, {});
    const correct = Object.values(statuses).filter((status) => status === 'correct').length;
    check(examId, statuses, mockExamScore(correct, exam.tasks.length));
  };

  return {
    exam,
    session,
    result,
    tasks,
    task,
    taskRef,
    review,
    reviewIndex,
    answers: scrubberAnswers,
    currentIndex,
    setCurrentIndex: (index: number) => setCurrentIndex(examId, index),
    setAnswer: (taskId: string, answer: string) => setAnswer(examId, taskId, answer),
    addAttachments: (taskId: string, names: string[]) => addAttachments(examId, taskId, names),
    removeAttachment: (taskId: string, name: string) => removeAttachment(examId, taskId, name),
    exit: () => router.push(MOCK_EXAM_CATALOG_PATH),
    checkAnswers,
  };
}
