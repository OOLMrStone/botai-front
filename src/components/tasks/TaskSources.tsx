import { TASK_CONTENT, type TaskSource } from '@/config/tasks';
import { layout } from '@/config/layout';
import { taskSourceUrl } from '@/lib/task-content';

export function TaskSources({ sources }: { sources?: TaskSource[] }) {
  const origins = (sources ?? []).flatMap((source) => [
    ...(source.originalPublisher
      ? [{ label: source.originalPublisher.name, url: source.originalPublisher.url }]
      : []),
    ...source.originalReferences,
  ]);
  const distinct = origins.filter(
    (origin, index) =>
      origin.label && origins.findIndex((candidate) => candidate.label === origin.label) === index,
  );
  if (!distinct.length) return null;
  return (
    <div className={layout.training.sourceMeta}>
      <p>
        {TASK_CONTENT.sourceLabel}
        {distinct.map((origin, index) => {
          const url = origin.url ? taskSourceUrl(origin.url) : null;
          return (
            <span key={index}>
              {TASK_CONTENT.sourceSeparator}
              {url ? (
                <a
                  className={layout.training.sourceLink}
                  href={url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {origin.label}
                </a>
              ) : (
                origin.label
              )}
            </span>
          );
        })}
      </p>
    </div>
  );
}
