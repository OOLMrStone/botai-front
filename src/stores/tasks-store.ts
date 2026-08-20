'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  DEFAULT_TRAINING_SETTINGS,
  type TaskStatus,
  type TrainingSettings,
  type TrainingTask,
} from '@/config/tasks';
import { checkTrainingAnswers } from '@/lib/task-training';

export type TasksView = 'part-1' | 'part-2' | 'favorites';
export interface TrainingSession {
  id: string;
  taskIds: string[];
  currentIndex: number;
  answers: Record<string, string>;
  statuses: Record<string, TaskStatus>;
  revealedSolutions: string[];
  source: 'catalog' | 'favorites';
}

interface TasksState {
  view: TasksView;
  expandedNumber: number | null;
  catalogScrollTop: number;
  setupRequested: boolean;
  setupTaskIds: string[];
  setupSource: TrainingSession['source'];
  favorites: string[];
  history: Record<string, Exclude<TaskStatus, 'unverified'>>;
  settings: TrainingSettings;
  session: TrainingSession | null;
  setView: (view: TasksView) => void;
  toggleNumber: (examNumber: number) => void;
  setCatalogScrollTop: (scrollTop: number) => void;
  requestSetup: () => void;
  consumeSetupRequest: () => void;
  toggleFavorite: (taskId: string) => void;
  setFavorites: (taskIds: string[]) => void;
  setSettings: (settings: TrainingSettings) => void;
  startSession: (tasks: TrainingTask[], source: TrainingSession['source']) => void;
  setCurrentIndex: (index: number) => void;
  setAnswer: (taskId: string, answer: string) => void;
  checkAnswers: (tasks: TrainingTask[]) => void;
  toggleSolution: (taskId: string) => void;
  finishSession: () => void;
  removeCorrectFavorites: () => void;
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      view: 'part-1',
      expandedNumber: null,
      catalogScrollTop: 0,
      setupRequested: false,
      setupTaskIds: [],
      setupSource: 'catalog',
      favorites: [],
      history: {},
      settings: DEFAULT_TRAINING_SETTINGS,
      session: null,
      setView: (view) => set({ view, expandedNumber: null }),
      toggleNumber: (examNumber) =>
        set((state) => ({
          expandedNumber: state.expandedNumber === examNumber ? null : examNumber,
        })),
      setCatalogScrollTop: (catalogScrollTop) => set({ catalogScrollTop }),
      requestSetup: () =>
        set((state) => ({
          setupRequested: true,
          setupTaskIds: state.session?.taskIds ?? [],
          setupSource: state.session?.source ?? 'catalog',
          session: null,
        })),
      consumeSetupRequest: () => set({ setupRequested: false }),
      toggleFavorite: (taskId) =>
        set((state) => ({
          favorites: state.favorites.includes(taskId)
            ? state.favorites.filter((id) => id !== taskId)
            : [taskId, ...state.favorites],
        })),
      setFavorites: (favorites) => set({ favorites }),
      setSettings: (settings) => set({ settings }),
      startSession: (tasks, source) =>
        set({
          session: {
            id: `${Date.now()}`,
            taskIds: tasks.map((task) => task.id),
            currentIndex: 0,
            answers: {},
            statuses: {},
            revealedSolutions: [],
            source,
          },
        }),
      setCurrentIndex: (currentIndex) =>
        set((state) => ({ session: state.session ? { ...state.session, currentIndex } : null })),
      setAnswer: (taskId, answer) =>
        set((state) =>
          state.session
            ? {
                session: {
                  ...state.session,
                  answers: { ...state.session.answers, [taskId]: answer },
                  statuses: { ...state.session.statuses, [taskId]: 'unverified' },
                },
              }
            : state,
        ),
      checkAnswers: (tasks) => {
        const session = get().session;
        if (!session) return;

        const { statuses, history } = checkTrainingAnswers({
          taskIds: session.taskIds,
          answers: session.answers,
          statuses: session.statuses,
          history: get().history,
          tasks,
        });

        set({ session: { ...session, statuses, currentIndex: 0 }, history });
      },
      toggleSolution: (taskId) =>
        set((state) => {
          if (!state.session) return state;
          const shown = state.session.revealedSolutions.includes(taskId);
          return {
            session: {
              ...state.session,
              revealedSolutions: shown
                ? state.session.revealedSolutions.filter((id) => id !== taskId)
                : [...state.session.revealedSolutions, taskId],
            },
          };
        }),
      finishSession: () => set({ session: null }),
      removeCorrectFavorites: () =>
        set((state) => {
          if (!state.session) return state;
          const correct = new Set(
            state.session.taskIds.filter((taskId) => state.session?.statuses[taskId] === 'correct'),
          );
          return { favorites: state.favorites.filter((taskId) => !correct.has(taskId)) };
        }),
    }),
    { name: 'botai-tasks' },
  ),
);
