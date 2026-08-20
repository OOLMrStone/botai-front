'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ROUTES } from '@/config/onboarding-steps';
import { TASK_ANSWER_INPUT_ID, type TrainingTask } from '@/config/tasks';
import { useKeyboardViewport } from '@/hooks/use-keyboard-viewport';
import { saveFavoriteTask } from '@/lib/api/tasks';
import { useTasksStore } from '@/stores/tasks-store';

export function useTrainingShell(tasks: TrainingTask[]) {
  const router = useRouter();
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const session = useTasksStore((state) => state.session);
  const setCurrentIndex = useTasksStore((state) => state.setCurrentIndex);
  const setAnswer = useTasksStore((state) => state.setAnswer);
  const checkAnswers = useTasksStore((state) => state.checkAnswers);
  const toggleSolution = useTasksStore((state) => state.toggleSolution);
  useKeyboardViewport(TASK_ANSWER_INPUT_ID);

  const reviewIndex = tasks.length;
  const review = session?.currentIndex === reviewIndex;
  const task = session ? tasks[session.currentIndex] : undefined;
  const taskId = task?.id;
  const status = taskId ? (session?.statuses[taskId] ?? 'unverified') : 'unverified';
  const unverified =
    session?.taskIds.some((id) => (session.statuses[id] ?? 'unverified') === 'unverified') ?? false;
  const allCorrect = session?.taskIds.every((id) => session.statuses[id] === 'correct') ?? false;
  const missing =
    session?.taskIds.flatMap((id, index) => (session.answers[id]?.trim() ? [] : [index])) ?? [];

  const leaveTraining = () => router.push(ROUTES.tasks);

  const exit = () => {
    if (
      session?.source === 'favorites' &&
      session.taskIds.some((id) => session.statuses[id] === 'correct')
    ) {
      setExitDialogOpen(true);
      return;
    }
    leaveTraining();
  };

  const finishFavoriteExit = async (remove: boolean) => {
    if (!session) return;
    if (remove) {
      const state = useTasksStore.getState();
      const previous = state.favorites;
      const correct = session.taskIds.filter((id) => session.statuses[id] === 'correct');
      state.removeCorrectFavorites();
      try {
        await Promise.all(correct.map((id) => saveFavoriteTask(id, false)));
      } catch {
        useTasksStore.getState().setFavorites(previous);
        return;
      }
    }
    leaveTraining();
  };

  const continueTraining = () => {
    useTasksStore.getState().requestSetup();
    router.push(ROUTES.tasks);
  };

  return {
    session,
    reviewIndex,
    review,
    task,
    status,
    unverified,
    allCorrect,
    missing,
    exitDialogOpen,
    setExitDialogOpen,
    setCurrentIndex,
    setAnswer,
    checkAnswers,
    toggleSolution,
    exit,
    finishFavoriteExit,
    continueTraining,
  };
}
