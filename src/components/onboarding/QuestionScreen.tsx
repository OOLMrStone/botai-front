'use client';

import { Button } from '@/components/ui/button';
import { RadioGroup } from '@/components/ui/radio-group';
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
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle ? <p className="text-muted-foreground">{subtitle}</p> : null}
      </div>

      <RadioGroup
        value={value ?? ''}
        onValueChange={(next) => onValueChange(String(next))}
        className="gap-3"
      >
        {options.map((option) => (
          <SelectableCard
            key={option.id}
            value={option.id}
            label={option.label}
            description={option.description}
            icon={option.icon}
          />
        ))}
      </RadioGroup>
    </ScreenShell>
  );
}
