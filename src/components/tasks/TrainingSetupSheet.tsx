'use client';

import { Button } from '@/components/ui/button';
import { DialogSheet } from '@/components/ui/dialog';
import { layout } from '@/config/layout';
import type { TrainingSettings, TrainingTask } from '@/config/tasks';
import { TASK_COPY, TASK_COUNT_OPTIONS } from '@/config/tasks';
import { useTrainingSetup } from '@/hooks/use-training-setup';

import { TrainingDifficultySlider } from './TrainingDifficultySlider';

interface TrainingSetupSheetProps {
  tasks: TrainingTask[];
  initial: TrainingSettings;
  onClose: () => void;
  onStart: (settings: TrainingSettings) => void;
}

export function TrainingSetupSheet({ tasks, initial, onClose, onStart }: TrainingSetupSheetProps) {
  const { settings, difficultyLevel, difficultyLabelKey, canStart, setCount, setDifficultyLevel } =
    useTrainingSetup(initial, tasks);

  return (
    <DialogSheet
      open
      title={TASK_COPY.setup.title}
      closeLabel={TASK_COPY.close}
      className={layout.tasks.setup}
      swipeToClose
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <fieldset className={layout.tasks.setupGroup}>
        <legend className={layout.tasks.setupLegend}>{TASK_COPY.setup.count}</legend>
        <div className={layout.tasks.countGrid}>
          {TASK_COUNT_OPTIONS.map((count) => (
            <Button
              key={count}
              type="button"
              aria-pressed={settings.count === count}
              variant={settings.count === count ? 'default' : 'outline'}
              className={layout.tasks.setupOption}
              onClick={() => setCount(count)}
            >
              {count === 'all' ? TASK_COPY.setup.all : count}
            </Button>
          ))}
        </div>
      </fieldset>

      <fieldset className={layout.tasks.setupGroup} disabled={tasks.length === 0}>
        <div className={layout.tasks.setupLegendRow}>
          <legend className={layout.tasks.setupLegend}>{TASK_COPY.setup.difficulty}</legend>
          <span className={layout.tasks.setupHint}>{TASK_COPY.setup.difficultyHint}</span>
        </div>
        <TrainingDifficultySlider
          value={difficultyLevel}
          valueLabel={TASK_COPY.setup.difficultyLevels[difficultyLabelKey]}
          onChange={setDifficultyLevel}
        />
      </fieldset>

      <Button
        className={layout.tasks.setupCta}
        disabled={!canStart}
        onClick={() => onStart(settings)}
      >
        {TASK_COPY.setup.start}
      </Button>
    </DialogSheet>
  );
}
