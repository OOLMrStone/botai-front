'use client';

import { X } from 'lucide-react';

import { ValidatedInput, type InputValidationState } from '@/components/ui/validated-input';
import { layout } from '@/config/layout';
import { TASK_COPY } from '@/config/tasks';
import { useAnswerInput } from '@/hooks/use-answer-input';
import { cn } from '@/lib/utils';

interface AnswerInputProps {
  id: string;
  value: string;
  validationState: InputValidationState;
  placeholder: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onValueChange: (value: string) => void;
}

export function AnswerInput({
  id,
  value,
  validationState,
  placeholder,
  className,
  disabled = false,
  readOnly = false,
  onValueChange,
}: AnswerInputProps) {
  const { inputRef, clear, preserveFocus, canClear } = useAnswerInput({
    value,
    disabled,
    readOnly,
    onValueChange,
  });

  return (
    <div className={layout.training.answerWrap}>
      <ValidatedInput
        ref={inputRef}
        id={id}
        inputMode="text"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        validationState={validationState}
        className={cn(layout.training.answer, className)}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        trailingAction={
          canClear ? (
            <button
              type="button"
              className={cn(layout.validatedInput.clearAction, layout.focusRing)}
              aria-label={TASK_COPY.training.clearAnswer}
              onPointerDown={preserveFocus}
              onClick={clear}
            >
              <X aria-hidden="true" className={layout.validatedInput.clearIcon} />
            </button>
          ) : undefined
        }
        onChange={(event) => onValueChange(event.target.value)}
      />
    </div>
  );
}
