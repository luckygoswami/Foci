import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, rtdb } from '../firebase-config';
import type { FirebaseUserId } from '@/types/core';
import type { UserData } from '@/types/user';
import { ref, set } from 'firebase/database';

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

export const setUserStatus = async (
  userId: FirebaseUserId,
  state: 'online' | 'studying' | 'offline',
  startedAt: number | null = null
): Promise<void> => {
  set(ref(rtdb, 'userStatus/' + userId), {
    state,
    startedAt,
    lastChanged: Date.now(),
  });
};
