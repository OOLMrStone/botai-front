import { layout } from '@/config/layout';
import { cn } from '@/lib/utils';

interface ScreenShellProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  center?: boolean;
  className?: string;
}

// Общий каркас экрана: контент + прижатый снизу блок действий. Размеры - из layout.
export function ScreenShell({ children, footer, center = false, className }: ScreenShellProps) {
  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col',
        layout.shell.padX,
        layout.shell.padTop,
        layout.shell.padBottom,
        className,
      )}
    >
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col',
          layout.shell.gap,
          center ? 'items-center justify-center text-center' : 'justify-start',
        )}
      >
        {children}
      </div>

      {footer ? <div className={layout.shell.footerTop}>{footer}</div> : null}
    </div>
  );
}
