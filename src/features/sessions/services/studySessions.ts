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
  const startTime = sessionData.resumeTime || sessionData.startTime;
  const now = Date.now();
  const elapsedMs = now - startTime;
  const elapsedMinutes = Math.floor(elapsedMs / 60000);
  const duration = sessionData.duration + elapsedMinutes;

  return duration;
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

export async function fetchCurrentSession(
  userId: FirebaseUserId
): Promise<CurrentSession> {
  const local = localStorage.getItem('currentSession') ?? 'null';

  if (local) {
    return JSON.parse(local) as CurrentSession;
  } else {
    const sessionRef = ref(rtdb, 'currentSessions/' + userId);
    try {
      const snapshot = await get(sessionRef);

      if (snapshot.exists()) {
        return snapshot.val() as CurrentSession;
      } else {
        throw new Error("Can't retrieve current session data.");
      }
    } catch (e) {
      throw new Error(
        `Error reading session from database: ${(e as Error).message}`
      );
    }
  }
}

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

  await set(ref(rtdb, 'currentSessions/' + userId), session);

  localStorage.removeItem('currentSession');
  localStorage.setItem('currentSession', JSON.stringify(session));
};

export const pauseCurrentSession = async (
  userId: FirebaseUserId
): Promise<void> => {
  const sessionData: CurrentSession = await fetchCurrentSession(userId);
  const duration = getEffectiveDuration(sessionData);

  const sessionUpdate: Partial<CurrentSession> = {
    duration,
    state: 'idle',
  };
  await update(ref(rtdb, 'currentSessions/' + userId), {
    ...sessionUpdate,
  });

  localStorage.setItem(
    'currentSession',
    JSON.stringify({
      ...sessionData,
      ...sessionUpdate,
    })
  );
};

export const resumeCurrentSession = async (
  userId: FirebaseUserId
): Promise<void> => {
  const sessionUpdate: Partial<CurrentSession> = {
    state: 'studying',
    resumeTime: Date.now(),
  };

  await update(ref(rtdb, 'currentSessions/' + userId), {
    ...sessionUpdate,
  });

  const sessionData: CurrentSession = await fetchCurrentSession(userId);
  localStorage.setItem(
    'currentSession',
    JSON.stringify({
      ...sessionData,
      ...sessionUpdate,
    })
  );
};

export const endCurrentSession = async (
  userId: FirebaseUserId
): Promise<void> => {
  const sessionData: CurrentSession = await fetchCurrentSession(userId);
  const duration = getEffectiveDuration(sessionData);

  const session: StudySession = {
    userId,
    startTime: sessionData.startTime,
    endTime: Date.now(),
    duration,
    subject: sessionData.subject,
    ...(sessionData.groupIds && { groupIds: sessionData.groupIds }),
  };

  try {
    duration && (await addStudySession(session));
  } finally {
    await remove(ref(rtdb, 'currentSessions/' + userId));
    localStorage.removeItem('currentSession');
  }
};
