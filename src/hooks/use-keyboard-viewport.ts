'use client';

import { useEffect } from 'react';

export function useKeyboardViewport() {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    let frame = 0;

    const syncViewport = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          '--training-viewport-height',
          `${viewport.height}px`,
        );
        document.documentElement.style.setProperty(
          '--training-viewport-offset-top',
          `${viewport.offsetTop}px`,
        );
      });
    };

    syncViewport();
    viewport.addEventListener('resize', syncViewport);
    viewport.addEventListener('scroll', syncViewport);
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.style.removeProperty('--training-viewport-height');
      document.documentElement.style.removeProperty('--training-viewport-offset-top');
      viewport.removeEventListener('resize', syncViewport);
      viewport.removeEventListener('scroll', syncViewport);
    };
  }, []);
}
