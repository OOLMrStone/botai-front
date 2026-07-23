import { TIMINGS } from '@/config/constants';
import { ApiError, apiFetch, sleep } from '@/lib/api/client';

export type OAuthProvider = 'yandex' | 'google' | 'vk';

export interface RegisterPayload {
  age: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Пользователь, как его отдаёт бэкенд (GET /api/auth/me и ответы login/register).
export interface User {
  id: string;
  email: string;
  displayName: string | null;
  role: string;
  authProvider: string;
  // Тариф. Реальный бэкенд его пока не отдаёт - тогда считаем бесплатным
  // (lib/plan.normalizePlan), мок отдаёт всегда.
  plan?: string;
}

export async function oauthSignIn(provider: OAuthProvider): Promise<User> {
  await sleep(TIMINGS.mockLatencyMs);

  // TODO: реальный OAuth-редирект (Яндекс / Google / ВК) - база на бэкенде уже есть.
  return {
    id: `mock-${provider}`,
    email: `mock@${provider}`,
    displayName: null,
    role: 'USER',
    authProvider: provider.toUpperCase(),
  };
}

export async function registerUser(payload: RegisterPayload): Promise<User> {
  // TODO: возраст (payload.age) бэкенд пока не хранит.
  await apiFetch<User>('/api/auth/register', {
    json: {
      email: payload.email,
      password: payload.password,
      displayName: [payload.firstName, payload.lastName].filter(Boolean).join(' ') || undefined,
    },
  });

  // Регистрация не создаёт сессию - сразу входим, чтобы кука появилась.
  return loginUser({ email: payload.email, password: payload.password });
}

export async function loginUser(payload: LoginPayload): Promise<User> {
  return apiFetch<User>('/api/auth/login', { json: payload });
}

// null - сессии нет (или истекла); это штатный случай, не ошибка.
export async function fetchCurrentUser(): Promise<User | null> {
  try {
    return await apiFetch<User>('/api/auth/me');
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  await apiFetch<void>('/api/auth/logout', { method: 'POST' });
}
