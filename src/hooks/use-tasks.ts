'use client';

import type { TrainingTask } from '@/config/tasks';
import { useAsyncData, type AsyncData } from '@/hooks/use-async-data';
import { fetchTasks } from '@/lib/api/tasks';
import { cachedResource } from '@/lib/cached-resource';

const tasksResource = cachedResource(fetchTasks);

export interface TasksState extends Omit<AsyncData<TrainingTask[]>, 'data'> {
  tasks: TrainingTask[] | null;
}

export function useTasks(): TasksState {
  const { data, failed, retry } = useAsyncData(tasksResource);
  return { tasks: data, failed, retry };
}
