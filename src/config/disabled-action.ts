export const DISABLED_ACTION = { sideOffset: 10, collisionPadding: 16 } as const;
export const DISABLED_ACTION_COPY = {
  explanation: 'Почему недоступно',
  checkEmpty: 'Сначала реши хотя бы одну задачу и запиши ответ',
  checkInvalid: 'Допиши ответ числом. После этого его можно будет проверить',
  checkPhoto: 'Сначала прикрепи фото решения к задаче',
  checkPro: 'Для проверки фото нужен платный тариф',
  checkPending: 'Проверка уже идёт. Дождись результата',
  checkUnsupported: 'Для этих задач проверка пока недоступна. Открой задачу и сверься с решением',
  checkUnavailable: 'Проверка временно недоступна. Попробуй позже',
  checkRetry: 'Открой задачу и повтори проверку или прикрепи другое фото',
  checkFinished: 'Записанные ответы уже проверены. Результаты можно посмотреть в задачах',
  photoLocked: 'Это фото уже отправлено на проверку. Состав решения больше нельзя менять',
  photoRetry: 'Сначала открой повторную попытку проверки этой задачи',
  drawingLocked: 'Решение уже отправлено на проверку. Черновик сохранён и доступен для просмотра',
  catalogEmpty: 'Задачи этого номера ещё готовятся. Пока выбери другой номер',
  verificationSent: 'Письмо уже отправлено. Открой его и перейди по ссылке для подтверждения',
} as const;

export const CHECK_DISABLED_REASONS = [
  { states: ['pending'], reason: DISABLED_ACTION_COPY.checkPending },
  { states: ['invalid'], reason: DISABLED_ACTION_COPY.checkInvalid },
  {
    states: ['failed', 'rejected', 'cancelled', 'expired'],
    reason: DISABLED_ACTION_COPY.checkRetry,
  },
  { states: ['empty'], reason: DISABLED_ACTION_COPY.checkEmpty },
  { states: ['photo'], reason: DISABLED_ACTION_COPY.checkPhoto },
  { states: ['pro'], reason: DISABLED_ACTION_COPY.checkPro },
  { states: ['unsupported'], reason: DISABLED_ACTION_COPY.checkUnsupported },
  { states: ['unavailable'], reason: DISABLED_ACTION_COPY.checkUnavailable },
] as const;
