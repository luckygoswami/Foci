import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import type { StudySession } from '@/types/study';
import type { FirebaseUserId } from '@/types/core';

export const addStudySession = async (session: StudySession): Promise<void> => {
  await addDoc(collection(db, 'studySessions'), session);
};

export const getUserStudySessions = async (
  userId: FirebaseUserId
): Promise<StudySession[]> => {
  const q = query(
    collection(db, 'studySessions'),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as StudySession);
};
