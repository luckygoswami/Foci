import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase-config';
import type { Group, GroupId } from '@/types/group';

export const getGroupById = async (groupId: GroupId): Promise<Group | null> => {
  const groupRef = doc(db, 'groups', groupId);
  const snapshot = await getDoc(groupRef);
  return snapshot.exists() ? (snapshot.data() as Group) : null;
};

export const createGroup = async (group: Group): Promise<void> => {
  const groupRef = doc(db, 'groups', group.id);
  await setDoc(groupRef, group);
};

export const updateGroup = async (
  groupId: GroupId,
  data: Partial<Group>
): Promise<void> => {
  const groupRef = doc(db, 'groups', groupId);
  await updateDoc(groupRef, data);
};
