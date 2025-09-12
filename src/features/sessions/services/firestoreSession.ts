import { db } from '@/lib/firebase-config';
import type { FirebaseUserId, Session } from '@/types';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  runTransaction,
  where,
} from 'firebase/firestore';
import { getDayRange } from './sessionUtils';

export async function sessionExistsInFirestore(
  userId: FirebaseUserId,
  startTime: number
): Promise<boolean> {
  const sessionDocRef = doc(db, `sessions/${userId}_${startTime}`);

  try {
    const docSnap = await getDoc(sessionDocRef);
    return docSnap.exists();
  } catch (err: any) {
    console.error('Error fetching session existence:', err);
    throw new Error('Something went wrong.');
  }
}

export async function saveSessionToFirestore(
  sessionData: Session
): Promise<void> {
  try {
    const userRef = doc(db, 'users', sessionData.userId);
    const sessionRef = doc(
      db,
      'sessions',
      `${sessionData.userId}_${sessionData.startTime}`
    );

    await runTransaction(db, async (tx) => {
      tx.update(userRef, {
        totalStudyTime: increment(sessionData.duration),
      });
      tx.set(sessionRef, sessionData);
    });
  } catch (err) {
    console.error('Error saving session to firestore:', err);
    throw new Error('Unable to save session.');
  }
}

export async function getSessionsByUser(
  userId: FirebaseUserId
): Promise<Session[]> {
  const q = query(collection(db, 'sessions'), where('userId', '==', userId));

  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as Session);
  } catch (err: any) {
    console.error('Error fetching sessions:', err);
    throw new Error('Unable to fetch sessions.');
  }
}

/**
 * Fetches user sessions within a date range from Firestore
 * @param userId - User ID to filter sessions
 * @param date - Start date (YYYY-MM-DD) or (DD-MMM-YYYY)
 * @param [tillDate] - Optional end date (inclusive)
 * @returns Promise with array of Session objects
 */
export async function getSessionsByDate(
  userId: FirebaseUserId,
  date: string,
  tillDate?: string
): Promise<Session[]> {
  const { start, end } = getDayRange(date, tillDate);

  const q = query(
    collection(db, 'sessions'),
    where('userId', '==', userId),
    where('startTime', '>=', start),
    where('startTime', '<=', end)
  );

  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as Session);
  } catch (err: any) {
    console.error('Error in getting sessions by date:', err);
    throw new Error('Something went wrong.');
  }
}
