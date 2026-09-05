// Технические константы приложения. Никаких магических чисел в коде - только отсюда.

// Тайминги (мс). courseBuildMs делят лоадер «строим курс» и мок buildCourse.
export const TIMINGS = {
  courseBuildMs: 3500,
  mockLatencyMs: 600,
} as const;

export const COMMITMENT_SEAL = {
  holdDurationMs: 1400,
  moveTolerancePx: 18,
} as const;

// Арт-сфера. dprCap - потолок плотности рендера: ниже реального DPR экрана
// точки становятся мылом (буфер растягивается), выше 3 - лишний расход впустую.
export const SPHERE = {
  points: 1500,
  dprCap: 3,
} as const;

export const TASK_DRAWING = {
  lineWidth: 3,
  eraserRadius: 14,
  dprCap: 2,
  pointMinDistancePx: 2,
  workspaceBottomSpacePx: 176,
  workspaceGrowthThresholdPx: 128,
  workspaceGrowthStepPx: 256,
  workspaceMaxHeightPx: 6000,
  workspaceAutoScrollEdgePx: 56,
  workspaceAutoScrollStepPx: 12,
  panPointerCount: 2,
} as const;

export const ERASER_MENU_MOTION = {
  selectDurationMs: 280,
  selectEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;
