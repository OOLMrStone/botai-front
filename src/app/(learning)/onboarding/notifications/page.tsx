'use client';

import { Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { layout } from '@/config/layout';
import { COPY } from '@/config/onboarding-steps';
import { useOnboardingFlow } from '@/hooks/use-flow-navigation';
import { useOnboardingStore } from '@/stores/onboarding-store';

// Экран-имитация запроса уведомлений. Реальный Notification API не трогаем.
export default function NotificationsPage() {
  const { goNext } = useOnboardingFlow('notifications');
  const setNotifications = useOnboardingStore((s) => s.setNotifications);

  const finish = (enabled: boolean) => {
    setNotifications(enabled);
    goNext();
  };

  return (
    <ScreenShell
      center
      footer={
        <div className={layout.ctaStack}>
          <Button className={layout.cta} size="default" onClick={() => finish(true)}>
            {COPY.notifications.primary}
          </Button>
          <Button
            variant="ghost"
            className={layout.cta}
            size="default"
            onClick={() => finish(false)}
          >
            {COPY.notifications.secondary}
          </Button>
        </div>
      }
    >
      <div className={layout.surface.illustration}>
        <Bell className="size-8" />
      </div>

      <ScreenHeading title={COPY.notifications.title} subtitle={COPY.notifications.subtitle} />
    </ScreenShell>
  );
}
