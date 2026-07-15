'use client';

import { Button } from '@/components/ui/button';
import { RadioGroup } from '@/components/ui/radio-group';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { SelectableCard } from '@/components/onboarding/SelectableCard';
import type { Option } from '@/config/onboarding-steps';

interface QuestionScreenProps {
  title: string;
  subtitle?: string;
  options: readonly Option[];
  value: string | null;
  onValueChange: (value: string) => void;
  onContinue: () => void;
  actionLabel: string;
}

// Обёртка «вопрос + список вариантов + Продолжить».
export function QuestionScreen({
  title,
  subtitle,
  options,
  value,
  onValueChange,
  onContinue,
  actionLabel,
}: QuestionScreenProps) {
  return (
    <ScreenShell
      footer={
        <Button
          className="h-12 w-full text-base"
          size="lg"
          disabled={value === null}
          onClick={onContinue}
        >
          {actionLabel}
        </Button>
      }
    >
      <ScreenHeading title={title} subtitle={subtitle} />

      {/* Список тянется на всё свободное место: карточки делят его поровну,
          но не ниже min и не выше max - экран заполнен, без пустот и «тонких» карточек. */}
      <RadioGroup
        value={value ?? ''}
        onValueChange={(next) => onValueChange(String(next))}
        className="flex min-h-0 flex-1 flex-col justify-start gap-2.5"
      >
        {options.map((option) => (
          <SelectableCard
            key={option.id}
            value={option.id}
            label={option.label}
            description={option.description}
            icon={option.icon}
            className="max-h-24 min-h-16 flex-1"
          />
        ))}
      </RadioGroup>
    </ScreenShell>
  );
}
