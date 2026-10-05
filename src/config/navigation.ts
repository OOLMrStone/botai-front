import { ClipboardCheck, Home, ListChecks, Sparkles, UserRound } from 'lucide-react';
import type { ComponentType } from 'react';

import { COPY, ROUTES } from '@/config/onboarding-steps';

export interface AppTab {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

// Состав и порядок вкладок нижней навигации - один источник правды.
export const APP_TABS: AppTab[] = [
  { href: ROUTES.home, label: COPY.nav.home, icon: Home },
  { href: ROUTES.quizzes, label: COPY.nav.quizzes, icon: Sparkles },
  { href: ROUTES.tasks, label: COPY.nav.tasks, icon: ListChecks },
  { href: ROUTES.mockExams, label: COPY.nav.mockExams, icon: ClipboardCheck },
  { href: ROUTES.profile, label: COPY.nav.profile, icon: UserRound },
];

export const LEARNING_COPY = {
  navigation: 'Учебные разделы',
  course: 'ЕГЭ · Профильная математика',
  storefront: 'На главную сайта',
} as const;
