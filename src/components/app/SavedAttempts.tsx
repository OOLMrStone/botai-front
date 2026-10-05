'use client';
import { useRouter } from 'next/navigation';
import { AppCard, AppCardHeading } from '@/components/app/AppCard';
import { ErrorNote } from '@/components/common/ErrorNote';
import { Button } from '@/components/ui/button';
import { layout } from '@/config/layout';
import { LEARNING_COPY as C, LEARNING_ROUTES, DATE_FORMAT } from '@/config/integration';
import { ROUTES } from '@/config/onboarding-steps';
import { useAsyncData } from '@/hooks/use-async-data';
import type { CachedResource } from '@/lib/cached-resource';
import type { Attempt } from '@/lib/api/learning-types';
import { examsResource, unfinishedResource } from '@/lib/learning-resources';
export function SavedAttempts({
  resource = unfinishedResource,
  history = false,
}: {
  resource?: CachedResource<Attempt[]>;
  history?: boolean;
}) {
  const { data, failed, retry } = useAsyncData(resource);
  const router = useRouter();
  const exams = useAsyncData(examsResource).data;
  return (
    <div className={layout.integration.unfinished}>
      {failed ? (
        <ErrorNote message={C.loadError} onRetry={retry} />
      ) : data === null ? (
        <p className={layout.typography.description}>{C.loading}</p>
      ) : data.length ? (
        data.map((attempt) => (
          <AppCard key={attempt.id}>
            <AppCardHeading
              title={
                attempt.kind === 'mock-exam'
                  ? (exams?.find((exam) => exam.id === attempt.templateId)?.title ?? C.examTitle)
                  : C.trainingTitle(
                      [...new Set(attempt.items.map((item) => item.task.examNumber))].join(', '),
                    )
              }
              subtitle={C.checked(attempt.summary.graded, attempt.summary.total)}
            />
            <p className={layout.typography.caption}>
              {DATE_FORMAT.format(new Date(attempt.updatedAt))} · {C.attemptStatus[attempt.status]}{' '}
              · {C.score(attempt.summary.earnedPoints, attempt.summary.maxPoints)}
            </p>
            {attempt.summary.pending ? (
              <p className={layout.typography.description}>{C.pending}</p>
            ) : null}
            {attempt.summary.graded < attempt.summary.total ? (
              <p className={layout.typography.caption}>{C.incomplete}</p>
            ) : null}
            <p className={layout.typography.caption}>
              {attempt.currentIndex === attempt.items.length
                ? C.check
                : C.resumeAt(attempt.currentIndex + 1)}
            </p>
            <Button
              className={layout.cta}
              onClick={() => router.push(LEARNING_ROUTES.attempt(attempt.id))}
            >
              <span className={layout.integration.attemptActionText}>
                {attempt.kind === 'mock-exam'
                  ? C.continueExam
                  : C.continueCollection(
                      [...new Set(attempt.items.map((item) => item.task.examNumber))].join(', '),
                    )}
              </span>
            </Button>
          </AppCard>
        ))
      ) : (
        <AppCard>
          <AppCardHeading title={history ? C.historyEmpty : C.emptyCollections} />
          <Button className={layout.cta} onClick={() => router.push(ROUTES.tasks)}>
            {C.openCatalog}
          </Button>
        </AppCard>
      )}
    </div>
  );
}
