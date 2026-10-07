import { TRAINING_REVIEW_STATES } from '@/config/training-review';

export const ATTEMPT_FEEDBACK_COPY = {
  correct: TRAINING_REVIEW_STATES.correct.label,
  incorrect: 'Пока неверно',
  photoScore: (score: number, maxScore: number) => `${score} из ${maxScore} баллов`,
  photoReady: 'Фото готово к проверке',
  photoSaved: 'Фото сохранено',
  retryPhoto: 'Прикрепить фото заново',
  where: (text: string) => `Где: ${text}`,
  correction: (text: string) => `Как исправить: ${text}`,
} as const;

export const CANCELLABLE_SUBMISSION_STATES = ['queued', 'running'] as const;
