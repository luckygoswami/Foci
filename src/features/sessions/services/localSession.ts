import type { CurrentSession } from '@/types';

export async function getLocalSession(): Promise<CurrentSession | null> {
  try {
    const raw = localStorage.getItem('currentSession');
    if (!raw) return null;
    return JSON.parse(raw) as CurrentSession;
  } catch (err) {
    console.error('Error in getting local session:', err);
    throw new Error('Something went wrong.');
  }
}

export async function setLocalSession(session: CurrentSession): Promise<void> {
  try {
    localStorage.setItem('currentSession', JSON.stringify(session));
  } catch (err) {
    console.error('Error in saving local session:', err);
    throw new Error('Something went wrong.');
  }
}

export async function updateLocalSession(
  updates: Partial<CurrentSession>
): Promise<CurrentSession | null> {
  try {
    const existing = await getLocalSession();
    if (!existing) return null;

    const updated: CurrentSession = {
      ...existing,
      ...updates,
      lastUpdated: Date.now(),
    };

    await setLocalSession(updated);
    return updated;
  } catch (err: any) {
    console.error('Error in updating local session:', err);
    throw new Error(err.message);
  }
}

export async function removeLocalSession(): Promise<void> {
  try {
    localStorage.removeItem('currentSession');
  } catch (err) {
    console.error('Error removing local session:', err);
    throw new Error('Something went wrong.');
  }
}
