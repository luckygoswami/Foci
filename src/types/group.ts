import type { DocumentReference, Timestamp } from 'firebase/firestore';
import type { FirebaseUserId, GroupId } from './core';
import type { User } from './user';

export interface Group {
  id: GroupId;
  name: string;
  description: string;
  creatorId: FirebaseUserId;
  memberCount: number;
  members: GroupMember[];
  isPublic: boolean;
  joinCode?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GroupMember {
  userRef: DocumentReference<User>;
  role: 'admin' | 'member';
  joinedAt: Timestamp;
}
