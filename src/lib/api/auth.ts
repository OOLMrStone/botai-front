import { TIMINGS } from '@/config/constants';
import { sleep } from '@/lib/api/client';

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

export interface AuthResult {
  userId: string;
  token: string;
}

export async function oauthSignIn(provider: OAuthProvider): Promise<AuthResult> {
  await sleep(TIMINGS.mockLatencyMs);

  // TODO: реальный OAuth-редирект (Яндекс / Google / ВК) - нужен бэкенд, см. SCOPE.
  return { userId: `mock-${provider}`, token: 'mock-token' };
}

export async function registerUser(_payload: RegisterPayload): Promise<AuthResult> {
  await sleep(TIMINGS.mockLatencyMs);

  // TODO: POST /auth/register - создать профиль.
  return { userId: 'mock-user', token: 'mock-token' };
}

export async function loginUser(_payload: LoginPayload): Promise<AuthResult> {
  await sleep(TIMINGS.mockLatencyMs);

  // TODO: POST /auth/login - вход существующего пользователя.
  return { userId: 'mock-user', token: 'mock-token' };
}
