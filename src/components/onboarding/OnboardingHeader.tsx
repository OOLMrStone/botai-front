'use client';

import { ChevronLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { Progress } from '@/components/ui/progress';

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
  const showBack = index > 0;

  return (
    <header className="flex items-center gap-3 px-4 pt-4">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Назад"
        className="text-muted-foreground hover:bg-muted flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-0"
        disabled={!showBack}
      >
        <ChevronLeft className="size-5" />
      </button>

      <Progress value={progress} className="flex-1" />
    </header>
  );
}
