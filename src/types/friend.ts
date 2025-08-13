import type { FirebaseUserId } from './core';

export interface Friend {
  userId: FirebaseUserId;
  name: string;
  avatarId: string;
}

export interface FriendRequest {
  senderId: FirebaseUserId;
  senderName: string;
  senderAvatarId: string;
  recipientId: FirebaseUserId;
  recipientName: string;
  recipientAvatarId: string;
  createdAt: number;
  status: 'pending' | 'accepted' | 'rejected';
}
