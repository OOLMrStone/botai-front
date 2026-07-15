'use client';

import { Button } from '@/components/ui/button';
import { MascotPlaceholder } from '@/components/onboarding/MascotPlaceholder';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
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

      <ScreenHeading title={title} subtitle={subtitle} />
    </ScreenShell>
  );
}
