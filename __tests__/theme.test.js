/**
 * Tests for F-008: Design System and F-002: Heat Level data
 * Also covers F-005.1: ITT_TOPICS count
 */
import { COLORS, SPACING, HEAT_LABELS, ITT_TOPICS, FONTS } from '../src/constants/theme';

describe('F-008: Design System', () => {
  // T-008.1
  test('background color is #0D0D1A', () => {
    expect(COLORS.background).toBe('#0D0D1A');
  });

  // T-008.2
  test('primary color is #6C63FF', () => {
    expect(COLORS.primary).toBe('#6C63FF');
  });

  // T-008.3
  test('secondary color is #FF6584', () => {
    expect(COLORS.secondary).toBe('#FF6584');
  });

  // T-008.4
  test('accent color is #00D9FF', () => {
    expect(COLORS.accent).toBe('#00D9FF');
  });

  // T-008.5
  test('spacing scale is correct (4, 8, 16, 24, 32, 48)', () => {
    expect(SPACING.xs).toBe(4);
    expect(SPACING.sm).toBe(8);
    expect(SPACING.md).toBe(16);
    expect(SPACING.lg).toBe(24);
    expect(SPACING.xl).toBe(32);
    expect(SPACING.xxl).toBe(48);
  });

  // T-008.6
  test('semantic colors defined for success, warning, error', () => {
    expect(COLORS.success).toBeDefined();
    expect(COLORS.warning).toBeDefined();
    expect(COLORS.error).toBeDefined();
  });

  test('FONTS object is exported with correct keys', () => {
    expect(FONTS.regular).toBeDefined();
    expect(FONTS.small).toBeDefined();
    expect(FONTS.heading).toBeDefined();
    expect(FONTS.subheading).toBeDefined();
    expect(FONTS.caption).toBeDefined();
  });
});

describe('F-002: Heat Level Data', () => {
  // T-002.1 / T-002.3
  test('HEAT_LABELS has 5 levels', () => {
    expect(Object.keys(HEAT_LABELS)).toHaveLength(5);
  });

  // T-002.4-8
  test('each level has label, emoji, and description', () => {
    for (let i = 1; i <= 5; i++) {
      expect(HEAT_LABELS[i]).toBeDefined();
      expect(HEAT_LABELS[i].label).toBeDefined();
      expect(HEAT_LABELS[i].emoji).toBeDefined();
      expect(HEAT_LABELS[i].description).toBeDefined();
    }
  });

  test('level 1 is Academic', () => {
    expect(HEAT_LABELS[1].label).toBe('Academic');
  });

  test('level 2 is Thoughtful', () => {
    expect(HEAT_LABELS[2].label).toBe('Thoughtful');
  });

  test('level 3 is Persuasive', () => {
    expect(HEAT_LABELS[3].label).toBe('Persuasive');
  });

  test('level 4 is Passionate', () => {
    expect(HEAT_LABELS[4].label).toBe('Passionate');
  });

  test('level 5 is On Fire', () => {
    expect(HEAT_LABELS[5].label).toBe('On Fire');
  });
});

describe('F-005.1: ITT Topics', () => {
  // T-005.1
  test('at least 15 debate topics available', () => {
    expect(ITT_TOPICS.length).toBeGreaterThanOrEqual(15);
  });

  test('all topics are non-empty strings', () => {
    ITT_TOPICS.forEach((topic) => {
      expect(typeof topic).toBe('string');
      expect(topic.trim().length).toBeGreaterThan(0);
    });
  });
});
