'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import type { DailyTask } from '@/config/daily-tasks';
import { COPY } from '@/config/onboarding-steps';

// Карточка задачи дня: условие и ответ по кнопке. Ответ прячем, чтобы сначала
// подумать - в этом весь смысл задачи дня.
export function DailyTaskCard({ task }: { task: DailyTask }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="border-border bg-card w-full space-y-2 rounded-2xl border p-4">
      <p className="text-muted-foreground text-sm">{COPY.home.dailyTaskTitle}</p>
      <p className="font-medium">{task.question}</p>

      {revealed ? (
        <p className="text-muted-foreground text-sm">{`${COPY.home.dailyTaskAnswerPrefix}: ${task.answer}`}</p>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setRevealed(true)}>
          {COPY.home.dailyTaskReveal}
        </Button>
      )}
    </div>
  );
}
