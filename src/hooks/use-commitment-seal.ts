'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';

import { COMMITMENT_SEAL } from '@/config/constants';
import { capturePointer } from '@/lib/pointer-capture';

interface PressOrigin {
  pointerId: number;
  x: number;
  y: number;
}

const KEYBOARD_POINTER_ID = -1;

export function useCommitmentSeal() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const originRef = useRef<PressOrigin | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [isSealed, setIsSealed] = useState(false);

  const cancelHold = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    originRef.current = null;
    setIsHolding(false);
  }, []);

  const beginHold = useCallback(() => {
    setIsHolding(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      originRef.current = null;
      setIsHolding(false);
      setIsSealed(true);
    }, COMMITMENT_SEAL.holdDurationMs);
  }, []);

  const startHold = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (isSealed || originRef.current || !event.isPrimary) return;

      capturePointer(event.currentTarget, event.pointerId);
      originRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
      beginHold();
    },
    [beginHold, isSealed],
  );

  const startKeyboardHold = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (
        isSealed ||
        originRef.current ||
        event.repeat ||
        (event.key !== ' ' && event.key !== 'Enter')
      ) {
        return;
      }

      event.preventDefault();
      originRef.current = {
        pointerId: KEYBOARD_POINTER_ID,
        x: 0,
        y: 0,
      };
      beginHold();
    },
    [beginHold, isSealed],
  );

  const trackHold = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      const origin = originRef.current;
      if (!origin || origin.pointerId !== event.pointerId) return;

      const distance = Math.hypot(event.clientX - origin.x, event.clientY - origin.y);
      if (distance > COMMITMENT_SEAL.moveTolerancePx) cancelHold();
    },
    [cancelHold],
  );

  const endHold = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (originRef.current?.pointerId === event.pointerId) cancelHold();
    },
    [cancelHold],
  );

  const endKeyboardHold = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (
        originRef.current?.pointerId === KEYBOARD_POINTER_ID &&
        (event.key === ' ' || event.key === 'Enter')
      ) {
        event.preventDefault();
        cancelHold();
      }
    },
    [cancelHold],
  );

  useEffect(() => cancelHold, [cancelHold]);

  return {
    isHolding,
    isSealed,
    startHold,
    startKeyboardHold,
    trackHold,
    endHold,
    endKeyboardHold,
    cancelHold,
  };
}
