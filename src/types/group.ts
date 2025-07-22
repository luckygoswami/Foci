import type { FirebaseUserId } from './core';

export interface Group {
  name: string;
  avatarId: string;
  description?: string;
  isPublic: boolean;
  tags?: string[];
  creatorId: FirebaseUserId;
  memberCount: number;
  members: GroupMember[];
  memberIds: FirebaseUserId[];
  joinCode: string;
  createdAt: number;
  updatedAt: number;
}

export interface GroupMember {
  userId: FirebaseUserId;
  role: 'admin' | 'member';
  joinedAt: number;
}
