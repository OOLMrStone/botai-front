'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  MOCK_EXAM_PRECOMPLETED_ANSWERS,
  type MockExamFilter,
  type MockExamSort,
} from '@/config/mock-exams';
import type { TaskStatus } from '@/config/tasks';

export interface MockExamSession {
  examId: string;
  currentIndex: number;
  answers: Record<string, string>;
  attachments: Record<string, string[]>;
  statuses: Record<string, TaskStatus>;
}

export interface MockExamResult {
  score: number;
  completedAt: string;
}

interface MockExamsState {
  sort: MockExamSort;
  filter: MockExamFilter;
  sessions: Record<string, MockExamSession>;
  results: Record<string, MockExamResult>;
  setSort: (sort: MockExamSort) => void;
  setFilter: (filter: MockExamFilter) => void;
  start: (examId: string) => void;
  setCurrentIndex: (examId: string, currentIndex: number) => void;
  setAnswer: (examId: string, taskId: string, answer: string) => void;
  addAttachments: (examId: string, taskId: string, names: string[]) => void;
  removeAttachment: (examId: string, taskId: string, name: string) => void;
  check: (examId: string, statuses: Record<string, TaskStatus>, score: number) => void;
  complete: (examId: string, score: number) => void;
}

const PRECOMPLETED_RESULTS: Record<string, MockExamResult> = {
  'variant-01': { score: 70, completedAt: '2026-07-28T12:00:00.000Z' },
};

const PRECOMPLETED_SESSION: MockExamSession = {
  examId: 'variant-01',
  currentIndex: 0,
  answers: MOCK_EXAM_PRECOMPLETED_ANSWERS,
  attachments: {},
  statuses: Object.fromEntries(
    Object.keys(MOCK_EXAM_PRECOMPLETED_ANSWERS).map((taskId) => [taskId, 'correct']),
  ),
};

export const useMockExamsStore = create<MockExamsState>()(
  persist(
    (set) => ({
      sort: 'newest',
      filter: 'all',
      sessions: { 'variant-01': PRECOMPLETED_SESSION },
      results: PRECOMPLETED_RESULTS,
      setSort: (sort) => set({ sort }),
      setFilter: (filter) => set({ filter }),
      start: (examId) =>
        set((state) => {
          const session = state.sessions[examId];
          return {
            sessions: {
              ...state.sessions,
              [examId]: session
                ? { ...session, currentIndex: 0 }
                : {
                    examId,
                    currentIndex: 0,
                    answers: {},
                    attachments: {},
                    statuses: {},
                  },
            },
          };
        }),
      setCurrentIndex: (examId, currentIndex) =>
        set((state) => {
          const session = state.sessions[examId];
          if (!session) return state;
          return {
            sessions: { ...state.sessions, [examId]: { ...session, currentIndex } },
          };
        }),
      setAnswer: (examId, taskId, answer) =>
        set((state) => {
          const session = state.sessions[examId];
          if (!session) return state;
          return {
            sessions: {
              ...state.sessions,
              [examId]: {
                ...session,
                answers: { ...session.answers, [taskId]: answer },
                statuses: { ...session.statuses, [taskId]: 'unverified' },
              },
            },
          };
        }),
      addAttachments: (examId, taskId, names) =>
        set((state) => {
          const session = state.sessions[examId];
          if (!session) return state;
          const currentNames = session.attachments[taskId] ?? [];
          const nextNames = [...new Set([...currentNames, ...names])];
          return {
            sessions: {
              ...state.sessions,
              [examId]: {
                ...session,
                attachments: { ...session.attachments, [taskId]: nextNames },
                statuses: { ...session.statuses, [taskId]: 'unverified' },
              },
            },
          };
        }),
      removeAttachment: (examId, taskId, name) =>
        set((state) => {
          const session = state.sessions[examId];
          if (!session) return state;

          const nextNames = (session.attachments[taskId] ?? []).filter(
            (attachmentName) => attachmentName !== name,
          );

          return {
            sessions: {
              ...state.sessions,
              [examId]: {
                ...session,
                attachments: { ...session.attachments, [taskId]: nextNames },
                statuses: { ...session.statuses, [taskId]: 'unverified' },
              },
            },
          };
        }),
      check: (examId, statuses, score) =>
        set((state) => {
          const session = state.sessions[examId];
          if (!session) return state;
          return {
            sessions: {
              ...state.sessions,
              [examId]: { ...session, currentIndex: 0, statuses },
            },
            results: {
              ...state.results,
              [examId]: { score, completedAt: new Date().toISOString() },
            },
          };
        }),
      complete: (examId, score) =>
        set((state) => ({
          results: {
            ...state.results,
            [examId]: { score, completedAt: new Date().toISOString() },
          },
        })),
    }),
    {
      name: 'botai-mock-exams',
      version: 1,
      merge: (persisted, current) => {
        const stored = persisted as Partial<MockExamsState>;
        const storedPrecompleted = stored.sessions?.['variant-01'];
        const precompletedSession = storedPrecompleted
          ? {
              ...PRECOMPLETED_SESSION,
              ...storedPrecompleted,
              answers: {
                ...PRECOMPLETED_SESSION.answers,
                ...storedPrecompleted.answers,
              },
              statuses: {
                ...PRECOMPLETED_SESSION.statuses,
                ...storedPrecompleted.statuses,
              },
            }
          : PRECOMPLETED_SESSION;
        return {
          ...current,
          ...stored,
          sessions: {
            ...stored.sessions,
            'variant-01': precompletedSession,
          },
          results: { ...PRECOMPLETED_RESULTS, ...stored.results },
        };
      },
    },
  ),
);
