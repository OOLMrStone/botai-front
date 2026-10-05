import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { compileFunction } from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, '..');
function loader(mocks = {}) {
  const cache = new Map();
  function load(name) {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    if (!name.startsWith('@/')) return require(name);
    if (cache.has(name)) return cache.get(name).exports;
    const base = resolve(root, 'src', name.slice(2));
    const file = existsSync(`${base}.ts`) ? `${base}.ts` : `${base}.tsx`;
    const source = readFileSync(file, 'utf8');
    const result = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
      },
    });
    const loadedModule = { exports: {} };
    cache.set(name, loadedModule);
    compileFunction(result.outputText, ['require', 'module', 'exports'], { filename: file })(
      load,
      loadedModule,
      loadedModule.exports,
    );
    return loadedModule.exports;
  }
  return load;
}

const load = loader();
const validation = load('@/lib/validation');
for (const answer of ['0', '-12', '12,5', '12.5', '000.50', '-0']) {
  test(`готовый ответ: ${answer}`, () => assert.equal(validation.isValidShortAnswer(answer), true));
}
for (const answer of [
  '',
  '-',
  '12,',
  'SELECT * FROM',
  '1/2',
  '1e2',
  '0x10',
  'Infinity',
  '1.2.3',
  '1 2',
  '.5',
  '+1',
]) {
  test(`не готовый ответ: ${JSON.stringify(answer)}`, () =>
    assert.equal(validation.isValidShortAnswer(answer), false));
}
for (const answer of ['', '-', '12,', '12.', '-0,']) {
  test(`черновик: ${JSON.stringify(answer)}`, () =>
    assert.equal(validation.isShortAnswerDraft(answer), true));
}

test('единая проверка не принимает экспоненту и hex из старой сессии', () => {
  const { isTrainingAnswerCorrect } = load('@/lib/task-training');
  assert.equal(isTrainingAnswerCorrect({ acceptedAnswers: ['100'] }, '1e2'), false);
  assert.equal(isTrainingAnswerCorrect({ acceptedAnswers: ['16'] }, '0x10'), false);
});
test('десятичные записи сравниваются без потери точности', () => {
  const { isTrainingAnswerCorrect } = load('@/lib/task-training');
  assert.equal(isTrainingAnswerCorrect({ acceptedAnswers: ['12.5'] }, '0012,500'), true);
  assert.equal(
    isTrainingAnswerCorrect({ acceptedAnswers: ['9007199254740992'] }, '9007199254740993'),
    false,
  );
});

function reactHarness() {
  const slots = [];
  let cursor = 0;
  return {
    render(hook) {
      cursor = 0;
      return hook();
    },
    react: {
      useRef(value) {
        const index = cursor++;
        return (slots[index] ??= { current: value });
      },
      useState(value) {
        const index = cursor++;
        slots[index] ??= value;
        return [
          slots[index],
          (next) => {
            slots[index] = next;
          },
        ];
      },
      useEffect() {},
      useTransition() {
        return [false, (run) => run()];
      },
    },
  };
}

test('вставка SQL отклоняется целиком, удаление и минус разрешены', () => {
  const harness = reactHarness();
  const { useAnswerInput } = loader({ react: harness.react })('@/hooks/use-answer-input');
  const accepted = [];
  const input = harness.render(() =>
    useAnswerInput({
      answerKey: 'task-1',
      value: '12',
      disabled: false,
      readOnly: false,
      onValueChange: (value) => accepted.push(value),
    }),
  );
  input.change('12abc34');
  input.change('SELECT * FROM');
  input.change('');
  input.change('-');
  input.change('-12,5');
  assert.deepEqual(accepted, ['', '-', '-12,5']);
});

test('первый клик открывает маршрут, повторный не запускает второй переход', () => {
  const harness = reactHarness();
  const paths = [];
  const { useMockExamNavigation } = loader({
    react: harness.react,
    'next/navigation': { useRouter: () => ({ push: (path) => paths.push(path), prefetch() {} }) },
  })('@/hooks/use-mock-exam-navigation');
  const navigation = harness.render(() => useMockExamNavigation([]));
  navigation.openExam('variant-04');
  navigation.openExam('variant-04');
  assert.deepEqual(paths, ['/mock-training/variant-04']);
});

test('вход начинает с первого задания и сохраняет ответы, вложения и результат', () => {
  const { useMockExamsStore } = loader({ 'zustand/middleware': { persist: (create) => create } })(
    '@/stores/mock-exams-store',
  );
  useMockExamsStore.getState().start('exam');
  useMockExamsStore.getState().setAnswer('exam', 'task', '12');
  useMockExamsStore.getState().addAttachments('exam', 'task', ['solution.jpg']);
  useMockExamsStore.getState().setCurrentIndex('exam', 5);
  useMockExamsStore.getState().start('exam');
  const session = useMockExamsStore.getState().sessions.exam;
  assert.equal(session.currentIndex, 0);
  assert.equal(session.answers.task, '12');
  assert.deepEqual(session.attachments.task, ['solution.jpg']);
});

test('ошибка вставки остаётся у своего задания, DOM ref сохраняется при смене пустого ответа', () => {
  const harness = reactHarness();
  const { useAnswerInput } = loader({ react: harness.react })('@/hooks/use-answer-input');
  const render = (answerKey) =>
    harness.render(() =>
      useAnswerInput({
        answerKey,
        value: '',
        disabled: false,
        readOnly: false,
        onValueChange() {},
      }),
    );
  const first = render('task-1');
  first.change('SELECT * FROM');
  assert.equal(typeof render('task-1').error, 'string');
  const next = render('task-2');
  assert.equal(next.error, undefined);
  assert.equal(next.inputRef, first.inputRef);
});

test('минус остаётся черновиком, ошибка blur исчезает после завершения числа', () => {
  const harness = reactHarness();
  const { useAnswerInput } = loader({ react: harness.react })('@/hooks/use-answer-input');
  let value = '-';
  const render = () =>
    harness.render(() =>
      useAnswerInput({
        answerKey: 'task-1',
        value,
        disabled: false,
        readOnly: false,
        onValueChange(next) {
          value = next;
        },
      }),
    );
  assert.equal(render().error, undefined);
  render().blur();
  assert.equal(typeof render().error, 'string');
  assert.equal(value, '-');
  render().change('-2,5');
  assert.equal(value, '-2,5');
  assert.equal(render().error, undefined);
});

test('старый неверный ответ показывает ошибку, неизменяемый ответ не меняется', () => {
  const harness = reactHarness();
  const { useAnswerInput } = loader({ react: harness.react })('@/hooks/use-answer-input');
  const changes = [];
  const input = harness.render(() =>
    useAnswerInput({
      answerKey: 'task-1',
      value: '1e2',
      disabled: false,
      readOnly: true,
      onValueChange(next) {
        changes.push(next);
      },
    }),
  );
  assert.equal(typeof input.error, 'string');
  input.change('100');
  assert.deepEqual(changes, []);
});

function setupHarness() {
  const paths = [];
  const requests = [];
  const states = [];
  let cursor = 0;
  const store = loader()('@/stores/tasks-store').useTasksStore;
  const useStore = (selector) => selector(store.getState());
  useStore.getState = store.getState;
  useStore.setState = store.setState;
  const catalogResource = {};
  const favoritesResource = {};
  const tasks = Array.from({ length: 7 }, (_, index) => ({
    id: `setup-task-${index}`,
    examNumber: index === 6 ? 2 : 1,
    difficulty: index % 2 ? 'medium' : 'easy',
    topicIds: [index % 2 ? 'triangle' : 'circle'],
  }));
  const catalog = {
    format: { id: 'server-format' },
    numbers: [1, 2].map((number) => ({
      examNumber: number,
      part: 1,
      title: String(number),
      availableCount: tasks.filter((task) => task.examNumber === number).length,
      topics: [],
    })),
  };
  const loadSetup = loader({
    'next/navigation': {
      useRouter: () => ({ push: (path) => paths.push(path), replace: (path) => paths.push(path) }),
    },
    react: {
      useState: (initial) => {
        const index = cursor++;
        if (!(index in states)) states[index] = initial;
        return [
          states[index],
          (value) => {
            states[index] = typeof value === 'function' ? value(states[index]) : value;
          },
        ];
      },
    },
    '@/hooks/use-async-data': {
      useAsyncData: (resource) => ({
        data: resource === catalogResource ? catalog : [],
        failed: false,
        retry() {},
      }),
    },
    '@/lib/learning-resources': { catalogResource, favoritesResource, invalidateAttempts() {} },
    '@/lib/api/learning': {
      createTraining: async (request, key) => {
        requests.push({ request, key });
        return { id: 'saved-server-attempt' };
      },
    },
    '@/stores/tasks-store': { useTasksStore: useStore },
  });
  const render = (hook) => {
    cursor = 0;
    return hook(tasks);
  };
  return { store, paths, loadSetup, tasks, requests, render };
}

test('карточка открывает серверный номер, локальную сессию ещё не начинает', () => {
  const { store, paths, loadSetup, render } = setupHarness();
  const catalog = render(loadSetup('@/hooks/use-task-catalog').useTaskCatalog);
  catalog.openNumber(1);
  assert.deepEqual(paths, ['/training/setup']);
  assert.equal(store.getState().session, null);
  assert.equal(store.getState().setupExamNumber, 1);
  assert.deepEqual(store.getState().setupTaskIds, []);
});

test('избранное создаёт сохранённую серверную подборку с каноническими ID', async () => {
  const { store, paths, loadSetup, tasks, requests, render } = setupHarness();
  const catalog = render(loadSetup('@/hooks/use-task-catalog').useTaskCatalog);
  await catalog.openFavorites(tasks.slice(0, 5));
  assert.deepEqual(requests[0].request, {
    formatId: 'server-format',
    selections: [],
    source: 'favorites',
    taskIds: tasks.slice(0, 5).map((task) => task.id),
  });
  assert.equal(paths.pop(), '/training?attempt=saved-server-attempt');
  assert.equal(store.getState().session, null);
  assert.ok(requests[0].key);
});

test('повторная настройка сохраняет полный номер, а не только выбранные задачи', () => {
  const { store, tasks } = setupHarness();
  store.getState().openSetup(tasks, 'catalog', 1);
  store.getState().startSession(tasks.slice(0, 2), 'catalog');
  store.getState().requestSetup();
  assert.equal(store.getState().session, null);
  assert.deepEqual(
    store.getState().setupTaskIds,
    tasks.map((task) => task.id),
  );
  assert.equal(store.getState().setupExamNumber, 1);
});

test('старая сессия с другим источником не наследует чужую настройку', () => {
  const { store, tasks } = setupHarness();
  store.getState().openSetup(tasks, 'catalog', 1);
  store.getState().startSession(tasks.slice(0, 2), 'favorites');
  store.getState().requestSetup();
  assert.deepEqual(
    store.getState().setupTaskIds,
    tasks.slice(0, 2).map((task) => task.id),
  );
  assert.equal(store.getState().setupSource, 'favorites');
  assert.equal(store.getState().setupExamNumber, null);
});

test('старт отправляет тему, сложность и количество серверу', async () => {
  const { store, paths, loadSetup, requests, render } = setupHarness();
  store.setState({ setupExamNumber: 1 });
  const hook = loadSetup('@/hooks/use-training-setup-page').useTrainingSetupPage;
  let setup = render(hook);
  setup.update(1, { topicIds: ['circle'], count: 2 });
  setup.setDifficultyLevel(0);
  setup = render(hook);
  await setup.start();
  assert.equal(store.getState().session, null);
  assert.deepEqual(requests[0].request, {
    formatId: 'server-format',
    selections: [{ examNumber: 1, count: 2, topicIds: ['circle'] }],
    difficulty: 'easy',
    source: 'catalog',
  });
  assert.deepEqual(paths, ['/training?attempt=saved-server-attempt']);
});

test('пустой выбор и нехватка задач не создают ложный успех, несколько номеров независимы', async () => {
  const { loadSetup, requests, render } = setupHarness();
  const hook = loadSetup('@/hooks/use-training-setup-page').useTrainingSetupPage;
  let setup = render(hook);
  await setup.start();
  assert.equal(requests.length, 0);
  setup.toggle(1);
  setup.toggle(2);
  setup = render(hook);
  assert.equal(setup.selections.length, 2);
  assert.equal(setup.total, 2);
  setup.update(2, { count: 20 });
  setup = render(hook);
  assert.equal(setup.shortage, true);
  assert.equal(setup.canStart, false);
  await setup.start();
  assert.equal(requests.length, 0);
});

test('название бренда в заголовках, подписях и акцентах использует полный знак', () => {
  const { createElement } = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const { BRAND } = load('@/config/brand');
  const { COPY } = load('@/config/onboarding-steps');
  const { ScreenHeading } = load('@/components/onboarding/ScreenHeading');
  const { HighlightText } = load('@/components/onboarding/HighlightText');
  const { GoalChart } = load('@/components/onboarding/GoalChart');
  const cases = [
    createElement(ScreenHeading, { title: COPY.goalResult.title }),
    createElement(ScreenHeading, { title: 'Название', subtitle: BRAND.name }),
    createElement(HighlightText, { text: `*${BRAND.name}*` }),
    createElement(GoalChart),
  ];

  for (const element of cases) {
    const markup = renderToStaticMarkup(element);
    assert.match(markup, /role="img" data-wordmark="inline" aria-label="ботai"/);
    assert.match(markup, /class="wordmark-ai inline-block shrink-0">ai<\/span>/);
    assert.doesNotMatch(markup, /sr-only|retrogression/);
    assert.doesNotMatch(markup, /\bbotai\b/);
  }
});

test('заголовки и логотип используют один спокойный вес независимо от экрана', () => {
  const { layout } = load('@/config/layout');
  for (const variant of Object.values(layout.heading.variants)) {
    assert.match(variant.title, /\bfont-semibold\b/);
    assert.doesNotMatch(variant.title, /\bfont-(?:bold|extrabold|black)\b/);
  }
  assert.match(layout.wordmark.root, /\bfont-semibold\b/);
});

test('desktop-навигация показывает общий знак и сохраняет учебные маршруты', () => {
  const { createElement } = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const { ROUTES } = load('@/config/onboarding-steps');
  const { APP_TABS } = load('@/config/navigation');
  const loadNavigation = loader({
    'next/navigation': { usePathname: () => ROUTES.tasks },
  });
  const { AppNavigation } = loadNavigation('@/components/app/AppNavigation');
  const markup = renderToStaticMarkup(createElement(AppNavigation));

  assert.match(markup, /data-wordmark="navigation" aria-label="ботai"/);
  assert.match(markup, /aria-current="page"[^>]*href="\/tasks"/);
  for (const tab of APP_TABS) assert.ok(markup.includes(`href="${tab.href}"`), tab.href);
  assert.ok(markup.includes(`href="${ROUTES.storefront}"`));
  assert.doesNotMatch(markup, /wordmark-chrome|\bbotai\b/);
});

test('шапка и подвал витрины используют компактный знак той же системы', () => {
  const { createElement } = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const loadStorefront = loader({
    '@/hooks/use-storefront': {
      useStorefrontNavigation: () => ({ menuOpen: false }),
    },
  });

  for (const name of ['StorefrontNavigation', 'StorefrontFooter']) {
    const component = loadStorefront(`@/components/storefront/${name}`)[name];
    const markup = renderToStaticMarkup(createElement(component));
    assert.match(markup, /data-wordmark="compact" aria-label="ботai"/, name);
    assert.match(markup, /class="wordmark-ai inline-block shrink-0">ai<\/span>/, name);
    assert.doesNotMatch(markup, /wordmark-chrome/, name);
  }
});

test('действия витрины сохраняют переход и геометрию общей капсулы', () => {
  const { createElement } = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const { StorefrontAction } = load('@/components/storefront/StorefrontAction');
  const { ROUTES } = load('@/config/onboarding-steps');

  for (const tone of ['orange', 'dark']) {
    const markup = renderToStaticMarkup(
      createElement(StorefrontAction, { href: ROUTES.studentEntry, tone }, 'Учиться'),
    );
    assert.ok(markup.includes(`href="${ROUTES.studentEntry}"`));
    assert.match(markup, /data-control-size="default"/);
    assert.match(markup, /\bh-12\b/);
    assert.match(markup, /\brounded-control\b/);
    assert.doesNotMatch(markup, /data-control-size="storefront"/);
  }
});

function studentEntryHarness(refresh) {
  const paths = [];
  const states = [];
  const effects = [];
  const loadEntry = loader({
    react: {
      useState: (initial) => [initial, (value) => states.push(value)],
      useEffect: (effect) => effects.push(effect),
    },
    'next/navigation': { useRouter: () => ({ replace: (path) => paths.push(path) }) },
    '@/stores/auth-store': { useAuthStore: (select) => select({ refresh }) },
  });
  const { useStudentEntry: renderEntry } = loadEntry('@/hooks/use-student-entry');
  const entry = renderEntry();
  const cleanup = effects[0]();

  return { entry, paths, states, cleanup };
}

for (const authenticated of [false, true]) {
  test(`/learn выбирает маршрут после проверки ${authenticated ? 'активной' : 'гостевой'} сессии`, async () => {
    const { STUDENT_ENTRY } = load('@/config/student-entry');
    const { paths, states } = studentEntryHarness(() =>
      Promise.resolve(authenticated ? { id: 'student' } : null),
    );
    assert.deepEqual(paths, []);

    await Promise.resolve();

    assert.deepEqual(paths, [STUDENT_ENTRY[authenticated ? 'authenticated' : 'anonymous']]);
    assert.deepEqual(states, []);
  });
}

test('/learn не считает ошибку проверки гостевой сессией и позволяет повторить', async () => {
  const { entry, paths, states } = studentEntryHarness(() => Promise.reject(new Error('offline')));

  await Promise.resolve();

  assert.deepEqual(paths, []);
  assert.deepEqual(states, [true]);
  entry.retry();
  assert.deepEqual(states, [true, false]);
});

test('/learn не перенаправляет после ухода со страницы', async () => {
  const { cleanup, paths, states } = studentEntryHarness(() => Promise.resolve({ id: 'student' }));
  cleanup();

  await Promise.resolve();

  assert.deepEqual(paths, []);
  assert.deepEqual(states, []);
});

test('подсказка формата помещается в поле, ответ сохраняется и ошибка не переходит к следующему', () => {
  const harness = reactHarness();
  const { useAnswerInput } = loader({ react: harness.react })('@/hooks/use-answer-input');
  const { SHORT_ANSWER_COPY } = load('@/config/short-answer');
  let value = '12';
  const render = (answerKey = 'task-1') =>
    harness.render(() =>
      useAnswerInput({
        answerKey,
        value,
        disabled: false,
        readOnly: false,
        onValueChange(next) {
          value = next;
        },
      }),
    );

  render().change('12abc');
  assert.equal(value, '12');
  assert.equal(render().errorHint, SHORT_ANSWER_COPY.invalidHint);
  assert.equal(render().showInlineHint, true);
  assert.equal(render('task-2').showInlineHint, false);

  render().clear();
  render().change('abc');
  assert.equal(value, '');
  assert.equal(render().errorHint, SHORT_ANSWER_COPY.invalidHint);
  assert.equal(render().showInlineHint, false);

  render().change('-');
  render().blur();
  assert.equal(render().errorHint, SHORT_ANSWER_COPY.incompleteHint);
  assert.equal(render().showInlineHint, true);
  render().change('-2,5');
  assert.equal(render().errorHint, undefined);
});

function keyboardHarness(options, run) {
  const previous = Object.fromEntries(
    ['window', 'document', 'Element'].map((key) => [key, globalThis[key]]),
  );
  const listeners = new Map();
  const selected = [];
  let modal = false;
  class Target {
    constructor(native = false) {
      this.native = native;
    }
    closest() {
      return this.native ? this : null;
    }
  }
  globalThis.Element = Target;
  globalThis.window = {
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: (name, callback) => {
      if (listeners.get(name) === callback) listeners.delete(name);
    },
  };
  globalThis.document = { querySelector: () => (modal ? {} : null) };
  let cleanup;
  const { useTaskKeyboardNavigation: renderKeyboard } = loader({
    react: {
      useRef: (value) => ({ current: value }),
      useEffect: (effect) => {
        cleanup = effect();
      },
    },
  })('@/hooks/use-task-keyboard-navigation');

  try {
    renderKeyboard({
      currentIndex: 1,
      lastIndex: 3,
      enabled: true,
      onSelect: (index) => selected.push(index),
      ...options,
    });
    const press = (key, overrides = {}) => {
      let prevented = false;
      listeners.get('keydown')?.({
        key,
        target: new Target(),
        preventDefault() {
          prevented = true;
        },
        ...overrides,
      });
      return prevented;
    };
    run({
      selected,
      press,
      Target,
      setModal: (open) => {
        modal = open;
      },
      listeners,
    });
  } finally {
    cleanup?.();
    assert.equal(listeners.size, 0);
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete globalThis[key];
      else globalThis[key] = value;
    }
  }
}

test('стрелки переключают по одному заданию и доходят до обзора без выхода за границы', () => {
  keyboardHarness({}, ({ press, selected }) => {
    assert.equal(press('ArrowLeft'), true);
    assert.equal(press('ArrowRight'), true);
    assert.equal(press('ArrowDown'), false);
    assert.deepEqual(selected, [0, 2]);
  });
  keyboardHarness({ currentIndex: 0 }, ({ press, selected }) => {
    assert.equal(press('ArrowLeft'), false);
    assert.deepEqual(selected, []);
  });
  keyboardHarness({ currentIndex: 2 }, ({ press, selected }) => {
    press('ArrowRight');
    assert.deepEqual(selected, [3]);
  });
  keyboardHarness({ currentIndex: 3 }, ({ press, selected }) => {
    assert.equal(press('ArrowRight'), false);
    press('ArrowLeft');
    assert.deepEqual(selected, [2]);
  });
});

test('стрелки не забираются у поля, слайдера, модального окна и системных сочетаний', () => {
  keyboardHarness({}, ({ press, selected, Target, setModal }) => {
    assert.equal(press('ArrowRight', { target: new Target(true) }), false);
    for (const flag of [
      'defaultPrevented',
      'isComposing',
      'repeat',
      'altKey',
      'ctrlKey',
      'metaKey',
      'shiftKey',
    ]) {
      assert.equal(press('ArrowRight', { [flag]: true }), false, flag);
    }
    setModal(true);
    assert.equal(press('ArrowRight'), false);
    assert.deepEqual(selected, []);
  });
  keyboardHarness({ enabled: false }, ({ listeners, press, selected }) => {
    assert.equal(listeners.size, 0);
    assert.equal(press('ArrowRight'), false);
    assert.deepEqual(selected, []);
  });
});

test('удержание указателя блокирует смену задачи до release/cancel/blur', () => {
  keyboardHarness({}, ({ listeners, press, selected }) => {
    for (const end of ['pointerup', 'pointercancel', 'blur']) {
      listeners.get('pointerdown')({ pointerId: 7 });
      assert.equal(press('ArrowRight'), false);
      listeners.get(end)({ pointerId: 7 });
      assert.equal(press('ArrowRight'), true);
    }
    assert.deepEqual(selected, [2, 2, 2]);
  });
});

test('форма рисунка сохраняется при повороте и zoom, миграция идемпотентна', () => {
  const { migrateDrawingToWorkspace, drawingPointDistance, drawingBottom } =
    load('@/lib/task-drawing');
  const old = [
    {
      id: 'square',
      coordinateSpace: 'workspace',
      points: [
        { x: 0.1, y: 100 },
        { x: 0.2, y: 100 },
        { x: 0.2, y: 200 },
      ],
    },
  ];
  const migrated = migrateDrawingToWorkspace(old, 600, 1000);
  for (const width of [1000, 600, 1000]) {
    const [a, b, c] = migrated[0].points;
    assert.equal(drawingPointDistance(a, b, width), drawingPointDistance(b, c, width));
    assert.equal(drawingBottom(migrated, width), 0.2 * width);
  }
  assert.equal(migrated[0].points[0].y * 1000, 100);
  assert.deepEqual(migrateDrawingToWorkspace(migrated, 900, 600), migrated);
  const legacy = [{ id: 'old', points: [{ x: 0.2, y: 0.5 }] }];
  assert.equal(migrateDrawingToWorkspace(legacy, 600, 1000)[0].points[0].y, 0.3);
});

test('оба ластика работают в общей системе координат после поворота', () => {
  const { eraseDrawingAt } = load('@/lib/task-drawing');
  const strokes = [
    {
      id: 'line',
      coordinateSpace: 'width',
      points: [
        { x: 0.1, y: 0.1 },
        { x: 0.5, y: 0.1 },
      ],
    },
  ];
  for (const width of [375, 844]) {
    assert.equal(eraseDrawingAt(strokes, { x: 0.3, y: 0.1 }, width, 'stroke-eraser').length, 0);
    const parts = eraseDrawingAt(strokes, { x: 0.3, y: 0.1 }, width, 'point-eraser');
    assert.equal(parts.length, 2);
    assert.ok(parts.every((s) => s.coordinateSpace === 'width'));
  }
});

test('полностью стёртый рисунок остаётся dirty до подтверждения сервера', () => {
  const { useTasksStore } = loader()('@/stores/tasks-store');
  const store = useTasksStore.getState();
  const stroke = {
    id: 'line',
    points: [
      { x: 0.1, y: 20 },
      { x: 0.3, y: 30 },
    ],
  };
  store.setDrawing('server-item', [stroke]);
  store.commitDrawing('server-item');
  store.acknowledge('server-item', useTasksStore.getState().savedDrawings['server-item']);
  store.setDrawing('server-item', []);
  store.commitDrawing('server-item');
  const cleared = useTasksStore.getState().savedDrawings['server-item'];
  assert.deepEqual(cleared, []);
  assert.equal(Object.hasOwn(useTasksStore.getState().savedDrawings, 'server-item'), true);
  store.acknowledge('server-item', cleared);
  assert.equal(Object.hasOwn(useTasksStore.getState().savedDrawings, 'server-item'), false);
});
