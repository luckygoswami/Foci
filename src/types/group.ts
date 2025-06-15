import type { FirebaseUserId } from './core';

export interface Group {
  name: string;
  description: string;
  tags?: string[];
  creatorId: FirebaseUserId;
  memberCount: number;
  members: GroupMember[];
  isPublic: boolean;
  joinCode: number;
  createdAt: number;
  updatedAt: number;
}

export interface GroupMember {
  userId: FirebaseUserId;
  role: 'admin' | 'member';
  joinedAt: number;
}
