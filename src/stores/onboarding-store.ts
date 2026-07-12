import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RegistrationData {
  age: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface OnboardingState {
  goal: string | null;
  level: string | null;
  dailyGoalMinutes: number | null;
  notificationsEnabled: boolean;
  hearAboutUs: string | null;
  registration: RegistrationData;

  setGoal: (goal: string) => void;
  setLevel: (level: string) => void;
  setDailyGoal: (minutes: number) => void;
  setNotifications: (enabled: boolean) => void;
  setHearAboutUs: (source: string) => void;
  updateRegistration: (data: Partial<RegistrationData>) => void;
  reset: () => void;
}

const emptyRegistration: RegistrationData = {
  age: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      goal: null,
      level: null,
      dailyGoalMinutes: null,
      notificationsEnabled: false,
      hearAboutUs: null,
      registration: emptyRegistration,

      setGoal: (goal) => set({ goal }),
      setLevel: (level) => set({ level }),
      setDailyGoal: (dailyGoalMinutes) => set({ dailyGoalMinutes }),
      setNotifications: (notificationsEnabled) => set({ notificationsEnabled }),
      setHearAboutUs: (hearAboutUs) => set({ hearAboutUs }),
      updateRegistration: (data) =>
        set((state) => ({ registration: { ...state.registration, ...data } })),
      reset: () =>
        set({
          goal: null,
          level: null,
          dailyGoalMinutes: null,
          notificationsEnabled: false,
          hearAboutUs: null,
          registration: emptyRegistration,
        }),
    }),
    { name: 'botai-onboarding' },
  ),
);
