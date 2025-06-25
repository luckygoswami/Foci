import type { FirebaseUserId, GroupId } from './core';

export interface StudySession {
  userId: FirebaseUserId;
  startTime: number;
  endTime: number;
  duration: number;
  subject: string;
  groupIds?: GroupId[];
}

export interface CurrentSession {
  startTime: number;
  resumeTime?: number;
  duration: number;
  state: 'studying' | 'idle';
  subject: string;
  groupIds?: GroupId[];
  isPublic: boolean;
}
