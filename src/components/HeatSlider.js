import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { COLORS, SPACING, HEAT_LABELS } from '../constants/theme';

export default function HeatSlider({ value, onValueChange }) {
  const heat = HEAT_LABELS[value];

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Heat Level</Text>
        <Text style={styles.heatLabel}>
          {heat.emoji} {heat.label}
        </Text>
      </View>

      <Text style={styles.description}>{heat.description}</Text>

      <View style={styles.sliderTrack}>
        {[1, 2, 3, 4, 5].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.sliderDot,
              level <= value && styles.sliderDotActive,
              level === value && styles.sliderDotCurrent,
            ]}
            onPress={() => onValueChange(level)}
            activeOpacity={0.7}
          >
            <Text style={[styles.dotText, level <= value && styles.dotTextActive]}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
        <View style={styles.trackLine} />
        <View style={[styles.trackLineFill, { width: `${(value - 1) * 25}%` }]} />
      </View>

      <View style={styles.scaleLabels}>
        <Text style={styles.scaleLabel}>🎓 Academic</Text>
        <Text style={styles.scaleLabel}>🌋 On Fire</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  heatLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  sliderTrack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    position: 'relative',
    paddingHorizontal: SPACING.sm,
  },
  trackLine: {
    position: 'absolute',
    left: SPACING.sm + 16,
    right: SPACING.sm + 16,
    height: 3,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    zIndex: 0,
  },
  trackLineFill: {
    position: 'absolute',
    left: SPACING.sm + 16,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    zIndex: 0,
  },
  sliderDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  sliderDotActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surfaceLight,
  },
  sliderDotCurrent: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
    transform: [{ scale: 1.15 }],
  },
  dotText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  dotTextActive: {
    color: COLORS.text,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },
  scaleLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
