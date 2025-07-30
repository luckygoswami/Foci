import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import type { Group, GroupId, FirebaseUserId } from '@/types';

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
  return snapshot.docs.map((doc) => ({
    groupId: doc.id,
    ...(doc.data() as Group),
  }));
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
  // TODO: Clean up invites, etc.
  await deleteDoc(groupRef);
};
