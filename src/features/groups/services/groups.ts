import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import type {
  FirebaseUserId,
  Group,
  GroupId,
  GroupInvite,
  GroupMember,
  UserData,
} from '@/types';
import type { GroupMemberRoles } from '../types';

export const fetchGroupById = async (
  groupId: GroupId
): Promise<Group | null> => {
  const groupRef = doc(db, 'groups', groupId);
  const snapshot = await getDoc(groupRef);
  return snapshot.exists() ? (snapshot.data() as Group) : null;
};

export const fetchGroupsJoinedByUser = async (
  userId: FirebaseUserId
): Promise<(Group & { groupId: string })[]> => {
  const q = query(
    collection(db, 'groups'),
    where('memberIds', 'array-contains', userId)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return [];

  return snapshot.docs.map((doc) => {
    return { groupId: doc.id, ...(doc.data() as Group) };
  });
};

export const createGroup = async (
  groupData: Group
): Promise<GroupId | null> => {
  try {
    const groupId = await addDoc(collection(db, 'groups'), groupData);
    return groupId.id;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updateGroup = async (
  groupId: GroupId,
  data: Partial<Group>
): Promise<void> => {
  const groupRef = doc(db, 'groups', groupId);
  await updateDoc(groupRef, data);
};

export const deleteGroup = async (groupId: GroupId): Promise<void> => {
  const groupRef = doc(db, 'groups', groupId);
  const groupDoc = await getDoc(groupRef);

  if (!groupDoc.exists()) return;
  // TODO: delete all group refrences from database like group invites for this group
  await deleteDoc(groupRef);
};

export const getGroupRoles = (
  groupMembers: GroupMember[]
): GroupMemberRoles => {
  const creator = groupMembers.find(
    (mem) => mem.role === 'creator'
  ) as GroupMember;
  const admins = groupMembers.filter((mem) => mem.role === 'admin');
  const members = groupMembers.filter((mem) => mem.role === 'member');

  return {
    creator,
    admins,
    members,
  };
};

export const sendGroupInvite = async (groupInvite: GroupInvite) => {
  try {
    await setDoc(
      doc(
        db,
        'groupInvites',
        `${groupInvite.groupId}_${groupInvite.recipientId}`
      ),
      groupInvite
    );
  } catch (err) {
    throw new Error('Failed to send invite.');
  }
};

export const fetchGroupInvitesByRecipient = async (
  userId: FirebaseUserId
): Promise<GroupInvite[]> => {
  const q = query(
    collection(db, 'groupInvites'),
    where('recipientId', '==', userId),
    where('status', '==', 'pending')
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) return [];

  return snapshot.docs.map((doc) => {
    return { ...(doc.data() as GroupInvite) };
  });
};

export const fetchGroupInvitesBySender = async (
  senderId: FirebaseUserId,
  groupId: GroupId
): Promise<GroupInvite[]> => {
  const q = query(
    collection(db, 'groupInvites'),
    where('senderId', '==', senderId),
    where('groupId', '==', groupId),
    where('status', '==', 'pending')
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) return [];

  return snapshot.docs.map((doc) => {
    return { ...(doc.data() as GroupInvite) };
  });
};

export const addGroupMember = async (
  groupId: GroupId,
  userObj: Pick<UserData, 'userId' | 'name' | 'avatarId'>
) => {
  const { userId, name, avatarId } = userObj;

  const groupRef = doc(db, 'groups', groupId);
  updateDoc(groupRef, {
    memberIds: arrayUnion(userId),
    members: arrayUnion({
      userId,
      name,
      avatarId,
      role: 'member',
      joinedAt: Date.now(),
    }),
  });
};

export const removeGroupMember = async (
  groupId: GroupId,
  memberObj: GroupMember
) => {
  const { userId } = memberObj;

  const groupRef = doc(db, 'groups', groupId);
  await updateDoc(groupRef, {
    memberIds: arrayRemove(userId),
    members: arrayRemove({
      ...memberObj,
    }),
  });
};

export const acceptGroupInvite = async (invite: GroupInvite) => {
  const inviteRef = doc(
    db,
    'groupInvites',
    `${invite.groupId}_${invite.recipientId}`
  );
  await updateDoc(inviteRef, {
    status: 'accepted',
  });
};

export const rejectGroupInvite = async (invite: GroupInvite) => {
  const inviteRef = doc(
    db,
    'groupInvites',
    `${invite.groupId}_${invite.recipientId}`
  );
  await updateDoc(inviteRef, {
    status: 'rejected',
  });
};

export const assignRole = (group: Group, userId: FirebaseUserId) => {
  const member = group.members.find((mem) => mem.userId == userId);
  return member ? member.role : 'spectator';
};
