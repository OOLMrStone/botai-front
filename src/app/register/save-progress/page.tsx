import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { MascotPlaceholder } from '@/components/onboarding/MascotPlaceholder';
import { OAuthButtons } from '@/components/onboarding/OAuthButtons';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { COPY, registerPath, ROUTES } from '@/config/onboarding-steps';
import { cn } from '@/lib/utils';

// Гейт после урока: «Сохрани прогресс» — OAuth, регистрация по почте или вход.
export default function SaveProgressPage() {
  return (
    <ScreenShell
      center
      footer={
        <div className="space-y-4">
          <OAuthButtons redirectTo={ROUTES.done} />

          <div className="text-muted-foreground flex items-center gap-3 text-sm">
            <span className="bg-border h-px flex-1" />
            или
            <span className="bg-border h-px flex-1" />
          </div>

          <Link
            href={registerPath('age')}
            className={cn(buttonVariants({ size: 'lg' }), 'h-12 w-full text-base')}
          >
            {COPY.register.saveProgress.emailCta}
          </Link>

          <Link href={ROUTES.login} className={cn(buttonVariants({ variant: 'ghost' }), 'w-full')}>
            {COPY.register.saveProgress.loginCta}
          </Link>
        </div>
      }
    >
      <MascotPlaceholder />

      <ScreenHeading
        title={COPY.register.saveProgress.title}
        subtitle={COPY.register.saveProgress.subtitle}
      />
    </ScreenShell>
  );
}
