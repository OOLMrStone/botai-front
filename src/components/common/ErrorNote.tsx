'use client';

import { TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { COPY } from '@/config/onboarding-steps';

// Единственный способ показать пользователю ошибку запроса: плашка с текстом и,
// если повтор имеет смысл, кнопкой «Повторить». Экраны не рисуют ошибки сами.
export function ErrorNote({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="border-destructive/40 bg-destructive/5 text-destructive flex items-center gap-2 rounded-xl border p-3 text-sm"
    >
      <TriangleAlert className="size-4 shrink-0" />
      <span className="flex-1">{message}</span>
      {onRetry ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          className="text-destructive h-auto px-2 py-1"
        >
          {COPY.errors.retry}
        </Button>
      ) : null}
    </div>
  );
}
