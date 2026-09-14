'use client';

import { useCallback, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';

import { animateCard, cardPositions } from '@/hooks/catalog-reflow';

export function useCatalogReflow() {
  const gridRef = useRef<HTMLDivElement>(null);
  const animationsRef = useRef<Animation[]>([]);

  useEffect(() => () => animationsRef.current.forEach((animation) => animation.cancel()), []);

  const runReflow = useCallback((update: () => void) => {
    const grid = gridRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!grid || reducedMotion) {
      animationsRef.current.forEach((animation) => animation.cancel());
      update();
      return;
    }

    // При повторном тапе продолжаем с видимой позиции, а не с конца прерванного движения.
    const before = cardPositions(grid, true);
    animationsRef.current.forEach((animation) => animation.cancel());
    flushSync(update);
    const after = cardPositions(grid);

    animationsRef.current = Array.from(after).flatMap(([card, current]) => {
      const previous = before.get(card);

      return previous ? animateCard(card, previous, current) : [];
    });
  }, []);

  return { gridRef, runReflow };
}
