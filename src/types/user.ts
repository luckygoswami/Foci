import type { FirebaseUserId, Streak } from './core';

export interface UserData {
  userId: FirebaseUserId;
  username: string;
  email: string;
  name: string;
  avatarUrl?: string;
  studyGoal: string;
  subjects: string[];
  dailyTargetMinutes: number;
  weeklyTargetMinutes: number;
  totalStudyTime: number;
  lastActive: number;
  friends: FirebaseUserId[];
  createdAt: number;
  updatedAt: number;
  streak: Streak;
  privacySettings: {
    showStudyTime: boolean;
    showOnlineStatus: boolean;
  };
}
