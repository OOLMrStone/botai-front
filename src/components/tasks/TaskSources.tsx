import { TASK_CONTENT, type TaskSource } from '@/config/tasks';
import { layout } from '@/config/layout';
import { taskSourceUrl } from '@/lib/task-content';

export function TaskSources({ sources }: { sources?: TaskSource[] }) {
  if (!sources?.length) return null;
  return (
    <div className={layout.training.sourceMeta}>
      {sources.map((source, index) => {
        const url = taskSourceUrl(source.sourceUrl);
        const label = Object.hasOwn(TASK_CONTENT.providerLabels, source.provider)
          ? TASK_CONTENT.providerLabels[source.provider]
          : source.provider;
        const references = [
          ...new Set([
            ...(source.originalPublisher ? [source.originalPublisher.name] : []),
            ...source.originalReferences.map((reference) => reference.label),
          ]),
        ].join(TASK_CONTENT.sourceSeparator);
        return (
          <p key={index}>
            {TASK_CONTENT.sourceLabel}
            {TASK_CONTENT.sourceSeparator}
            {url ? (
              <a
                className={layout.training.sourceLink}
                href={url}
                target="_blank"
                rel="noreferrer noopener"
              >
                {label}
              </a>
            ) : (
              label
            )}
            {references ? `${TASK_CONTENT.sourceSeparator}${references}` : ''}
          </p>
        );
      })}
    </div>
  );
}
