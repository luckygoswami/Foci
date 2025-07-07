import { useContext } from 'react';
import { CurrentSessionContext } from './CurrentSessionContext';

export function useCurrentSession() {
  const ctx = useContext(CurrentSessionContext);
  if (!ctx)
    throw new Error(
      'useCurrentSession must be used within CurrentSessionProvider'
    );
  return ctx;
}
