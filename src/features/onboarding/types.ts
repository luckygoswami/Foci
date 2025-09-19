import type { Subject } from '@/types';

export type OnboardingState = {
  username: string;
  name: string;
  avatarId?: string;
  bio?: string;
  subjects: Subject[];
  dailyTargetMinutes: number;
  weeklyTargetMinutes: number;
};
