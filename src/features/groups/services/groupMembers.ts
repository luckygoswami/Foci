import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  runTransaction,
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import type { Group, GroupId, GroupMember, UserData } from '@/types';

export async function addGroupMember(
  groupId: GroupId,
  userObj: Pick<UserData, 'userId' | 'name' | 'avatarId'>
): Promise<void> {
  const { userId, name, avatarId } = userObj;

  try {
    const groupRef = doc(db, 'groups', groupId);

    await runTransaction(db, async (tx) => {
      const groupSnap = await tx.get(groupRef);
      const groupData = groupSnap.data() as Group;

      if (groupData.memberIds.includes(userId)) {
        throw new Error('Group already joined.');
      }

      tx.update(groupRef, {
        memberIds: arrayUnion(userId),
        members: arrayUnion({
          userId,
          name,
          avatarId,
          role: 'member',
          joinedAt: Date.now(),
        }),
      });
    });
  } catch (err: any) {
    console.error('Error in adding group memeber:', err);
    throw new Error(err.message || 'Unable to add member');
  }
}

export async function removeGroupMember(
  groupId: GroupId,
  memberObj: GroupMember
): Promise<void> {
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
