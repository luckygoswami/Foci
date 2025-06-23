import type { FirebaseUserId } from './core';

export interface FriendRequest {
  fromId: FirebaseUserId;
  toId: FirebaseUserId;
  createdAt: number;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
}
