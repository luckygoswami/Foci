import type { FirebaseUserId, GroupId } from './core';

export interface Session {
  userId: FirebaseUserId;
  startTime: number;
  endTime: number;
  duration: number; // in minutes
  subject: string;
  groupIds?: GroupId[];
}

export interface CurrentSession {
  startTime: number;
  resumeTime?: number;
  lastUpdated: number;
  accumulatedDuration: number; // in seconds
  paused: boolean;
  subject: string;
  groupIds?: GroupId[];
  isPublic: boolean;
}
