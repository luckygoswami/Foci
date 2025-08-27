import type { CurrentSession, FirebaseUserId, GroupId, Session } from '@/types';
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

export async function startSession(
  userId: FirebaseUserId,
  subject: string,
  groupIds?: GroupId[],
  isPublic: boolean = true
): Promise<CurrentSession> {
  const session: CurrentSession = {
    startTime: Date.now(),
    lastUpdated: Date.now(),
    accumulatedDuration: 0,
    paused: false,
    subject,
    isPublic,
    ...(groupIds && { groupIds }),
  };

  try {
    await setLocalSession(session);
    setRemoteSession(userId, session);
  } catch (err) {
    throw new Error('Unable to start session.');
  }

  return session;
}

export async function pauseSession(
  userId: FirebaseUserId,
  session: CurrentSession | null
): Promise<CurrentSession | null> {
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

  try {
    const updatedSession = await updateLocalSession(sessionUpdate);
    updateRemoteSession(userId, sessionUpdate);
    return updatedSession;
  } catch (err) {
    throw new Error('Unable to pause session.');
  }
}

export async function resumeSession(
  userId: FirebaseUserId,
  session: CurrentSession | null
): Promise<CurrentSession | null> {
  const sessionUpdate: Partial<CurrentSession> = {
    ...session, // Whole session is destructured as the user can continue two different sessions independently
    paused: false,
    resumeTime: Date.now(),
  };

  try {
    const updatedSession = await updateLocalSession(sessionUpdate);
    updateRemoteSession(userId, sessionUpdate);
    return updatedSession;
  } catch (err) {
    throw new Error('Unable to resume session.');
  }
}

export async function endSession(
  userId: FirebaseUserId,
  session: CurrentSession | null
): Promise<void> {
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

  let mainError: boolean = false;

  try {
    await removeLocalSession();
    duration && (await saveSessionToFirestore(sessionData));
  } catch (err) {
    mainError = true;
  }

  removeRemoteSession(userId).catch((_) => (mainError = true));

  if (mainError) throw new Error('Unable to end session.');
}
