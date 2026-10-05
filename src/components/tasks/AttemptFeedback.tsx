import { Button } from '@/components/ui/button';
import { layout } from '@/config/layout';
import { LEARNING_COPY as C } from '@/config/integration';
import type { AttemptItem } from '@/lib/api/learning-types';
export function AttemptFeedback({
  item,
  busy,
  onCancel,
  onRetry,
}: {
  item: AttemptItem;
  busy: boolean;
  onCancel: () => void;
  onRetry: () => void;
}) {
  const submission = item.submission;
  const result = item.result ?? submission?.result;
  if (!submission && !result) return null;
  return (
    <div className={layout.integration.feedback}>
      {submission ? (
        <p className={layout.typography.description}>{C.status[submission.status]}</p>
      ) : null}
      {result ? (
        <>
          <p className={layout.typography.sectionTitle}>
            {result.isGraded && result.score !== null
              ? C.score(result.score, result.maxScore)
              : C.noScore}
          </p>
          {result.isDemo ? <p className={layout.typography.caption}>{C.demoResult}</p> : null}
          {result.rejectionReason ? (
            <p className={layout.typography.description}>{result.rejectionReason}</p>
          ) : null}
          {result.feedback ? (
            <>
              <p className={layout.typography.description}>{result.feedback.analysis.summary}</p>
              <p className={layout.typography.description}>{result.feedback.grading.explanation}</p>
              {result.feedback.analysis.errors.map((error) => (
                <p key={error.id} className={layout.typography.description}>
                  {error.description} {error.advice}
                </p>
              ))}
              <details>
                <summary className={layout.typography.description}>{C.feedback}</summary>
                <pre className={layout.integration.raw}>
                  {JSON.stringify(result.feedback, null, 2)}
                </pre>
              </details>
            </>
          ) : null}
        </>
      ) : null}
      {submission && ['queued', 'running', 'draft'].includes(submission.status) ? (
        <Button variant="outline" disabled={busy} onClick={onCancel}>
          {C.cancel}
        </Button>
      ) : null}
      {submission?.retryable ? (
        <Button variant="outline" disabled={busy} onClick={onRetry}>
          {C.retryCheck}
        </Button>
      ) : null}
    </div>
  );
}
