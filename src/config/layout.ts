// Единый источник раскладки экранов - «как рисовать». Компоненты не пишут
// размеры руками, а берут их отсюда. Правка размера/отступа - только в этом файле.
//
// Пропорции эталонные (десктопные), но тянутся под высоту вьюпорта, чтобы на
// любом телефоне экран выглядел как масштабированная копия десктопа и всегда
// влезал без скролла. Формат: clamp(пол, доля_высоты_svh, эталон_десктопа) -
// на высоком экране = эталон, на низком пропорционально ужимается, но не ниже
// читаемого/тач-пола. Боковые поля фиксированы: ширина колонки ≈ десктопной,
// по горизонтали пропорции уже верные.
export const layout = {
  gestureSurface: 'gesture-surface',
  focusRing: 'outline-none focus-visible:ring-2 focus-visible:ring-ring/40',

  // Каркас экрана (ScreenShell): поля, вертикальный ритм, отбивка футера.
  shell: {
    padX: 'px-6',
    padTop: 'pt-[clamp(0.5rem,2svh,1rem)]',
    padBottom: 'pb-[max(clamp(1rem,3svh,2rem),env(safe-area-inset-bottom))]',
    gap: 'gap-[clamp(0.75rem,3svh,1.5rem)]',
    footerTop: 'pt-[clamp(0.75rem,3svh,1.5rem)]',
  },

  // Прокручиваемая область экрана - одна на экран. Запас снизу нужен, чтобы
  // последний элемент не упирался в край контейнера: иначе на низких экранах
  // край срезает кружки/карточки и это читается как «обрезано белым».
  scroll: 'min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[clamp(0.5rem,2svh,1rem)]',

  // Заголовок экрана (ScreenHeading): флюидная версия шкалы typography.
  heading: {
    title: 'text-[clamp(1.75rem,4.4svh,2.25rem)]',
    subtitle: 'text-[clamp(1rem,2.2svh,1.125rem)]',
    gap: 'space-y-[clamp(0.25rem,1svh,0.75rem)]',
  },
  typography: {
    navigationTitle: 'text-2xl font-extrabold tracking-tight text-foreground',
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

  // Основное действие экрана (CTA); stack - вертикальный зазор пары кнопок.
  cta: 'h-[clamp(2.75rem,6svh,3rem)] w-full text-base',
  ctaStack: 'space-y-[clamp(0.5rem,1.5svh,0.75rem)]',
  commitment: {
    block:
      'mt-[clamp(1.25rem,4svh,2.5rem)] flex flex-col items-center gap-[clamp(0.625rem,1.5svh,0.75rem)]',
    hint: 'min-h-5 text-sm text-muted-foreground transition-opacity duration-200 motion-reduce:transition-none',
    hintHidden: 'opacity-0',
    hintVisible: 'opacity-100',
    seal: 'relative isolate flex size-[clamp(7.5rem,20svh,10rem)] touch-none items-center justify-center overflow-hidden rounded-full border border-border bg-background outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
    fill: 'pointer-events-none absolute inset-1 -z-10 origin-center scale-[var(--commitment-seal-scale)] rounded-full bg-foreground transition-transform duration-[var(--commitment-seal-duration)] ease-out motion-reduce:transition-none',
    label: 'pointer-events-none max-w-24 text-center text-sm font-medium',
    labelIdle: 'text-foreground',
    labelHolding: 'text-background',
    check:
      'pointer-events-none size-10 text-background animate-in fade-in zoom-in-75 duration-200 motion-reduce:animate-none',
    status: 'min-h-4 text-xs text-muted-foreground',
    statusVisible:
      'animate-in fade-in slide-in-from-bottom-1 duration-200 motion-reduce:animate-none',
    footer: 'transition-[opacity,transform] duration-200 motion-reduce:transition-none',
    footerHidden: 'pointer-events-none translate-y-2 opacity-0',
    footerVisible: 'translate-y-0 opacity-100',
  },
  tasks: {
    content: 'mx-auto w-full max-w-2xl',
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
    card: 'relative min-h-32 min-w-0 overflow-hidden rounded-3xl',
    cardContent: 'min-w-0',
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
    sheet:
      'tasks-sheet-enter bg-background border-border fixed inset-x-0 bottom-0 z-[60] mx-auto max-h-[calc(100svh-0.5rem)] max-w-2xl overflow-y-auto overscroll-contain rounded-t-4xl border p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]',
    sheetOverlay: 'tasks-overlay-enter fixed inset-0 z-[55] bg-black/30',
    sheetHeader: 'flex items-start justify-between gap-4',
    sheetHeaderActions: 'flex shrink-0 items-center gap-1',
    sheetTitle: 'text-lg font-semibold',
    sheetTime: 'text-sm tabular-nums text-muted-foreground',
    sheetClose: 'size-11 rounded-full',
    sheetGrabber:
      'group -mt-4 mx-auto mb-1 flex h-11 w-16 touch-none items-center justify-center rounded-full outline-none',
    sheetGrabberPill:
      'h-1.5 w-9 rounded-full bg-muted-foreground/35 transition-[background-color] group-focus-visible:bg-foreground motion-reduce:transition-none',
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
    difficultySliderWrap: 'relative h-11',
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
    fields: 'space-y-7 text-left',
    fieldGroup: 'space-y-3',
    input: 'h-12 rounded-2xl text-base',
    footer: 'border-border shrink-0 space-y-3 border-t pt-3',
  },
  training: {
    shell:
      'fixed inset-x-0 top-0 mx-auto flex h-[var(--training-viewport-height,100svh)] w-full max-w-2xl translate-y-[var(--training-viewport-offset-top,0px)] flex-col overflow-hidden',
    header: 'shrink-0 px-4 pt-[max(0.625rem,env(safe-area-inset-top))] pb-1',
    scrubber: 'h-16 min-w-0 flex-1',
    cardArea: 'min-h-0 flex-1 overflow-hidden px-4 py-3',
    card: 'min-h-full rounded-4xl p-5',
    taskCard:
      'border-border bg-card relative flex h-full min-h-0 flex-col overflow-hidden rounded-4xl border',
    reviewCard:
      'border-border bg-card flex min-h-full flex-col overflow-y-auto overscroll-contain border',
    controls: 'shrink-0 gap-2 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]',
    controlsRow: 'flex',
    controlsEqual: 'grid grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)]',
    controlButton: 'size-12 shrink-0 rounded-xl',
    reviewButton: 'h-12 min-w-0 flex-1 px-2 text-base',
    answerWrap: 'min-w-0 flex-1 [&>div]:min-w-0',
    answer: 'h-12 w-full text-base md:text-base',
    headerRow: 'flex items-center gap-2 pr-[3.25rem]',
    closeButton: 'size-11 shrink-0 rounded-full',
    cardHeader:
      'relative z-20 flex shrink-0 flex-nowrap items-start gap-x-[clamp(0.125rem,1vw,0.75rem)] px-5 pt-5 pb-6',
    titleGroup: 'flex min-h-10 min-w-0 flex-1 flex-col justify-center gap-0.5',
    difficultyIcon: 'task-skull-icon ml-1.5 inline-block size-4.5 align-[-0.125em] text-foreground',
    cardTitle: 'text-lg font-semibold whitespace-nowrap',
    solvedMeta: 'max-w-full truncate text-xs leading-4 font-medium text-muted-foreground',
    actions: 'ml-auto flex shrink-0 items-center gap-0 sm:gap-1',
    actionButton: 'size-10 rounded-xl sm:size-11',
    actionButtonActive: 'bg-foreground text-background hover:bg-foreground hover:text-background',
    actionIcon: 'size-4.5 sm:size-5',
    pointEraserIcon:
      "inline-block size-4.5 translate-y-px bg-current sm:size-5 [mask:url('/icons/eraser-trail.svg')_center/contain_no-repeat]",
    eraserControl: 'relative',
    eraserTriggerIconHidden: 'flex items-center justify-center opacity-0',
    eraserMenu:
      'absolute top-full right-0 z-30 mt-1 flex gap-1 rounded-2xl border border-border bg-popover p-1 shadow-lg animate-in fade-in slide-in-from-top-1 duration-[var(--task-control-motion-duration)] motion-reduce:animate-none',
    eraserOption: 'size-11 rounded-xl text-muted-foreground',
    eraserOptionActive: 'bg-foreground text-background hover:bg-foreground hover:text-background',
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
  sheetDragSlopPx: 6,
  sheetDismissDistanceRatio: 0.24,
  sheetDismissVelocityPxMs: 0.65,
} as const;

export const taskMotion = {
  catalogReflowMs: 320,
  catalogReflowEasing: 'cubic-bezier(0.22, 0.8, 0.25, 1)',
  catalogShapeStartOpacity: 0.55,
  catalogShapeTolerancePx: 1,
  sheetDismissMs: 220,
  sheetSnapBackMs: 260,
  sheetReleaseEasing: 'cubic-bezier(0.22, 0.8, 0.25, 1)',
} as const;
