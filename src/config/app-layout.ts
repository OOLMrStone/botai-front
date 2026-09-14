// Геометрия хаба и профиля: карточки, метрики и состояния загрузки.
export const appLayout = {
  card: {
    surface: 'border-border bg-card min-w-0 w-full shrink-0 rounded-2xl border p-4',
    stack: 'flex flex-col gap-3',
    compact: 'gap-1',
    heading: 'flex flex-col gap-1',
  },
  home: {
    content: 'flex flex-col gap-5',
    reveal: 'min-h-11 self-start px-3 text-sm',
    question: 'text-base font-medium',
    answer: 'text-sm leading-relaxed text-muted-foreground',
    ring: 'relative mx-auto size-40 shrink-0',
    ringSvg: 'block size-full',
    ringTrack: 'stroke-border',
    ringProgress: 'stroke-foreground',
    ringLabel: 'absolute inset-0 flex flex-col items-center justify-center gap-1',
    status: 'flex min-h-6 items-center justify-between font-semibold text-foreground',
    statusItem: 'flex items-center gap-1.5',
    statusIcon: 'size-5 shrink-0',
  },
  profile: {
    content: 'space-y-6',
    identity: 'flex flex-col items-center gap-3 text-center',
    avatar: 'bg-muted text-muted-foreground flex size-20 items-center justify-center rounded-3xl',
    avatarIcon: 'size-8',
    email: 'max-w-full [overflow-wrap:anywhere]',
    settings:
      'flex items-center gap-3 text-left transition-transform active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100',
    settingsLabel: 'min-w-0 flex-1',
    settingsIcon: 'text-muted-foreground size-5 shrink-0',
    section: 'space-y-3',
    grid: 'grid grid-cols-2 gap-3',
    metricLabel: 'flex min-w-0 items-center gap-1.5',
    metricIcon: 'size-4 shrink-0',
    metricValue: 'leading-tight [overflow-wrap:anywhere]',
    skeleton: 'h-20 rounded-2xl',
  },
  calendar: {
    root: 'grid grid-cols-7 gap-1',
    day: 'flex min-w-0 flex-col items-center gap-1.5',
    circle: 'flex aspect-square w-full max-w-9 items-center justify-center rounded-full text-sm',
    active: 'bg-primary/10 text-primary',
    idle: 'bg-muted text-muted-foreground',
    today: 'inset-ring-primary inset-ring-2',
    icon: 'size-4',
  },
  planGate: {
    root: 'text-muted-foreground flex items-center gap-2 text-sm',
    icon: 'size-4 shrink-0',
  },
  skeleton: {
    status: 'h-6 w-16 rounded-full',
    caption: 'h-5 w-24',
    ring: 'size-full rounded-full',
    question: 'h-12 w-full',
    action: 'h-11 w-32',
  },
} as const;

export const dailyGoalRing = {
  viewBox: '0 0 120 120',
  center: 60,
  radius: 52,
  strokeWidth: 10,
  start: 'rotate(-90 60 60)',
} as const;

export const profileSkeletonTiles = ['streak', 'xp', 'goal', 'daily-goal'] as const;
