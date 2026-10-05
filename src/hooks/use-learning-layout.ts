'use client';

import { usePathname } from 'next/navigation';

import { mockExamPath } from '@/config/mock-exams';
import { APP_TABS } from '@/config/navigation';
import { ROUTES } from '@/config/onboarding-steps';
import { useQuizStore } from '@/stores/quiz-store';

export function useLearningLayout() {
  const pathname = usePathname();
  const quizStage = useQuizStore((state) => state.stage);
  const catalog = APP_TABS.some((tab) => tab.href === pathname);
  const quizActive = pathname === ROUTES.quizzes && quizStage !== 'catalog';
  const workspace = pathname === ROUTES.training || pathname.startsWith(mockExamPath(''));
  const unchanged = pathname === ROUTES.lemurWalk;
  const mode: 'unchanged' | 'workspace' | 'catalog' | 'flow' = unchanged
    ? 'unchanged'
    : workspace
      ? 'workspace'
      : catalog && !quizActive
        ? 'catalog'
        : 'flow';

  return {
    mode,
    showExit:
      mode === 'flow' &&
      !quizActive &&
      pathname !== ROUTES.studentEntry &&
      pathname !== ROUTES.trainingSetup,
  };
}
