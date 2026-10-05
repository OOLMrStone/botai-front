'use client';

import { Button } from '@/components/ui/button';
import { MascotPlaceholder } from '@/components/onboarding/MascotPlaceholder';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { layout } from '@/config/layout';

interface ResultScreenProps {
  title: string;
  pending?: boolean;
  subtitle?: string;
  actionLabel: string;
  onAction: () => void;
  showMascot?: boolean;
}

// Экран-реакция: заголовок + подпись + кнопка. Опционально с маскотом.
// В тексте поддерживается ручной перенос строки через \n (whitespace-pre-line).
export function ResultScreen({
  title,
  pending = false,
  subtitle,
  actionLabel,
  onAction,
  showMascot = true,
}: ResultScreenProps) {
  return (
    <ScreenShell
      center
      footer={
        <Button className={layout.cta} size="default" disabled={pending} onClick={onAction}>
          {actionLabel}
        </Button>
      }
    >
      {showMascot ? <MascotPlaceholder /> : null}

      <ScreenHeading title={title} subtitle={subtitle} />
    </ScreenShell>
  );
}
