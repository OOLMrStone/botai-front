'use client';

import { Flame } from 'lucide-react';

import { layout } from '@/config/layout';
import { cn } from '@/lib/utils';

const DAY_MS = 24 * 60 * 60 * 1000;
const weekdayFmt = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' });

interface StreakCalendarProps {
  streakDays: number;
}

// Неделя в ударе: текущая неделя пн-вс. Дни в пределах стрика (до сегодня) горят,
// сегодня выделен кольцом. Статично - без анимаций, только раскладка.
export function StreakCalendar({ streakDays }: StreakCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const mondayOffset = (today.getDay() + 6) % 7;

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today.getTime() + (i - mondayOffset) * DAY_MS);
    const daysAgo = Math.round((today.getTime() - date.getTime()) / DAY_MS);
    return {
      key: date.getTime(),
      label: weekdayFmt.format(date),
      date: date.getDate(),
      active: daysAgo >= 0 && daysAgo < streakDays,
      isToday: daysAgo === 0,
    };
  });

  return (
    <div className={layout.app.calendar.root}>
      {days.map((day) => (
        <div key={day.key} className={layout.app.calendar.day}>
          <span className={layout.typography.caption}>{day.label}</span>
          <div
            className={cn(
              layout.app.calendar.circle,
              day.active ? layout.app.calendar.active : layout.app.calendar.idle,
              // Кольцо внутреннее: внешнее вылезает за бокс ячейки и его срезает
              // край скролл-контейнера, когда календарь упирается в низ экрана.
              day.isToday && layout.app.calendar.today,
            )}
          >
            {day.active ? <Flame className={layout.app.calendar.icon} /> : day.date}
          </div>
        </div>
      ))}
    </div>
  );
}
