import type { Difficulty, TaskCount, TaskStatus, TrainingTask } from '@/config/tasks';

const DIFFICULTY_ORDER: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };

interface SelectTasksInput {
  tasks: TrainingTask[];
  difficulties: Difficulty[];
  count: TaskCount;
  history: Record<string, 'correct' | 'incorrect'>;
}

interface CheckAnswersInput {
  taskIds: string[];
  answers: Record<string, string>;
  statuses: Record<string, TaskStatus>;
  history: Record<string, Exclude<TaskStatus, 'unverified'>>;
  tasks: TrainingTask[];
}

export function selectTrainingTasks({ tasks, difficulties, count, history }: SelectTasksInput) {
  const priority = (task: TrainingTask) => {
    const status = history[task.id];
    return status === undefined ? 0 : status === 'incorrect' ? 1 : 2;
  };

  const sorted = tasks
    .filter((task) => difficulties.includes(task.difficulty))
    .toSorted(
      (a, b) =>
        priority(a) - priority(b) ||
        DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty],
    );

  if (count === 'all') return sorted.filter((task) => history[task.id] !== 'correct');
  return sorted.slice(0, count);
}

export function taskProgress(
  tasks: TrainingTask[],
  history: Record<string, 'correct' | 'incorrect'>,
) {
  if (tasks.length === 0) return 0;
  const correct = tasks.filter((task) => history[task.id] === 'correct').length;
  return Math.round((correct / tasks.length) * 100);
}

function normalizedNumber(answer: string) {
  return Number(answer.trim().replace(',', '.'));
}

export function checkTrainingAnswers({
  taskIds,
  answers,
  statuses: previousStatuses,
  history: previousHistory,
  tasks,
}: CheckAnswersInput) {
  const taskMap = new Map(tasks.map((task) => [task.id, task]));
  const statuses = { ...previousStatuses };
  const history = { ...previousHistory };

  for (const taskId of taskIds) {
    if ((statuses[taskId] ?? 'unverified') !== 'unverified') continue;
    const task = taskMap.get(taskId);
    const rawAnswer = answers[taskId];
    if (!task || !rawAnswer?.trim()) continue;

    const normalized = normalizedNumber(rawAnswer);
    const correct = task.acceptedAnswers.some((answer) => normalizedNumber(answer) === normalized);
    const status = correct ? 'correct' : 'incorrect';
    statuses[taskId] = status;
    history[taskId] = status;
  }

  return { statuses, history };
}

export function resolveTrainingTasks(taskIds: string[], tasks: TrainingTask[]) {
  if (taskIds.length === 0) return null;

  const taskMap = new Map(tasks.map((task) => [task.id, task]));
  const sessionTasks = taskIds.flatMap((taskId) => {
    const task = taskMap.get(taskId);
    return task ? [task] : [];
  });

  return sessionTasks.length === taskIds.length ? sessionTasks : null;
}
