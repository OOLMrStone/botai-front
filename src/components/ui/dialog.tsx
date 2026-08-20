'use client';

import { Dialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { layout } from '@/config/layout';
import { cn } from '@/lib/utils';

interface DialogSheetProps {
  open: boolean;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
  headerAside?: React.ReactNode;
  className?: string;
  onOpenChange: (open: boolean) => void;
}

export function DialogSheet({
  open,
  title,
  closeLabel,
  children,
  headerAside,
  className,
  onOpenChange,
}: DialogSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className={layout.tasks.sheetOverlay} />
        <Dialog.Popup className={cn(layout.tasks.sheet, className)}>
          <div className={layout.tasks.sheetHeader}>
            <Dialog.Title className={layout.tasks.sheetTitle}>{title}</Dialog.Title>
            <div className={layout.tasks.sheetHeaderActions}>
              {headerAside}
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
            </div>
          </div>
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
