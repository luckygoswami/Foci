import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { updateStreakIfNeeded, getStreakDays } from './streaks';

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

import { getDoc, updateDoc } from 'firebase/firestore';
import { getStartOfDay } from '@/lib/utils';

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
