export type OnboardingState = {
  username: string;
  name: string;
  avatarId: string;
  bio?: string;
  subjects: string[];
  dailyTargetMinutes: number;
  weeklyTargetMinutes: number;
};
