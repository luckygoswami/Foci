import { db } from '@/lib/firebase-config';
import type { Session } from '@/types';
import type { FirebaseUserId } from '@/types/core';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDayRange } from './sessionUtils';

export async function sessionExistsInFirestore(
  userId: FirebaseUserId,
  startTime: number
): Promise<boolean> {
  const sessionDocRef = doc(db, `sessions/${userId}_${startTime}`);
  const docSnap = await getDoc(sessionDocRef);

  return docSnap.exists();
}

export const saveSessionToFirestore = async (
  sessionData: Session
): Promise<void> => {
  try {
    await setDoc(
      doc(db, `sessions/${sessionData.userId}_${sessionData.startTime}`),
      sessionData
    );

    const userRef = doc(db, 'users', sessionData.userId);
    await updateDoc(userRef, {
      totalStudyTime: increment(sessionData.duration),
    });
  } catch (err) {
    console.error('[saveSessionToFirestore] Failed:', err);
    throw err;
  }
};

export const getSessionsByUser = async (
  userId: FirebaseUserId
): Promise<Session[]> => {
  const q = query(collection(db, 'sessions'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Session);
};

export const getSessionsByDate = async (
  userId: FirebaseUserId,
  date: string,
  tillDate?: string
): Promise<Session[]> => {
  const { start, end } = getDayRange(date, tillDate);

  const q = query(
    collection(db, 'sessions'),
    where('userId', '==', userId),
    where('startTime', '>=', start),
    where('startTime', '<=', end)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Session);
};
