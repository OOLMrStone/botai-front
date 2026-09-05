'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  DEFAULT_TRAINING_SETTINGS,
  type DrawingStroke,
  type TaskHistoryStatus,
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
  history: Record<string, TaskHistoryStatus>;
  solvedAt: Record<string, string>;
  settings: TrainingSettings;
  session: TrainingSession | null;
  drawings: Record<string, DrawingStroke[]>;
  savedDrawings: Record<string, DrawingStroke[]>;
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
  setDrawing: (taskId: string, strokes: DrawingStroke[]) => void;
  commitDrawing: (taskId: string) => void;
  markInProgress: (taskId: string) => void;
  prepareSessionExit: () => void;
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
      solvedAt: {},
      settings: DEFAULT_TRAINING_SETTINGS,
      session: null,
      drawings: {},
      savedDrawings: {},
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
        set((state) => {
          const drawings = { ...state.drawings };
          for (const task of tasks) {
            const saved = state.savedDrawings[task.id];
            if (state.history[task.id] === 'correct') delete drawings[task.id];
            else if (saved) drawings[task.id] = saved;
          }

          return {
            session: {
              id: `${Date.now()}`,
              taskIds: tasks.map((task) => task.id),
              currentIndex: 0,
              answers: {},
              statuses: {},
              revealedSolutions: [],
              source,
            },
            drawings,
          };
        }),
      setCurrentIndex: (currentIndex) =>
        set((state) => ({ session: state.session ? { ...state.session, currentIndex } : null })),
      setAnswer: (taskId, answer) =>
        set((state) =>
          state.session
            ? {
                history:
                  state.history[taskId] === 'correct'
                    ? state.history
                    : { ...state.history, [taskId]: 'in-progress' },
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

        const solvedIds = session.taskIds.filter((taskId) => statuses[taskId] === 'correct');
        const solvedAt = { ...get().solvedAt };
        const drawings = { ...get().drawings };
        const savedDrawings = { ...get().savedDrawings };
        const checkedAt = new Date().toISOString();
        for (const taskId of solvedIds) {
          solvedAt[taskId] = checkedAt;
          delete drawings[taskId];
          delete savedDrawings[taskId];
        }

        set({
          session: { ...session, statuses, currentIndex: 0 },
          history,
          solvedAt,
          drawings,
          savedDrawings,
        });
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
      setDrawing: (taskId, strokes) =>
        set((state) => ({ drawings: { ...state.drawings, [taskId]: strokes } })),
      commitDrawing: (taskId) =>
        set((state) => {
          const strokes = state.drawings[taskId];
          if (!strokes || state.history[taskId] === 'correct') return state;
          const savedDrawings = { ...state.savedDrawings };
          if (strokes.length) savedDrawings[taskId] = strokes;
          else delete savedDrawings[taskId];
          return { savedDrawings };
        }),
      markInProgress: (taskId) =>
        set((state) =>
          state.history[taskId] === 'correct'
            ? state
            : { history: { ...state.history, [taskId]: 'in-progress' } },
        ),
      prepareSessionExit: () =>
        set((state) => {
          if (!state.session) return state;
          const history = { ...state.history };
          const drawings = { ...state.drawings };
          const savedDrawings = { ...state.savedDrawings };
          const statuses: Record<string, TaskStatus> = {};

          for (const taskId of state.session.taskIds) {
            const correct =
              state.session.statuses[taskId] === 'correct' || history[taskId] === 'correct';
            if (correct) {
              if (state.session.statuses[taskId] === 'correct') statuses[taskId] = 'correct';
              delete drawings[taskId];
              delete savedDrawings[taskId];
              continue;
            }

            const started =
              Boolean(state.session.answers[taskId]?.trim()) ||
              Boolean(state.drawings[taskId]?.length) ||
              state.session.statuses[taskId] === 'incorrect';
            if (started && history[taskId] !== 'correct') history[taskId] = 'in-progress';
            if (state.drawings[taskId]?.length) savedDrawings[taskId] = state.drawings[taskId];
          }

          return {
            history,
            drawings,
            savedDrawings,
            session: { ...state.session, answers: {}, statuses },
          };
        }),
    }),
    {
      name: 'botai-tasks',
      version: 2,
      partialize: (state) => ({ ...state, drawings: {} }),
      migrate: (persisted) => {
        const saved = persisted as Partial<TasksState>;
        const legacyHistory = (persisted as { history?: Record<string, string> }).history ?? {};
        return {
          ...saved,
          history: Object.fromEntries(
            Object.entries(legacyHistory).map(([taskId, status]) => [
              taskId,
              status === 'incorrect' ? 'in-progress' : status,
            ]),
          ),
          solvedAt: saved.solvedAt ?? {},
          drawings: {},
          savedDrawings: saved.savedDrawings ?? saved.drawings ?? {},
        } as TasksState;
      },
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<TasksState>),
        drawings: {},
        savedDrawings: (persisted as Partial<TasksState>).savedDrawings ?? {},
      }),
    },
  ),
);
