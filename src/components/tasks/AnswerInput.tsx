import { ValidatedInput, type InputValidationState } from '@/components/ui/validated-input';
import { layout } from '@/config/layout';
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
  return (
    <div className={layout.training.answerWrap}>
      <ValidatedInput
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
        onChange={(event) => onValueChange(event.target.value)}
      />
    </div>
  );
}
