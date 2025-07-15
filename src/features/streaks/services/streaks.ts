import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStartOfDay } from '@/lib/utils';
import { db } from '@/lib/firebase-config';
import type { FirebaseUserId, Streak } from '@/types/core';

export async function updateStreakIfNeeded(
  userId: string,
  sessionStartTime: number
) {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  if (!userData) return;

  const streak = userData.streak || {
    current: 0,
    longest: 0,
    lastActivityDate: null,
  };

  const sessionDay = getStartOfDay(sessionStartTime);
  const lastDay = streak.lastActivityDate || 0;
  const yesterday = sessionDay - 86400000;

  if (sessionDay === lastDay) return; // Already updated for today

  const current = lastDay === yesterday ? streak.current + 1 : 1;

  const longest = Math.max(streak.longest, current);

  await updateDoc(userRef, {
    'streak.current': current,
    'streak.longest': longest,
    'streak.lastActivityDate': sessionDay,
  });
}

export async function setStreak(userId: FirebaseUserId) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    streak: {
      current: 12,
      lastActivityDate: new Date(2025, 6, 12, 0, 0, 0, 0).getTime(),
      longest: 9,
    },
  });
}

/**
 * Calculates the names of the weekdays that make up the current streak.
 * It includes today only if the streak was updated for today.
 *
 * @param {Streak} streak - The user's streak object.
 * @returns {string[]} Array of weekday names (e.g., ['Wednesday', 'Thursday']).
 */
export function getStreakDays(streak: Streak): string[] {
  const { current, lastActivityDate } = streak;

  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const today = Date.now();
  const todayMidnight = getStartOfDay(today);
  const todayIndex = new Date(today).getDay();

  const includeToday = lastActivityDate === todayMidnight;

  const days = [];
  for (let offset = 0; offset < current; offset++) {
    const dayIndex = todayIndex - offset + (includeToday ? 0 : -1);
    if (dayIndex < 0) break;
    days.unshift(dayNames[dayIndex]);
  }

  return days;
}
