'use client';

import { SelectableCard } from '@/components/onboarding/SelectableCard';
import { FormSection } from '@/components/common/FormSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { layout } from '@/config/layout';
import { COPY, DAILY_GOAL_OPTIONS, GOAL_OPTIONS, LEVEL_OPTIONS } from '@/config/onboarding-steps';

interface ProfileEditFieldsProps {
  name: string;
  onNameChange: (value: string) => void;
  goalId: string;
  onGoalChange: (goalId: string) => void;
  levelId: string;
  onLevelChange: (levelId: string) => void;
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
  levelId,
  onLevelChange,
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

      <FormSection title={COPY.level.title}>
        <RadioGroup
          aria-label={COPY.level.title}
          value={levelId}
          onValueChange={(next) => onLevelChange(String(next))}
        >
          {LEVEL_OPTIONS.map((option) => (
            <SelectableCard
              key={option.id}
              value={option.id}
              label={option.label}
              description={option.description}
              icon={option.icon}
            />
          ))}
        </RadioGroup>
      </FormSection>

      <FormSection title={COPY.profile.dailyGoalTitle}>
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
      </FormSection>

      <FormSection title={COPY.profile.goalTitle}>
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
      </FormSection>
    </div>
  );
}
