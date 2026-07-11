import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { ONBOARDING_STEPS } from '@/config/onboarding-steps';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <OnboardingHeader steps={ONBOARDING_STEPS} />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
