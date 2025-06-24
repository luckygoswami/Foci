import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  increment,
} from 'firebase/firestore';
import { db, rtdb } from '../firebase-config';
import type { CurrentSession, StudySession } from '@/types/study';
import type { FirebaseUserId, GroupId } from '@/types/core';
import { ref, set, update } from 'firebase/database';

export const addStudySession = async (
  sessionData: StudySession
): Promise<void> => {
  await addDoc(collection(db, 'studySessions'), sessionData);

  const userRef = doc(db, 'users', sessionData.userId);
  await updateDoc(userRef, {
    totalStudyTime: increment(sessionData.duration),
  });
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

export const setCurrentSession = async (
  userId: FirebaseUserId,
  subject: string,
  groupIds: GroupId[] = [],
  isPublic: boolean = true
): Promise<void> => {
  const session: CurrentSession = {
    startTime: Date.now(),
    duration: 0,
    state: 'studying',
    subject,
    groupIds,
    isPublic,
  };

  await set(ref(rtdb, 'currentSessions/' + userId), session);

  localStorage.removeItem('currentSession');
  localStorage.setItem('currentSession', JSON.stringify(session));
};

export const pauseCurrentSession = async (
  userId: FirebaseUserId
): Promise<void> => {
  const session: CurrentSession = JSON.parse(
    localStorage.getItem('currentSession') ?? 'null'
  );
  const startTime = session.startTime;
  const now = Date.now();
  const elapsedMs = now - startTime;
  const elapsedMinutes = Math.floor(elapsedMs / 60000);

  await update(ref(rtdb, 'currentSessions/' + userId), {
    startTime: null,
    duration: increment(elapsedMinutes),
    state: 'pause',
  });

  localStorage.setItem(
    'currentSession',
    JSON.stringify({
      ...session,
      startTime: null,
      duration: session.duration + elapsedMinutes,
      state: 'idle',
    })
  );
};
