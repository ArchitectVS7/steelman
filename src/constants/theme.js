export const COLORS = {
  background: '#0D0D1A',
  surface: '#1A1A2E',
  surfaceLight: '#252540',
  primary: '#6C63FF',
  primaryDark: '#5A52D5',
  secondary: '#FF6584',
  accent: '#00D9FF',
  text: '#EAEAEA',
  textSecondary: '#9B9BB4',
  textMuted: '#5E5E7E',
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
  border: '#2A2A45',
  cardBg: '#16162A',
};

export const FONTS = {
  regular: { fontSize: 16, color: COLORS.text },
  small: { fontSize: 14, color: COLORS.textSecondary },
  heading: { fontSize: 28, fontWeight: '700', color: COLORS.text },
  subheading: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  caption: { fontSize: 12, color: COLORS.textMuted },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const HEAT_LABELS = {
  1: { label: 'Academic', emoji: '🎓', description: 'Calm, measured, scholarly tone' },
  2: { label: 'Thoughtful', emoji: '🤔', description: 'Balanced and considerate' },
  3: { label: 'Persuasive', emoji: '💬', description: 'Clear and convincing' },
  4: { label: 'Passionate', emoji: '🔥', description: 'Energetic true-believer voice' },
  5: { label: 'On Fire', emoji: '🌋', description: 'Maximum rhetorical intensity' },
};

export const ITT_TOPICS = [
  'Social media is a net positive for society',
  'Remote work is better than in-office work',
  'College education is worth the cost',
  'Universal basic income should be implemented',
  'Nuclear energy is the best path to clean energy',
  'AI art should be considered real art',
  'Voting should be mandatory',
  'Zoos are ethical institutions',
  'Fast food should be more heavily regulated',
  'Space exploration funding should be increased',
  'Standardized testing is a fair measure of ability',
  'Social media companies should moderate content more aggressively',
  'Tipping culture should be abolished',
  'Professional athletes are overpaid',
  'Homework should be eliminated in schools',
];
