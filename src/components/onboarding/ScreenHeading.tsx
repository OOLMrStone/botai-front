import type { ReactNode } from 'react';

interface ScreenHeadingProps {
  title: ReactNode;
  subtitle?: string;
}

// Единая типографика заголовка экрана (скилл typography): h1 + опциональный подзаголовок.
// Оба поддерживают ручной перенос через \n (whitespace-pre-line).
export function ScreenHeading({ title, subtitle }: ScreenHeadingProps) {
  return (
    <div className="space-y-3">
      <h1 className="text-4xl font-extrabold tracking-tight text-balance whitespace-pre-line">
        {title}
      </h1>
      {subtitle ? (
        <p className="text-muted-foreground text-lg text-balance whitespace-pre-line">{subtitle}</p>
      ) : null}
    </div>
  );
}
