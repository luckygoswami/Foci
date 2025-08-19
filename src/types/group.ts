import type { FirebaseUserId, GroupId } from './core';

export interface Group {
  // Not including groupId inside doc to support groupCreation in offline mode. The groupId'll be assigned while offlne
  name: string;
  name_lower: string;
  avatarId: string;
  description?: string;
  isPublic: boolean;
  tags?: string[];
  creatorId: FirebaseUserId;
  members: GroupMember[];
  memberIds: FirebaseUserId[];
  joinCode: string;
  createdAt: number;
  updatedAt: number;
}

export interface GroupMember {
  userId: FirebaseUserId;
  name: string;
  avatarId: string;
  role: 'admin' | 'member' | 'creator';
  joinedAt: number;
}

export interface GroupInvite {
  senderId: FirebaseUserId;
  senderName: string;
  senderAvatarId: string;
  recipientId: FirebaseUserId;
  groupId: GroupId;
  groupName: string;
  groupAvatarId: string;
  createdAt: number;
  status: 'pending' | 'accepted' | 'rejected';
}
