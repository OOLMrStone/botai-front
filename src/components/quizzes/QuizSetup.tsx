import { SelectableCard } from '@/components/onboarding/SelectableCard';
import { RadioGroup } from '@/components/ui/radio-group';
import { QuizDuration } from '@/components/quizzes/QuizDuration';
import { MathFormula } from '@/components/common/MathFormula';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { layout } from '@/config/layout';
import { QUIZ_COPY, QUIZ_DIFFICULTIES } from '@/config/quiz';
import { useQuiz } from '@/hooks/use-quiz';
import { cn } from '@/lib/utils';

export function QuizSetup() {
  const { topic, difficulty, setDifficulty } = useQuiz();
  if (!topic) return null;

  return (
    <div className={cn(layout.scroll, layout.quiz.stack)}>
      <ScreenHeading variant="app" title={QUIZ_COPY.setupTitles[topic.id]} />
      <MathFormula
        value={topic.formula}
        className={cn(layout.quiz.topicArt, layout.quiz.surface)}
      />
      <fieldset className={layout.quiz.stack}>
        <legend className={layout.quiz.label}>{QUIZ_COPY.difficulty}</legend>
        <RadioGroup
          value={difficulty}
          onValueChange={(value) => setDifficulty(value === 'challenge' ? 'challenge' : 'basic')}
          className={layout.quiz.grid}
        >
          {QUIZ_DIFFICULTIES.map((option) => (
            <SelectableCard key={option.id} value={option.id} label={option.title} />
          ))}
        </RadioGroup>
      </fieldset>
      <QuizDuration />
    </div>
  );
}
