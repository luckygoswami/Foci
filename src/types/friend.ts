import type { Timestamp } from 'firebase/firestore';
import type { FirebaseUserId } from './core';

export interface FriendRequest {
  fromId: FirebaseUserId;
  toId: FirebaseUserId;
  fromName: string;
  toName: string;
  createdAt: Timestamp;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
}
