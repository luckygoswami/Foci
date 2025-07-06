import type { CurrentSession, Session } from '@/types';
import type { FirebaseUserId, GroupId } from '@/types/core';
import {
  removeLocalSession,
  setLocalSession,
  updateLocalSession,
} from './localSession';
import {
  removeRemoteSession,
  setRemoteSession,
  updateRemoteSession,
} from './remoteSession';
import { getEffectiveDuration } from './sessionUtils';
import { saveSessionToFirestore } from './firestoreSession';

export const startSession = async (
  userId: FirebaseUserId,
  subject: string,
  groupIds?: GroupId[],
  isPublic: boolean = true
): Promise<CurrentSession> => {
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
  setRemoteSession(userId, session);

  return session;
};

export const pauseSession = async (
  userId: FirebaseUserId,
  session: CurrentSession | null
): Promise<CurrentSession | null> => {
  if (!session) {
    console.warn('[pauseSession] Tried to pause with null session');
    return null;
  }

  const accumulatedDuration = getEffectiveDuration(session);
  const sessionUpdate: Partial<CurrentSession> = {
    ...session, // Whole session is destructured as the user can continue two different sessions independently
    accumulatedDuration,
    paused: true,
  };

  const updatedSession = await updateLocalSession(sessionUpdate);
  updateRemoteSession(userId, sessionUpdate);

  return updatedSession;
};

export const resumeSession = async (
  userId: FirebaseUserId,
  session: CurrentSession | null
): Promise<CurrentSession | null> => {
  const sessionUpdate: Partial<CurrentSession> = {
    ...session, // Whole session is destructured as the user can continue two different sessions independently
    paused: false,
    resumeTime: Date.now(),
  };

  const updatedSession = await updateLocalSession(sessionUpdate);
  updateRemoteSession(userId, sessionUpdate);

  return updatedSession;
};

export const endSession = async (
  userId: FirebaseUserId,
  session: CurrentSession | null
): Promise<void> => {
  if (!session) return;
  const duration = Math.floor(getEffectiveDuration(session) / 60); // saving duration in minutes in firestore

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
    removeRemoteSession(userId);
  }
};
