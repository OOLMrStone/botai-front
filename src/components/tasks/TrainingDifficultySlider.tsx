import { RangeSlider } from '@/components/common/RangeSlider';
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
  return (
    <RangeSlider
      value={value}
      valueLabel={valueLabel}
      label={TASK_COPY.setup.difficulty}
      {...TASK_DIFFICULTY_SLIDER}
      scale={Object.values(TASK_COPY.setup.difficultyScale)}
      onChange={onChange}
    />
  );
}
