// HTTP-клиент API. Сессию держит бэкенд в куке SESSION (HttpOnly) - браузер
// прикладывает её сам. Для мутирующих запросов бэкенд требует CSRF-токен:
// читаем куку XSRF-TOKEN и возвращаем её значение в заголовке X-XSRF-TOKEN.

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// Кука XSRF-TOKEN появляется после любого запроса к бэкенду;
// если её ещё нет - дёргаем bootstrap-эндпоинт.
async function csrfToken(): Promise<string> {
  const existing = readCookie('XSRF-TOKEN');
  if (existing) return existing;

  await fetch('/api/auth/csrf', { credentials: 'include' });
  return readCookie('XSRF-TOKEN') ?? '';
}

interface ApiFetchInit extends RequestInit {
  json?: unknown;
}

export async function apiFetch<T>(path: string, init: ApiFetchInit = {}): Promise<T> {
  const { json, ...rest } = init;
  const method = (rest.method ?? (json !== undefined ? 'POST' : 'GET')).toUpperCase();

  const headers = new Headers(rest.headers);
  if (json !== undefined) headers.set('Content-Type', 'application/json');
  if (MUTATING_METHODS.has(method)) headers.set('X-XSRF-TOKEN', await csrfToken());

  const response = await fetch(path, {
    ...rest,
    method,
    headers,
    credentials: 'include',
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });

  if (!response.ok) {
    // Бэкенд отвечает RFC 9457 problem detail - берём человекочитаемое поле.
    const problem = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new ApiError(response.status, problem?.detail ?? `HTTP ${response.status}`);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

// Имитация сетевой задержки - для оставшихся мок-эндпоинтов.
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
