import { describe, it, expect, vi } from 'vitest';
import {
  cn,
  formatDuration,
  toTitleCase,
  formatTimestamp,
  formatMediumDate,
  getWeekBoundaries,
  getStartOfDay,
  shuffle,
  generateRandomCode,
  getMonthYear,
  timeAgo,
} from './utils';

// Correct clsx and tailwind-merge mocks
vi.mock('clsx', () => ({
  clsx: (...args: any[]) => args.flat(Infinity).filter(Boolean).join(' '),
}));
vi.mock('tailwind-merge', () => ({
  twMerge: (val: string) => val,
}));

describe('Utils', () => {
  it('formatDuration formats seconds into HH:MM:SS', () => {
    expect(formatDuration(3665)).toBe('01:01:05');
    expect(formatDuration(0)).toBe('00:00:00');
    expect(formatDuration(59)).toBe('00:00:59');
    expect(formatDuration(3600)).toBe('01:00:00');
  });

  it('toTitleCase capitalizes each word', () => {
    expect(toTitleCase('advanced physics')).toBe('Advanced Physics');
    expect(toTitleCase('self paced study')).toBe('Self Paced Study');
    expect(toTitleCase('')).toBe('');
    expect(toTitleCase('already Capitalized')).toBe('Already Capitalized');
  });

  it('formatTimestamp formats timestamp to readable date', () => {
    const ts = 1752018424000;
    expect(formatTimestamp(ts)).toBe(
      new Date(ts).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    );
  });

  it('formatMediumDate formats to medium date', () => {
    const ts = 1673827200000;
    expect(formatMediumDate(ts)).toBe(
      new Date(ts).toLocaleString('en-GB', { dateStyle: 'medium' })
    );
  });

  it('getWeekBoundaries returns correct Sunday and Saturday', () => {
    const t = Date.UTC(2023, 6, 19); // Wed, 19 July 2023 UTC
    const { firstDay, lastDay } = getWeekBoundaries(t);
    expect(firstDay.getDay()).toBe(0); // Sunday
    expect(lastDay.getDay()).toBe(6); // Saturday
    expect(firstDay.getHours()).toBe(0);
    expect(firstDay.getMinutes()).toBe(0);
    expect(lastDay.getHours()).toBe(23);
    expect(lastDay.getMinutes()).toBe(59);
  });

  it('getStartOfDay returns timestamp for 00:00:00 local', () => {
    const t = new Date('2025-07-07T17:25:20.000Z').getTime();
    const start = getStartOfDay(t);
    const localStart = new Date(start);
    expect(localStart.getHours()).toBe(0);
    expect(localStart.getMinutes()).toBe(0);
    expect(localStart.getSeconds()).toBe(0);
    expect(localStart.getMilliseconds()).toBe(0);
  });

  it('shuffle randomizes array and does not mutate original', () => {
    const arr = [1, 2, 3, 4, 5];
    const copy = [...arr];
    const shuffled = shuffle(arr);
    expect(shuffled.sort()).toEqual(arr.sort());
    expect(arr).toEqual(copy);
  });

  it('generateRandomCode generates a code of given length', () => {
    const code = generateRandomCode();
    expect(typeof code).toBe('string');
    expect(code.length).toBe(6);

    const code8 = generateRandomCode(8);
    expect(code8.length).toBe(8);
    expect(code8).not.toMatch(/[OI01]/);
  });

  it('getMonthYear returns month and year in "Mon YYYY" format', () => {
    const date = new Date('2025-08-15').getTime();
    const out = getMonthYear(date);
    expect(out).toMatch(/^[A-Z][a-z]{2} \d{4}$/);
  });

  it('timeAgo reports time ago in human-readable string', () => {
    const now = Date.now();
    expect(timeAgo(now - 10 * 1000)).toBe('10 seconds ago');
    expect(timeAgo(now - 60 * 1000)).toBe('1 minute ago');
    expect(timeAgo(now - 3600 * 1000)).toBe('1 hour ago');
    expect(timeAgo(now - 24 * 3600 * 1000)).toBe('1 day ago');
    expect(timeAgo(now + 10_000)).toBe('in the future');
  });

  it('cn combines classnames', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
    expect(cn('a', null, false, 'b')).toBe('a b');
  });
});
