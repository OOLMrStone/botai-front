'use client';

import { useEffect } from 'react';

export function useKeyboardViewport(inputId: string) {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const keepInputVisible = () => {
      const input = document.getElementById(inputId);
      const keyboardOffset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      document.documentElement.style.setProperty('--keyboard-offset', `${keyboardOffset}px`);
      if (document.activeElement === input)
        input?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };

    viewport.addEventListener('resize', keepInputVisible);
    viewport.addEventListener('scroll', keepInputVisible);
    return () => {
      document.documentElement.style.removeProperty('--keyboard-offset');
      viewport.removeEventListener('resize', keepInputVisible);
      viewport.removeEventListener('scroll', keepInputVisible);
    };
  }, [inputId]);
}
