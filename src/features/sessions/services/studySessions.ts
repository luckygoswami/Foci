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
import { db, rtdb } from '@/lib/firebase-config';
import type { CurrentSession, StudySession } from '@/types/study';
import type { FirebaseUserId, GroupId } from '@/types/core';
import { get, ref, remove, set, update } from 'firebase/database';

function getEffectiveDuration(sessionData: CurrentSession): number {
  if (sessionData.state == 'idle') return sessionData.duration;

  const startTime = sessionData.resumeTime || sessionData.startTime;
  const now = Date.now();
  const elapsedMs = now - startTime;
  const elapsedMinutes = Math.floor(elapsedMs / 60000);
  const duration = sessionData.duration + elapsedMinutes;
  return duration;
}

export async function fetchCurrentSession(
  userId: FirebaseUserId
): Promise<CurrentSession | void> {
  const local = localStorage.getItem('currentSession');

  if (local) {
    return JSON.parse(local) as CurrentSession;
  }

  const snapshot = await get(ref(rtdb, 'currentSessions/' + userId));
  if (snapshot.exists()) {
    const currentSession = snapshot.val() as CurrentSession;
    localStorage.setItem('currentSession', JSON.stringify(currentSession));
    return currentSession;
  } else {
    return;
  }
}

const addStudySession = async (sessionData: StudySession): Promise<void> => {
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

export const startCurrentSession = async (
  userId: FirebaseUserId,
  subject: string,
  groupIds?: GroupId[],
  isPublic: boolean = true
): Promise<void> => {
  const session: CurrentSession = {
    startTime: Date.now(),
    duration: 0,
    state: 'studying',
    subject,
    isPublic,
    ...(groupIds && { groupIds }),
  };

  localStorage.removeItem('currentSession');
  localStorage.setItem('currentSession', JSON.stringify(session));
  await set(ref(rtdb, 'currentSessions/' + userId), session);
};

export const pauseCurrentSession = async (
  userId: FirebaseUserId
): Promise<void> => {
  const sessionData = await fetchCurrentSession(userId);
  if (!sessionData) return;
  const duration = getEffectiveDuration(sessionData);

  const sessionUpdate: Partial<CurrentSession> = {
    duration,
    state: 'idle',
  };

  localStorage.setItem(
    'currentSession',
    JSON.stringify({
      ...sessionData,
      ...sessionUpdate,
    })
  );
  await update(ref(rtdb, 'currentSessions/' + userId), {
    ...sessionUpdate,
  });
};

export const resumeCurrentSession = async (
  userId: FirebaseUserId
): Promise<void> => {
  const sessionData = await fetchCurrentSession(userId);
  if (!sessionData) return;
  const sessionUpdate: Partial<CurrentSession> = {
    state: 'studying',
    resumeTime: Date.now(),
  };

  localStorage.setItem(
    'currentSession',
    JSON.stringify({
      ...sessionData,
      ...sessionUpdate,
    })
  );
  await update(ref(rtdb, 'currentSessions/' + userId), {
    ...sessionUpdate,
  });
};

export const endCurrentSession = async (
  userId: FirebaseUserId
): Promise<void> => {
  const sessionData = await fetchCurrentSession(userId);
  if (!sessionData) return;
  const duration = getEffectiveDuration(sessionData);

  const session: StudySession = {
    userId,
    startTime: sessionData.startTime,
    endTime: Date.now(),
    duration,
    subject: sessionData.subject,
    ...(sessionData.groupIds && { groupIds: sessionData.groupIds }),
  };

  console.log('[session data before ending]', session);
  localStorage.removeItem('currentSession');
  try {
    duration && (await addStudySession(session));
  } finally {
    await remove(ref(rtdb, 'currentSessions/' + userId));
  }
};
