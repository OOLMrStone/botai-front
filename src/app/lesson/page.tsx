import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { ScreenTransition } from '@/components/onboarding/ScreenTransition';
import { COPY, ROUTES } from '@/config/onboarding-steps';
import { cn } from '@/lib/utils';

// Заглушка урока. Сам урок вне scope. «Завершить урок» → награда-streak.
export default function LessonPage() {
  return (
    <ScreenTransition>
      <ScreenShell
        center
        footer={
          <Link
            href={ROUTES.streak}
            className={cn(buttonVariants({ size: 'lg' }), 'h-12 w-full text-base')}
          >
            {COPY.lesson.action}
          </Link>
        }
      >
        <div className="bg-muted text-muted-foreground flex size-20 items-center justify-center rounded-3xl">
          <GraduationCap className="size-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">{COPY.lesson.title}</h1>
          <p className="text-muted-foreground text-balance">{COPY.lesson.subtitle}</p>
        </div>
      </ScreenShell>
    </ScreenTransition>
  );
}
