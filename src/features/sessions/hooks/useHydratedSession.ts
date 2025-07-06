import { useEffect, useState } from 'react';
import {
  getLocalSession,
  setLocalSession,
  removeLocalSession,
  getRemoteSession,
  setRemoteSession,
  sessionExistsInFirestore,
  endSession,
} from '@/features/sessions';
import type { CurrentSession } from '@/types/session';
import { useAuth } from '@/features/auth';
import { useOnlineStatus } from '@/features/connection';

export type ConflictState = null | {
  local: CurrentSession;
  remote: CurrentSession;
};

export function useHydratedSession(
  setSession: (s: CurrentSession | null) => void
) {
  const [loading, setLoading] = useState(true);
  const [conflict, setConflict] = useState<ConflictState>(null);
  const { user, loading: authLoading } = useAuth();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        if (authLoading) return;
        if (!user) {
          setLoading(false);
          return;
        }
        const userId = user.uid;

        const local = await getLocalSession();
        // Consider offline situation as case 3B
        if (!isOnline) {
          if (local) {
            setSession(local);
            setLoading(false);
            return;
          } else {
            setLoading(false);
            return;
          }
        }

        const remote = await getRemoteSession(userId);

        /* ------------ CASE 1 ------------ */
        if (!local && !remote) {
          setLoading(false);
          return;
        }

        /* ------------ CASE 2 ------------ */
        if (!local && remote) {
          const exists = await sessionExistsInFirestore(
            userId,
            remote.startTime
          );
          if (!exists) {
            await setLocalSession(remote);
            setSession(remote);
          } else {
            setSession(null);
          }
          setLoading(false);
          return;
        }

        /* ------------ CASE 3 ------------ */
        if (local && !remote) {
          const exists = await sessionExistsInFirestore(
            userId,
            local.startTime
          );
          if (exists) {
            await removeLocalSession();
            setSession(null);
            setLoading(false);
            return;
          }
          // not in Firestore => push to RTDB & continue
          await setRemoteSession(userId, local);
          setSession(local);
          setLoading(false);
          return;
        }

        /* At this point both exist */
        if (!local || !remote) return;

        /* ------------ CASE 4 (same session) ------------ */
        if (local.startTime === remote.startTime) {
          const latest =
            remote.lastUpdated > local.lastUpdated ? remote : local;

          // Sync both stores to latest
          await Promise.all([
            setLocalSession(latest),
            setRemoteSession(userId, latest),
          ]);
          setSession(latest);
          setLoading(false);
          return;
        }

        /* ------------ CASE 5 (different sessions) ------------ */
        setConflict({ local, remote });
        setLoading(false);
      } catch (err) {
        console.error('[useHydratedSession] Failed to hydrate session:', err);
        setLoading(false);
      }
    };

    hydrateSession();
  }, [user, isOnline]);

  const resolveConflict = async (choice: 'local' | 'remote' | 'end') => {
    const userId = user?.uid;

    if (!conflict || !userId) return;
    const { local, remote } = conflict;
    const localUpdated = {
      ...local,
      lastUpdated: Date.now(),
    };
    const remoteUpdated = {
      ...remote,
      lastUpdated: Date.now(),
    };

    switch (choice) {
      case 'local':
        await endSession(userId, remoteUpdated);
        await Promise.all([
          setRemoteSession(userId, localUpdated),
          setLocalSession(localUpdated),
        ]);
        setSession(localUpdated);
        break;
      case 'remote':
        await endSession(userId, localUpdated);
        await Promise.all([
          setLocalSession(remoteUpdated),
          setRemoteSession(userId, remoteUpdated),
        ]);
        setSession(remoteUpdated);
        break;
      case 'end':
        await endSession(userId, localUpdated);
        await endSession(userId, remoteUpdated);
        setSession(null);
        break;
    }
    setConflict(null);
  };

  return { loading, conflict, resolveConflict };
}
