'use client';

import { useRef, useState } from 'react';

import type { PointerEvent as ReactPointerEvent } from 'react';

import { cn } from '@/lib/utils';

interface SignaturePadProps {
  onSignedChange?: (signed: boolean) => void;
  className?: string;
}

// Поле для росчерка на canvas. Цвет линии - currentColor (тема), координаты масштабируем.
export function SignaturePad({ onSignedChange, className }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [hasInk, setHasInk] = useState(false);

  const pointFor = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const start = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    canvas.setPointerCapture(e.pointerId);
    ctx.strokeStyle = getComputedStyle(canvas).color;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const p = pointFor(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    drawing.current = true;
  };

  const move = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;

    const ctx = canvasRef.current!.getContext('2d')!;
    const p = pointFor(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();

    if (!hasInk) {
      setHasInk(true);
      onSignedChange?.(true);
    }
  };

  const end = () => {
    drawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current!;
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
    onSignedChange?.(false);
  };

  return (
    <div className={cn('relative', className)}>
      <canvas
        ref={canvasRef}
        width={600}
        height={220}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        className="text-foreground border-border bg-card h-40 w-full touch-none rounded-2xl border"
      />
      {hasInk ? (
        <button
          type="button"
          onClick={clear}
          className="text-muted-foreground hover:text-foreground absolute top-3 right-3 text-xs transition-colors"
        >
          Очистить
        </button>
      ) : null}
    </div>
  );
}
