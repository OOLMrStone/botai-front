'use client';

import { Lock } from 'lucide-react';

import { COPY } from '@/config/onboarding-steps';
import type { FeatureId } from '@/config/plans';
import { useHasFeature } from '@/hooks/use-plan';

// Гейт платной фичи: с подходящим тарифом показываем содержимое, без него -
// замок с подписью. Единственный способ закрыть что-то тарифом.
export function PlanGate({ feature, children }: { feature: FeatureId; children: React.ReactNode }) {
  const allowed = useHasFeature(feature);

  if (allowed) return <>{children}</>;

  return (
    <div className="text-muted-foreground flex items-center gap-2 text-sm">
      <Lock className="size-4 shrink-0" />
      <span>{COPY.plan.locked}</span>
    </div>
  );
}
