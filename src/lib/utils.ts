import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a duration in seconds into HH:MM:SS string
 * @param seconds - Total duration in seconds (e.g., 3665)
 * @returns Formatted time string (e.g., "01:01:05")
 *
 * @example
 * ```ts
 * formatDuration(3665) // → "01:01:05"
 * ```
 */
export function formatDuration(seconds: number) {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secondsStr = String(seconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${secondsStr}`;
}

/**
 * Converts each word in a string to **Title Case** —
 * capitalizing the first letter of each word.
 *
 * @param text - The input string to convert (e.g. "organic chemistry lab")
 * @returns A new string with each word capitalized (e.g. "Organic Chemistry Lab")
 *
 * @example
 * ```ts
 * toTitleCase("advanced physics") // → "Advanced Physics"
 * toTitleCase("self paced study") // → "Self Paced Study"
 * ```
 */
export function toTitleCase(text: string): string {
  return text
    .split(' ')
    .map((word) => (word ? `${word[0].toUpperCase()}${word.slice(1)}` : ''))
    .join(' ');
}

/**
 * Formats a numeric timestamp into a human-readable date and time string.
 *
 * @param timestamp - A Unix timestamp (in milliseconds) to format.
 * @returns A formatted date string in British English locale, e.g. "7 July 2025 at 3:17 PM".
 *
 * @example
 * ```ts
 * formatTimestampToString(1752018424000)
 * // → "7 July 2025 at 3:17 PM"
 * ```
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Formats a timestamp as a human-readable medium-length date string.
 * Uses British English locale formatting (e.g. "15 Jan 2023").
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string (e.g. "15 Jan 2023")
 *
 * @example
 * const dateString = formatMediumDate(1673827200000);
 * console.log(dateString); // "15 Jan 2023"
 */
export function formatMediumDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-GB', {
    dateStyle: 'medium',
  });
}

/**
 * Calculates the start and end dates of the week containing the given timestamp.
 * Week is considered to run from Sunday 00:00:00 to Saturday 23:59:59.999.
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns  Week boundaries
 * @returns return.firstDay - Start of week (Sunday 00:00:00)
 * @returns return.lastDay - End of week (Saturday 23:59:59.999)
 */
export function getWeekBoundaries(timestamp: number): {
  firstDay: Date;
  lastDay: Date;
} {
  const date = new Date(timestamp);
  const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)

  const sundayOffset = -dayOfWeek;
  const saturdayOffset = 6 - dayOfWeek;

  const firstDay = new Date(date);
  firstDay.setDate(date.getDate() + sundayOffset);
  firstDay.setHours(0, 0, 0, 0);

  const lastDay = new Date(date);
  lastDay.setDate(date.getDate() + saturdayOffset);
  lastDay.setHours(23, 59, 59, 999);

  return { firstDay, lastDay };
}

/**
 * Returns the Unix timestamp (in milliseconds) for the start of the day (00:00:00.000)
 * corresponding to the provided timestamp.
 *
 * @param timestamp - The input Unix timestamp in milliseconds.
 * @returns The timestamp (in ms) at 00:00:00.000 of the same day.
 *
 * @example
 * getStartOfDay(1752018424000); // → 1752000000000
 */
export function getStartOfDay(timestamp: number): number {
  return new Date(timestamp).setHours(0, 0, 0, 0);
}

/**
 * Creates a new array with the elements of the input array randomly shuffled.
 *
 * Uses the Fisher-Yates (Knuth) shuffle algorithm for uniform randomization.
 * The original array is not mutated.
 *
 * @template T
 * @param {T[]} arr - The array to shuffle.
 * @returns {T[]} A new array with the elements of `arr` in random order.
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = arr.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generates a random alphanumeric code of a specified length.
 *
 * The generated code uses the characters A-Z (excluding O and I) and 2-9 (excluding 0 and 1)
 * to avoid confusion between similarly shaped characters.
 *
 * @param {number} [length=6] - The desired length of the generated code. Defaults to 6.
 * @returns {string} A randomly generated code string.
 *
 * @example
 * // Returns a code like '9GJ27K'
 * generateRandomCode();
 *
 * @example
 * // Returns a code like 'N4GFRM8P'
 * generateRandomCode(8);
 */
export function generateRandomCode(length: number = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude O, 0, I, 1 for clarity
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Returns a formatted string with the month and year from a Unix timestamp.
 * @param timestamp - The input Unix timestamp in milliseconds.
 * @returns A string in the format "Jan 2022".
 */
export function getMonthYear(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('default', { month: 'short', year: 'numeric' });
}

/**
 * Converts a timestamp (ms since epoch) into a human-readable
 * "time ago" string like "2 hours ago", "3 days ago", etc.
 *
 * @param timestamp - The timestamp in milliseconds.
 * @returns A formatted time-ago string.
 */
export function timeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;

  if (diffMs < 0) return 'in the future'; // Guard for invalid data

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30); // Approximation
  const years = Math.floor(days / 365); // Approximation

  if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (weeks < 5) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;

  return `${years} year${years !== 1 ? 's' : ''} ago`;
}

/**
 * Get the first date of last month and the last date of current month in (DD MMM YYYY) format.
 */
export function getLastMonthToCurrentMonthRange(): {
  lastMonth: {
    startDate: string;
    monthIndex: number;
  };
  currentMonth: {
    endDate: string;
    monthIndex: number;
  };
} {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // First day of last month
  const firstDateOfLastMonth = new Date(lastMonthYear, lastMonth, 1).getTime();

  // Last day of current month
  const lastDateOfCurrentMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getTime();

  return {
    lastMonth: {
      startDate: formatMediumDate(firstDateOfLastMonth),
      monthIndex: lastMonth,
    },
    currentMonth: {
      endDate: formatMediumDate(lastDateOfCurrentMonth),
      monthIndex: currentMonth,
    },
  };
}

/**
 * Format a duration given in minutes into a string with hours and minutes.
 *
 * @param min - The total duration in minutes.
 * @param  dec - Whether to format as decimal hours (default false).
 * @returns The formatted duration string, e.g. "1h 30m", "2h", "45m", or "1.25h".
 */
export function formatDurationHM(min: number, dec = false): string {
  if (!min) return '0m';

  if (dec) {
    const hoursDecimal = Math.round((min / 60) * 100) / 100;
    return `${hoursDecimal}h`;
  }

  const h = Math.floor(min / 60);
  const m = min % 60;

  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}
