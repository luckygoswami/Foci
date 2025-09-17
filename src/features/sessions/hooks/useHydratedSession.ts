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
import type { CurrentSession } from '@/types';
import { useAuth } from '@/features/auth';
import { useOnlineStatus } from '@/features/connection';
import toast from 'react-hot-toast';

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
        if (authLoading || !user) return;
        const userId = user.uid;

        const local = await getLocalSession();
        // Offline case 3B
        if (!isOnline) {
          if (local) setSession(local);
          return;
        }

        const remote = await getRemoteSession(userId);

        /* ------------ CASE 1 ------------ */
        if (!local && !remote) return;

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
            return;
          }
          // not in Firestore => push to RTDB & continue
          await setRemoteSession(userId, local);
          setSession(local);
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
          return;
        }

        /* ------------ CASE 5 (different sessions) ------------ */
        setConflict({ local, remote });
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    hydrateSession();
  }, [user, isOnline, authLoading, setSession]);

  async function resolveConflict(choice: 'local' | 'remote' | 'end') {
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

    try {
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
    } catch (err: any) {
      toast.error(err.message);
    }
    setConflict(null);
  }

  return { loading, conflict, resolveConflict };
}
