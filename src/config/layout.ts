import { appLayout } from '@/config/app-layout';

// Единый источник раскладки экранов - «как рисовать». Компоненты не пишут
// размеры руками, а берут их отсюда. Правка размера/отступа - только в этом файле.
//
// Пропорции эталонные (десктопные), но тянутся под высоту вьюпорта, чтобы на
// любом телефоне экран выглядел как масштабированная копия десктопа и всегда
// влезал без скролла. Формат: clamp(пол, доля_высоты_svh, эталон_десктопа) -
// на высоком экране = эталон, на низком пропорционально ужимается, но не ниже
// читаемого/тач-пола. Боковые поля фиксированы: ширина колонки ≈ десктопной,
// по горизонтали пропорции уже верные.
export const answerSuccessSurface =
  'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-200';

const compactHeadingSubtitle = 'text-base text-muted-foreground';

export const layout = {
  app: appLayout,
  viewport: {
    width: 'mx-auto w-full max-w-md',
    frame: 'bg-background flex min-h-svh flex-col',
  },
  flowHeader: {
    root: 'flex shrink-0 items-center gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))]',
    back: 'text-muted-foreground hover:bg-muted flex size-11 shrink-0 items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
    icon: 'size-5',
    progress: 'flex-1',
  },
  errorNote: {
    root: 'border-destructive/40 bg-destructive/5 text-destructive flex min-w-0 shrink-0 flex-wrap items-center gap-2 rounded-xl border p-3 text-sm',
    icon: 'size-4 shrink-0',
    message: 'min-w-0 flex-1 wrap-anywhere',
    retry: 'text-destructive min-h-11 shrink-0 px-3 text-base',
  },
  sheet: {
    root: 'sheet-enter bg-background border-border fixed inset-x-0 bottom-0 z-[60] max-h-[calc(100svh-max(0.5rem,env(safe-area-inset-top)))] overflow-y-auto overscroll-contain rounded-t-4xl border p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]',
    overlay: 'sheet-overlay-enter fixed inset-0 z-[55] bg-black/30',
    header: 'flex items-start justify-between gap-4',
    headerActions: 'flex shrink-0 items-center gap-1',
    title: 'text-lg font-semibold',
    close: 'size-11 rounded-full',
    grabber:
      'group -mt-4 mx-auto mb-1 flex h-11 w-16 touch-none items-center justify-center rounded-full outline-none',
    grabberPill: 'h-1.5 w-9 rounded-full bg-muted-foreground/35 group-focus-visible:bg-foreground',
    icon: 'size-5',
  },
  mathFormula: '[&_.katex-display]:m-0!',
  bottomNav: {
    root: 'border-border bg-background flex shrink-0 items-stretch border-t pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]',
    item: 'flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-1 text-xs',
    icon: 'size-6',
  },
  quiz: {
    root: 'flex h-svh flex-col bg-background',
    header:
      'grid shrink-0 grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-3 px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-3',
    headerSide:
      'flex size-11 items-center justify-center text-xs font-medium tabular-nums text-muted-foreground',
    headerLabel: 'col-start-2 text-center text-xs font-medium tracking-wide text-muted-foreground',
    row: 'flex items-center gap-3',
    stack: 'flex flex-col gap-4',
    compact: 'flex flex-col gap-2',
    caption: 'text-xs font-medium tracking-wide text-muted-foreground',
    body: 'text-sm leading-relaxed text-muted-foreground',
    label: 'text-base font-semibold',
    icon: 'size-5 shrink-0',
    iconButton: 'size-11 rounded-full',
    catalog: 'flex flex-col gap-4 pt-2',
    topic:
      'group flex w-full flex-col gap-3 rounded-3xl border p-4 text-left transition-transform active:scale-[0.98] motion-reduce:transition-none',
    surface: 'border-border bg-muted/40 text-foreground',
    topicTop: 'flex items-start justify-between gap-4',
    topicTitle: 'text-lg font-semibold tracking-tight',
    topicArt:
      'flex min-h-16 items-center justify-center rounded-2xl bg-background/70 px-4 py-3 text-lg',
    badge:
      'inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 text-xs font-medium',
    grid: 'grid grid-cols-2 gap-3',
    setting:
      'flex min-h-16 flex-col items-start justify-center gap-1 rounded-2xl border-2 px-4 py-3 text-left',
    selected: 'border-foreground bg-muted text-foreground',
    idle: 'border-border bg-background hover:bg-muted/50',
    note: 'rounded-2xl bg-muted/60 p-4 text-sm leading-relaxed text-muted-foreground',
    progress: 'h-2 flex-1 overflow-hidden rounded-full bg-muted',
    progressFill:
      'h-full origin-left rounded-full bg-primary transition-transform duration-300 motion-reduce:transition-none',
    question: 'flex min-h-0 flex-1 flex-col gap-5',
    tokenPlaceholder: 'border-transparent bg-muted',
    tokenPlaceholderContent: 'invisible',
    tokenMoving: 'relative z-10',
    answerErrorMotion:
      'quiz-answer-error [--quiz-error-distance:3px] [--quiz-error-duration:250ms]',
    answerSuccessMotion:
      'quiz-answer-success [--quiz-success-lift:3px] [--quiz-success-settle:1px] [--quiz-success-duration:360ms]',
    mathFit: 'flex min-w-0 w-full items-center justify-center overflow-x-auto',
    mathInner: 'w-max shrink-0 origin-center whitespace-nowrap',
    answers: 'grid grid-cols-2 gap-3',
    answer:
      'relative flex min-h-[clamp(5rem,14svh,7rem)] items-center justify-center-safe overflow-x-auto rounded-2xl border-2 px-3 py-4 text-base transition-transform active:translate-y-0.5 motion-reduce:transition-none',
    pairColumn: 'grid grid-rows-3 gap-2',
    pair: 'flex min-h-16 items-center justify-center-safe overflow-x-auto rounded-2xl border-2 px-2 py-3 text-base',
    matched: answerSuccessSurface,
    buildZone:
      'flex min-h-24 flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/40 p-3',
    token:
      'flex min-h-12 min-w-12 items-center justify-center rounded-xl border-2 px-3 py-2 text-base',
    tokens: 'flex flex-wrap justify-center gap-2',
    feedback: 'flex flex-col gap-2 rounded-2xl border p-4',
    incorrect:
      'border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
    formula: 'overflow-x-auto py-1 text-center text-base',
    result: 'flex flex-1 flex-col items-center justify-center gap-6 text-center',
    medal: 'flex size-24 items-center justify-center rounded-full bg-muted text-foreground',
    trophy: 'size-12',
    score: 'text-6xl font-extrabold tabular-nums tracking-tight',
  },
  gestureSurface: 'gesture-surface',
  focusRing: 'outline-none focus-visible:ring-2 focus-visible:ring-ring/40',

  // Каркас экрана (ScreenShell): поля, вертикальный ритм, отбивка футера.
  shell: {
    padX: 'px-6',
    padBottomWithNav: 'pb-0',
    padTop: 'pt-[clamp(0.5rem,2svh,1rem)]',
    padTopWithNav: 'pt-[max(clamp(0.5rem,2svh,1rem),env(safe-area-inset-top))]',
    padBottom: 'pb-[max(clamp(1rem,3svh,2rem),env(safe-area-inset-bottom))]',
    gap: 'gap-[clamp(0.75rem,3svh,1.5rem)]',
    footerTop: 'pt-[clamp(0.75rem,3svh,1.5rem)]',
  },

  // Прокручиваемая область экрана - одна на экран. Запас снизу нужен, чтобы
  // последний элемент не упирался в край контейнера: иначе на низких экранах
  // край срезает кружки/карточки и это читается как «обрезано белым».
  scroll: 'min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[clamp(0.5rem,2svh,1rem)]',

  // Роль определяет иерархию: крупный экран знакомства, вкладка, навигация или задача.
  heading: {
    root: 'min-w-0 shrink-0 space-y-[clamp(0.25rem,1svh,0.75rem)]',
    title: 'tracking-tight text-balance whitespace-pre-line wrap-anywhere',
    subtitle: 'text-balance whitespace-pre-line wrap-anywhere',
    variants: {
      screen: {
        title: 'text-[clamp(1.75rem,4.4svh,2.25rem)] font-extrabold leading-tight',
        subtitle: 'text-[clamp(1rem,2.2svh,1.125rem)] text-muted-foreground',
      },
      app: {
        title: 'text-[clamp(1.5rem,6.4vw,1.75rem)] font-bold leading-tight',
        subtitle: compactHeadingSubtitle,
      },
      navigation: {
        title: 'text-2xl font-bold leading-tight',
        subtitle: compactHeadingSubtitle,
      },
      task: {
        title: 'text-[clamp(1.125rem,2.7svh,1.375rem)] font-bold leading-snug',
        subtitle: 'text-base leading-relaxed text-foreground',
      },
    },
  },
  typography: {
    sectionTitle: 'text-base font-semibold text-foreground',
    controlTitle: 'text-base font-medium text-foreground',
    description: 'text-sm text-muted-foreground',
    value: 'text-lg font-bold tracking-tight text-foreground',
    caption: 'text-xs text-muted-foreground',
  },

  // Список вариантов делит свободную высоту (flex-1) - влезает любое число
  // карточек без переполнения. Пол карточки - тач-таргет 2.75rem, потолок - десктоп.
  list: 'flex min-h-0 flex-1 flex-col justify-start gap-[clamp(0.375rem,1.2svh,0.625rem)]',
  card: 'min-h-11 max-h-[4.5rem] flex-1',
  option: {
    root: 'group bg-muted/45 flex min-h-16 w-full items-center gap-3 rounded-3xl border border-transparent px-4 py-3 text-left outline-none',
    iconFrame:
      'text-muted-foreground group-data-[checked]:text-primary flex size-[clamp(1.5rem,3.5svh,2rem)] shrink-0 items-center justify-center',
    icon: 'block size-full shrink-0 overflow-visible',
    description: 'mt-0.5 block',
    indicator:
      'border-input group-data-[checked]:border-primary mr-1.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2',
    indicatorFill: 'bg-primary size-2.5 rounded-full',
  },

  // Основное действие экрана (CTA); stack - вертикальный зазор пары кнопок.
  cta: 'h-[clamp(2.75rem,6svh,3rem)] w-full text-base',
  ctaStack: 'space-y-[clamp(0.5rem,1.5svh,0.75rem)]',
  commitment: {
    block:
      'mt-[clamp(1.25rem,4svh,2.5rem)] flex flex-col items-center gap-[clamp(0.625rem,1.5svh,0.75rem)]',
    seal: 'relative isolate flex size-[clamp(7.5rem,20svh,10rem)] touch-none items-center justify-center overflow-hidden rounded-full border border-border bg-background outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
    fill: 'pointer-events-none absolute inset-1 -z-10 origin-center scale-[var(--commitment-seal-scale)] rounded-full bg-foreground transition-transform duration-[var(--commitment-seal-duration)] ease-out motion-reduce:transition-none',
    label: 'pointer-events-none max-w-24 text-center text-sm font-medium',
    labelIdle: 'text-foreground',
    labelHolding: 'text-background',
    check:
      'pointer-events-none size-10 text-background animate-in fade-in zoom-in-75 duration-200 motion-reduce:animate-none',
    status: 'min-h-5 text-center text-sm text-muted-foreground',
    statusVisible:
      'animate-in fade-in slide-in-from-bottom-1 duration-200 motion-reduce:animate-none',
    footer: 'transition-[opacity,transform] duration-200 motion-reduce:transition-none',
    footerHidden: 'pointer-events-none translate-y-2 opacity-0 disabled:opacity-0',
    footerVisible: 'translate-y-0 opacity-100',
  },
  tasks: {
    content: 'w-full',
    catalogScroll: '[overflow-anchor:none]',
    catalogStack: 'space-y-5',
    tabs: 'sticky top-0 z-40 grid h-14 grid-cols-3 rounded-2xl bg-muted p-1',
    tabsIndicator:
      'pointer-events-none absolute inset-y-1 left-1 z-10 w-[calc((100%_-_0.5rem)/3)] rounded-[calc(var(--radius-2xl)-0.25rem)] bg-foreground transition-transform duration-[var(--task-tab-motion-duration)] ease-out motion-reduce:transition-none',
    tabsActiveLabels:
      'pointer-events-none absolute inset-y-1 left-1 z-30 w-[calc((100%_-_0.5rem)/3)] overflow-hidden rounded-[calc(var(--radius-2xl)-0.25rem)] transition-transform duration-[var(--task-tab-motion-duration)] ease-out motion-reduce:transition-none',
    tabsActiveLabelsTrack:
      'grid h-full w-[300%] grid-cols-3 transition-transform duration-[var(--task-tab-motion-duration)] ease-out motion-reduce:transition-none',
    tabActiveLabel: 'flex items-center justify-center text-base font-medium text-background',
    tabButton:
      'relative z-20 h-12 rounded-[calc(var(--radius-2xl)-0.25rem)] bg-transparent px-1 text-base font-medium hover:bg-transparent',
    tabLabel: 'text-muted-foreground',
    grid: 'grid grid-cols-2 gap-3 [overflow-anchor:none]',
    card: 'relative isolate min-h-32 min-w-0 rounded-3xl border border-transparent',
    cardSurface: 'pointer-events-none absolute -inset-px -z-10 origin-top-left rounded-[inherit]',
    cardContent: 'min-w-0',
    reflowSnapshot: 'pointer-events-none absolute !m-0',
    disabledCardContent: 'text-muted-foreground',
    compactCard: 'p-4',
    activeCard:
      'bg-card border-border border shadow-[0_1px_0_color-mix(in_oklch,var(--foreground)_8%,transparent)]',
    disabledCard: 'bg-muted/35 border-border/70 text-muted-foreground border',
    expanded: 'z-10 col-span-2 p-4',
    expandedContent: 'mt-4',
    metric: 'space-y-2',
    metricHeader: 'flex min-h-6 items-baseline justify-between gap-1',
    metricLabel: 'text-base font-medium',
    metricValue: 'text-sm tabular-nums text-muted-foreground',
    topicList: 'space-y-2',
    topic:
      'bg-muted/55 hover:bg-muted/75 min-h-16 w-full rounded-2xl border border-transparent px-4 py-3 text-left transition-[background-color,transform] duration-[var(--task-control-motion-duration)] active:scale-[0.99] motion-reduce:transition-none',
    progress: 'h-1.5',
    favoriteAll: 'h-auto justify-start text-left',
    favoriteCard: 'h-auto flex-col items-start',
    favoriteNumber: 'text-lg font-semibold',
    favoriteId: 'text-xs text-muted-foreground',
    empty: 'py-12 text-center text-base text-muted-foreground',
    numberHeader: 'scroll-mt-[4.5rem] min-h-20 w-full min-w-0 rounded-2xl text-left',
    numberHeaderExpanded: 'min-h-11 px-4',
    numberHeaderGrid:
      'grid min-h-20 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-3',
    numberHeadingTitle: 'min-w-0 truncate text-base font-medium',
    numberTitleCompact: 'col-span-2 col-start-1 row-start-2',
    numberTitleExpanded: 'col-start-2 row-start-1',
    numberHeaderMeta: 'col-start-3 row-start-1 flex shrink-0 items-center',
    numberLabel: 'col-start-1 row-start-1 text-lg font-semibold',
    compactMetricValue: 'col-start-3 row-start-2 text-sm tabular-nums text-muted-foreground',
    compactProgress: 'col-span-3 col-start-1 row-start-3 h-1.5',
    skeleton: 'h-32 rounded-2xl',
    setup: 'space-y-5',
    setupGroup: 'space-y-3',
    setupLegendRow: 'space-y-0.5',
    setupLegend: 'text-base font-medium',
    setupHint: 'block text-xs text-muted-foreground',
    countGrid: 'grid grid-cols-4 gap-2',
    setupOption: 'h-11 min-w-0 px-1 text-base',
    setupCta: 'h-12 w-full text-base font-medium',
    difficultyControl: 'space-y-2',
    difficultyValue: 'text-sm font-medium',
    difficultySliderWrap: 'relative mx-3 h-11',
    difficultyTrack:
      'bg-muted absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full',
    difficultyTrackFill:
      'bg-foreground absolute inset-0 origin-left scale-x-[var(--difficulty-progress)]',
    difficultyThumb:
      'bg-foreground border-background pointer-events-none absolute top-1/2 left-[var(--difficulty-position)] z-10 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] shadow-sm',
    difficultySlider:
      'absolute inset-0 z-20 h-11 w-full cursor-pointer appearance-none rounded-lg bg-transparent opacity-0 outline-none focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-11 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:mt-2.5 [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-transparent',
    difficultyScale: 'flex justify-between text-xs text-muted-foreground',
    soon: 'col-span-3 col-start-1 row-start-3 text-xs text-muted-foreground',
    icon: 'size-5',
  },
  settings: {
    shell: 'flex h-svh flex-col bg-background',
    header: 'flex shrink-0 items-center gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2',
    backButton:
      'text-muted-foreground hover:bg-muted flex size-11 shrink-0 items-center justify-center rounded-2xl transition-colors',
    backIcon: 'size-5',
    content: 'space-y-7 pt-4',
    logoutSection: 'border-border space-y-3 border-t py-4',
    logoutAction: 'h-12 w-full justify-center px-0',
    fields: 'space-y-7 text-left',
    fieldGroup: 'space-y-3',
    input: 'h-12 rounded-2xl text-base',
    footer: 'border-border shrink-0 space-y-3 border-t pt-3',
  },
  validatedInput: {
    frame: 'relative',
    success:
      'border-success focus-visible:border-success focus-visible:ring-success/20 ring-success/20 pr-10 ring-3',
    successIcon:
      'text-success pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2',
    withAction: 'pr-11',
    clearAction:
      'absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground',
    clearIcon: 'size-4',
  },
  training: {
    shell:
      'bg-background fixed inset-x-0 top-0 flex h-[var(--training-viewport-height,100svh)] translate-y-[var(--training-viewport-offset-top,0px)] flex-col overflow-hidden',
    header: 'shrink-0 px-4 pt-[max(0.625rem,env(safe-area-inset-top))] pb-1',
    scrubber: 'h-16 min-w-0 flex-1',
    cardArea: 'min-h-0 flex-1 overflow-hidden px-4 py-3',
    card: 'min-h-full rounded-4xl p-5',
    taskCard:
      'border-border bg-card relative flex h-full min-h-0 flex-col overflow-hidden rounded-4xl border',
    reviewCard:
      'border-border bg-card flex h-full min-h-0 flex-col overflow-y-auto overscroll-contain touch-pan-y border',
    controls: 'shrink-0 gap-2 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]',
    controlsRow: 'flex',
    controlsEqual: 'grid grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)]',
    controlButton: 'size-12 shrink-0 rounded-xl',
    reviewButton:
      'h-auto min-h-12 min-w-0 flex-1 self-stretch px-2 py-2 text-base leading-tight whitespace-normal',
    answerWrap: 'min-w-0 flex-1 [&>div]:min-w-0',
    answer: 'h-12 w-full text-base',
    headerRow: 'flex items-center gap-2',
    closeButton: 'size-11 shrink-0 rounded-full',
    cardHeader:
      'relative z-20 flex shrink-0 items-center px-2 py-3 min-[375px]:px-5 sm:pt-5 sm:pb-4',
    titleGroup: 'flex min-h-11 min-w-0 flex-1 flex-col justify-center gap-0.5',
    difficultyIcon: 'task-skull-icon ml-1.5 inline-block size-4.5 align-[-0.125em] text-foreground',
    cardTitle: 'text-lg font-semibold whitespace-nowrap',
    solvedMeta: 'max-w-full truncate text-xs leading-4 font-medium text-muted-foreground',
    actions: '-mr-2 ml-auto flex shrink-0 items-center',
    actionButton: 'h-11 w-[clamp(2.25rem,calc((100vw-11rem)/4),2.75rem)] shrink-0 rounded-xl',
    actionButtonActive: 'bg-foreground text-background hover:bg-foreground hover:text-background',
    actionIcon: 'size-4.5 sm:size-5',
    pointEraserIcon:
      "inline-block size-4.5 translate-y-px bg-current sm:size-5 [mask:url('/icons/eraser-trail.svg')_center/contain_no-repeat]",
    drawingViewport: 'min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain',
    drawingDocument: 'relative min-h-full w-full',
    drawingContent: 'relative flex flex-col px-5',
    drawingCanvas: 'absolute inset-0 z-10 h-full w-full touch-none text-[var(--task-ink)]',
    drawingCanvasIdle: 'pointer-events-none',
    drawingCanvasActive: 'cursor-crosshair',
    solutionButton: 'mt-6',
    solution: 'border-border mt-3 border-t pt-4',
    reviewStats: 'mt-2',
    reviewStat: 'text-sm text-muted-foreground',
    reviewList: 'mt-6 space-y-2',
    reviewTask:
      'border-border bg-card hover:bg-muted/35 flex min-h-14 w-full items-center justify-between rounded-2xl border px-4 text-left transition-transform duration-[var(--task-control-motion-duration)] active:scale-[0.99] motion-reduce:transition-none',
    reviewTaskText: 'flex min-w-0 flex-col gap-0.5',
    reviewTaskTitle: 'text-base font-medium',
    reviewTaskStatus: 'text-sm text-muted-foreground',
    reviewTaskIcon: 'size-5 shrink-0 text-muted-foreground',
    reviewActions: 'w-full space-y-2',
    exitSheet: 'w-full space-y-4',
    exitActions: 'grid grid-cols-2 gap-2',
    exitAction: 'h-11',
    blockList: 'space-y-4',
    latex: 'overflow-x-auto py-2 text-center text-[clamp(1.25rem,2.4vw,1.625rem)]',
    image: 'relative mx-auto w-full max-w-md',
    blockText: 'text-base whitespace-pre-line',
    blockImage: 'object-contain',
    blockImageMonochrome: 'dark:invert',
    scrubberFrame: 'flex h-full min-w-0 items-center gap-2',
    scrubberTrack:
      'relative flex h-11 min-w-0 flex-1 touch-none items-center gap-0.5 rounded-2xl bg-muted/80 p-2',
    scrubberSegment:
      'relative h-2.5 min-w-1 flex-1 rounded-full border transition-transform duration-[var(--task-control-motion-duration)] motion-reduce:transition-none',
    scrubberLens:
      'tasks-lens-enter absolute inset-0 z-10 flex items-center justify-center gap-1.5 rounded-2xl bg-foreground p-1.5 shadow-lg',
    scrubberLensSegment:
      'relative flex h-8 min-w-8 flex-1 items-center justify-center rounded-[calc(var(--radius-xl)-0.125rem)] border text-xs font-medium tabular-nums',
    scrubberIndicator:
      'pointer-events-none absolute -bottom-1.5 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full bg-foreground',
    reviewIndicator:
      'flex size-11 shrink-0 items-center justify-center rounded-full transition-transform duration-[var(--task-control-motion-duration)] active:scale-95 motion-reduce:transition-none',
    reviewIcon: 'size-5',
    segmentCurrent: 'border-transparent',
    segmentEmpty: 'border-border bg-background',
    segmentAnswered: 'border-muted-foreground bg-muted-foreground',
    segmentCorrect: 'border-success bg-success',
    segmentIncorrect: 'border-destructive bg-destructive',
    lensItem: 'task-lens-item bg-background/10 text-background',
    lensItemActive: 'scale-105 bg-background text-foreground',
    reviewActive: 'bg-foreground text-background',
    reviewInactive: 'bg-muted/80 text-muted-foreground',
  },
} as const;

export const taskGestures = {
  scrubberHoldMs: 280,
  scrubberSlowdown: 0.42,
  scrubberLensRadius: 2,
} as const;

export const taskMotion = {
  catalogReflowMs: 380,
  catalogReflowEasing: 'cubic-bezier(0.22, 0.8, 0.25, 1)',
  catalogDetailDelayFraction: 0.85,
  catalogDetailExitFraction: 0.12,
  catalogShapePhaseFraction: 0.55,
  catalogShapeTolerancePx: 1,
} as const;
