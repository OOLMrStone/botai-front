'use client';

import { TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { layout } from '@/config/layout';
import { COPY } from '@/config/onboarding-steps';

// Единственный способ показать пользователю ошибку запроса: плашка с текстом и,
// если повтор имеет смысл, кнопкой «Повторить». Экраны не рисуют ошибки сами.
export function ErrorNote({
  message,
  onRetry,
  retryLabel = COPY.errors.retry,
}: {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <div role="alert" className={layout.errorNote.root}>
      <TriangleAlert className={layout.errorNote.icon} />
      <span className={layout.errorNote.message}>{message}</span>
      {onRetry ? (
        <Button variant="ghost" onClick={onRetry} className={layout.errorNote.retry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
