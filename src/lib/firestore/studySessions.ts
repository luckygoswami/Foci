import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  getDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase-config';
import type { StudySession } from '@/types/study';
import type { FirebaseUserId } from '@/types/core';

export const addStudySession = async (
  sessionData: StudySession
): Promise<void> => {
  await addDoc(collection(db, 'studySessions'), sessionData);
  const userRef = doc(db, 'users', sessionData.userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const prevTime = userDoc.data().totalStudyTime;
    await updateDoc(userRef, {
      totalStudyTime: prevTime + sessionData.duration,
    });
  }
};

export const getStudySessionsByUser = async (
  userId: FirebaseUserId
): Promise<StudySession[]> => {
  const q = query(
    collection(db, 'studySessions'),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as StudySession);
};

export const getStudySessionsByDate = async (
  userId: FirebaseUserId,
  date: string,
  tillDate?: string
): Promise<StudySession[]> => {
  const startOfTheDay = Date.parse(`${date}, 12:00:00 am`);
  const endOfTheDay = Date.parse(`${tillDate || date}, 11:59:59 pm`);

  const q = query(
    collection(db, 'studySessions'),
    where('userId', '==', userId),
    where('startTime', '>=', startOfTheDay),
    where('startTime', '<=', endOfTheDay)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as StudySession);
};
