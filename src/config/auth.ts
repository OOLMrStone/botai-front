// Имена куки и CSRF-заголовка - контракт с бэкендом (Spring). Одно место для
// клиента (lib/api/client) и локального мок-бэкенда (app/api/auth/_mock),
// чтобы они не разъехались.

export const AUTH_COOKIE = {
  session: 'SESSION',
  xsrf: 'XSRF-TOKEN',
} as const;

export const AUTH_HEADER = {
  xsrf: 'X-XSRF-TOKEN',
} as const;
