'use client';

import { useCallback, useEffect, useState } from 'react';

import type { CachedResource } from '@/lib/cached-resource';

// Один способ подтянуть данные бэкенда в экран: null - грузится (экран рисует
// скелетон), failed - упало (плашка ErrorNote с «Повторить»).
export interface AsyncData<T> {
  data: T | null;
  failed: boolean;
  retry: () => void;
}

export function useAsyncData<T>(resource: CachedResource<T>): AsyncData<T> {
  const [data, setData] = useState<T | null>(resource.peek);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (data || failed) return;

    let alive = true;
    void resource.get().then(
      (loaded) => {
        if (alive) setData(loaded);
      },
      () => {
        if (alive) setFailed(true);
      },
    );

    return () => {
      alive = false;
    };
  }, [resource, data, failed]);

  const retry = useCallback(() => setFailed(false), []);

  return { data, failed, retry };
}
