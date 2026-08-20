'use client';

import type { ComponentProps } from 'react';

import { Check } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type InputValidationState = 'neutral' | 'error' | 'success';

interface ValidatedInputProps extends ComponentProps<'input'> {
  validationState: InputValidationState;
}

export function ValidatedInput({ validationState, className, ...props }: ValidatedInputProps) {
  return (
    <div className="relative">
      <Input
        aria-invalid={validationState === 'error'}
        className={cn(
          validationState === 'success' &&
            'border-success focus-visible:border-success focus-visible:ring-success/20 ring-success/20 pr-10 ring-3',
          className,
        )}
        {...props}
      />
      {validationState === 'success' ? (
        <Check className="text-success pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2" />
      ) : null}
    </div>
  );
}
