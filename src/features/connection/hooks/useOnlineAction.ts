import toast from 'react-hot-toast';
import { useOnlineStatus } from '../context/OnlineStatusProvider';
import { useCallback } from 'react';

/**
 * Hook that wraps functions to automatically check online status
 * and show offline alert if needed
 */
export function useOnlineAction() {
  const isOnline = useOnlineStatus();

  const withOnlineCheck = useCallback(
    <T extends any[], R>(fn: (...args: T) => R) => {
      return (...args: T): R | void => {
        if (!isOnline) {
          toast.error('No internet connection.');
          return;
        }
        return fn(...args);
      };
    },
    [isOnline]
  );

  return { withOnlineCheck, isOnline };
}
