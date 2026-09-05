'use client';

import { useEffect, useRef, useState } from 'react';

import { ERASER_MENU_MOTION } from '@/config/constants';
import type { DrawingTool } from '@/config/tasks';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

type EraserTool = Extract<DrawingTool, `${string}-eraser`>;

interface UseEraserMenuOptions {
  tool: DrawingTool;
  selectEraser: (tool: EraserTool) => void;
  disableEraser: () => void;
}

export function useEraserMenu({ tool, selectEraser, disableEraser }: UseEraserMenuOptions) {
  const [open, setOpen] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const selectingRef = useRef(false);
  const selectionRunRef = useRef(0);
  const activeAnimationsRef = useRef<Animation[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const strokeOptionRef = useRef<HTMLButtonElement>(null);
  const pointOptionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const selectedOption = tool === 'point-eraser' ? pointOptionRef : strokeOptionRef;
    selectedOption.current?.focus();
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      activeAnimationsRef.current.forEach((animation) => animation.cancel());
      selectionRunRef.current += 1;
      selectingRef.current = false;
      setSelecting(false);
      setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      activeAnimationsRef.current.forEach((animation) => animation.cancel());
      selectionRunRef.current += 1;
      selectingRef.current = false;
      setSelecting(false);
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('pointerdown', closeOnOutsidePress);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open, tool]);

  const toggle = () => {
    if (selectingRef.current) {
      activeAnimationsRef.current.forEach((animation) => animation.cancel());
      selectionRunRef.current += 1;
      selectingRef.current = false;
      setSelecting(false);
    }
    if (tool === 'stroke-eraser' || tool === 'point-eraser') {
      disableEraser();
      setOpen(false);
      return;
    }

    selectEraser('stroke-eraser');
    setOpen(true);
  };

  const select = async (nextTool: EraserTool) => {
    if (selectingRef.current) {
      activeAnimationsRef.current.forEach((animation) => animation.cancel());
      selectingRef.current = false;
      setSelecting(false);
    }
    const selectionRun = selectionRunRef.current + 1;
    selectionRunRef.current = selectionRun;
    const option = nextTool === 'point-eraser' ? pointOptionRef.current : strokeOptionRef.current;
    const trigger = triggerRef.current;
    selectEraser(nextTool);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!option || !trigger || reducedMotion) {
      setOpen(false);
      trigger?.focus();
      return;
    }

    selectingRef.current = true;
    setSelecting(true);
    const optionRect = option.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const translateX = triggerRect.left - optionRect.left;
    const translateY = triggerRect.top - optionRect.top;
    const sibling = nextTool === 'point-eraser' ? strokeOptionRef.current : pointOptionRef.current;
    const animationOptions = {
      duration: ERASER_MENU_MOTION.selectDurationMs,
      easing: ERASER_MENU_MOTION.selectEasing,
      fill: 'forwards' as const,
    };
    const selectedAnimation = option.animate(
      [
        { transform: 'translate3d(0, 0, 0)', opacity: 1 },
        { transform: `translate3d(${translateX}px, ${translateY}px, 0)`, opacity: 1 },
      ],
      animationOptions,
    );
    const siblingAnimation = sibling?.animate([{ opacity: 1 }, { opacity: 0 }], animationOptions);
    activeAnimationsRef.current = [selectedAnimation, siblingAnimation].filter(
      (animation): animation is Animation => animation !== undefined,
    );

    await selectedAnimation.finished.catch(() => undefined);
    if (selectionRun !== selectionRunRef.current) return;
    activeAnimationsRef.current = [];
    setOpen(false);
    selectingRef.current = false;
    setSelecting(false);
    triggerRef.current?.focus();
  };

  const navigate = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key))
      return;
    event.preventDefault();
    const moveToPoint = ['ArrowRight', 'ArrowDown', 'End'].includes(event.key);
    (moveToPoint ? pointOptionRef : strokeOptionRef).current?.focus();
  };

  return {
    open,
    selecting,
    rootRef,
    triggerRef,
    strokeOptionRef,
    pointOptionRef,
    toggle,
    select,
    navigate,
    close: () => {
      activeAnimationsRef.current.forEach((animation) => animation.cancel());
      selectionRunRef.current += 1;
      selectingRef.current = false;
      setSelecting(false);
      setOpen(false);
    },
  };
}
