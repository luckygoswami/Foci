import type { CurrentSession } from '@/types';

export async function getLocalSession(): Promise<CurrentSession | null> {
  try {
    const raw = localStorage.getItem('currentSession');
    if (!raw) return null;
    return JSON.parse(raw) as CurrentSession;
  } catch (err) {
    console.error('[getLocalSession] Failed to parse:', err);
    return null;
  }
}

export async function setLocalSession(session: CurrentSession): Promise<void> {
  try {
    localStorage.setItem('currentSession', JSON.stringify(session));
  } catch (err) {
    console.error('[setLocalSession] Failed:', err);
  }
}

export async function updateLocalSession(
  updates: Partial<CurrentSession>
): Promise<CurrentSession | null> {
  const existing = await getLocalSession();
  if (!existing) return null;

  const updated: CurrentSession = {
    ...existing,
    ...updates,
    lastUpdated: Date.now(),
  };

  await setLocalSession(updated);
  return updated;
}

export async function removeLocalSession(): Promise<void> {
  try {
    localStorage.removeItem('currentSession');
  } catch (err) {
    console.error('[removeLocalSession] Failed:', err);
  }
}
