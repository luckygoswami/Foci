import { getSessionsByDate } from '@/features/sessions';
import { formatMediumDate, getWeekBoundaries } from '@/lib/utils';
import type { UserData } from '@/types';
import type { GoalProgress, SubjectDuration } from '../types';
import type { FirebaseUserId } from '@/types/core';

export async function fetchDailyGoalProgress(
  userData: UserData
): Promise<GoalProgress> {
  const date = Date.now();
  const sessions = await getSessionsByDate(
    userData.userId,
    formatMediumDate(date)
  );

  const target = userData.dailyTargetMinutes;
  const completed = sessions.reduce((acc, curr) => acc + curr.duration, 0);
  const progress: GoalProgress = [
    {
      name: 'completed',
      value: completed,
    },
    {
      name: 'remaining',
      value: Math.max(0, target - completed),
    },
  ];
  return progress;
}

export async function fetchWeeklyGoalProgress(
  userData: UserData
): Promise<GoalProgress> {
  const { firstDay, lastDay } = getWeekBoundaries(Date.now());
  const from = formatMediumDate(firstDay.getTime());
  const to = formatMediumDate(lastDay.getTime());

  const target =
    userData.weeklyTargetMinutes || userData.dailyTargetMinutes * 7;
  const sessions = await getSessionsByDate(userData.userId, from, to);
  const completed = sessions.reduce((acc, curr) => acc + curr.duration, 0);
  const progress: GoalProgress = [
    {
      name: 'completed',
      value: completed,
    },
    {
      name: 'remaining',
      value: Math.max(0, target - completed),
    },
  ];
  return progress;
}

export async function fetchSubjectTimeDistribution(
  userId: FirebaseUserId
): Promise<SubjectDuration[]> {
  const now = Date.now();
  const sessions = await getSessionsByDate(
    userId,
    formatMediumDate(now - 86400000 * 6),
    formatMediumDate(now)
  );

  const normalizedSessions = sessions.map((s) => ({
    ...s,
    subject: s.subject.toLowerCase(),
  }));

  const durationMap = normalizedSessions.reduce<Record<string, number>>(
    (acc, session) => {
      acc[session.subject] = (acc[session.subject] || 0) + session.duration;
      return acc;
    },
    {}
  );

  const subjectsArray = [...new Set(normalizedSessions.map((s) => s.subject))];

  const progress = subjectsArray
    .map((sub) => ({
      name: sub,
      value: Math.max(0, durationMap[sub] || 0),
    }))
    .sort((a, b) => b.value - a.value);

  return progress;
}
