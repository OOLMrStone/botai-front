// Общая утилита фейк-слоя: имитация сетевой задержки.
// TODO: заменить на реальный fetch-клиент, когда появится бэкенд.

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
