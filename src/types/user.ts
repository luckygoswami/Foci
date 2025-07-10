import type { FirebaseUserId, GroupId } from './core';

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
  groups: GroupId[];
  createdAt: number;
  updatedAt: number;
  streak: {
    current: number;
    longest: number;
    updatedAt: number;
  };
  privacySettings: {
    showStudyTime: boolean;
    showOnlineStatus: boolean;
  };
}
