import { rtdb } from '@/lib/firebase-config';
import type { CurrentSession, FirebaseUserId } from '@/types';
import { child, get, ref, remove, set, update } from 'firebase/database';

export async function getRemoteSession(
  userId: FirebaseUserId
): Promise<CurrentSession | null> {
  try {
    const snap = await get(child(ref(rtdb), `currentSessions/${userId}`));
    if (!snap.exists()) return null;
    return snap.val() as CurrentSession;
  } catch (err) {
    console.error('Error fetching remote session:', err);
    throw new Error('Something went wrong.');
  }
}

export async function setRemoteSession(
  userId: FirebaseUserId,
  session: CurrentSession
): Promise<void> {
  try {
    await set(ref(rtdb, `currentSessions/${userId}`), session);
  } catch (err) {
    console.error('Error saving remote session:', err);
    throw new Error('Something went wrong.');
  }
}

export async function updateRemoteSession(
  userId: FirebaseUserId,
  sessionUpdates: Partial<CurrentSession>
): Promise<void> {
  const updates = {
    ...sessionUpdates,
    lastUpdated: Date.now(),
  };

  try {
    await update(ref(rtdb, `currentSessions/${userId}`), updates);
  } catch (err) {
    console.error('Error updating remote session:', err);
    throw new Error('Something went wrong.');
  }
}

export async function removeRemoteSession(
  userId: FirebaseUserId
): Promise<void> {
  try {
    await remove(ref(rtdb, `currentSessions/${userId}`));
  } catch (err) {
    console.error('Error removing remote session:', err);
    throw new Error('Something went wrong.');
  }
}
