'use client';

import type { KeyboardEvent, PointerEvent } from 'react';
import { useRef, useState } from 'react';

import { taskGestures } from '@/config/layout';

interface ScrubberInput {
  taskCount: number;
  currentIndex: number;
  onSelect: (index: number) => void;
}

interface PointerAnchor {
  x: number;
  index: number;
  segmentWidth: number;
}

export function useTaskScrubber({ taskCount, currentIndex, onSelect }: ScrubberInput) {
  const scrubberRef = useRef<HTMLDivElement>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const anchor = useRef<PointerAnchor | null>(null);
  const [precise, setPrecise] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(currentIndex);

  const indexAt = (clientX: number) => {
    const rect = scrubberRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const ratio = Math.min(0.999, Math.max(0, (clientX - rect.left) / rect.width));

    return Math.floor(ratio * taskCount);
  };

  const clearHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
  };

  const cancel = () => {
    clearHold();
    setPrecise(false);
    anchor.current = null;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();

    if (event.key === 'ArrowLeft') onSelect(Math.max(0, currentIndex - 1));
    if (event.key === 'ArrowRight') onSelect(Math.min(taskCount - 1, currentIndex + 1));
    if (event.key === 'Home') onSelect(0);
    if (event.key === 'End') onSelect(taskCount - 1);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const index = indexAt(event.clientX);
    event.currentTarget.setPointerCapture(event.pointerId);
    anchor.current = { x: event.clientX, index, segmentWidth: bounds.width / taskCount };
    setPreviewIndex(index);
    clearHold();
    holdTimer.current = setTimeout(() => setPrecise(true), taskGestures.scrubberHoldMs);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!precise || !anchor.current) return;
    const slowedDelta = (event.clientX - anchor.current.x) * taskGestures.scrubberSlowdown;
    const indexDelta = Math.round(slowedDelta / anchor.current.segmentWidth);
    setPreviewIndex(Math.min(taskCount - 1, Math.max(0, anchor.current.index + indexDelta)));
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    clearHold();
    onSelect(precise ? previewIndex : indexAt(event.clientX));
    setPrecise(false);
    anchor.current = null;
  };

  const lensIndices = Array.from(
    { length: taskGestures.scrubberLensRadius * 2 + 1 },
    (_, offset) => previewIndex - taskGestures.scrubberLensRadius + offset,
  ).filter((index) => index >= 0 && index < taskCount);

  return {
    scrubberRef,
    precise,
    previewIndex,
    lensIndices,
    onKeyDown,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: cancel,
  };
}
