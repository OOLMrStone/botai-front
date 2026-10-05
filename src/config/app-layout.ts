// Геометрия хаба и профиля: карточки, метрики и состояния загрузки.
export const appLayout = {
  card: {
    surface: 'border-border bg-card min-w-0 w-full shrink-0 rounded-card border p-4',
    stack: 'flex flex-col gap-3',
    compact: 'gap-1',
    heading: 'flex flex-col gap-1',
  },
  home: {
    content: 'flex shrink-0 flex-col gap-5 desktop:gap-8',
    header:
      'contents desktop:flex desktop:flex-row-reverse desktop:items-center desktop:justify-between desktop:gap-8',
    cards:
      'contents desktop:grid desktop:gap-8 xl:grid xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-6 landscape-short:grid landscape-short:grid-cols-2 landscape-short:gap-3',
    goalTitle: 'flex items-center gap-2 text-sm text-muted-foreground',
    goalCard:
      'desktop:p-6 xl:col-start-2 xl:row-start-1 xl:min-h-64 xl:justify-between landscape-short:col-start-2 landscape-short:row-start-1',
    taskCard:
      'desktop:p-6 xl:col-start-1 xl:row-start-2 xl:min-h-52 landscape-short:col-start-1 landscape-short:row-start-2',
    taskError: 'contents xl:block',
    continueCard:
      'desktop:order-first desktop:p-6 xl:col-start-1 xl:row-start-1 xl:min-h-64 xl:justify-between landscape-short:col-start-1 landscape-short:row-start-1 landscape-short:justify-between xl:bg-muted/30',
    continueAction: 'desktop:max-w-xs',
    reviewCard:
      'desktop:p-6 xl:col-start-2 xl:row-start-2 xl:min-h-52 landscape-short:col-start-2 landscape-short:row-start-2',
    reveal: 'min-h-11 self-start px-3 text-sm',
    question: 'text-base font-medium',
    answer: 'text-sm leading-relaxed text-muted-foreground',
    ring: 'relative mx-auto size-40 shrink-0 landscape-short:size-28',
    ringSvg: 'block size-full',
    ringTrack: 'stroke-border',
    ringProgress: 'stroke-foreground',
    ringLabel: 'absolute inset-0 flex flex-col items-center justify-center gap-1',
    status:
      'grid min-h-6 grid-cols-[1fr_auto_1fr] items-center gap-3 font-semibold text-foreground desktop:flex desktop:shrink-0 desktop:gap-6',
    statusItem: 'flex items-center gap-1.5',
    brand: 'desktop:hidden',
    statusEnd: 'flex items-center justify-end gap-1.5',
    statusIcon: 'size-5 shrink-0',
  },
  profile: {
    shell: '[container-type:size]',
    content:
      'my-auto flex shrink-0 flex-col gap-[var(--profile-gap)] py-[clamp(0.5rem,2cqh,1.5rem)] [--profile-gap:clamp(0.5rem,calc(4cqh-1rem),1.5rem)] [--profile-card-padding:clamp(0.5rem,calc(3cqh-0.625rem),1rem)] desktop:mx-auto desktop:w-full desktop:max-w-2xl landscape-short:grid landscape-short:max-w-none landscape-short:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] landscape-short:gap-5',
    group: 'flex min-w-0 flex-col gap-[var(--profile-gap)]',
    card: 'p-[var(--profile-card-padding)]',
    identity: 'flex flex-col items-center gap-[clamp(0.25rem,1cqh,0.75rem)] text-center',
    avatar:
      'bg-muted text-muted-foreground flex size-[clamp(2.5rem,calc(12cqh-2rem),5rem)] shrink-0 items-center justify-center rounded-card',
    avatarIcon: 'size-8',
    email: 'max-w-full [overflow-wrap:anywhere]',
    settings:
      'flex min-h-12 items-center gap-3 text-left transition-transform active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100',
    settingsLabel: 'min-w-0 flex-1',
    settingsIcon: 'text-muted-foreground size-5 shrink-0',
    section: 'space-y-[clamp(0.375rem,1cqh,0.75rem)]',
    grid: 'grid grid-cols-2 gap-[clamp(0.375rem,1cqh,0.75rem)]',
    metricLabel: 'flex min-w-0 items-center gap-1.5',
    metricIcon: 'size-4 shrink-0',
    metricValue: 'leading-tight [overflow-wrap:anywhere]',
    skeleton: 'h-20 rounded-card',
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

export const profileSkeletonTiles = ['streak', 'study-time', 'goal', 'daily-goal'] as const;
