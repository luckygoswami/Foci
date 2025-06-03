import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase-config';
import type { FirebaseUserId } from '@/types/core';
import type { UserData } from '@/types/user';
import type { User } from 'firebase/auth';

export const getUserById = async (
  userId: FirebaseUserId
): Promise<UserData | null> => {
  const userRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? (snapshot.data() as UserData) : null;
};

export const createUserDataIfNotExists = async (
  userId: FirebaseUserId,
  userData: Partial<UserData>
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  userRef && (await setDoc(userRef, userData));
};

export const updateUser = async (
  userId: FirebaseUserId,
  data: Partial<User>
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, data);
};
