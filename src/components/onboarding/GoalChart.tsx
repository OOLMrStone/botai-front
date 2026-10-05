import { BrandText } from '@/components/onboarding/BrandText';
import { layout } from '@/config/layout';
import { COPY } from '@/config/onboarding-steps';

// Мини-график «с botai vs сам»: статичные линии, поверх - шторка .goal-wipe и
// флажок .goal-flag. Оба анимируемых слоя - отдельные элементы поверх графика,
// а не элементы внутри <svg>: WebKit не даёт содержимому svg собственный слой,
// и transform на нём перерисовывает весь график каждый кадр (на мобиле видно).
// Цвета - из CSS-переменных темы, чтобы работало и в тёмной.
export function GoalChart() {
  return (
    <div className={layout.surface.chart}>
      <p className="text-muted-foreground mb-1 text-sm">{COPY.goalChart.title}</p>

      <div className="relative overflow-hidden">
        <svg
          viewBox="0 0 306 150"
          className="w-full"
          role="img"
          aria-label={COPY.goalChart.accessibleLabel}
        >
          <line
            x1="12"
            y1="132"
            x2="288"
            y2="132"
            style={{ stroke: 'var(--border)' }}
            strokeWidth="1"
          />

          <path
            d="M12 122 C 100 118, 190 112, 288 104"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ stroke: 'var(--muted-foreground)' }}
          />
          <path
            d="M12 122 C 120 120, 165 58, 288 26"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ stroke: 'var(--foreground)' }}
          />

          <foreignObject {...layout.goalChart.brandLabel}>
            <div className={layout.goalChart.brandLabelClass}>
              <BrandText text={COPY.goalChart.withBrand} />
            </div>
          </foreignObject>
          <text x="150" y="98" fontSize="11" style={{ fill: 'var(--muted-foreground)' }}>
            {COPY.goalChart.alone}
          </text>
          <text x="12" y="147" fontSize="10" style={{ fill: 'var(--muted-foreground)' }}>
            {COPY.goalChart.now}
          </text>
          <text x="266" y="147" fontSize="10" style={{ fill: 'var(--muted-foreground)' }}>
            {COPY.goalChart.exam}
          </text>
        </svg>

        {/* Флажок отдельным svg в той же системе координат: анимируем сам элемент svg,
            он получает слой композитора как обычный блок. */}
        <svg
          viewBox="0 0 306 150"
          aria-hidden="true"
          className="goal-flag absolute inset-0 w-full"
          style={{ color: 'var(--foreground)' }}
        >
          <line
            x1="288"
            y1="26"
            x2="288"
            y2="7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M288 7 L 302 11 L 288 15 Z" fill="currentColor" />
          <circle cx="288" cy="26" r="2.5" fill="currentColor" />
        </svg>

        {/* Шторка поверх графика: цвет карточки, уезжает вправо и проявляет линии. */}
        <div className="goal-wipe bg-card absolute inset-0" aria-hidden="true" />
      </div>
    </div>
  );
}
