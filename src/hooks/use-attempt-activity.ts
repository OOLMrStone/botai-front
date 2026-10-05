'use client';
import { useEffect } from 'react';
import { sendActivity } from '@/lib/api/stats';
import { INTEGRATION } from '@/config/integration';
export function useAttemptActivity(id: string, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let last = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      const seconds = Math.min(INTEGRATION.activitySeconds, Math.floor((now - last) / 1000));
      last = now;
      if (document.visibilityState === 'visible' && seconds > 0)
        void sendActivity(id, seconds).catch(() => undefined);
    }, INTEGRATION.activityMs);
    return () => clearInterval(timer);
  }, [id, enabled]);
}
