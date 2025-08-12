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
export const formatDuration = (seconds: number) => {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secondsStr = String(seconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${secondsStr}`;
};

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
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {Object} Week boundaries
 * @returns {Date} return.firstDay - Start of week (Sunday 00:00:00)
 * @returns {Date} return.lastDay - End of week (Saturday 23:59:59.999)
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
