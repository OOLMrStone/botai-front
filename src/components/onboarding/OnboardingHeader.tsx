'use client';

import { ChevronLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { Progress } from '@/components/ui/progress';
import { layout } from '@/config/layout';
import { COPY } from '@/config/onboarding-steps';

interface OnboardingHeaderProps {
  steps: readonly string[];
}

// Стрелка «назад» + прогресс-бар. Живёт в layout, текущий шаг берёт из pathname.
export function OnboardingHeader({ steps }: OnboardingHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const slug = pathname.split('/').filter(Boolean).pop() ?? '';
  const index = steps.indexOf(slug);

  // Не-шаговые роуты (гейт, «Готово») и welcome (сцена «Рассвета») - без шапки.
  if (index <= 0) return null;

  const progress = ((index + 1) / steps.length) * 100;

  return (
    <header className={layout.flowHeader.root}>
      <button
        type="button"
        onClick={() => router.back()}
        aria-label={COPY.nav.back}
        className={layout.flowHeader.back}
      >
        <ChevronLeft className={layout.flowHeader.icon} />
      </button>

      <Progress value={progress} className={layout.flowHeader.progress} />
    </header>
  );
}
