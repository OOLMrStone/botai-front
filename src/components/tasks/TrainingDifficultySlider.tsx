import type { CSSProperties } from 'react';

import { layout } from '@/config/layout';
import { TASK_COPY, TASK_DIFFICULTY_SLIDER } from '@/config/tasks';

interface TrainingDifficultySliderProps {
  value: number;
  valueLabel: string;
  onChange: (value: number) => void;
}

export function TrainingDifficultySlider({
  value,
  valueLabel,
  onChange,
}: TrainingDifficultySliderProps) {
  const progress =
    (value - TASK_DIFFICULTY_SLIDER.min) /
    (TASK_DIFFICULTY_SLIDER.max - TASK_DIFFICULTY_SLIDER.min);
  const progressStyle = {
    '--difficulty-progress': progress,
    '--difficulty-position': `${progress * 100}%`,
  } as CSSProperties;

  return (
    <div className={layout.tasks.difficultyControl}>
      <div className={layout.tasks.difficultyValue} aria-hidden="true">
        {valueLabel}
      </div>
      <div className={layout.tasks.difficultySliderWrap} style={progressStyle}>
        <div className={layout.tasks.difficultyTrack} aria-hidden="true">
          <span className={layout.tasks.difficultyTrackFill} />
        </div>
        <span aria-hidden="true" className={layout.tasks.difficultyThumb} />
        <input
          type="range"
          min={TASK_DIFFICULTY_SLIDER.min}
          max={TASK_DIFFICULTY_SLIDER.max}
          step={TASK_DIFFICULTY_SLIDER.step}
          value={value}
          aria-label={TASK_COPY.setup.difficulty}
          aria-valuetext={valueLabel}
          className={layout.tasks.difficultySlider}
          onInput={(event) => onChange(Number(event.currentTarget.value))}
        />
      </div>
      <div className={layout.tasks.difficultyScale} aria-hidden="true">
        <span>{TASK_COPY.setup.difficultyScale.easy}</span>
        <span>{TASK_COPY.setup.difficultyScale.balanced}</span>
        <span>{TASK_COPY.setup.difficultyScale.hard}</span>
      </div>
    </div>
  );
}
