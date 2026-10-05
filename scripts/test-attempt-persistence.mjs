import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  moduleLoader,
  hookHarness,
  memoryStore,
  settle,
  deferred,
} from './helpers/hook-harness.mjs';

function setup() {
  const harness = hookHarness();
  const timers = new Map();
  let sequence = 0;
  const stroke = (id) => [{ id, coordinateSpace: 'width', points: [{ x: 0.1, y: 0.1 }] }];
  let server = {
    id: 'attempt',
    revision: 1,
    currentIndex: 0,
    items: [{ id: 'item', answer: '', drawing: [], task: {}, submission: { status: 'queued' } }],
  };
  let get = async () => structuredClone(server);
  let patch = async (_id, body) => {
    if (body.revision !== server.revision)
      throw new (load('@/lib/api/client').ApiError)(409, 'conflict');
    server = {
      ...server,
      revision: server.revision + 1,
      currentIndex: body.currentIndex ?? server.currentIndex,
      items: server.items.map((item) => ({
        ...item,
        ...body.items.find((edit) => edit.id === item.id),
      })),
    };
    return structuredClone(server);
  };
  const load = moduleLoader(
    {
      react: harness.react,
      zustand: { create: () => memoryStore() },
      '@/lib/api/learning': {
        fetchAttempt: (...args) => get(...args),
        patchAttempt: (...args) => patch(...args),
      },
      '@/lib/learning-resources': { invalidateAttempts() {} },
      '@/lib/attempt': { itemLocked: () => false },
    },
    {
      window: { addEventListener() {}, removeEventListener() {} },
      setTimeout: (fn) => {
        timers.set(++sequence, fn);
        return sequence;
      },
      clearTimeout: (id) => timers.delete(id),
      setInterval: (fn) => {
        timers.set(++sequence, fn);
        return sequence;
      },
      clearInterval: (id) => timers.delete(id),
    },
  );
  const store = load('@/stores/tasks-store').useTasksStore;
  const render = () => harness.render(() => load('@/hooks/use-attempt').useAttempt('attempt'));
  const init = async () => {
    render();
    await settle();
    return render();
  };
  return {
    harness,
    load,
    store,
    render,
    init,
    stroke,
    timers,
    server: () => server,
    setGet(fn) {
      get = fn;
    },
    setPatch(fn) {
      patch = fn;
    },
    remote(next) {
      server = { ...server, ...next };
    },
  };
}

test('transport retry preserves answer and drawing, including failed discard GET', async () => {
  const s = setup();
  let api = await s.init();
  api.setAnswer('item', '123');
  s.store.getState().setDrawing('item', s.stroke('local'));
  s.store.getState().commitDrawing('item');
  s.setPatch(async () => {
    throw new Error('offline');
  });
  await s.render().save();
  s.setGet(async () => {
    throw new Error('offline');
  });
  await s.render().reload();
  assert.equal(s.render().answers.item, '123');
  assert.equal(s.store.getState().savedDrawings.item[0].id, 'local');
  let sent;
  s.setPatch(async (_id, body) => {
    sent = body;
    return { ...s.server(), revision: 2, items: [{ ...s.server().items[0], ...body.items[0] }] };
  });
  await s.render().retry();
  assert.equal(sent.items[0].answer, '123');
  assert.equal(sent.items[0].drawing[0].id, 'local');
  assert.equal(s.render().unsaved, false);
});

test('SPA Back/remount keeps attempt draft; owner reset removes it and ignores late ACK', async () => {
  const s = setup();
  const api = await s.init();
  api.setAnswer('item', '123');
  s.harness.unmount();
  await s.init();
  assert.equal(s.render().answers.item, '123');
  const write = deferred();
  s.setPatch(() => write.promise);
  const saving = s.render().save();
  s.load('@/lib/attempt-drafts').clearAttemptDrafts();
  s.store.getState().reset();
  s.harness.unmount();
  write.resolve({ ...s.server(), revision: 2, items: [{ ...s.server().items[0], answer: '123' }] });
  await saving;
  await s.init();
  assert.deepEqual(s.render().answers, {});
  assert.equal(s.render().attempt.revision, 1);
});

test('late polling GET cannot roll back accepted PATCH', async () => {
  const s = setup();
  await s.init();
  const poll = deferred();
  s.setGet(() => poll.promise);
  [...s.timers.values()].forEach((fn) => fn());
  await settle();
  await s.render().select(1);
  assert.equal(s.render().attempt.currentIndex, 1);
  poll.resolve({ ...s.server(), revision: 1, currentIndex: 0 });
  await settle();
  assert.equal(s.render().attempt.revision, 2);
  assert.equal(s.render().attempt.currentIndex, 1);
});

test('ACK removes only captured answer/drawing, preserving edits made during save', async () => {
  const s = setup();
  let api = await s.init();
  const first = s.stroke('A');
  api.setAnswer('item', 'A');
  s.store.getState().setDrawing('item', first);
  s.store.getState().commitDrawing('item');
  const write = deferred();
  s.setPatch(() => write.promise);
  const saving = s.render().save();
  s.render().setAnswer('item', 'AB');
  const second = s.stroke('AB');
  s.store.getState().setDrawing('item', second);
  s.store.getState().commitDrawing('item');
  write.resolve({
    ...s.server(),
    revision: 2,
    items: [{ ...s.server().items[0], answer: 'A', drawing: first }],
  });
  await saving;
  assert.equal(s.render().answers.item, 'AB');
  assert.strictEqual(s.store.getState().savedDrawings.item, second);
});

test('fresh server drawings hydrate only clean items; remote revision cannot rebase dirty draft', async () => {
  const s = setup();
  await s.init();
  const state = s.store.getState();
  state.hydrate([{ id: 'item', drawing: s.stroke('remote') }]);
  assert.equal(s.store.getState().drawings.item[0].id, 'remote');
  state.setDrawing('item', s.stroke('gesture'));
  state.hydrate([{ id: 'item', drawing: s.stroke('remote2') }]);
  assert.equal(s.store.getState().drawings.item[0].id, 'gesture');
  state.commitDrawing('item');
  state.hydrate([{ id: 'item', drawing: s.stroke('remote2') }]);
  assert.equal(s.store.getState().drawings.item[0].id, 'gesture');
  s.render().setAnswer('item', '123');
  s.remote({ revision: 2 });
  s.harness.unmount();
  await s.init();
  assert.equal(s.render().conflict, true);
  assert.equal(s.render().attempt.revision, 1);
  assert.equal(s.render().answers.item, '123');
  await s.render().reload();
  assert.equal(s.render().attempt.revision, 2);
  assert.deepEqual(s.render().answers, {});
  assert.deepEqual(s.store.getState().drawings.item, []);
});

test('same-revision stale poll cannot undo accepted submission changes', async () => {
  const s = setup();
  await s.init();
  const poll = deferred();
  s.setGet(() => poll.promise);
  [...s.timers.values()].forEach((fn) => fn());
  await settle();
  const ready = {
    ...s.server(),
    items: [{ ...s.server().items[0], submission: { status: 'graded' } }],
  };
  s.setPatch(async () => ready);
  await s.render().select(1);
  poll.resolve(s.server());
  await settle();
  assert.equal(s.render().attempt.items[0].submission.status, 'graded');
});

test('remote revision while dirty blocks PATCH until explicit successful discard', async () => {
  const s = setup();
  await s.init();
  s.render().setAnswer('item', '123');
  s.remote({ revision: 2 });
  s.harness.unmount();
  await s.init();
  let patches = 0;
  s.setPatch(async () => {
    patches++;
    return s.server();
  });
  await s.render().save();
  assert.equal(patches, 0);
  assert.equal(s.render().answers.item, '123');
});

test('discard scopes answers/drawings/gesture flags to one attempt', async () => {
  const s = setup();
  await s.init();
  const other = s.load('@/lib/attempt-drafts').attemptDraft('other');
  other.setAnswer('other-item', '456');
  s.store.getState().setDrawing('other-item', s.stroke('other'));
  s.store.getState().commitDrawing('other-item');
  s.store.getState().setDrawing('item', s.stroke('local'));
  s.render().setAnswer('item', '123');
  await s.render().reload();
  assert.equal(other.answers['other-item'], '456');
  assert.equal(s.store.getState().savedDrawings['other-item'][0].id, 'other');
  assert.equal(s.store.getState().editingDrawings.item, undefined);
  assert.deepEqual(s.store.getState().drawings.item, []);
});
