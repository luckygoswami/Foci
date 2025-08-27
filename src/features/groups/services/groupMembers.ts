import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import type { GroupId, GroupMember, UserData } from '@/types';

export async function addGroupMember(
  groupId: GroupId,
  userObj: Pick<UserData, 'userId' | 'name' | 'avatarId'>
) {
  const { userId, name, avatarId } = userObj;
  const groupRef = doc(db, 'groups', groupId);

  try {
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
  } catch (err: any) {
    console.error('Error in adding group memeber:', err);
    throw new Error('Unable to add member.');
  }
}

export async function removeGroupMember(
  groupId: GroupId,
  memberObj: GroupMember
) {
  const { userId } = memberObj;
  const groupRef = doc(db, 'groups', groupId);

  try {
    await updateDoc(groupRef, {
      memberIds: arrayRemove(userId),
      members: arrayRemove({ ...memberObj }),
    });
  } catch (err: any) {
    console.error('Error in removing group member:', err);
    throw new Error('Unable to remove member.');
  }
}
