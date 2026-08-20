'use client';

import { useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';

import { taskMotion } from '@/config/layout';

interface CardPosition {
  bounds: DOMRect;
  shared: Map<string, DOMRect>;
}

function sharedPositions(card: HTMLElement) {
  return new Map(
    Array.from(card.querySelectorAll<HTMLElement>('[data-reflow-shared]')).flatMap((element) => {
      const key = element.dataset.reflowShared;

      return key ? [[key, element.getBoundingClientRect()] as const] : [];
    }),
  );
}

function cardPositions(grid: HTMLDivElement) {
  return new Map(
    Array.from(grid.children).flatMap((child) => {
      if (!(child instanceof HTMLElement) || !child.dataset.examNumber) return [];

      return [
        [
          child.dataset.examNumber,
          { bounds: child.getBoundingClientRect(), shared: sharedPositions(child) },
        ] as const,
      ];
    }),
  );
}

function hasChangedShape(previous: DOMRect, current: DOMRect) {
  return Math.abs(previous.width - current.width) > taskMotion.catalogShapeTolerancePx;
}

function animateSharedElements(card: HTMLElement, previous: CardPosition, current: DOMRect) {
  for (const element of card.querySelectorAll<HTMLElement>('[data-reflow-shared]')) {
    const key = element.dataset.reflowShared;
    const previousBounds = key ? previous.shared.get(key) : undefined;
    if (!previousBounds) continue;

    const currentBounds = element.getBoundingClientRect();
    const x = previousBounds.left - previous.bounds.left - (currentBounds.left - current.left);
    const y = previousBounds.top - previous.bounds.top - (currentBounds.top - current.top);
    if (x === 0 && y === 0) continue;

    element.getAnimations().forEach((animation) => animation.cancel());
    element.animate(
      [{ transform: `translate3d(${x}px, ${y}px, 0)` }, { transform: 'translate3d(0, 0, 0)' }],
      {
        duration: taskMotion.catalogReflowMs,
        easing: taskMotion.catalogReflowEasing,
      },
    );
  }
}

function animateShape(card: HTMLElement, previous: CardPosition, current: DOMRect) {
  const content = card.querySelector<HTMLElement>('[data-reflow-content]');
  if (!content) return;

  content.getAnimations().forEach((animation) => animation.cancel());
  content.animate([{ opacity: taskMotion.catalogShapeStartOpacity }, { opacity: 1 }], {
    duration: taskMotion.catalogReflowMs,
    easing: taskMotion.catalogReflowEasing,
  });

  animateSharedElements(card, previous, current);
}

function animatePosition(card: HTMLElement, x: number, y: number) {
  card.animate(
    [{ transform: `translate3d(${x}px, ${y}px, 0)` }, { transform: 'translate3d(0, 0, 0)' }],
    {
      duration: taskMotion.catalogReflowMs,
      easing: taskMotion.catalogReflowEasing,
    },
  );
}

export function useCatalogReflow() {
  const gridRef = useRef<HTMLDivElement>(null);

  const runReflow = useCallback((update: () => void) => {
    const grid = gridRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!grid || reducedMotion) {
      update();
      return;
    }

    const before = cardPositions(grid);
    flushSync(update);

    for (const child of grid.children) {
      if (!(child instanceof HTMLElement) || !child.dataset.examNumber) continue;

      const previous = before.get(child.dataset.examNumber);
      if (!previous) continue;

      const current = child.getBoundingClientRect();
      const x = previous.bounds.left - current.left;
      const y = previous.bounds.top - current.top;
      if (x === 0 && y === 0 && !hasChangedShape(previous.bounds, current)) continue;

      child.getAnimations().forEach((animation) => animation.cancel());
      if (hasChangedShape(previous.bounds, current)) {
        animateShape(child, previous, current);
      } else {
        animatePosition(child, x, y);
      }
    }
  }, []);

  return { gridRef, runReflow };
}
