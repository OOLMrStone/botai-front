import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { REGISTER_STEPS } from '@/config/onboarding-steps';

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <OnboardingHeader steps={REGISTER_STEPS} />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
