'use client';

import { SelectableCard } from '@/components/onboarding/SelectableCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { COPY, DAILY_GOAL_OPTIONS, GOAL_OPTIONS } from '@/config/onboarding-steps';

interface ProfileEditFieldsProps {
  name: string;
  onNameChange: (value: string) => void;
  goalId: string;
  onGoalChange: (goalId: string) => void;
  dailyMinutes: number;
  onDailyChange: (minutes: number) => void;
}

// Поля режима редактирования профиля: обращение + выбор цели дня и цели по ЕГЭ.
// Выбор вариантов - тот же RadioGroup + SelectableCard, что и в онбординге.
export function ProfileEditFields({
  name,
  onNameChange,
  goalId,
  onGoalChange,
  dailyMinutes,
  onDailyChange,
}: ProfileEditFieldsProps) {
  const dailyId = DAILY_GOAL_OPTIONS.find((option) => option.minutes === dailyMinutes)?.id ?? '';

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-2">
        <Label htmlFor="profile-name">{COPY.profile.nameTitle}</Label>
        <Input
          id="profile-name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder={COPY.profile.namePlaceholder}
          className="h-12 text-base"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">{COPY.profile.dailyGoalTitle}</p>
        <RadioGroup
          value={dailyId}
          onValueChange={(next) => {
            const option = DAILY_GOAL_OPTIONS.find((item) => item.id === String(next));
            if (option) onDailyChange(option.minutes);
          }}
        >
          {DAILY_GOAL_OPTIONS.map((option) => (
            <SelectableCard
              key={option.id}
              value={option.id}
              label={option.label}
              description={option.description}
              icon={option.icon}
            />
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">{COPY.profile.goalTitle}</p>
        <RadioGroup value={goalId} onValueChange={(next) => onGoalChange(String(next))}>
          {GOAL_OPTIONS.map((option) => (
            <SelectableCard
              key={option.id}
              value={option.id}
              label={option.label}
              description={option.description}
              icon={option.icon}
            />
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
