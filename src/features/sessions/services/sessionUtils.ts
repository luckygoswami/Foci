import type { CurrentSession } from '@/types';

/**
 * Calculates the total elapsed duration (in seconds) of a session,
 * including previously accumulated time and current running time if active.
 *
 * @param sessionData - The session object containing timing metadata
 * @returns The effective total duration in seconds
 */
export function getEffectiveDuration(sessionData: CurrentSession): number {
  if (sessionData.paused) return sessionData.accumulatedDuration;

  const startTime = sessionData.resumeTime || sessionData.startTime;
  const now = Date.now();
  const elapsedMs = now - startTime;
  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  return sessionData.accumulatedDuration + elapsedSeconds;
}

/**
 * Returns a timestamp range (in milliseconds) covering a full day or date range.
 *
 * @param date - Start date string (e.g., "2025-07-04")
 * @param tillDate - Optional end date string; defaults to the same day
 * @returns An object with `start` and `end` timestamps in ms
 */
export function getDayRange(date: string, tillDate?: string) {
  return {
    start: Date.parse(`${date}, 12:00:00 am`),
    end: Date.parse(`${tillDate || date}, 11:59:59 pm`),
  };
}
