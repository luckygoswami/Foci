import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import type { FirebaseUserId, UserData } from '@/types';

export const getUserById = async (
  userId: FirebaseUserId
): Promise<UserData | null> => {
  const userRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? (snapshot.data() as UserData) : null;
};

export const initializeUserData = async (
  userId: FirebaseUserId,
  userData: Partial<UserData>
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  userRef && (await setDoc(userRef, userData));
};

export const updateUser = async (
  userId: FirebaseUserId,
  data: Partial<UserData>
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, data);
};
