'use client';

import { Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { COPY } from '@/config/onboarding-steps';
import { useOnboardingFlow } from '@/hooks/use-flow-navigation';
import { useOnboardingStore } from '@/stores/onboarding-store';

// Экран-имитация запроса уведомлений. Реальный Notification API не трогаем.
export default function NotificationsPage() {
  const { goNext } = useOnboardingFlow();
  const setNotifications = useOnboardingStore((s) => s.setNotifications);

  const finish = (enabled: boolean) => {
    setNotifications(enabled);
    goNext('notifications');
  };

  return (
    <ScreenShell
      center
      footer={
        <div className="space-y-3">
          <Button className="h-12 w-full text-base" size="lg" onClick={() => finish(true)}>
            {COPY.notifications.primary}
          </Button>
          <Button
            variant="ghost"
            className="h-12 w-full text-base"
            size="lg"
            onClick={() => finish(false)}
          >
            {COPY.notifications.secondary}
          </Button>
        </div>
      }
    >
      <div className="bg-muted text-muted-foreground flex size-20 items-center justify-center rounded-3xl">
        <Bell className="size-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-balance">
          {COPY.notifications.title}
        </h1>
        <p className="text-muted-foreground text-balance">{COPY.notifications.subtitle}</p>
      </div>
    </ScreenShell>
  );
}
