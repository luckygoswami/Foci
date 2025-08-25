import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import type { FirebaseUserId, UserData } from '@/types';

export const fetchUserDataByUserId = async (
  userId: FirebaseUserId
): Promise<UserData | undefined> => {
  const userRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? (snapshot.data() as UserData) : undefined;
};

export const updateUser = async (
  userId: FirebaseUserId,
  data: Partial<UserData>
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, data);
};
