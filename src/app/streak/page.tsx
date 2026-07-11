'use client';

import { Check, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { ScreenTransition } from '@/components/onboarding/ScreenTransition';
import { COPY, ROUTES } from '@/config/onboarding-steps';
import { cn } from '@/lib/utils';

const STREAK = 1;
const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const VISIBLE_DAYS = 5;

// Первый день полоски - сегодня, дальше - следующие дни недели.
function buildWeek() {
  const today = new Date().getDay();
  return Array.from({ length: VISIBLE_DAYS }, (_, i) => ({
    label: WEEKDAYS[(today + i) % WEEKDAYS.length],
    active: i === 0,
  }));
}

// Награда после урока: streak «1 день в ударе», затем к сохранению прогресса.
export default function StreakPage() {
  const router = useRouter();
  const week = buildWeek();

  return (
    <ScreenTransition>
      <ScreenShell
        center
        footer={
          <Button
            className="h-12 w-full text-base"
            size="lg"
            onClick={() => router.push(ROUTES.saveProgress)}
          >
            {COPY.streak.action}
          </Button>
        }
      >
        <div className="flex flex-col items-center gap-2">
          <Flame className="size-20 text-amber-500" strokeWidth={1.5} />
          <span className="text-6xl font-extrabold text-amber-500 tabular-nums">{STREAK}</span>
          <span className="text-lg font-bold text-amber-500">{COPY.streak.unit}</span>
        </div>

        <div className="border-border w-full space-y-3 rounded-2xl border p-4">
          <div className="flex justify-between">
            {week.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    'text-xs font-semibold',
                    day.active ? 'text-amber-500' : 'text-muted-foreground',
                  )}
                >
                  {day.label}
                </span>
                <span
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full',
                    day.active ? 'bg-amber-500 text-white' : 'bg-muted',
                  )}
                >
                  {day.active ? <Check className="size-4" strokeWidth={3} /> : null}
                </span>
              </div>
            ))}
          </div>

          <div className="border-border border-t pt-3">
            <p className="text-muted-foreground text-center text-sm text-balance">
              {COPY.streak.hint}
            </p>
          </div>
        </div>
      </ScreenShell>
    </ScreenTransition>
  );
}
