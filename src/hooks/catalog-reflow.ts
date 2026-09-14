import { layout, taskMotion } from '@/config/layout';

interface DetailSnapshot {
  element: HTMLElement;
  bounds: DOMRect;
  opacity: string;
}

interface MotionTiming {
  duration: number;
  easing: string;
}

interface CardPosition {
  bounds: DOMRect;
  surface: DOMRect;
  shared: Map<string, DOMRect>;
  details: DetailSnapshot[];
}

export function cardPositions(
  grid: HTMLDivElement,
  captureDetails = false,
): Map<HTMLElement, CardPosition> {
  return new Map(
    Array.from(grid.children).flatMap((card) => {
      if (!(card instanceof HTMLElement) || !card.dataset.examNumber) return [];

      const bounds = card.getBoundingClientRect();
      const surface = card.querySelector<HTMLElement>('[data-reflow-surface]');
      const shared = new Map(
        Array.from(card.querySelectorAll<HTMLElement>('[data-reflow-shared]')).map((element) => [
          element.dataset.reflowShared ?? '',
          element.getBoundingClientRect(),
        ]),
      );

      const details = captureDetails
        ? Array.from(card.querySelectorAll<HTMLElement>('[data-reflow-detail]')).flatMap(
            (element) => {
              const copy = element.cloneNode(true);
              if (!(copy instanceof HTMLElement)) return [];

              copy.removeAttribute('data-reflow-detail');
              copy.removeAttribute('id');
              copy.querySelectorAll('[id]').forEach((child) => child.removeAttribute('id'));
              copy.setAttribute('aria-hidden', 'true');
              copy.inert = true;

              return [
                {
                  element: copy,
                  bounds: element.getBoundingClientRect(),
                  opacity: getComputedStyle(element).opacity,
                },
              ];
            },
          )
        : [];

      return [
        [card, { bounds, surface: surface?.getBoundingClientRect() ?? bounds, shared, details }],
      ];
    }),
  );
}

function translation(x: number, y: number) {
  return `translate3d(${x}px, ${y}px, 0)`;
}

export function animateCard(card: HTMLElement, previous: CardPosition, current: CardPosition) {
  const animations: Animation[] = [];
  const options = {
    duration: taskMotion.catalogReflowMs,
    easing: taskMotion.catalogReflowEasing,
  };
  const x = previous.bounds.left - current.bounds.left;
  const y = previous.bounds.top - current.bounds.top;
  const changedShape =
    Math.abs(previous.surface.width - current.surface.width) > taskMotion.catalogShapeTolerancePx ||
    Math.abs(previous.surface.height - current.surface.height) > taskMotion.catalogShapeTolerancePx;

  const expanding = current.surface.width > previous.surface.width;
  const phase = taskMotion.catalogShapePhaseFraction;
  const exit = taskMotion.catalogDetailExitFraction;
  const movement = [
    { transform: translation(x, y), offset: 0 },
    { transform: translation(x, y), offset: exit, easing: taskMotion.catalogReflowEasing },
    {
      transform: translation(y < 0 ? x : 0, y < 0 ? 0 : y),
      offset: phase,
      easing: taskMotion.catalogReflowEasing,
    },
    { transform: 'none', offset: 1 },
  ];

  if (x || y) {
    animations.push(card.animate(movement, { ...options, easing: 'linear' }));
  }
  if (!changedShape) {
    if (x) {
      animations.push(
        card.animate(
          [
            { opacity: 1, offset: 0 },
            { opacity: 0, offset: exit },
            { opacity: 0, offset: taskMotion.catalogDetailDelayFraction },
            { opacity: 1, offset: 1 },
          ],
          { ...options, easing: 'linear' },
        ),
      );
    }

    return animations;
  }

  animations.push(...fadePreviousDetails(card, previous, options));
  animations.push(...crossfadeSurface(card, previous, expanding, x, options));
  animations.push(...moveSharedContent(card, previous, current, expanding, x, y, options));
  animations.push(...revealDetails(card, options));

  return animations;
}

function fadePreviousDetails(card: HTMLElement, previous: CardPosition, options: MotionTiming) {
  const animations: Animation[] = [];
  for (const detail of previous.details) {
    const element = detail.element;
    element.classList.add(...layout.tasks.reflowSnapshot.split(' '));
    Object.assign(element.style, {
      left: `${detail.bounds.left - previous.bounds.left}px`,
      top: `${detail.bounds.top - previous.bounds.top}px`,
      width: `${detail.bounds.width}px`,
      height: `${detail.bounds.height}px`,
    });
    card.append(element);

    const animation = element.animate([{ opacity: detail.opacity }, { opacity: 0 }], {
      ...options,
      duration: taskMotion.catalogReflowMs * taskMotion.catalogDetailExitFraction,
      fill: 'forwards',
    });
    animation.onfinish = () => element.remove();
    animation.oncancel = () => element.remove();
    animations.push(animation);
  }

  return animations;
}

function crossfadeSurface(
  card: HTMLElement,
  previous: CardPosition,
  expanding: boolean,
  x: number,
  options: MotionTiming,
) {
  const animations: Animation[] = [];
  const phase = taskMotion.catalogShapePhaseFraction;
  const exit = taskMotion.catalogDetailExitFraction;
  const surface = card.querySelector<HTMLElement>('[data-reflow-surface]');
  if (surface) {
    // Обе поверхности сохраняют радиусы: меняется прозрачность, а не масштаб углов.
    const oldSurface = surface.cloneNode() as HTMLElement;
    oldSurface.removeAttribute('data-reflow-surface');
    oldSurface.inert = true;
    oldSurface.style.width = `${previous.surface.width}px`;
    oldSurface.style.height = `${previous.surface.height}px`;
    oldSurface.style.right = 'auto';
    oldSurface.style.bottom = 'auto';
    card.prepend(oldSurface);

    const oldAnimation = oldSurface.animate(
      expanding
        ? [
            { opacity: 1, offset: 0 },
            { opacity: 1, offset: phase },
            { opacity: 0, offset: 1 },
          ]
        : [{ opacity: 1 }, { opacity: 0 }],
      {
        ...options,
        duration: expanding ? options.duration : options.duration * exit,
        easing: 'linear',
        fill: 'forwards',
      },
    );
    oldAnimation.onfinish = () => oldSurface.remove();
    oldAnimation.oncancel = () => oldSurface.remove();
    animations.push(oldAnimation);
    animations.push(
      surface.animate(
        expanding
          ? [
              { opacity: 0, transform: translation(-x, 0), offset: 0 },
              {
                opacity: 0,
                transform: translation(-x, 0),
                offset: phase,
                easing: taskMotion.catalogReflowEasing,
              },
              { opacity: 1, transform: 'none', offset: 1 },
            ]
          : [
              { opacity: 0, offset: 0 },
              { opacity: 1, offset: phase },
              { opacity: 1, offset: 1 },
            ],
        { ...options, easing: 'linear' },
      ),
    );
  }

  return animations;
}

function moveSharedContent(
  card: HTMLElement,
  previous: CardPosition,
  current: CardPosition,
  expanding: boolean,
  x: number,
  y: number,
  options: MotionTiming,
) {
  const animations: Animation[] = [];
  const phase = taskMotion.catalogShapePhaseFraction;
  const exit = taskMotion.catalogDetailExitFraction;
  for (const element of card.querySelectorAll<HTMLElement>('[data-reflow-shared]')) {
    const key = element.dataset.reflowShared ?? '';
    const first = previous.shared.get(key);
    const last = current.shared.get(key);
    if (!first || !last) continue;

    animations.push(
      element.animate(
        [
          {
            transform: translation(first.left - last.left - x, first.top - last.top - y),
            offset: 0,
          },
          {
            transform: translation(first.left - last.left - x, first.top - last.top - y),
            offset: expanding ? phase : exit,
            easing: taskMotion.catalogReflowEasing,
          },
          { transform: 'none', offset: expanding ? 1 : phase },
          { transform: 'none', offset: 1 },
        ],
        { ...options, easing: 'linear' },
      ),
    );
  }
  return animations;
}

function revealDetails(card: HTMLElement, options: MotionTiming) {
  const animations: Animation[] = [];
  for (const element of card.querySelectorAll<HTMLElement>('[data-reflow-detail]')) {
    animations.push(
      element.animate([{ opacity: 0 }, { opacity: 1 }], {
        ...options,
        delay: taskMotion.catalogReflowMs * taskMotion.catalogDetailDelayFraction,
        duration: taskMotion.catalogReflowMs * (1 - taskMotion.catalogDetailDelayFraction),
        fill: 'backwards',
      }),
    );
  }
  return animations;
}
