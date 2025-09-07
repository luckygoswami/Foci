import type { CurrentSession } from '@/types';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import SessionConflictDialog from '../components/SessionConflictDialog';
import { useHydratedSession } from '../hooks/useHydratedSession';
import { CurrentSessionContext } from './CurrentSessionContext';
import { useAuth } from '@/features/auth';
import { removeLocalSession } from '../services/localSession';
import { removeRemoteSession } from '../services/remoteSession';
import { feedback } from '@/lib/feedback';

export function CurrentSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<CurrentSession | null>(null);
  const { user } = useAuth();
  const { loading, conflict, resolveConflict } = useHydratedSession(setSession);
  const previousUserRef = useRef<string | null>(null);

  // Clear session data when user logs out
  useEffect(() => {
    if (user) {
      // Store current user ID for future logout cleanup
      previousUserRef.current = user.uid;
    } else if (previousUserRef.current && !user) {
      // User has logged out, clear all session data
      const userIdToCleanup = previousUserRef.current;
      setSession(null);

      removeLocalSession().catch((err) => {
        feedback.error(err.message);
      });

      removeRemoteSession(userIdToCleanup).catch((err) => {
        feedback.error(err.message);
      });

      previousUserRef.current = null;
    }
  }, [user]);

  return (
    <CurrentSessionContext.Provider value={{ session, setSession, loading }}>
      {conflict ? (
        <SessionConflictDialog
          open={true}
          local={conflict.local}
          remote={conflict.remote}
          onChoose={resolveConflict}
        />
      ) : null}
      {children}
    </CurrentSessionContext.Provider>
  );
}
