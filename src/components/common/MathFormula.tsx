import katex from 'katex';
import { layout } from '@/config/layout';
import { cn } from '@/lib/utils';

export function MathFormula({
  value,
  className,
  displayMode = false,
}: {
  value: string;
  className?: string;
  displayMode?: boolean;
}) {
  const html = katex.renderToString(value, {
    throwOnError: false,
    output: 'htmlAndMathml',
    displayMode,
  });

  return (
    <div className={cn(layout.mathFormula, className)} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
