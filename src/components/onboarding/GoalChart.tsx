// Мини-график «с botai vs сам»: статичные линии, поверх - шторка .goal-wipe и
// флажок .goal-flag. Оба анимируемых слоя - отдельные элементы поверх графика,
// а не элементы внутри <svg>: WebKit не даёт содержимому svg собственный слой,
// и transform на нём перерисовывает весь график каждый кадр (на мобиле видно).
// Цвета - из CSS-переменных темы, чтобы работало и в тёмной.
export function GoalChart() {
  return (
    <div className="border-border bg-card w-full rounded-2xl border p-4">
      <p className="text-muted-foreground mb-1 text-sm">Путь к цели</p>

      <div className="relative overflow-hidden">
        <svg
          viewBox="0 0 306 150"
          className="w-full"
          role="img"
          aria-label="С botai до цели быстрее"
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

          <text x="196" y="20" fontSize="11" fontWeight="600" style={{ fill: 'var(--foreground)' }}>
            С botai
          </text>
          <text x="150" y="98" fontSize="11" style={{ fill: 'var(--muted-foreground)' }}>
            Сам по себе
          </text>
          <text x="12" y="147" fontSize="10" style={{ fill: 'var(--muted-foreground)' }}>
            Сейчас
          </text>
          <text x="266" y="147" fontSize="10" style={{ fill: 'var(--muted-foreground)' }}>
            ЕГЭ
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
