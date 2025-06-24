import type { FirebaseUserId, GroupId } from './core';

export interface StudySession {
  userId: FirebaseUserId;
  groupIds?: GroupId[];
  startTime: number;
  endTime: number;
  duration: number;
  subject: string;
}

export interface CurrentSession {
  startTime: number;
  duration: number;
  state: 'studying' | 'idle';
  subject: string;
  groupIds?: GroupId[];
  isPublic: boolean;
}
