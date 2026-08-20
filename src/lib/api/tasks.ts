import { TRAINING_TASKS, type TrainingTask } from '@/config/tasks';

export async function fetchTasks(): Promise<TrainingTask[]> {
  // TODO: заменить локальный банк реальным GET с бэкенда.
  return structuredClone(TRAINING_TASKS);
}

export async function saveFavoriteTask(taskId: string, favorite: boolean): Promise<void> {
  void taskId;
  void favorite;
  // TODO: заменить optimistic mock реальным запросом бэкенда.
  await Promise.resolve();
}
