import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import type { GroupId, GroupMember, UserData } from '@/types';

export const addGroupMember = async (
  groupId: GroupId,
  userObj: Pick<UserData, 'userId' | 'name' | 'avatarId'>
) => {
  const { userId, name, avatarId } = userObj;
  const groupRef = doc(db, 'groups', groupId);
  await updateDoc(groupRef, {
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
    members: arrayRemove({ ...memberObj }),
  });
};
