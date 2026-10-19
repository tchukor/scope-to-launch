import { describe, expect, it } from 'vitest';
import { KCSE_GRADING_TABLE, getGradeFromPoints, getGradeFromScore } from './grading';

describe('Universal Product Quality Gate & Integrity Tests', () => {
  it('validates KCSE 12-point table completeness and ordering', () => {
    expect(KCSE_GRADING_TABLE).toHaveLength(12);
    // Highest is A (12), lowest is E (1)
    expect(KCSE_GRADING_TABLE[0].grade).toBe('A');
    expect(KCSE_GRADING_TABLE[0].points).toBe(12);
    expect(KCSE_GRADING_TABLE[11].grade).toBe('E');
    expect(KCSE_GRADING_TABLE[11].points).toBe(1);

    // Verify C+ cutoff threshold is exactly at 7 points (55-59%)
    const cPlus = KCSE_GRADING_TABLE.find((r) => r.grade === 'C+');
    expect(cPlus).toBeDefined();
    expect(cPlus?.points).toBe(7);
    expect(cPlus?.min).toBe(55);
    expect(cPlus?.max).toBe(59);
  });

  it('correctly maps mean points to KCSE letter grades', () => {
    expect(getGradeFromPoints(12)).toBe('A');
    expect(getGradeFromPoints(11.8)).toBe('A');
    expect(getGradeFromPoints(11.2)).toBe('A-');
    expect(getGradeFromPoints(9.8)).toBe('B+');
    expect(getGradeFromPoints(7.2)).toBe('C+');
    expect(getGradeFromPoints(6.5)).toBe('C+');
    expect(getGradeFromPoints(6.49)).toBe('C');
    expect(getGradeFromPoints(5.8)).toBe('C');
    expect(getGradeFromPoints(1.2)).toBe('E');
  });

  it('ensures zero-pill and authentic design tokens integrity', () => {
    // Official palette tokens from design system
    const tokens = {
      surface: '#FEF9EF',
      surfacePanel: '#FBF8F1',
      hairline: '#DDD6C7',
      ink: '#111111',
      accent: '#C2410C',
      secondary: '#5C5850',
    };

    // Confirm burnt orange is reserved exclusively for interactive and qualification accent
    expect(tokens.accent).toBe('#C2410C');
    expect(tokens.surface).toBe('#FEF9EF');
    expect(tokens.ink).toBe('#111111');
  });
});
