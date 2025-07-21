import type { FirebaseUserId, GroupId } from './core';

export interface Group {
  groupId: GroupId;
  name: string;
  avatarId: string;
  description: string;
  tags?: string[];
  creatorId: FirebaseUserId;
  memberCount: number;
  members: GroupMember[];
  isPublic: boolean;
  joinCode: string;
  createdAt: number;
  updatedAt: number;
}

export interface GroupMember {
  userId: FirebaseUserId;
  role: 'admin' | 'member';
  joinedAt: number;
}
