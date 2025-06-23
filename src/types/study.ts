import type { FirebaseUserId, GroupId } from './core';

export interface StudySession {
  userId: FirebaseUserId;
  groupIds?: GroupId[];
  startTime: number;
  endTime: number;
  duration: number;
  subject: string;
  isPublic: boolean;
}
