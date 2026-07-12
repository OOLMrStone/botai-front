// Мини-график «с botai vs сам»: линии рисуются на маунте (stroke draw, класс .goal-line).
// Цвета берём из CSS-переменных темы, чтобы работало и в тёмной.
export function GoalChart() {
  return (
    <div className="border-border bg-card w-full rounded-2xl border p-4">
      <p className="text-muted-foreground mb-1 text-sm">Путь к цели</p>

      <svg viewBox="0 0 306 150" className="w-full" role="img" aria-label="С botai до цели быстрее">
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
          className="goal-line goal-line--delayed"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ stroke: 'var(--muted-foreground)' }}
        />
        <path
          d="M12 122 C 120 120, 165 58, 288 26"
          className="goal-line"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ stroke: 'var(--foreground)' }}
        />

        <g className="goal-flag" style={{ color: 'var(--foreground)' }}>
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
        </g>

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
    </div>
  );
}
