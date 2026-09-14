'use client';

import { SelectableCard } from '@/components/onboarding/SelectableCard';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { layout } from '@/config/layout';
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
    <div className={layout.settings.fields}>
      <div className={layout.settings.fieldGroup}>
        <Label htmlFor="profile-name" className={layout.typography.sectionTitle}>
          {COPY.profile.nameTitle}
        </Label>
        <Input
          id="profile-name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder={COPY.profile.namePlaceholder}
          className={layout.settings.input}
        />
      </div>

      <div className={layout.settings.fieldGroup}>
        <SectionHeading>{COPY.profile.dailyGoalTitle}</SectionHeading>
        <RadioGroup
          aria-label={COPY.profile.dailyGoalTitle}
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

      <div className={layout.settings.fieldGroup}>
        <SectionHeading>{COPY.profile.goalTitle}</SectionHeading>
        <RadioGroup
          aria-label={COPY.profile.goalTitle}
          value={goalId}
          onValueChange={(next) => onGoalChange(String(next))}
        >
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
