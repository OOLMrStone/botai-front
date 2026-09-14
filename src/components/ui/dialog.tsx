'use client';

import { Dialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { layout } from '@/config/layout';
import { useSheetSwipe } from '@/hooks/use-sheet-swipe';
import { preventGestureContextMenu } from '@/lib/gesture-surface';
import { cn } from '@/lib/utils';

interface DialogSheetProps {
  open: boolean;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
  className?: string;
  swipeToClose?: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DialogSheet({
  open,
  title,
  closeLabel,
  children,
  className,
  swipeToClose = false,
  onOpenChange,
}: DialogSheetProps) {
  const close = () => onOpenChange(false);
  const { popupRef, backdropRef, handleProps } = useSheetSwipe({
    enabled: open && swipeToClose,
    onClose: close,
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop ref={backdropRef} className={layout.sheet.overlay} />
        <Dialog.Popup
          ref={popupRef}
          className={cn(layout.sheet.root, layout.viewport.width, className)}
        >
          {swipeToClose ? (
            <button
              type="button"
              className={cn(layout.sheet.grabber, layout.gestureSurface)}
              aria-label={closeLabel}
              onContextMenu={preventGestureContextMenu}
              {...handleProps}
            >
              <span aria-hidden="true" className={layout.sheet.grabberPill} />
            </button>
          ) : null}
          <div className={layout.sheet.header}>
            <Dialog.Title className={layout.sheet.title}>{title}</Dialog.Title>
            <div className={layout.sheet.headerActions}>
              {!swipeToClose ? (
                <Dialog.Close
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={layout.sheet.close}
                      aria-label={closeLabel}
                    />
                  }
                >
                  <X aria-hidden="true" className={layout.sheet.icon} />
                </Dialog.Close>
              ) : null}
            </div>
          </div>
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
