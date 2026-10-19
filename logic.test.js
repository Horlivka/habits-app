import { describe, it, expect } from "vitest";
import { calculatePercentage, formatDate } from "./logic.js";

describe("calculatePercentage", () => {
  it("returns 0 when total is 0", () => {
    expect(calculatePercentage(5, 0)).toBe(0);
  });

  it("rounds to the nearest whole percent", () => {
    expect(calculatePercentage(1, 3)).toBe(33);
  });
});

describe("formatDate", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(formatDate(new Date(2026, 0, 15))).toBe("2026-01-15");
  });

  it("adds a leading zero to a single-digit day", () => {
    const date = new Date(2026, 0, 5, 12, 0);
    const result = formatDate(date);
    expect(result).toBe("2026-01-05");
  });

  it("keeps the same day just after midnight", () => {
    const date = new Date(2026, 0, 15, 0, 30);
    const result = formatDate(date);
    expect(result).toBe("2026-01-15");
  });
});
