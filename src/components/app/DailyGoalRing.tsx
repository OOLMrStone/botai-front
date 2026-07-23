import { COPY } from '@/config/onboarding-steps';

interface DailyGoalRingProps {
  progressMinutes: number;
  goalMinutes: number;
}

// Радиальный прогресс дневной цели: дуга рисуется через strokeDasharray/offset,
// цвета берём из переменных темы, как в GoalChart. Центр показывает минуты.
export function DailyGoalRing({ progressMinutes, goalMinutes }: DailyGoalRingProps) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  // goalMinutes <= 0 - цель ещё не загрузилась: пустое кольцо, без NaN и без «выполнено».
  const fraction = goalMinutes > 0 ? Math.min(progressMinutes / goalMinutes, 1) : 0;
  const done = goalMinutes > 0 && progressMinutes >= goalMinutes;

  return (
    <div className="border-border bg-card w-full rounded-2xl border p-4">
      <p className="text-muted-foreground mb-3 text-sm">
        {done ? COPY.home.dailyGoalDone : COPY.home.dailyGoalTitle}
      </p>

      <svg
        viewBox="0 0 120 120"
        className="mx-auto block size-40"
        role="img"
        aria-label={`${COPY.home.dailyGoalTitle}: ${progressMinutes} / ${goalMinutes} ${COPY.home.dailyGoalUnit}`}
      >
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="10"
          style={{ stroke: 'var(--border)' }}
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
          transform="rotate(-90 60 60)"
          style={{ stroke: 'var(--foreground)' }}
        />

        <text
          x="60"
          y="58"
          textAnchor="middle"
          fontSize="20"
          fontWeight="700"
          style={{ fill: 'var(--foreground)' }}
        >
          {progressMinutes} / {goalMinutes}
        </text>
        <text
          x="60"
          y="78"
          textAnchor="middle"
          fontSize="12"
          style={{ fill: 'var(--muted-foreground)' }}
        >
          {COPY.home.dailyGoalUnit}
        </text>
      </svg>
    </div>
  );
}
