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
// В title поддерживается перенос строки через \n.
export function ResultScreen({
  title,
  subtitle,
  actionLabel,
  onAction,
  showMascot = true,
}: ResultScreenProps) {
  const titleLines = title.split('\n').map((line) => line.trim());

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
        <h1 className="text-2xl font-bold tracking-tight text-balance">
          {titleLines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h1>
        {subtitle ? <p className="text-muted-foreground text-balance">{subtitle}</p> : null}
      </div>
    </ScreenShell>
  );
}
