import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  formatDuration,
  calculateElapsedSeconds,
  calculateDurationSeconds,
  sumDurations,
  isWithinDays,
} from "./time";

describe("formatDuration", () => {
  it("formats zero seconds", () => {
    const result = formatDuration(0);
    expect(result.hms).toBe("00:00:00");
    expect(result.friendly).toBe("0s");
  });

  it("formats seconds only", () => {
    const result = formatDuration(45);
    expect(result.hms).toBe("00:00:45");
    expect(result.friendly).toBe("45s");
  });

  it("formats minutes and seconds", () => {
    const result = formatDuration(125);
    expect(result.hms).toBe("00:02:05");
    expect(result.friendly).toBe("2m");
  });

  it("formats hours, minutes, and seconds", () => {
    const result = formatDuration(12020);
    expect(result.hms).toBe("03:20:20");
    expect(result.friendly).toBe("3h 20m");
  });

  it("formats hours only (no minutes)", () => {
    const result = formatDuration(7200);
    expect(result.hms).toBe("02:00:00");
    expect(result.friendly).toBe("2h");
  });

  it("handles large durations", () => {
    const result = formatDuration(86400);
    expect(result.hms).toBe("24:00:00");
    expect(result.friendly).toBe("24h");
  });

  it("handles negative values as zero", () => {
    const result = formatDuration(-100);
    expect(result.hms).toBe("00:00:00");
    expect(result.friendly).toBe("0s");
  });

  it("floors decimal values", () => {
    const result = formatDuration(65.9);
    expect(result.hms).toBe("00:01:05");
    expect(result.friendly).toBe("1m");
  });
});

describe("calculateElapsedSeconds", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calculates elapsed time from Date object", () => {
    const now = new Date("2024-01-15T12:00:00Z");
    vi.setSystemTime(now);

    const startTime = new Date("2024-01-15T11:30:00Z");
    const elapsed = calculateElapsedSeconds(startTime);
    expect(elapsed).toBe(1800);
  });

  it("calculates elapsed time from ISO string", () => {
    const now = new Date("2024-01-15T12:00:00Z");
    vi.setSystemTime(now);

    const elapsed = calculateElapsedSeconds("2024-01-15T11:45:00Z");
    expect(elapsed).toBe(900);
  });
});

describe("calculateDurationSeconds", () => {
  it("calculates duration between two dates", () => {
    const start = new Date("2024-01-15T10:00:00Z");
    const end = new Date("2024-01-15T11:30:00Z");
    expect(calculateDurationSeconds(start, end)).toBe(5400);
  });

  it("handles string dates", () => {
    expect(
      calculateDurationSeconds(
        "2024-01-15T10:00:00Z",
        "2024-01-15T10:05:00Z"
      )
    ).toBe(300);
  });

  it("returns zero for end before start", () => {
    const start = new Date("2024-01-15T12:00:00Z");
    const end = new Date("2024-01-15T10:00:00Z");
    expect(calculateDurationSeconds(start, end)).toBe(0);
  });
});

describe("sumDurations", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sums completed entries", () => {
    const entries = [
      {
        durationSeconds: 3600,
        startTime: new Date("2024-01-15T10:00:00Z"),
        endTime: new Date("2024-01-15T11:00:00Z"),
      },
      {
        durationSeconds: 1800,
        startTime: new Date("2024-01-15T11:00:00Z"),
        endTime: new Date("2024-01-15T11:30:00Z"),
      },
    ];
    expect(sumDurations(entries)).toBe(5400);
  });

  it("includes running entry elapsed time", () => {
    const entries = [
      {
        durationSeconds: 3600,
        startTime: new Date("2024-01-15T10:00:00Z"),
        endTime: new Date("2024-01-15T11:00:00Z"),
      },
      {
        durationSeconds: null,
        startTime: new Date("2024-01-15T11:30:00Z"),
        endTime: null,
      },
    ];
    expect(sumDurations(entries)).toBe(3600 + 1800);
  });

  it("handles empty array", () => {
    expect(sumDurations([])).toBe(0);
  });

  it("calculates from start/end if durationSeconds is null but endTime exists", () => {
    const entries = [
      {
        durationSeconds: null,
        startTime: new Date("2024-01-15T10:00:00Z"),
        endTime: new Date("2024-01-15T10:30:00Z"),
      },
    ];
    expect(sumDurations(entries)).toBe(1800);
  });
});

describe("isWithinDays", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true for date within range", () => {
    const date = new Date("2024-01-14T12:00:00Z");
    expect(isWithinDays(date, 7)).toBe(true);
  });

  it("returns false for date outside range", () => {
    const date = new Date("2024-01-01T12:00:00Z");
    expect(isWithinDays(date, 7)).toBe(false);
  });

  it("handles string dates", () => {
    expect(isWithinDays("2024-01-14T12:00:00Z", 7)).toBe(true);
  });
});
