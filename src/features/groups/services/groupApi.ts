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

export async function fetchGroupById(groupId: GroupId): Promise<Group | null> {
  const groupRef = doc(db, 'groups', groupId);

  try {
    const snapshot = await getDoc(groupRef);
    return snapshot.exists() ? (snapshot.data() as Group) : null;
  } catch (err: any) {
    console.error('Error fetching group:', err);
    throw new Error('Unable to fetch group.');
  }
}

export async function fetchGroupsJoinedByUser(
  userId: FirebaseUserId
): Promise<(Group & { groupId: string })[]> {
  const q = query(
    collection(db, 'groups'),
    where('memberIds', 'array-contains', userId)
  );

  try {
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    return snapshot.docs.map((doc) => ({
      groupId: doc.id,
      ...(doc.data() as Group),
    }));
  } catch (err: any) {
    console.error('Error fetching joined groups:', err);
    throw new Error('Unable to fetch joined groups.');
  }
}

export async function createGroup(groupData: Group): Promise<GroupId> {
  try {
    const group = await addDoc(collection(db, 'groups'), groupData);
    return group.id;
  } catch (err: any) {
    console.error('Error creating group:', err);
    throw new Error('Unable to create new group.');
  }
}

export async function updateGroup(
  groupId: GroupId,
  data: Partial<Group>
): Promise<void> {
  const groupRef = doc(db, 'groups', groupId);

  try {
    await updateDoc(groupRef, data);
  } catch (err: any) {
    console.error('Error updating group:', err);
    throw new Error('Unable to update group.');
  }
}

export async function deleteGroup(groupId: GroupId): Promise<void> {
  const groupRef = doc(db, 'groups', groupId);

  try {
    const groupDoc = await getDoc(groupRef);
    if (!groupDoc.exists()) return;
    // TODO: Clean up invites, etc.
    await deleteDoc(groupRef);
  } catch (err: any) {
    console.error('Error deleting group:', err);
    throw new Error('Unable to delete group.');
  }
}
