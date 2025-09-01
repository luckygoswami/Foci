import { getSessionsByDate } from '@/features/sessions';
import { formatMediumDate, getWeekBoundaries } from '@/lib/utils';
import type { UserData, FirebaseUserId, Session } from '@/types';
import type {
  GoalProgress,
  SegmentedSubjectProgress,
  SubjectDuration,
  WeeklyProgress,
} from '../types';
import { MONTH_NAMES } from '@/constants/dateTime';

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
        subject: sub,
        duration: Math.max(0, durationMap[sub] || 0),
      }))
      .sort((a, b) => b.duration - a.duration);

    return progress;
  } catch (err: any) {
    console.error('Failed to fetch subject durations:', err);
    throw new Error('Unable to fetch progress.');
  }
}

export function get7SegmentProgressForSubject(
  subjectName: string,
  sessions: Session[]
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

export function getWeeklyProgressForSubject(
  subjectName: string,
  sessions: Session[]
): WeeklyProgress[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const thisMonthName = MONTH_NAMES[currentMonth];
  const lastMonthName = MONTH_NAMES[lastMonth];

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const thisMonthDays = getDaysInMonth(currentYear, currentMonth);
  const lastMonthDays = getDaysInMonth(lastMonthYear, lastMonth);

  // Always 4 weeks (1-7, 8-14, 15-21, 22-end)
  const makeWeeks = (daysInMonth: number) => [
    { range: [1, 7], total: 0 },
    { range: [8, 14], total: 0 },
    { range: [15, 21], total: 0 },
    { range: [22, daysInMonth], total: 0 },
  ];

  const thisWeeks = makeWeeks(thisMonthDays);
  const lastWeeks = makeWeeks(lastMonthDays);

  // Fill weeks with durations
  sessions.forEach((session) => {
    if (session.subject?.toLowerCase() !== subjectName.toLowerCase()) return;

    const date = new Date(session.startTime);
    const day = date.getDate();

    const isThisMonth =
      date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    const isLastMonth =
      date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;

    if (isThisMonth) {
      const weekIndex = thisWeeks.findIndex(
        (w) => day >= w.range[0] && day <= w.range[1]
      );
      if (weekIndex >= 0) thisWeeks[weekIndex].total += session.duration;
    }

    if (isLastMonth) {
      const weekIndex = lastWeeks.findIndex(
        (w) => day >= w.range[0] && day <= w.range[1]
      );
      if (weekIndex >= 0) lastWeeks[weekIndex].total += session.duration;
    }
  });

  const result: WeeklyProgress[] = thisWeeks.map((w, idx) => ({
    week: (idx + 1).toString(),
    [thisMonthName]: w.total,
    [lastMonthName]: lastWeeks[idx]?.total ?? 0,
  }));

  return result;
}

export function getSafeProgress(data: GoalProgress) {
  const completed = data[0].value;
  const total = data[0].value + data[1].value;

  const MIN_PERCENT = 0.04;

  if (total <= 0) {
    return [
      { name: 'completed', value: 0 },
      { name: 'remaining', value: 0 },
    ];
  }

  // Clamp completed so it's not negative or bigger than total
  const clamped = Math.min(Math.max(completed, 0), total);

  // If > 0, enforce minimum 4% slice
  const safeCompleted =
    clamped === 0 ? 0 : Math.max(clamped, total * MIN_PERCENT);

  // Remaining should never be negative
  const safeRemaining = Math.max(total - clamped, 0);

  return [
    { name: 'completed', value: safeCompleted },
    { name: 'remaining', value: safeRemaining },
  ];
}
