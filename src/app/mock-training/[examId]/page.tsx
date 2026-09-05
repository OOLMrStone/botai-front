'use client';

import { useParams } from 'next/navigation';

import { MockExamTrainingShell } from '@/components/mock-exams/MockExamTrainingShell';
import { MOCK_EXAM_TASKS } from '@/config/mock-exams';
import { useRequireAuth } from '@/hooks/use-require-auth';

export default function MockExamTrainingPage() {
  const { examId } = useParams<{ examId: string }>();
  const auth = useRequireAuth();

  if (auth !== 'authenticated') return null;

  return <MockExamTrainingShell examId={examId} taskBank={MOCK_EXAM_TASKS} />;
}
