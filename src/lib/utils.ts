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
