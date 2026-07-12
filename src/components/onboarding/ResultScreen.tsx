'use client';

import { Button } from '@/components/ui/button';
import { MascotPlaceholder } from '@/components/onboarding/MascotPlaceholder';
import { ScreenShell } from '@/components/onboarding/ScreenShell';

interface ResultScreenProps {
  title: string;
  subtitle?: string;
  actionLabel: string;
  onAction: () => void;
  showMascot?: boolean;
}

// Экран-реакция: заголовок + подпись + кнопка. Опционально с маскотом.
// В тексте поддерживается ручной перенос строки через \n (whitespace-pre-line).
export function ResultScreen({
  title,
  subtitle,
  actionLabel,
  onAction,
  showMascot = true,
}: ResultScreenProps) {
  return (
    <ScreenShell
      center
      footer={
        <Button className="h-12 w-full text-base" size="lg" onClick={onAction}>
          {actionLabel}
        </Button>
      }
    >
      {showMascot ? <MascotPlaceholder /> : null}

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-balance whitespace-pre-line">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-muted-foreground text-balance whitespace-pre-line">{subtitle}</p>
        ) : null}
      </div>
    </ScreenShell>
  );
}
