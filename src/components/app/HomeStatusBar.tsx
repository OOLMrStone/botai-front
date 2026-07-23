import { Flame, Zap } from 'lucide-react';

import { COPY } from '@/config/onboarding-steps';

interface HomeStatusBarProps {
  streakDays: number;
  xp: number;
}

// Верхняя строка хаба: стрик (пламя) слева и XP справа. Значения - из useUserStats.
// aria-label на стрике, потому что одна цифра рядом с иконкой без него непонятна.
export function HomeStatusBar({ streakDays, xp }: HomeStatusBarProps) {
  return (
    <div className="text-foreground flex items-center justify-between font-semibold">
      <span
        className="flex items-center gap-1.5"
        aria-label={`${streakDays} ${COPY.home.streakUnit}`}
      >
        <Flame className="size-5" />
        {streakDays}
      </span>

      <span className="flex items-center gap-1.5">
        <Zap className="size-5" />
        {`${xp} ${COPY.home.xpUnit}`}
      </span>
    </div>
  );
}
