'use client';

import { Dialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { layout } from '@/config/layout';
import { useSheetSwipe } from '@/hooks/use-sheet-swipe';
import { cn } from '@/lib/utils';

interface DialogSheetProps {
  open: boolean;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
  headerAside?: React.ReactNode;
  className?: string;
  swipeToClose?: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DialogSheet({
  open,
  title,
  closeLabel,
  children,
  headerAside,
  className,
  swipeToClose = false,
  onOpenChange,
}: DialogSheetProps) {
  const close = () => onOpenChange(false);
  const { popupRef, backdropRef, handleProps } = useSheetSwipe({
    enabled: swipeToClose,
    onClose: close,
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop ref={backdropRef} className={layout.tasks.sheetOverlay} />
        <Dialog.Popup ref={popupRef} className={cn(layout.tasks.sheet, className)}>
          {swipeToClose ? (
            <button
              type="button"
              className={layout.tasks.sheetGrabber}
              aria-label={closeLabel}
              {...handleProps}
            >
              <span aria-hidden="true" className={layout.tasks.sheetGrabberPill} />
            </button>
          ) : null}
          <div className={layout.tasks.sheetHeader}>
            <Dialog.Title className={layout.tasks.sheetTitle}>{title}</Dialog.Title>
            <div className={layout.tasks.sheetHeaderActions}>
              {headerAside}
              {!swipeToClose ? (
                <Dialog.Close
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={layout.tasks.sheetClose}
                      aria-label={closeLabel}
                    />
                  }
                >
                  <X aria-hidden="true" className={layout.tasks.icon} />
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
