'use client';

import type { ComponentProps } from 'react';

import { Check } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ValidatedFieldProps extends Omit<ComponentProps<'input'>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  validate: (value: string) => boolean;
  errorText: string;
}

// Поле с инлайн-валидацией: пусто - нейтрально, невалидно - красная рамка + текст,
// валидно - зелёная рамка + галочка. Единый способ провалидированного ввода.
export function ValidatedField({
  value,
  onChange,
  validate,
  errorText,
  className,
  ...props
}: ValidatedFieldProps) {
  const state = value.length === 0 ? 'neutral' : validate(value) ? 'success' : 'error';

  return (
    <>
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={state === 'error'}
          className={cn(
            state === 'success' &&
              'border-success focus-visible:border-success focus-visible:ring-success/20 ring-success/20 pr-10 ring-3',
            className,
          )}
          {...props}
        />
        {state === 'success' ? (
          <Check className="text-success pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2" />
        ) : null}
      </div>

      {state === 'error' ? <p className="text-destructive text-sm">{errorText}</p> : null}
    </>
  );
}
