import type { FirebaseUserId, Streak, Subject } from './core';
import type { Friend } from './friend';

export interface UserData {
  userId: FirebaseUserId;
  username: string;
  email: string | null;
  name: string;
  avatarId: string;
  bio?: string;
  subjects: Subject[];
  dailyTargetMinutes: number;
  weeklyTargetMinutes: number;
  totalStudyTime: number; // in minutes
  lastActive: number;
  friends: Friend[];
  createdAt: number;
  updatedAt: number;
  streak: Streak;
  privacySettings: {
    showStudyTime: boolean;
    showOnlineStatus: boolean;
  };
}
