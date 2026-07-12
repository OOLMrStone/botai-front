'use client';

import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

import { MascotPlaceholder } from '@/components/onboarding/MascotPlaceholder';
import { TIMINGS } from '@/config/constants';

interface BuildingLoaderProps {
  title: string;
  subtitle?: string;
  onDone: () => void;
  durationMs?: number;
}

// Лоадер «Строим курс…»: держит экран, затем авто-переход через onDone.
export function BuildingLoader({
  title,
  subtitle,
  onDone,
  durationMs = TIMINGS.courseBuildMs,
}: BuildingLoaderProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, durationMs);
    return () => clearTimeout(timer);
  }, [onDone, durationMs]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <MascotPlaceholder />

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight whitespace-pre-line">{title}</h1>
        {subtitle ? (
          <p className="text-muted-foreground text-balance whitespace-pre-line">{subtitle}</p>
        ) : null}
      </div>

      <Loader2 className="text-muted-foreground size-6 animate-spin" />
    </div>
  );
}
