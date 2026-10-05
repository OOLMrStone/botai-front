import assert from 'node:assert/strict';
import { test } from 'node:test';
import { moduleLoader, hookHarness, deferred } from './helpers/hook-harness.mjs';

function setup(status = 'anonymous', mock = false) {
  const harness = hookHarness();
  let user = status === 'authenticated' ? { id: 'owner' } : null;
  const navigation = [],
    requests = [];
  let resets = 0,
    needed = false;
  let save = async () => {};
  const choices = {
    goal: 'good',
    level: 'basics',
    dailyGoalMinutes: 45,
    notificationsEnabled: false,
    reset: () => resets++,
    requireProfileSave: () => {
      needed = true;
    },
  };
  const routes = { home: '/home', lesson: '/lesson' };
  const load = moduleLoader({
    react: harness.react,
    'next/navigation': { useRouter: () => ({ push: (url) => navigation.push(url) }) },
    '@/hooks/use-auth-session': { useAuthSession: () => ({ status, retry() {} }) },
    '@/config/env': { IS_MOCK_API: mock },
    '@/config/onboarding-steps': {
      ONBOARDING_DESTINATION: mock ? '/lesson' : '/register/save-progress',
      ROUTES: routes,
    },
    '@/lib/api/onboarding': {
      saveOnboarding: async (payload) => {
        requests.push(payload);
        await save();
      },
    },
    '@/stores/onboarding-store': { useOnboardingStore: { getState: () => choices } },
    '@/stores/auth-store': { useAuthStore: { getState: () => ({ user }) } },
  });
  const render = () =>
    harness.render(() => load('@/hooks/use-complete-onboarding').useCompleteOnboarding());
  return {
    render,
    navigation,
    requests,
    resets: () => resets,
    needed: () => needed,
    setSave(fn) {
      save = fn;
    },
    changeOwner(next) {
      user = next;
    },
  };
}

test('real guest ready reaches registration while retaining choices; mock demo route remains', async () => {
  const guest = setup();
  await guest.render().start();
  assert.deepEqual(guest.navigation, ['/register/save-progress']);
  assert.equal(guest.needed(), true);
  assert.equal(guest.resets(), 0);
  assert.equal(guest.requests.length, 0);
  const mock = setup('anonymous', true);
  mock.render().start();
  assert.deepEqual(mock.navigation, ['/lesson']);
});

test('authenticated ready/done await saved choices before HOME', async () => {
  const s = setup('authenticated');
  const gate = deferred();
  s.setSave(() => gate.promise);
  const pending = s.render().finish();
  assert.deepEqual(s.navigation, []);
  assert.equal(s.resets(), 0);
  assert.equal(s.render().pending, true);
  gate.resolve();
  await pending;
  assert.deepEqual(s.navigation, ['/home']);
  assert.equal(s.resets(), 1);
  assert.deepEqual(s.requests, [
    { goal: 'good', level: 'basics', dailyGoalMinutes: 45, notificationsEnabled: false },
  ]);
});

test('onboarding transport failure retains choices and permits retry', async () => {
  const s = setup('authenticated');
  s.setSave(async () => {
    throw new Error('offline');
  });
  await s.render().finish();
  assert.equal(s.resets(), 0);
  assert.deepEqual(s.navigation, []);
  assert.equal(s.render().error, 'offline');
  s.setSave(async () => {});
  await s.render().finish();
  assert.deepEqual(s.navigation, ['/home']);
  assert.equal(s.resets(), 1);
});

test('late completion from old owner cannot reset new owner or navigate', async () => {
  const s = setup('authenticated');
  const gate = deferred();
  s.setSave(() => gate.promise);
  const pending = s.render().finish();
  s.changeOwner({ id: 'other' });
  gate.resolve();
  await pending;
  assert.equal(s.resets(), 0);
  assert.deepEqual(s.navigation, []);
});
