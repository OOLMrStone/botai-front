import type { Difficulty } from '@/config/tasks';
import { TASK_DIFFICULTY_SLIDER } from '@/config/tasks';

export interface DifficultyMix {
  easy: number;
  medium: number;
  hard: number;
}

const ALL_DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

function interpolate(from: DifficultyMix, to: DifficultyMix, progress: number): DifficultyMix {
  return {
    easy: from.easy + (to.easy - from.easy) * progress,
    medium: from.medium + (to.medium - from.medium) * progress,
    hard: from.hard + (to.hard - from.hard) * progress,
  };
}

export function clampDifficultyLevel(level: number) {
  return Math.min(TASK_DIFFICULTY_SLIDER.max, Math.max(TASK_DIFFICULTY_SLIDER.min, level));
}

export function difficultyMixAt(rawLevel: number): DifficultyMix {
  const level = clampDifficultyLevel(rawLevel);
  if (level <= 25) {
    return interpolate(
      { easy: 1, medium: 0, hard: 0 },
      { easy: 0.65, medium: 0.35, hard: 0 },
      level / 25,
    );
  }
  if (level < 40) {
    return interpolate(
      { easy: 0.65, medium: 0.35, hard: 0 },
      { easy: 0.4, medium: 0.6, hard: 0 },
      (level - 25) / 15,
    );
  }
  if (level <= 50) {
    return interpolate(
      { easy: 0.4, medium: 0.55, hard: 0.05 },
      { easy: 0.2, medium: 0.6, hard: 0.2 },
      (level - 40) / 10,
    );
  }
  if (level <= 75) {
    return interpolate(
      { easy: 0, medium: 0.6, hard: 0.4 },
      { easy: 0, medium: 0.55, hard: 0.45 },
      (level - 50) / 25,
    );
  }
  return interpolate(
    { easy: 0, medium: 0.55, hard: 0.45 },
    { easy: 0, medium: 0, hard: 1 },
    (level - 75) / 25,
  );
}

export function difficultiesAt(level: number) {
  const mix = difficultyMixAt(level);
  return ALL_DIFFICULTIES.filter((difficulty) => mix[difficulty] > 0);
}

export function difficultyLevelFromSelection(difficulties: Difficulty[]) {
  if (difficulties.length === 1) {
    if (difficulties[0] === 'easy') return TASK_DIFFICULTY_SLIDER.min;
    if (difficulties[0] === 'hard') return TASK_DIFFICULTY_SLIDER.max;
  }
  if (!difficulties.includes('hard')) return 25;
  if (!difficulties.includes('easy')) return 75;
  return TASK_DIFFICULTY_SLIDER.defaultValue;
}

export function difficultyLabelKey(level: number) {
  const normalized = clampDifficultyLevel(level);
  if (normalized <= 15) return 'easy' as const;
  if (normalized < 40) return 'easyMedium' as const;
  if (normalized <= 50) return 'balanced' as const;
  if (normalized < 85) return 'mediumHard' as const;
  return 'hard' as const;
}

export function allocateDifficultyCounts(total: number, level: number) {
  const mix = difficultyMixAt(level);
  const raw = ALL_DIFFICULTIES.map((difficulty) => ({
    difficulty,
    value: mix[difficulty] * total,
  }));
  const counts: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 };
  raw.forEach(({ difficulty, value }) => {
    counts[difficulty] = Math.floor(value);
  });

  let remainder = total - Object.values(counts).reduce((sum, count) => sum + count, 0);
  raw
    .filter(({ value }) => value > 0)
    .sort((a, b) => b.value - Math.floor(b.value) - (a.value - Math.floor(a.value)))
    .forEach(({ difficulty }) => {
      if (remainder <= 0) return;
      counts[difficulty] += 1;
      remainder -= 1;
    });

  return counts;
}
