import type { Timestamp } from 'firebase/firestore';
import type { FirebaseUserId, GroupId } from './core';

export interface StudySession {
  userId: FirebaseUserId;
  groupIds?: GroupId[];
  startTime: Timestamp;
  endTime: Timestamp;
  duration: number;
  subject: string;
  isPublic: boolean;
}
