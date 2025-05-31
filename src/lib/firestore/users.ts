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
import type { User } from '@/types/user';

export const getUserById = async (
  userId: FirebaseUserId
): Promise<User | null> => {
  const userRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? (snapshot.data() as User) : null;
};

export const createUser = async (user: User): Promise<void> => {
  const userRef = doc(db, 'users', user.id);
  await setDoc(userRef, user);
};

export const updateUser = async (
  userId: FirebaseUserId,
  data: Partial<User>
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, data);
};
