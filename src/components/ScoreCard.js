import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

const CRITERIA_LABELS = {
  authenticity: { label: 'Authenticity', icon: '🎭' },
  charity: { label: 'Charity', icon: '💛' },
  specificity: { label: 'Specificity', icon: '🔬' },
  empathy: { label: 'Empathy', icon: '🫂' },
  biasLeakage: { label: 'Bias Control', icon: '🎯' },
};

function getGradeColor(grade) {
  switch (grade) {
    case 'A': return COLORS.success;
    case 'B': return COLORS.accent;
    case 'C': return COLORS.warning;
    case 'D': return '#FF8C42';
    case 'F': return COLORS.error;
    default: return COLORS.textMuted;
  }
}

function ScoreBar({ label, icon, score, maxScore = 10 }) {
  const pct = (score / maxScore) * 100;
  const barColor = pct >= 70 ? COLORS.success : pct >= 50 ? COLORS.warning : COLORS.error;

  return (
    <View style={styles.scoreRow}>
      <Text style={styles.scoreIcon}>{icon}</Text>
      <Text style={styles.scoreLabel}>{label}</Text>
      <View style={styles.barContainer}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={styles.scoreValue}>{score}/{maxScore}</Text>
    </View>
  );
}

export default function ScoreCard({ scores }) {
  const gradeColor = getGradeColor(scores.grade);

  return (
    <View style={styles.container}>
      <View style={styles.gradeRow}>
        <View style={[styles.gradeBadge, { borderColor: gradeColor }]}>
          <Text style={[styles.gradeText, { color: gradeColor }]}>{scores.grade}</Text>
        </View>
        <View style={styles.gradeInfo}>
          <Text style={styles.totalScore}>{scores.total}/50</Text>
          <Text style={styles.totalLabel}>Overall Score</Text>
        </View>
      </View>

      <View style={styles.scoresContainer}>
        {Object.entries(CRITERIA_LABELS).map(([key, { label, icon }]) => (
          <ScoreBar key={key} label={label} icon={icon} score={scores[key]} />
        ))}
      </View>

      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackTitle}>Feedback</Text>
        <Text style={styles.feedbackText}>{scores.feedback}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  gradeBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
  },
  gradeText: {
    fontSize: 32,
    fontWeight: '800',
  },
  gradeInfo: {
    marginLeft: SPACING.md,
  },
  totalScore: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  totalLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  scoresContainer: {
    marginBottom: SPACING.md,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  scoreIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
    width: 24,
  },
  scoreLabel: {
    width: 100,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.cardBg,
    borderRadius: 4,
    marginHorizontal: SPACING.sm,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreValue: {
    width: 36,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'right',
  },
  feedbackContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: SPACING.md,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accent,
    marginBottom: SPACING.xs,
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary,
  },
});
