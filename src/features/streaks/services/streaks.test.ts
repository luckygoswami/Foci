import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
} from 'vitest';
import { updateStreakIfNeeded, getStreakDays, isStreakBroken } from './streaks';
import { getDoc, updateDoc } from 'firebase/firestore';
import { getStartOfDay } from '@/lib/utils';

// Mock dependencies (e.g., Firestore & utility functions)
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
  initializeFirestore: vi.fn(),
  persistentLocalCache: vi.fn(),
  persistentMultipleTabManager: vi.fn(),
  connectFirestoreEmulator: vi.fn(),
}));
vi.mock('@/lib/utils', () => ({
  getStartOfDay: vi.fn(),
}));

// Helper to simulate a Firestore user snapshot
const createUserSnap = (data: any) => ({
  data: () => data,
});

const userId = 'test-user';

describe('updateStreakIfNeeded', () => {
  beforeEach(() => {
    (getDoc as unknown as ReturnType<typeof vi.fn>).mockReset();
    (updateDoc as unknown as ReturnType<typeof vi.fn>).mockReset();
  });

  it('returns null if user has no data', async () => {
    (getDoc as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      createUserSnap(null)
    );
    const result = await updateStreakIfNeeded(userId, 1234567890);
    expect(result).toBeNull();
  });

  it('returns null if streak already updated for today', async () => {
    const today = 100000;
    (getDoc as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      createUserSnap({
        streak: { current: 2, longest: 5, lastActivityDate: today },
      })
    );
    (getStartOfDay as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      today
    );

    const result = await updateStreakIfNeeded(userId, today);
    expect(result).toBeNull();
    expect(updateDoc).not.toHaveBeenCalled();
  });

  it('increments streak if consecutive day', async () => {
    const yesterday = 90000;
    const today = yesterday + 86400000;
    (getDoc as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      createUserSnap({
        streak: { current: 2, longest: 2, lastActivityDate: yesterday },
      })
    );
    (getStartOfDay as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      today
    );

    const result = await updateStreakIfNeeded(userId, today);
    expect(result?.current).toBe(3);
    expect(result?.longest).toBe(3);
    expect(updateDoc).toHaveBeenCalledTimes(1);
  });

  it('resets streak if not consecutive', async () => {
    const oldDay = 1000;
    const today = 1000 + 3 * 86400000;
    (getDoc as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      createUserSnap({
        streak: { current: 7, longest: 10, lastActivityDate: oldDay },
      })
    );
    (getStartOfDay as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      today
    );

    const result = await updateStreakIfNeeded(userId, today);
    expect(result?.current).toBe(1);
    expect(result?.longest).toBe(10);
    expect(updateDoc).toHaveBeenCalledTimes(1);
  });
});

describe('getStreakDays', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Fix date to Thursday, July 17, 2025
  const base = new Date('2025-07-17T00:00:00Z').getTime();

  it('returns weekdays for current streak', () => {
    vi.spyOn(Date, 'now').mockReturnValue(base);
    (getStartOfDay as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      base
    );
    const streak = {
      current: 3,
      longest: 7,
      lastActivityDate: base,
    };
    const days = getStreakDays(streak);

    // Expected sequence will depend on logic:
    expect(days).toEqual(['Tuesday', 'Wednesday', 'Thursday']);
  });

  it('returns empty for zero streak', () => {
    const streak = { current: 0, longest: 3, lastActivityDate: base };
    const days = getStreakDays(streak);
    expect(days).toEqual([]);
  });
});

describe('isStreakBroken', () => {
  let now: number;
  let todayMidnight: number;
  let yesterdayMidnight: number;
  let twoDaysAgoMidnight: number;

  beforeAll(() => {
    (getStartOfDay as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (ts) => {
        const d = new Date(ts);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      }
    );

    now = Date.now();
    todayMidnight = getStartOfDay(now);
    yesterdayMidnight = todayMidnight - 86400000;
    twoDaysAgoMidnight = todayMidnight - 2 * 86400000;
  });

  it('returns true if current is 0', () => {
    expect(
      isStreakBroken({
        current: 0,
        lastActivityDate: todayMidnight,
        longest: 0,
      })
    ).toBe(true);
  });

  it('returns false if lastActivityDate is later than yesterday midnight', () => {
    // Streak should be unbroken if activity was anytime yesterday or today
    expect(
      isStreakBroken({
        current: 3,
        lastActivityDate: todayMidnight,
        longest: 0,
      })
    ).toBe(false);
    expect(
      isStreakBroken({
        current: 5,
        lastActivityDate: todayMidnight + 1000 * 60 * 60,
        longest: 0,
      })
    ).toBe(false); // today at 1am
    expect(
      isStreakBroken({
        current: 10,
        lastActivityDate: yesterdayMidnight + 1000 * 60 * 60,
        longest: 0,
      })
    ).toBe(false); // yesterday at 1am
  });

  it('returns true if lastActivityDate before yesterday midnight', () => {
    // Streak is broken if activity is before start of yesterday
    expect(
      isStreakBroken({
        current: 7,
        lastActivityDate: twoDaysAgoMidnight,
        longest: 0,
      })
    ).toBe(true);
    expect(
      isStreakBroken({
        current: 2,
        lastActivityDate: twoDaysAgoMidnight - 1000,
        longest: 0,
      })
    ).toBe(true);
  });

  it('returns true for very old lastActivityDate', () => {
    expect(
      isStreakBroken({
        current: 99,
        lastActivityDate: todayMidnight - 1000 * 60 * 60 * 24 * 10,
        longest: 0,
      })
    ).toBe(true);
  });

  it('returns false for edge case: lastActivityDate equal to yesterdayMidnight', () => {
    // Exactly at yesterday midnight should be within the unbroken window
    expect(
      isStreakBroken({
        current: 5,
        lastActivityDate: yesterdayMidnight,
        longest: 0,
      })
    ).toBe(false);
  });

  it('handles fractional lastActivityDate values', () => {
    expect(
      isStreakBroken({
        current: 2,
        lastActivityDate: todayMidnight - 10,
        longest: 0,
      })
    ).toBe(false);
  });
});
