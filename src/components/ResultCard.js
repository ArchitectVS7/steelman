import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

const SECTION_ICONS = {
  reexpression: '🔄',
  commonGround: '🤝',
  learned: '💡',
  steelman: '🛡️',
  weakPoint: '🎯',
};

const SECTION_TITLES = {
  reexpression: 'Re-expression',
  commonGround: 'Common Ground',
  learned: 'What I Learned',
  steelman: 'The Steelman',
  weakPoint: 'Weak Point in Your Take',
};

export default function ResultCard({ sectionKey, content }) {
  const [expanded, setExpanded] = useState(sectionKey === 'steelman');
  const icon = SECTION_ICONS[sectionKey] || '📝';
  const title = SECTION_TITLES[sectionKey] || sectionKey;

  const isHighlight = sectionKey === 'steelman';
  const isWeakPoint = sectionKey === 'weakPoint';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isHighlight && styles.cardHighlight,
        isWeakPoint && styles.cardWeakPoint,
      ]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={[styles.title, isHighlight && styles.titleHighlight]}>
          {title}
        </Text>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </View>

      {expanded && (
        <View style={styles.contentContainer}>
          <View style={styles.divider} />
          <Text style={styles.content}>{content}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHighlight: {
    borderColor: COLORS.primary,
    backgroundColor: '#1A1A35',
  },
  cardWeakPoint: {
    borderColor: COLORS.secondary,
    backgroundColor: '#1A1520',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  titleHighlight: {
    color: COLORS.primary,
  },
  chevron: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  contentContainer: {
    marginTop: SPACING.sm,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  content: {
    fontSize: 15,
    lineHeight: 23,
    color: COLORS.textSecondary,
  },
});
