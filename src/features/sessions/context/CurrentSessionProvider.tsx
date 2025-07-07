import type { CurrentSession } from '@/types';
import { useState, type ReactNode } from 'react';
import SessionConflictDialog from '../components/SessionConflictDialog';
import { useHydratedSession } from '../hooks/useHydratedSession';
import { CurrentSessionContext } from './CurrentSessionContext';

export function CurrentSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<CurrentSession | null>(null);
  const { loading, conflict, resolveConflict } = useHydratedSession(setSession);

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
