import type { DocumentReference, Timestamp } from 'firebase/firestore';
import type { FirebaseUserId, GroupId } from './core';
import type { StudySession } from './study';

export interface User {
  id: FirebaseUserId;
  username: string;
  email: string;
  name: string;
  avatarUrl?: string;
  bio: string;
  studyGoal: string;
  subjects: string[];
  dailyTargetMinutes: number;
  totalStudyTime: number;
  studySessions: DocumentReference<StudySession>[];
  lastActive: Timestamp;
  friends: FirebaseUserId[];
  groups: GroupId[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  streak: {
    current: number;
    longest: number;
    updatedAt: Timestamp;
  };
  privacySettings: {
    showStudyTime: boolean;
    showOnlineStatus: boolean;
  };
}

export interface UserStatus {
  id: FirebaseUserId;
  state: 'studying' | 'online' | 'offline';
  startedAt: Timestamp | null;
  lastChanged: Timestamp;
}
