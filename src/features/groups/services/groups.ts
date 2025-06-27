import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import type { GroupId } from '@/types/core';
import type { Group } from '@/types/group';

export const getGroupById = async (groupId: GroupId): Promise<Group | null> => {
  const groupRef = doc(db, 'groups', groupId);
  const snapshot = await getDoc(groupRef);
  return snapshot.exists() ? (snapshot.data() as Group) : null;
};

export const createGroup = async (groupData: Group): Promise<void> => {
  const newGroupRef = await addDoc(collection(db, 'groups'), groupData);
  const userDoc = doc(db, 'users', groupData.creatorId);
  await updateDoc(userDoc, {
    groups: arrayUnion(newGroupRef.id),
  });
};

export const updateGroup = async (
  groupId: GroupId,
  data: Partial<Group>
): Promise<void> => {
  const groupRef = doc(db, 'groups', groupId);
  await updateDoc(groupRef, data);
};
