import { getSessionsByDate } from '@/features/sessions';
import { formatMediumDate, getWeekBoundaries } from '@/lib/utils';
import type { UserData, FirebaseUserId } from '@/types';
import type {
  GoalProgress,
  SegmentedSubjectProgress,
  SubjectDuration,
} from '../types';

export async function fetchDailyGoalProgress(
  userData: UserData
): Promise<GoalProgress> {
  const date = Date.now();

  try {
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
  } catch (err: any) {
    console.error('Failed to fetch daily progress:', err);
    throw new Error('Unable to fetch progress.');
  }
}

export async function fetchWeeklyGoalProgress(
  userData: UserData
): Promise<GoalProgress> {
  const { firstDay, lastDay } = getWeekBoundaries(Date.now());
  const from = formatMediumDate(firstDay.getTime());
  const to = formatMediumDate(lastDay.getTime());

  const target =
    userData.weeklyTargetMinutes || userData.dailyTargetMinutes * 7;

  try {
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
  } catch (err: any) {
    console.error('Failed to fetch weekly progress:', err);
    throw new Error('Unable to fetch progress.');
  }
}

export async function fetchSubjectTimeDistribution(
  userId: FirebaseUserId
): Promise<SubjectDuration[]> {
  const now = Date.now();

  try {
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

    const subjectsArray = [
      ...new Set(normalizedSessions.map((s) => s.subject)),
    ];

    const progress = subjectsArray
      .map((sub) => ({
        name: sub,
        value: Math.max(0, durationMap[sub] || 0),
      }))
      .sort((a, b) => b.value - a.value);

    return progress;
  } catch (err: any) {
    console.error('Failed to fetch subject durations:', err);
    throw new Error('Unable to fetch progress.');
  }
}

export function get7SegmentProgressForSubject(
  subjectName: string,
  sessions: any[]
): SegmentedSubjectProgress[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const thisMonthDays = getDaysInMonth(currentYear, currentMonth);
  const lastMonthDays = getDaysInMonth(lastMonthYear, lastMonth);

  const makeSegments = (daysInMonth: number) => {
    const segmentSize = Math.ceil(daysInMonth / 7);
    const segments = [];
    for (let i = 0; i < 7; i++) {
      const start = i * segmentSize + 1;
      const end = Math.min(start + segmentSize - 1, daysInMonth);
      start >= end
        ? segments.push({ range: `${start}`, total: 0 })
        : segments.push({ range: `${start}-${end}`, total: 0 });
    }
    return segments;
  };

  const thisSegments = makeSegments(thisMonthDays);
  const lastSegments = makeSegments(lastMonthDays);

  const normalizedSubject = subjectName.toLowerCase();

  sessions.forEach((session) => {
    if (session.subject?.toLowerCase() !== normalizedSubject) return;

    const date = new Date(session.startTime);
    const day = date.getDate();
    const isThisMonth =
      date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    const isLastMonth =
      date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;

    const days = isThisMonth ? thisMonthDays : lastMonthDays;
    const segmentIndex = Math.floor((day - 1) / Math.ceil(days / 7));

    if (isThisMonth) thisSegments[segmentIndex].total += session.duration;
    if (isLastMonth) lastSegments[segmentIndex].total += session.duration;
  });

  const result: SegmentedSubjectProgress[] = thisSegments.map((seg, idx) => ({
    segment: seg.range,
    thisMonth: seg.total,
    lastMonth: lastSegments[idx]?.total ?? 0,
  }));

  return result;
}
