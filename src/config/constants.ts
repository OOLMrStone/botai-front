// Технические константы приложения. Никаких магических чисел в коде - только отсюда.

// Тайминги (мс). courseBuildMs делят лоадер «строим курс» и мок buildCourse.
export const TIMINGS = {
  courseBuildMs: 3500,
  mockLatencyMs: 600,
} as const;
