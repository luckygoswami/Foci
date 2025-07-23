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
    console.error('[getRemoteSession] Failed:', err);
    return null;
  }
}

export async function setRemoteSession(
  userId: FirebaseUserId,
  session: CurrentSession
): Promise<void> {
  try {
    await set(ref(rtdb, `currentSessions/${userId}`), session);
  } catch (err) {
    console.error('[setRemoteSession] Failed:', err);
    throw err;
  }
}

export async function updateRemoteSession(
  userId: FirebaseUserId,
  sessionUpdates: Partial<CurrentSession>
): Promise<void> {
  try {
    const updates = {
      ...sessionUpdates,
      lastUpdated: Date.now(),
    };
    await update(ref(rtdb, `currentSessions/${userId}`), updates);
  } catch (err) {
    console.error('[updateRemoteSession] Failed:', err);
    throw err;
  }
}

export async function removeRemoteSession(
  userId: FirebaseUserId
): Promise<void> {
  try {
    await remove(ref(rtdb, `currentSessions/${userId}`));
  } catch (err) {
    console.error('[removeRemoteSession] Failed:', err);
    throw err;
  }
}
