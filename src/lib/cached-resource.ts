// Ответ бэкенда, который тянется один раз за сессию: экран, открытый повторно,
// получает данные мгновенно (peek), без мигания скелетона. Параллельные вызовы
// делят один запрос. С реальным бэком здесь появится инвалидация / SWR.

export interface CachedResource<T> {
  peek: () => T | null;
  get: () => Promise<T>;
}

export function cachedResource<T>(load: () => Promise<T>): CachedResource<T> {
  let value: T | null = null;
  let inflight: Promise<T> | null = null;

  return {
    peek: () => value,
    get: () => {
      if (value) return Promise.resolve(value);
      if (!inflight) {
        inflight = load()
          .then((data) => {
            value = data;
            return data;
          })
          .finally(() => {
            inflight = null;
          });
      }
      return inflight;
    },
  };
}
