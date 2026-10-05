'use client';
import { ArrowRight } from 'lucide-react';
import { FormSection } from '@/components/common/FormSection';
import { ErrorNote } from '@/components/common/ErrorNote';
import { ActivitySetupScreen } from '@/components/common/ActivitySetupScreen';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { SelectableCard } from '@/components/onboarding/SelectableCard';
import { TrainingDifficultySlider } from '@/components/tasks/TrainingDifficultySlider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup } from '@/components/ui/radio-group';
import { layout } from '@/config/layout';
import { TASK_COPY } from '@/config/tasks';
import { LEARNING_COPY as C, INTEGRATION } from '@/config/integration';
import type { Task } from '@/lib/api/learning-types';
import { useTrainingSetupPage } from '@/hooks/use-training-setup-page';
import { cn } from '@/lib/utils';
export function TrainingSetupExperience({ tasks }: { tasks: Task[] }) {
  const setup = useTrainingSetupPage(tasks);
  return (
    <ActivitySetupScreen
      closeLabel={TASK_COPY.close}
      onClose={setup.close}
      footer={
        <div className={layout.activitySetup.footer}>
          {setup.error ? <ErrorNote message={setup.error} /> : null}
          {setup.shortage ? (
            <p role="status" className={layout.activitySetup.notice}>
              {C.shortage}
            </p>
          ) : null}
          <p className={layout.typography.description}>{C.selected(setup.total)}</p>
          <Button
            className={layout.cta}
            disabled={!setup.canStart}
            onClick={() => void setup.start()}
          >
            {setup.busy ? C.saving : TASK_COPY.setup.start}
            <ArrowRight className={layout.quiz.icon} />
          </Button>
        </div>
      }
    >
      <div className={cn(layout.scroll, layout.activitySetup.content)}>
        <ScreenHeading variant="app" title={C.selection} subtitle={C.selectNumber} />
        {setup.catalog.failed ? (
          <ErrorNote message={C.loadError} onRetry={setup.catalog.retry} />
        ) : null}
        <FormSection title={TASK_COPY.setup.difficulty}>
          <TrainingDifficultySlider
            value={setup.difficultyLevel}
            valueLabel={
              setup.difficulty === 'easy'
                ? TASK_COPY.setup.difficultyLevels.easy
                : setup.difficulty === 'hard'
                  ? TASK_COPY.setup.difficultyLevels.hard
                  : C.anyDifficulty
            }
            onChange={setup.setDifficultyLevel}
          />
        </FormSection>
        {(setup.catalog.data?.numbers ?? []).map((number) => {
          const selection = setup.selections.find((item) => item.examNumber === number.examNumber);
          return (
            <FormSection
              key={number.examNumber}
              title={TASK_COPY.setup.exam(number.examNumber, number.title)}
            >
              <Button
                variant={selection ? 'default' : 'outline'}
                className={layout.cta}
                aria-pressed={Boolean(selection)}
                onClick={() => setup.toggle(number.examNumber)}
              >
                {C.available(number.availableCount)}
              </Button>
              {selection ? (
                <div className={layout.settings.fields}>
                  <label className={layout.settings.fieldGroup}>
                    <span className={layout.typography.description}>{C.count}</span>
                    <Input
                      type="number"
                      min={1}
                      max={INTEGRATION.maxPerNumber}
                      value={selection.count}
                      aria-label={C.count}
                      onChange={(event) =>
                        setup.update(number.examNumber, { count: Number(event.target.value) })
                      }
                    />
                  </label>
                  <RadioGroup
                    aria-label={TASK_COPY.setup.topics}
                    value={selection.topicIds?.[0] ?? setup.allTopics}
                    onValueChange={(value) =>
                      setup.update(number.examNumber, {
                        topicIds: value === setup.allTopics ? [] : [String(value)],
                      })
                    }
                    className={layout.activitySetup.topics}
                  >
                    <SelectableCard value={setup.allTopics} label={C.allTopics} />
                    {number.topics.map((topic) => (
                      <SelectableCard
                        key={topic.id}
                        value={topic.id}
                        label={topic.title}
                        description={C.available(topic.availableCount)}
                      />
                    ))}
                  </RadioGroup>
                </div>
              ) : null}
            </FormSection>
          );
        })}
      </div>
    </ActivitySetupScreen>
  );
}
