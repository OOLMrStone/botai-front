import { DevToolsSlot } from '@/components/dev/DevToolsSlot';
import { LearningFrame } from '@/components/app/LearningFrame';

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LearningFrame>{children}</LearningFrame>
      <DevToolsSlot />
    </>
  );
}
