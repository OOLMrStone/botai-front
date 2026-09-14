import type { CSSProperties } from 'react';

import { layout } from '@/config/layout';

interface RangeSliderProps {
  value: number;
  valueLabel: string;
  label: string;
  min: number;
  max: number;
  step: number;
  scale: readonly string[];
  onChange: (value: number) => void;
}

export function RangeSlider({
  value,
  valueLabel,
  label,
  min,
  max,
  step,
  scale,
  onChange,
}: RangeSliderProps) {
  const progress = (value - min) / (max - min);
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
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={label}
          aria-valuetext={valueLabel}
          className={layout.tasks.difficultySlider}
          onInput={(event) => onChange(Number(event.currentTarget.value))}
        />
      </div>
      <div className={layout.tasks.difficultyScale} aria-hidden="true">
        {scale.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  );
}
