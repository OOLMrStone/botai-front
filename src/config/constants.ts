// Технические константы приложения. Никаких магических чисел в коде - только отсюда.

// Тайминги (мс). courseBuildMs делят лоадер «строим курс» и мок buildCourse.
export const TIMINGS = {
  courseBuildMs: 3500,
  mockLatencyMs: 600,
} as const;

// Арт-сфера. dprCap - потолок плотности рендера: ниже реального DPR экрана
// точки становятся мылом (буфер растягивается), выше 3 - лишний расход впустую.
export const SPHERE = {
  points: 1500,
  dprCap: 3,
} as const;
