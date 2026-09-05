'use client';

import { useState } from 'react';

import {
  TASK_DIFFICULTY_SLIDER,
  type TaskCount,
  type TrainingSettings,
  type TrainingTask,
} from '@/config/tasks';
import {
  difficultiesAt,
  difficultyLabelKey,
  difficultyLevelFromSelection,
} from '@/lib/task-difficulty';

export function useTrainingSetup(initial: TrainingSettings, tasks: TrainingTask[]) {
  const initialLevel =
    initial.difficultyLevel ?? difficultyLevelFromSelection(initial.difficulties);
  const [settings, setSettings] = useState<TrainingSettings>({
    ...initial,
    difficultyLevel: initialLevel,
    difficulties: difficultiesAt(initialLevel),
  });

  const setCount = (count: TaskCount) => setSettings((current) => ({ ...current, count }));
  const setDifficultyLevel = (difficultyLevel: number) =>
    setSettings((current) => ({
      ...current,
      difficultyLevel,
      difficulties: difficultiesAt(difficultyLevel),
    }));

  const difficultyLevel = settings.difficultyLevel ?? TASK_DIFFICULTY_SLIDER.defaultValue;
  const canStart = tasks.some((task) => settings.difficulties.includes(task.difficulty));

  return {
    settings,
    difficultyLevel,
    difficultyLabelKey: difficultyLabelKey(difficultyLevel),
    canStart,
    setCount,
    setDifficultyLevel,
  };
}
