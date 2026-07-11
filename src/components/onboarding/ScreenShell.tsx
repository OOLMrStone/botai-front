import { cn } from '@/lib/utils';

interface ScreenShellProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  center?: boolean;
}

// Общий каркас экрана: контент + прижатый снизу блок действий.
export function ScreenShell({ children, footer, center = false }: ScreenShellProps) {
  return (
    <div className="flex flex-1 flex-col px-6 pt-4 pb-8">
      <div
        className={cn(
          'flex flex-1 flex-col gap-6',
          center ? 'items-center justify-center text-center' : 'justify-start',
        )}
      >
        {children}
      </div>

      {footer ? <div className="pt-6">{footer}</div> : null}
    </div>
  );
}
