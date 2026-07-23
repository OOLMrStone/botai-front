import { Home, ListChecks, UserRound } from 'lucide-react';
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
  { href: ROUTES.tasks, label: COPY.nav.tasks, icon: ListChecks },
  { href: ROUTES.profile, label: COPY.nav.profile, icon: UserRound },
];
