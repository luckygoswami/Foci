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
import type { CurrentSession, Session } from '@/types/session';
import type { FirebaseUserId, GroupId } from '@/types/core';
import { child, get, ref, remove, set, update } from 'firebase/database';

export async function getLocalSession(): Promise<CurrentSession | null> {
  try {
    const raw = localStorage.getItem('currentSession');
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed as CurrentSession;
  } catch (err) {
    console.error('Failed to parse localSession:', err);
    return null;
  }
}

export async function setLocalSession(
  sessionData: CurrentSession
): Promise<void> {
  try {
    localStorage.setItem('currentSession', JSON.stringify(sessionData));
  } catch (err) {
    console.error('setLocalSession failed →', err);
  }
}

export async function updateLocalSession(
  sessionUpdates: Partial<CurrentSession>
): Promise<void> {
  const existing = await getLocalSession();
  if (!existing) return;

  const session: CurrentSession = {
    ...existing,
    ...sessionUpdates,
    lastUpdated: Date.now(),
  };

  await setLocalSession(session);
}

export async function removeLocalSession(): Promise<void> {
  try {
    localStorage.removeItem('currentSession');
  } catch (err) {
    console.error('removeLocalSession failed →', err);
  }
}

export async function getRemoteSession(
  userId: FirebaseUserId
): Promise<CurrentSession | null> {
  try {
    const snap = await get(child(ref(rtdb), `currentSessions/${userId}`));

    if (!snap.exists()) return null;

    const remote = snap.val();
    return remote as CurrentSession;
  } catch (err) {
    console.error('getRemoteSession failed →', err);
    return null;
  }
}

export async function setRemoteSession(
  userId: FirebaseUserId,
  sessionData: Omit<CurrentSession, 'lastUpdated'>
): Promise<void> {
  const payload: CurrentSession = {
    ...sessionData,
    lastUpdated: Date.now(),
  };

  try {
    await set(ref(rtdb, `currentSessions/${userId}`), payload);
  } catch (err) {
    console.error('setRemoteSession failed →', err);
    throw err;
  }
}

export async function updateRemoteSession(
  userId: FirebaseUserId,
  sessionUpdates: Partial<CurrentSession>
): Promise<void> {
  try {
    const updates: Partial<CurrentSession> = {
      ...sessionUpdates,
      lastUpdated: Date.now(),
    };

    const sessionRef = ref(rtdb, `currentSessions/${userId}`);
    await update(sessionRef, updates);
  } catch (error) {
    console.error('Failed to update session:', error);
    throw new Error(
      `Session update failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

export async function removeRemoteSession(
  userId: FirebaseUserId
): Promise<void> {
  try {
    await remove(ref(rtdb, `currentSessions/${userId}`));
  } catch (err) {
    console.error('removeRemoteSession failed →', err);
    throw err;
  }
}

function getEffectiveDuration(sessionData: CurrentSession): number {
  if (sessionData.paused) return sessionData.accumulatedDuration;

  const startTime = sessionData.resumeTime || sessionData.startTime;
  const now = Date.now();
  const elapsedMs = now - startTime;
  const elapsedMinutes = Math.floor(elapsedMs / 60000);
  const duration = sessionData.accumulatedDuration + elapsedMinutes;
  return duration;
}

const saveSessionToFirestore = async (sessionData: Session): Promise<void> => {
  await addDoc(collection(db, 'sessions'), sessionData);

  const userRef = doc(db, 'users', sessionData.userId);
  await updateDoc(userRef, {
    totalStudyTime: increment(sessionData.duration),
  });
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
  const startOfTheDay = Date.parse(`${date}, 12:00:00 am`);
  const endOfTheDay = Date.parse(`${tillDate || date}, 11:59:59 pm`);

  const q = query(
    collection(db, 'sessions'),
    where('userId', '==', userId),
    where('startTime', '>=', startOfTheDay),
    where('startTime', '<=', endOfTheDay)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Session);
};

export const startCurrentSession = async (
  userId: FirebaseUserId,
  subject: string,
  groupIds?: GroupId[],
  isPublic: boolean = true
): Promise<void> => {
  const session: CurrentSession = {
    startTime: Date.now(),
    lastUpdated: Date.now(),
    accumulatedDuration: 0,
    paused: false,
    subject,
    isPublic,
    ...(groupIds && { groupIds }),
  };

  await setLocalSession(session);
  await setRemoteSession(userId, session);
};

export const pauseCurrentSession = async (
  userId: FirebaseUserId
): Promise<void> => {
  const session = await getLocalSession();
  if (!session) return;
  const accumulatedDuration = getEffectiveDuration(session);

  const sessionUpdate: Partial<CurrentSession> = {
    accumulatedDuration,
    paused: true,
  };

  await updateLocalSession(sessionUpdate);
  await updateRemoteSession(userId, sessionUpdate);
};

export const resumeCurrentSession = async (
  userId: FirebaseUserId
): Promise<void> => {
  const sessionUpdate: Partial<CurrentSession> = {
    paused: false,
    resumeTime: Date.now(),
  };

  await updateLocalSession(sessionUpdate);
  await updateRemoteSession(userId, sessionUpdate);
};

export const endCurrentSession = async (
  userId: FirebaseUserId
): Promise<void> => {
  const session = await getLocalSession();
  if (!session) return;
  const duration = getEffectiveDuration(session);

  const sessionData: Session = {
    userId,
    startTime: session.startTime,
    endTime: Date.now(),
    duration,
    subject: session.subject,
    ...(session.groupIds && { groupIds: session.groupIds }),
  };

  await removeLocalSession();
  try {
    duration && (await saveSessionToFirestore(sessionData));
  } finally {
    await removeRemoteSession(userId);
  }
};
