import { getSessionsByDate } from '@/features/sessions';
import { formatMediumDate, getWeekBoundaries } from '@/lib/utils';
import type { UserData } from '@/types';
import type { GoalProgress } from '../types';

export async function getDailyGoalProgress(
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

export async function getWeeklyGoalProgress(
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
