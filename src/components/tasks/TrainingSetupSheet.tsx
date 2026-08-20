'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DialogSheet } from '@/components/ui/dialog';
import type { Difficulty, TrainingSettings, TrainingTask } from '@/config/tasks';
import { TASK_COPY, TASK_COUNT_OPTIONS, TASK_DIFFICULTY_OPTIONS } from '@/config/tasks';
import { layout } from '@/config/layout';

interface TrainingSetupSheetProps {
  tasks: TrainingTask[];
  initial: TrainingSettings;
  onClose: () => void;
  onStart: (settings: TrainingSettings) => void;
}

export function TrainingSetupSheet({ tasks, initial, onClose, onStart }: TrainingSetupSheetProps) {
  const [settings, setSettings] = useState(initial);

  const toggleDifficulty = (difficulty: Difficulty) => {
    const selected = settings.difficulties.includes(difficulty);
    const next = selected
      ? settings.difficulties.filter((item) => item !== difficulty)
      : [...settings.difficulties, difficulty];
    if (next.length) setSettings({ ...settings, difficulties: next });
  };

  return (
    <DialogSheet
      open
      title={TASK_COPY.setup.title}
      closeLabel={TASK_COPY.close}
      className={layout.tasks.setup}
      headerAside={<span className={layout.tasks.sheetTime}>{TASK_COPY.setup.time}</span>}
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
              onClick={() => setSettings({ ...settings, count })}
            >
              {count === 'all' ? TASK_COPY.setup.all : count}
            </Button>
          ))}
        </div>
      </fieldset>

      <fieldset className={layout.tasks.setupGroup}>
        <legend className={layout.tasks.setupLegend}>{TASK_COPY.setup.difficulty}</legend>
        <div className={layout.tasks.difficultyGrid}>
          {TASK_DIFFICULTY_OPTIONS.map((difficulty) => {
            const available = tasks.some((task) => task.difficulty === difficulty);
            return (
              <Button
                key={difficulty}
                type="button"
                aria-pressed={settings.difficulties.includes(difficulty)}
                variant={settings.difficulties.includes(difficulty) ? 'default' : 'outline'}
                className={layout.tasks.setupOption}
                disabled={!available}
                onClick={() => toggleDifficulty(difficulty)}
              >
                {TASK_COPY.difficulty[difficulty]}
              </Button>
            );
          })}
        </div>
      </fieldset>

      <Button className={layout.tasks.setupCta} onClick={() => onStart(settings)}>
        {TASK_COPY.setup.start}
      </Button>
    </DialogSheet>
  );
}
