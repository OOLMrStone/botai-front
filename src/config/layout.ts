import { appLayout } from '@/config/app-layout';

export const UI_RADIUS_ROLES = ['control', 'tile', 'card', 'panel'] as const;

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

const displayNumber = 'text-6xl font-bold tabular-nums';

const compactHeadingSubtitle = 'text-base text-muted-foreground';

export const layout = {
  integration: {
    stack: 'flex min-w-0 flex-col gap-4',
    feedback:
      'flex max-h-[25svh] min-w-0 flex-col gap-2 overflow-y-auto border-t border-border px-4 py-3',
    cardArea: 'flex min-h-0 flex-1 flex-col overflow-y-auto',
    raw: 'max-h-64 overflow-auto whitespace-pre-wrap break-words text-sm',
    photos: 'flex shrink-0 gap-2 overflow-x-auto px-4 py-2',
    photo: 'flex shrink-0 flex-col gap-2',
    preview: 'h-20 w-20 rounded-tile object-cover',
    summary: 'flex flex-wrap items-center justify-between gap-2 px-4 py-2',
    unfinished: 'flex min-w-0 flex-col gap-4 xl:col-start-1 xl:row-start-1 xl:row-span-2',
    filters: 'grid grid-cols-1 gap-3 sm:grid-cols-2',
    avatarImage: 'h-full w-full rounded-full object-cover',
    attemptActionText: 'min-w-0 truncate',
  },
  storefront: {
    root: 'min-h-svh bg-[var(--sf-paper)] text-[var(--sf-ink)] selection:bg-[var(--sf-pale)]',
    container:
      'mx-auto w-full max-w-7xl pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] sm:pl-[max(2rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))] lg:pl-[max(3rem,env(safe-area-inset-left))] lg:pr-[max(3rem,env(safe-area-inset-right))]',
    section: 'scroll-mt-24 py-[clamp(3.5rem,7vw,6rem)]',
    navOuter:
      'sticky top-0 z-40 border-b border-black/8 bg-[var(--sf-paper)]/95 pt-[env(safe-area-inset-top)] backdrop-blur-xl',
    nav: 'mx-auto flex max-w-7xl items-center justify-between gap-4 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] py-4 sm:pl-[max(2rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))] lg:pl-[max(3rem,env(safe-area-inset-left))] lg:pr-[max(3rem,env(safe-area-inset-right))]',
    brandLink:
      'inline-flex shrink-0 items-center gap-2.5 rounded-tile outline-none focus-visible:ring-2 focus-visible:ring-[var(--sf-orange)]',
    brandIcon: 'size-10 rounded-tile',
    desktopLinks: 'hidden items-center gap-6 xl:flex',
    navLink:
      'inline-flex min-h-11 items-center text-sm font-medium text-[var(--sf-muted)] hover:text-[var(--sf-ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--sf-orange)]',
    accountLink:
      'block min-h-11 min-w-0 max-w-40 content-center truncate text-sm font-medium text-[var(--sf-ink)] focus-visible:outline-2 focus-visible:outline-offset-4',
    sessionError: 'mx-auto max-w-7xl px-5 pt-4',
    trial: 'flex flex-wrap gap-x-2 gap-y-1 text-xs text-[var(--sf-muted)]',
    trialBanner: 'mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-black/15 pb-6',
    trialTitle: 'text-2xl font-semibold',
    navActions: 'flex min-w-0 items-center gap-3',
    navCta: 'hidden xl:inline-flex',
    menuButton:
      'flex shrink-0 bg-[var(--sf-warm)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--sf-orange)] xl:hidden',
    icon: 'size-5 shrink-0',
    smallIcon: 'size-4 shrink-0',
    mobileMenu:
      'mx-auto flex max-h-[calc(100svh-5rem-env(safe-area-inset-top))] max-w-7xl flex-col overflow-y-auto border-t border-black/8 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pl-[max(2rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))] xl:hidden',
    skip: 'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-tile focus:bg-white focus:p-4',
    hero: 'grid items-center gap-10 py-[clamp(2.75rem,6vw,5.5rem)] lg:grid-cols-[1.25fr_1fr] lg:gap-12',
    heroContent: 'flex min-w-0 flex-col items-start gap-6',
    eyebrow: 'text-xs font-semibold uppercase text-[var(--sf-muted)]',
    heroDescription: 'max-w-xl text-lg leading-relaxed text-[var(--sf-muted)]',
    heroActions: 'flex w-full flex-col items-start gap-3 pt-1 sm:w-auto',
    helper: 'text-sm leading-relaxed text-[var(--sf-muted)]',
    heroArt:
      'relative isolate flex aspect-square w-full max-w-lg flex-col justify-between justify-self-center overflow-hidden rounded-panel border-2 border-[var(--sf-orange)] bg-[var(--sf-paper)] p-7 sm:p-9',
    artTitle: 'relative z-10 text-2xl font-semibold leading-tight whitespace-pre-line',
    heroImage: 'absolute inset-x-0 bottom-[6%] w-full mix-blend-multiply',
    actionOrange: 'bg-[var(--sf-orange)] text-[var(--sf-ink)] hover:bg-[var(--sf-orange)]',
    actionDark: 'bg-[var(--sf-ink)] text-white hover:bg-[var(--sf-ink)]',
    action:
      'min-w-0 max-w-full outline-none hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-[var(--sf-orange)] focus-visible:ring-offset-4 motion-reduce:transition-none',
    sectionIntro: 'flex max-w-3xl flex-col gap-4',
    sectionDescription: 'max-w-2xl text-base leading-relaxed text-[var(--sf-muted)]',
    warmSection: 'bg-[var(--sf-warm)]',
    workflow: 'grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16',
    workflowCanvas:
      'flex min-w-0 flex-col items-center gap-3 rounded-panel border border-black/8 bg-[var(--sf-paper)] px-5 py-9 text-center sm:px-8 sm:py-12',
    workflowPath: 'mb-6 flex w-full items-center justify-between gap-2',
    workflowEndpoint: 'flex flex-1 flex-col items-center gap-4 text-xs font-medium sm:text-sm',
    workflowIcon: 'size-12 stroke-1 text-[var(--sf-ink)]',
    pathArrow: 'size-6 shrink-0 text-[var(--sf-muted)]',
    placeholderTitle: 'text-base font-medium',
    example:
      'relative mt-9 flex min-h-72 flex-col items-center justify-center gap-4 rounded-panel border border-dashed border-black/20 bg-[var(--sf-warm)] px-6 py-12 text-center sm:min-h-80',
    exampleLabel: 'mb-3 text-xs text-[var(--sf-muted)]',
    exampleIcon: 'size-10 stroke-1 text-[var(--sf-muted)]',
    exampleNote: 'max-w-md text-sm leading-relaxed text-[var(--sf-muted)]',
    comparison:
      'mt-3 overflow-x-auto rounded-card border border-black/10 outline-none focus-visible:ring-2 focus-visible:ring-[var(--sf-orange)] md:mt-9',
    comparisonHint: 'mt-8 text-sm text-[var(--sf-muted)] md:hidden',
    table:
      'w-full min-w-[44rem] border-collapse text-left text-sm [&_tr:last-child>*]:border-b-0 [&_tr>*:nth-child(2)]:bg-[var(--sf-pale)]/60',
    tableCell: 'w-1/4 border-b border-black/10 px-6 py-6 align-top leading-relaxed',
    tableHeading: 'bg-[var(--sf-warm)] text-base font-semibold',
    tableRowLabel: 'font-medium text-[var(--sf-muted)]',
    pricingToolbar: 'mt-9 flex flex-wrap items-center justify-between gap-5',
    freePractice: 'flex items-center gap-2 text-sm font-medium',
    periods: 'flex max-w-full gap-1 rounded-control border border-black/10 bg-white p-1',
    periodButton: 'text-[var(--sf-muted)] hover:bg-[var(--sf-pale)]',
    periodSelected: 'bg-[var(--sf-ink)] text-white hover:bg-[var(--sf-ink)] hover:text-white',
    pricingGrid: 'mt-7 grid gap-4 lg:grid-cols-3',
    priceRecommended: 'border-[var(--sf-ink)] bg-white ring-1 ring-[var(--sf-ink)]',
    priceHeading: 'flex min-h-16 flex-col gap-2',
    priceRecommendation: 'text-xs font-medium text-[var(--sf-muted)]',
    priceAmount: 'flex flex-col gap-1',
    priceValue: 'text-4xl font-bold leading-tight tabular-nums',
    priceQuota:
      'grid w-full grid-cols-[4rem_minmax(0,1fr)] items-center gap-3 text-sm leading-relaxed',
    quotaValue: 'text-3xl font-semibold tabular-nums',
    priceAction: 'mt-auto w-full',
    pricingNote: 'mt-5 text-sm text-[var(--sf-muted)]',
    priceCard:
      'flex flex-col items-start gap-7 rounded-card border border-black/10 bg-[var(--sf-paper)] p-6 xl:p-8',
    faqGrid: 'grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16',
    faq: 'border-b border-black/10 py-4 first:pt-0',
    faqSummary:
      'flex min-h-11 cursor-pointer list-none items-center justify-between gap-5 text-base font-medium outline-none focus-visible:ring-2 focus-visible:ring-[var(--sf-orange)] [&::-webkit-details-marker]:hidden',
    faqAnswer: 'max-w-xl pt-3 pb-1 text-sm leading-relaxed text-[var(--sf-muted)]',
    faqIcon:
      'size-5 shrink-0 transition-transform group-open:rotate-45 motion-reduce:transition-none',
    footer:
      'scroll-mt-24 border-t border-black/10 bg-[var(--sf-warm)] pt-10 pb-[max(1.5rem,env(safe-area-inset-bottom))]',
    footerGrid: 'flex flex-wrap justify-between gap-8',
    footerColumn: 'flex flex-col items-start gap-3',
    footerDescription: 'text-sm leading-relaxed text-[var(--sf-muted)]',
    footerLabel: 'text-sm font-semibold',
    footerEmail:
      'inline-flex min-h-11 items-center break-all text-base underline decoration-black/20 underline-offset-4',
    footerBottom:
      'mt-9 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-6 text-xs leading-relaxed text-[var(--sf-muted)]',
  },

  app: appLayout,
  lemurPreview: {
    root: 'flex h-svh min-h-0 flex-col bg-white text-foreground dark:bg-[#242529]',
    shell:
      'pt-[max(clamp(2rem,8svh,5rem),env(safe-area-inset-top))] pb-[max(clamp(1.5rem,5svh,3rem),env(safe-area-inset-bottom))]',
    stage:
      'flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-card bg-white',
    character: 'h-full max-h-[min(58svh,32rem)] w-full overflow-visible',
    player: 'flex h-full w-full flex-col items-center justify-center',
    squarePlayer: '[container-type:size]',
    surface: 'relative size-full',
    squareSurface: 'size-[min(100cqw,100cqh)] overflow-hidden',
    reaction:
      'absolute inset-0 size-full cursor-pointer touch-manipulation rounded-tile outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
    videoLayer: 'absolute',
    inactiveVideo: 'invisible',
    video: 'h-full w-full object-contain',
    mediaError: 'text-sm text-destructive',
    controls: 'grid grid-cols-1 gap-2 min-[360px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]',
    button: 'min-w-0',
  },
  wordmark: {
    root: 'inline-flex items-baseline font-semibold leading-none',
    sizes: {
      hero: 'text-6xl',
      compact: 'text-2xl',
      navigation: 'text-4xl',
      inline: 'align-baseline',
    },
    ai: 'wordmark-ai inline-block shrink-0',
  },
  streakCelebration: {
    score: `${displayNumber} text-amber-500`,
    unit: 'text-lg font-semibold text-amber-500',
  },
  goalChart: {
    brandLabel: { x: 196, y: 4, width: 90, height: 24 },
    brandLabelClass: 'text-foreground text-xs font-medium',
  },
  surface: {
    illustration:
      'bg-muted text-muted-foreground flex size-20 items-center justify-center rounded-card',
    centeredSummary: 'border-border w-full space-y-1 rounded-card border p-4 text-center',
    streakSummary: 'border-border w-full space-y-3 rounded-card border p-4',
    chart: 'border-border bg-card w-full rounded-card border p-4',
    mascot:
      'border-border bg-muted text-muted-foreground flex items-center justify-center rounded-card border-2 border-dashed',
    streakDay: 'flex size-8 items-center justify-center rounded-full',
  },
  control: {
    input: 'h-12 rounded-control',
    sizes: {
      default: 'h-12 gap-2 rounded-control px-4 text-base',
      compact: 'h-11 gap-2 rounded-control px-3 text-base',
      icon: 'size-12 rounded-control p-0',
      'icon-compact': 'size-11 rounded-control p-0',
      card: 'h-auto rounded-card text-base',
      segment: 'h-12 rounded-[calc(var(--radius-tile)-0.25rem)] text-base',
    },
  },
  auth: {
    forgot: 'text-muted-foreground font-normal',
  },
  oauth: {
    group: 'space-y-2',
    button: 'w-full justify-center gap-3',
    icon: 'size-5 shrink-0',
  },
  viewport: {
    width: 'w-full',
    frame:
      'bg-background flex min-h-svh flex-col pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]',
  },
  learning: {
    content: 'mx-auto flex min-h-svh w-full flex-col',
    catalog: 'max-w-none',
    flow: 'max-w-md desktop:max-w-2xl landscape-short:max-w-none',
    workspace: 'max-w-none',
    unchanged: 'max-w-md',
    app: 'flex h-svh flex-col desktop:grid desktop:grid-cols-[clamp(11rem,18vw,14rem)_minmax(0,1fr)] landscape-short:grid landscape-short:grid-cols-[4.5rem_minmax(0,1fr)]',
    main: 'flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-t border-border desktop:border-b landscape-short:border-b desktop:col-start-2 desktop:row-start-1 desktop:pl-4 desktop:pr-4 landscape-short:col-start-2 landscape-short:row-start-1 landscape-short:p-0',
    flowExit:
      'hidden desktop:fixed desktop:top-6 desktop:left-6 desktop:z-40 desktop:inline-flex desktop:min-h-11 desktop:items-center desktop:gap-2 desktop:rounded-tile desktop:px-3 desktop:text-sm desktop:text-muted-foreground desktop:hover:bg-muted landscape-short:hidden',
    icon: 'size-4 shrink-0',
  },
  flowHeader: {
    root: 'grid shrink-0 grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))]',
    back: 'text-muted-foreground hover:bg-muted flex size-11 shrink-0 items-center justify-center rounded-control outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
    icon: 'size-5',
    progress: 'min-w-0',
  },
  errorNote: {
    root: 'border-destructive/40 bg-destructive/5 text-destructive flex min-w-0 shrink-0 flex-wrap items-center gap-2 rounded-tile border p-3 text-sm',
    icon: 'size-4 shrink-0',
    message: 'min-w-0 flex-1 wrap-anywhere',
    retry: 'text-destructive min-h-11 shrink-0 px-3 text-base',
  },
  sheet: {
    width: 'mx-auto w-full max-w-md desktop:max-w-xl landscape-short:max-w-xl',
    root: 'sheet-enter bg-background border-border fixed inset-x-0 bottom-0 z-[60] max-h-[calc(100svh-max(0.5rem,env(safe-area-inset-top)))] overflow-y-auto overscroll-contain rounded-t-panel border p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] desktop:inset-y-6 desktop:my-auto desktop:h-fit desktop:max-h-[calc(100svh-3rem)] landscape-short:inset-y-2 landscape-short:my-auto landscape-short:h-fit landscape-short:max-h-[calc(100svh-1rem)] landscape-short:rounded-panel desktop:rounded-panel desktop:p-7',
    overlay: 'sheet-overlay-enter fixed inset-0 z-[55] bg-black/30',
    header: 'flex items-start justify-between gap-4',
    headerActions: 'flex shrink-0 items-center gap-1',
    title: 'text-lg font-semibold',
    close: 'size-11 rounded-full',
    desktopClose: 'hidden desktop:inline-flex landscape-short:inline-flex',
    grabber:
      'group -mt-4 mx-auto mb-1 flex h-11 w-16 touch-none items-center justify-center rounded-full outline-none desktop:hidden landscape-short:hidden',
    grabberPill: 'h-1.5 w-9 rounded-full bg-muted-foreground/35 group-focus-visible:bg-foreground',
    icon: 'size-5',
  },
  mathFormula: '[&_.katex-display]:m-0!',
  bottomNav: {
    root: 'border-border bg-background flex shrink-0 items-stretch border-t pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] desktop:col-start-1 desktop:row-start-1 desktop:flex-col desktop:gap-2 desktop:border-t-0 desktop:border-r desktop:overflow-y-auto desktop:px-3 desktop:pt-6 desktop:pb-4 landscape-short:col-start-1 landscape-short:row-start-1 landscape-short:flex-col landscape-short:gap-1 landscape-short:overflow-y-auto landscape-short:border-t-0 landscape-short:border-r landscape-short:px-1 landscape-short:py-2',
    item: 'flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-1 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring desktop:min-h-14 desktop:flex-none desktop:flex-row desktop:justify-start desktop:gap-3 desktop:rounded-card desktop:px-3 desktop:text-base desktop:hover:bg-muted/60 landscape-short:min-h-13 landscape-short:flex-none landscape-short:flex-col landscape-short:justify-center landscape-short:gap-1 landscape-short:px-0 landscape-short:text-xs',
    active:
      'text-foreground font-medium desktop:bg-muted desktop:inset-ring desktop:inset-ring-border landscape-short:rounded-tile landscape-short:bg-muted',
    idle: 'text-muted-foreground',
    brand:
      'hidden desktop:mb-6 desktop:flex desktop:flex-col desktop:gap-3 desktop:px-4 landscape-short:hidden',
    brandLink: 'w-fit rounded-tile outline-none focus-visible:ring-2 focus-visible:ring-ring',
    caption: 'text-xs text-muted-foreground',
    footer:
      'hidden desktop:mt-auto desktop:flex desktop:min-h-11 desktop:items-center desktop:gap-3 desktop:rounded-tile desktop:px-4 desktop:text-sm desktop:text-muted-foreground desktop:hover:bg-muted/60 landscape-short:hidden',
    icon: 'size-6',
  },
  formSection: {
    root: 'min-w-0',
    legend: 'mb-3 text-base font-semibold',
    content: 'min-w-0',
  },
  activitySetup: {
    closeAlignment: '-ml-4',
    content: 'flex flex-col gap-4',
    topics: 'grid grid-cols-1 gap-2 landscape-short:grid-cols-2',
    footer: 'space-y-3',
    notice: 'text-center text-sm text-muted-foreground',
  },
  quiz: {
    content: 'flex min-h-0 flex-1 flex-col',
    choiceGrid: 'grid grid-cols-1 gap-3 min-[360px]:grid-cols-2',
    root: 'flex h-svh flex-col bg-background',
    header:
      'grid shrink-0 grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-3 px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-3 landscape-short:pt-[max(0.25rem,env(safe-area-inset-top))] landscape-short:pb-0',
    headerSide:
      'flex size-11 items-center justify-center text-xs font-medium tabular-nums text-muted-foreground',
    headerLabel: 'col-start-2 text-center text-xs font-medium text-muted-foreground',
    row: 'flex items-center gap-3',
    stack: 'flex flex-col gap-4',
    compact: 'flex flex-col gap-2',
    resultActions:
      'flex flex-col gap-2 landscape-short:flex-row landscape-short:[&>button]:min-w-0 landscape-short:[&>button]:w-auto landscape-short:[&>button]:flex-1',
    caption: 'text-xs font-medium text-muted-foreground',
    body: 'text-sm leading-relaxed text-muted-foreground',
    label: 'text-base font-semibold',
    icon: 'size-5 shrink-0',
    iconButton: 'size-11 rounded-full',
    catalog:
      'flex flex-col gap-4 pt-2 desktop:grid desktop:grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] desktop:content-start desktop:gap-5 landscape-short:grid landscape-short:grid-cols-2 landscape-short:content-start',
    topic:
      'group flex w-full flex-col gap-3 rounded-card border p-4 text-left transition-transform active:scale-[0.98] motion-reduce:transition-none',
    surface: 'border-border bg-muted/40 text-foreground',
    topicTop: 'flex items-start justify-between gap-4',
    topicTitle: 'text-lg font-semibold',
    topicArt:
      'flex min-h-16 items-center justify-center rounded-[max(0px,calc(var(--radius-card)-1rem))] bg-background/70 px-4 py-3 text-lg',
    badge:
      'inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 text-xs font-medium',
    grid: 'grid grid-cols-2 gap-3',
    setting:
      'flex min-h-16 flex-col items-start justify-center gap-1 rounded-card border-2 px-4 py-3 text-left',
    selected: 'border-foreground bg-muted text-foreground',
    idle: 'border-border bg-background hover:bg-muted/50',
    note: 'rounded-tile bg-muted/60 p-4 text-sm leading-relaxed text-muted-foreground',
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
      'relative flex min-h-[clamp(5rem,14svh,7rem)] items-center justify-center-safe overflow-x-auto rounded-card border-2 px-3 py-4 text-base transition-transform active:translate-y-0.5 motion-reduce:transition-none',
    pairColumn: 'grid grid-rows-3 gap-2',
    pair: 'flex min-h-16 items-center justify-center-safe overflow-x-auto rounded-card border-2 px-2 py-3 text-base',
    matched: answerSuccessSurface,
    buildZone:
      'flex min-h-24 flex-wrap items-center justify-center gap-2 rounded-tile border-2 border-dashed border-border bg-muted/40 p-3',
    token:
      'flex min-h-12 min-w-12 items-center justify-center rounded-tile border-2 px-3 py-2 text-base',
    tokens: 'flex flex-wrap justify-center gap-2',
    feedback: 'flex flex-col gap-2 rounded-tile border p-4',
    incorrect:
      'border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
    formula: 'overflow-x-auto py-1 text-center text-base',
    result:
      'flex flex-1 flex-col items-center justify-center-safe gap-6 text-center landscape-short:justify-start landscape-short:gap-3 [&>*]:shrink-0',
    medal: 'flex size-24 items-center justify-center rounded-full bg-muted text-foreground',
    trophy: 'size-12',
    score: displayNumber,
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
    title: 'outline-none text-balance whitespace-pre-line wrap-anywhere',
    subtitle: 'text-balance whitespace-pre-line wrap-anywhere',
    variants: {
      landingHero: {
        title: 'text-[clamp(2.75rem,5.3vw,4.5rem)] font-semibold leading-[1.04] ',
        subtitle: 'text-lg leading-relaxed text-[var(--sf-muted)]',
      },
      landingSection: {
        title: 'text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.1] ',
        subtitle: 'text-base leading-relaxed text-[var(--sf-muted)]',
      },
      landingCard: {
        title: 'text-2xl font-semibold leading-tight ',
        subtitle: 'text-base leading-relaxed text-[var(--sf-muted)]',
      },
      screen: {
        title: 'text-[clamp(1.75rem,4.4svh,2.25rem)] font-semibold leading-tight',
        subtitle: 'text-[clamp(1rem,2.2svh,1.125rem)] text-muted-foreground',
      },
      app: {
        title: 'text-[clamp(1.5rem,6.4vw,1.75rem)] font-semibold leading-tight',
        subtitle: compactHeadingSubtitle,
      },
      navigation: {
        title: 'text-2xl font-semibold leading-tight',
        subtitle: compactHeadingSubtitle,
      },
      task: {
        title: 'text-[clamp(1.125rem,2.7svh,1.375rem)] font-semibold leading-snug',
        subtitle: 'text-base leading-relaxed text-foreground',
      },
    },
  },
  typography: {
    sectionTitle: 'text-base font-semibold text-foreground',
    controlTitle: 'text-base font-medium text-foreground',
    description: 'text-sm text-muted-foreground',
    value: 'text-lg font-semibold text-foreground',
    caption: 'text-xs text-muted-foreground',
  },

  // Список вариантов делит свободную высоту (flex-1) - влезает любое число
  // карточек без переполнения. Пол карточки - тач-таргет 2.75rem, потолок - десктоп.
  list: 'flex min-h-0 flex-1 flex-col justify-start gap-[clamp(0.375rem,1.2svh,0.625rem)]',
  card: 'min-h-11 max-h-[4.5rem] flex-1',
  option: {
    root: 'group bg-muted/45 flex min-h-16 w-full items-center gap-3 rounded-card border border-transparent px-4 py-3 text-left outline-none',
    iconFrame:
      'text-muted-foreground group-data-[checked]:text-primary flex size-[clamp(1.5rem,3.5svh,2rem)] shrink-0 items-center justify-center',
    icon: 'block size-full shrink-0 overflow-visible',
    description: 'mt-0.5 block',
    indicator:
      'border-input group-data-[checked]:border-primary mr-1.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2',
    indicatorFill: 'bg-primary size-2.5 rounded-full',
  },

  // Основное действие экрана (CTA); stack - вертикальный зазор пары кнопок.
  cta: 'w-full',
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
    tabs: 'sticky top-0 z-40 grid h-14 grid-cols-3 rounded-tile bg-muted p-1',
    tabsIndicator:
      'pointer-events-none absolute inset-y-1 left-1 z-10 w-[calc((100%_-_0.5rem)/3)] rounded-[calc(var(--radius-tile)-0.25rem)] bg-foreground transition-transform duration-[var(--task-tab-motion-duration)] ease-out motion-reduce:transition-none',
    tabsActiveLabels:
      'pointer-events-none absolute inset-y-1 left-1 z-30 w-[calc((100%_-_0.5rem)/3)] overflow-hidden rounded-[calc(var(--radius-tile)-0.25rem)] transition-transform duration-[var(--task-tab-motion-duration)] ease-out motion-reduce:transition-none',
    tabsActiveLabelsTrack:
      'grid h-full w-[300%] grid-cols-3 transition-transform duration-[var(--task-tab-motion-duration)] ease-out motion-reduce:transition-none',
    tabActiveLabel: 'flex items-center justify-center text-base font-medium text-background',
    tabButton:
      'relative z-20 h-12 rounded-[calc(var(--radius-tile)-0.25rem)] bg-transparent px-1 text-base font-medium hover:bg-transparent',
    tabLabel: 'text-muted-foreground',
    grid: 'grid grid-cols-2 gap-3 [overflow-anchor:none] desktop:grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] desktop:gap-4',
    card: 'relative isolate min-h-32 min-w-0 rounded-card border border-transparent text-left',
    compactCard: 'p-4',
    activeCard:
      'bg-card border-border border shadow-[0_1px_0_color-mix(in_oklch,var(--foreground)_8%,transparent)]',
    disabledCard: 'bg-muted/35 border-border/70 text-muted-foreground border',
    favoriteAll: 'justify-start p-4 text-left',
    favoriteCard: 'flex-col items-start p-4',
    favoriteNumber: 'text-lg font-semibold',
    favoriteId: 'text-xs text-muted-foreground',
    empty: 'py-12 text-center text-base text-muted-foreground',
    numberHeaderGrid:
      'grid min-h-20 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-3',
    numberHeadingTitle: 'min-w-0 truncate text-base font-medium',
    numberTitleCompact: 'col-span-2 col-start-1 row-start-2',
    numberHeaderMeta: 'col-start-3 row-start-1 flex shrink-0 items-center',
    numberLabel: 'col-start-1 row-start-1 text-lg font-semibold',
    compactMetricValue: 'col-start-3 row-start-2 text-sm tabular-nums text-muted-foreground',
    compactProgress: 'col-span-3 col-start-1 row-start-3 h-1.5',
    skeleton: 'h-32 rounded-tile',
    countGrid: 'grid grid-cols-4 gap-2',
    setupOption: 'min-w-0',
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
      'absolute inset-0 z-20 h-11 w-full cursor-pointer appearance-none rounded-control bg-transparent opacity-0 outline-none focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-11 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:mt-2.5 [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-transparent',
    difficultyScale: 'flex justify-between text-xs text-muted-foreground',
    soon: 'col-span-3 col-start-1 row-start-3 text-xs text-muted-foreground',
    icon: 'size-5',
  },
  settings: {
    shell: 'flex h-svh flex-col bg-background',
    header: 'flex shrink-0 items-center gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2',
    backButton:
      'text-muted-foreground hover:bg-muted flex size-11 shrink-0 items-center justify-center rounded-control transition-[transform,opacity]',
    backIcon: 'size-5',
    content: 'space-y-7 pt-4',
    logoutSection: 'border-border space-y-3 border-t py-4',
    logoutAction: 'h-12 w-full justify-center px-0',
    fields: 'space-y-7 text-left',
    fieldGroup: 'space-y-3',
    input: 'h-12 rounded-control text-base',
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
      'absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-control text-muted-foreground hover:text-foreground',
    clearIcon: 'size-4',
  },
  mockExamDemo: {
    card: 'flex h-full min-h-0 flex-col overflow-y-auto overscroll-contain rounded-panel border border-border bg-card p-[clamp(1rem,3svh,1.5rem)]',
    content: 'flex flex-col gap-[clamp(1rem,2.5svh,1.5rem)]',
    loading: 'flex min-h-full flex-col items-center justify-center gap-6 text-center',
    photo: 'relative h-40 w-30 overflow-hidden rounded-tile border border-border',
    photoImage: 'object-cover',
    spinner: 'size-8 shrink-0 animate-spin text-muted-foreground motion-reduce:animate-none',
    readyIcon: 'size-8 shrink-0 text-success',
    loadingLabel: 'flex w-full min-w-0 items-center justify-center gap-3',
    loadingTitle: 'min-w-0 flex-1',
    meta: 'text-sm text-muted-foreground',
    scores: 'grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center gap-4',
    primary: 'space-y-2',
    score: `${displayNumber} text-success`,
    scoreLabel: 'text-sm font-medium',
    scoreLine: 'flex items-baseline gap-2',
    scoreMax: 'text-lg font-semibold text-success',
    secondary: 'space-y-1 border-l border-border pl-4',
    secondaryScore: 'text-lg font-semibold tabular-nums',
    caption: 'text-xs leading-relaxed text-muted-foreground',
    tips: 'space-y-4 rounded-tile border border-amber-200 bg-amber-50 p-4 text-amber-950 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-100',
    tip: 'space-y-1',
    tipTitle: 'text-sm font-semibold',
    tipDescription: 'text-sm leading-relaxed',
    tipsHeading: 'flex items-center gap-2 text-base font-semibold',
    tipIcon: 'size-5 shrink-0',
    example:
      'group overflow-hidden rounded-tile border border-border bg-muted/35 transition-colors open:bg-card',
    exampleToggle:
      'flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 text-base font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&::-webkit-details-marker]:hidden',
    exampleChevronFrame:
      'flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground',
    exampleChevron:
      'size-4 transition-transform duration-[var(--task-control-motion-duration)] group-open:rotate-180 motion-reduce:transition-none',
    exampleContent: 'space-y-4 border-t border-border px-4 py-4',
    exampleIntro: 'text-sm leading-relaxed text-muted-foreground',
    exampleSteps: 'space-y-4',
    exampleStep: 'grid grid-cols-[1.5rem_minmax(0,1fr)] items-start gap-3',
    exampleStepNumber:
      'flex size-6 items-center justify-center rounded-full bg-foreground text-xs font-semibold tabular-nums text-background',
    exampleStepBody: 'min-w-0 space-y-1.5',
    exampleStepTitle: 'text-sm font-semibold',
    exampleFormula: 'overflow-x-auto py-1 text-sm whitespace-nowrap',
    exampleResult: 'rounded-tile bg-success/10 px-3 py-2 text-sm font-medium text-success',
    error: 'px-4 text-sm text-destructive',
  },
  training: {
    shell:
      'bg-background fixed inset-x-0 top-0 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] flex h-[var(--training-viewport-height,100svh)] translate-y-[var(--training-viewport-offset-top,0px)] flex-col overflow-hidden',
    header:
      'shrink-0 px-4 pt-[max(0.625rem,env(safe-area-inset-top))] pb-1 landscape-short:pt-[max(0.25rem,env(safe-area-inset-top))] landscape-short:pb-0 keyboard-open:hidden',
    scrubber: 'h-16 landscape-short:h-11 min-w-0 flex-1',
    cardArea:
      'min-h-0 flex-1 overflow-hidden px-4 py-3 landscape-short:py-1 keyboard-open:pt-1 keyboard-open:pb-0',
    card: 'h-full min-h-0 rounded-panel p-5',
    taskCard:
      'border-border bg-card relative flex h-full min-h-0 flex-col overflow-hidden rounded-panel border',
    reviewCard:
      'border-border bg-card flex h-full min-h-0 flex-col overflow-y-auto overscroll-contain touch-pan-y border',
    controls:
      'shrink-0 gap-2 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] landscape-short:pt-1 landscape-short:pb-[max(0.25rem,env(safe-area-inset-bottom))] keyboard-open:pt-1 keyboard-open:pb-1',
    controlsRow: 'flex items-start',
    controlButton: 'size-12 shrink-0 rounded-control',
    reviewButton:
      'h-12 min-w-0 flex-1 rounded-control px-3 py-1 text-base leading-tight whitespace-normal',
    answerWrap: 'relative min-w-0 flex-1 [&>div]:min-w-0',
    answerError: 'sr-only',
    answerWithHint: 'pt-4 pb-0',
    answerHint:
      'pointer-events-none absolute top-1 left-4 right-11 truncate text-xs leading-4 text-destructive',
    answerErrorPlaceholder: 'placeholder:text-destructive',
    answer: 'h-12 w-full rounded-control pl-4 text-base',
    headerRow: 'flex items-center gap-2',
    closeButton: 'size-11 shrink-0 rounded-full',
    cardHeader:
      'relative z-20 flex shrink-0 flex-wrap items-center gap-x-2 px-3 py-2 min-[400px]:px-4 landscape-short:py-0 keyboard-open:hidden',
    titleGroup: 'flex min-h-11 min-w-28 flex-1 flex-col justify-center gap-0.5',
    difficultyIcon: 'task-skull-icon ml-1.5 inline-block size-4.5 align-[-0.125em] text-foreground',
    cardTitle: 'text-lg font-semibold whitespace-nowrap',
    solvedMeta: 'max-w-full truncate text-xs leading-4 font-medium text-muted-foreground',
    actions: 'ml-auto flex shrink-0 items-center',
    actionButton: 'size-11 shrink-0 rounded-control',
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
    reviewHeader: 'flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1',
    reviewTitle: 'text-lg font-semibold',
    reviewStat: 'ml-auto text-sm whitespace-nowrap text-muted-foreground tabular-nums',
    reviewList: 'mt-6 space-y-2',
    reviewTask: 'w-full',
    reviewActions: 'w-full space-y-2',
    exitSheet: 'w-full space-y-4',
    exitActions: 'grid grid-cols-2 gap-2',
    exitAction: 'h-11',
    blockList: 'space-y-4',
    latex: 'overflow-x-auto py-2 text-center text-[clamp(1.25rem,2.4vw,1.625rem)]',
    image: 'relative mx-auto w-full max-w-md landscape-short:max-w-[min(18rem,50svh)]',
    blockText: 'text-base whitespace-pre-line',
    blockImage: 'object-contain',
    blockImageMonochrome: 'dark:invert',
    scrubberFrame: 'flex h-full min-w-0 items-center gap-2',
    scrubberTrack:
      'relative flex h-11 min-w-0 flex-1 touch-none items-center gap-0.5 rounded-control bg-muted/80 p-2',
    scrubberSegment:
      'relative h-2.5 min-w-1 flex-1 rounded-full border transition-transform duration-[var(--task-control-motion-duration)] motion-reduce:transition-none',
    scrubberLens:
      'tasks-lens-enter absolute inset-0 z-10 flex items-center justify-center gap-1.5 rounded-control bg-foreground p-1.5 shadow-lg',
    scrubberLensSegment:
      'relative flex h-8 min-w-8 flex-1 items-center justify-center rounded-control border text-xs font-medium tabular-nums',
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
