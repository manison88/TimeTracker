/**
 * Time formatting and calculation utilities
 */

export interface FormattedDuration {
  hms: string; // "03:20:20"
  friendly: string; // "3h 20m"
}

/**
 * Format seconds into hh:mm:ss and friendly format
 */
export function formatDuration(totalSeconds: number): FormattedDuration {
  const absSeconds = Math.max(0, Math.floor(totalSeconds));

  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const seconds = absSeconds % 60;

  const hms = [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");

  let friendly: string;
  if (hours > 0) {
    friendly = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  } else if (minutes > 0) {
    friendly = `${minutes}m`;
  } else {
    friendly = `${seconds}s`;
  }

  return { hms, friendly };
}

/**
 * Calculate elapsed seconds from a start time to now
 */
export function calculateElapsedSeconds(startTime: Date | string): number {
  const start =
    typeof startTime === "string" ? new Date(startTime) : startTime;
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / 1000);
}

/**
 * Calculate duration between two dates in seconds
 */
export function calculateDurationSeconds(
  startTime: Date | string,
  endTime: Date | string
): number {
  const start =
    typeof startTime === "string" ? new Date(startTime) : startTime;
  const end = typeof endTime === "string" ? new Date(endTime) : endTime;
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));
}

export interface TimeEntryForSum {
  durationSeconds: number | null;
  startTime: Date | string;
  endTime: Date | string | null;
}

/**
 * Sum durations from multiple time entries
 * For entries still running (endTime is null), calculates elapsed time
 */
export function sumDurations(entries: TimeEntryForSum[]): number {
  return entries.reduce((total, entry) => {
    if (entry.durationSeconds !== null) {
      // Completed entry - use stored duration
      return total + entry.durationSeconds;
    } else if (entry.endTime === null) {
      // Running entry - calculate elapsed
      return total + calculateElapsedSeconds(entry.startTime);
    } else {
      // Edge case: endTime exists but durationSeconds not stored
      return (
        total + calculateDurationSeconds(entry.startTime, entry.endTime)
      );
    }
  }, 0);
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a date and time for display
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Check if a date is within the last N days
 */
export function isWithinDays(date: Date | string, days: number): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  return diff <= days * dayMs;
}
