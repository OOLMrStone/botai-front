'use client';

import { useRef, type PointerEvent } from 'react';

interface AnswerInputOptions {
  value: string;
  disabled: boolean;
  readOnly: boolean;
  onValueChange: (value: string) => void;
}

export function useAnswerInput({ value, disabled, readOnly, onValueChange }: AnswerInputOptions) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canClear = value.length > 0 && !disabled && !readOnly;

  const clear = () => {
    onValueChange('');
    inputRef.current?.focus({ preventScroll: true });
  };

  // Не закрываем экранную клавиатуру между нажатием крестика и очисткой.
  const preserveFocus = (event: PointerEvent<HTMLButtonElement>) => event.preventDefault();

  return { inputRef, canClear, clear, preserveFocus };
}
