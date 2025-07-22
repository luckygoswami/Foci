import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import type { FirebaseUserId, GroupId } from '@/types/core';
import type { Group } from '@/types/group';

export const getGroupById = async (groupId: GroupId): Promise<Group | null> => {
  const groupRef = doc(db, 'groups', groupId);
  const snapshot = await getDoc(groupRef);
  return snapshot.exists() ? (snapshot.data() as Group) : null;
};

export const getGroupsJoinedByUser = async (
  userId: FirebaseUserId
): Promise<(Group & { groupId: string })[]> => {
  const q = query(
    collection(db, 'groups'),
    where('memberIds', 'array-contains', userId)
  );
  const snapshot = await getDocs(q);
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
