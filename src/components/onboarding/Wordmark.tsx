import { cn } from '@/lib/utils';

interface WordmarkProps {
  className?: string;
}

// Фирменный логотип botai (роль «Brand wordmark» скилла typography): строчный,
// 'bot' сплошным цветом текста, 'ai' - хромовый металл с дышащим светом
// (.wordmark-chrome в globals.css). Единственный источник начертания логотипа.
//
// Геометрически логотип центрируется контейнером ровно, но светлое хромовое 'ai'
// читается легче чёрного 'bot' - визуальная масса уходит влево. Сдвигаем вправо
// на эту величину, чтобы оптически встать по центру (компенсация светимости 'ai').
export function Wordmark({ className }: WordmarkProps) {
  return (
    <span
      role="img"
      aria-label="botai"
      className={cn(
        'inline-flex translate-x-[-1px] text-6xl font-extrabold tracking-tight',
        className,
      )}
    >
      <span aria-hidden="true">bot</span>
      <span aria-hidden="true" className="wordmark-chrome">
        ai
      </span>
    </span>
  );
}
