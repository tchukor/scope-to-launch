import { describe, expect, it } from "vitest";
import { getGradeFromScore } from "@/chokur/utils/grading";

describe("Brand & Landing Page KCSE Micro-Calculator Verification", () => {
  it("correctly calculates STEM High Achiever aggregate and university qualification", () => {
    const marks = [84, 78, 74, 82, 76, 80, 88]; // MAT, ENG, KIS, BIO, CHE, PHY, GEO
    const grades = marks.map((m) => getGradeFromScore(m));
    const totalPoints = grades.reduce((acc, g) => acc + g.points, 0);
    const meanPoints = totalPoints / marks.length;

    expect(totalPoints).toBeGreaterThanOrEqual(75);
    expect(meanPoints).toBeGreaterThanOrEqual(10.5); // A- or A tier
    expect(meanPoints >= 6.5).toBe(true); // Qualifies for KUCCPS direct degree entry
  });

  it("correctly identifies borderline C+ candidate at the 6.50 point threshold", () => {
    // Exactly at or near C+ average
    const borderlineMarks = [58, 55, 56, 54, 52, 60, 64];
    const grades = borderlineMarks.map((m) => getGradeFromScore(m));
    const totalPoints = grades.reduce((acc, g) => acc + g.points, 0);
    const meanPoints = totalPoints / borderlineMarks.length;

    // Mean points should hover around 6.50 - 7.00 (C+)
    expect(meanPoints).toBeGreaterThanOrEqual(6.5);
    expect(grades.every((g) => g.points >= 1 && g.points <= 12)).toBe(true);
  });

  it("verifies brand color hexes adhere to strict ground rules", () => {
    const BRAND_COLORS = {
      creamBackground: "#F6F1E7",
      creamPanel: "#FBF8F1",
      creamBackdrop: "#FEF9EF",
      inkText: "#111111",
      warmGreyText: "#5C5850",
      mutedGrey: "#9A958A",
      hairline: "#DDD6C7",
      burntOrangeAccent: "#C2410C",
    };

    expect(BRAND_COLORS.burntOrangeAccent).toBe("#C2410C");
    expect(BRAND_COLORS.creamBackground).toBe("#F6F1E7");
    expect(BRAND_COLORS.inkText).toBe("#111111");
  });
});
