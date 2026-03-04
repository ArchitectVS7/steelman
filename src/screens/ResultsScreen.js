import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { COLORS, SPACING, HEAT_LABELS } from '../constants/theme';
import ResultCard from '../components/ResultCard';

export default function ResultsScreen({ route, navigation }) {
  const { opinion, heatLevel, result } = route.params;
  const heat = HEAT_LABELS[heatLevel];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🛡️ Steelman — Opposing view of: "${opinion}"\n\n${result.fullText}`,
        title: 'Steelman Argument',
      });
    } catch (err) {
      // User cancelled
    }
  };

  const handleNewTake = () => {
    navigation.goBack();
  };

  const sections = [
    { key: 'reexpression', content: result.reexpression },
    { key: 'commonGround', content: result.commonGround },
    { key: 'learned', content: result.learned },
    { key: 'steelman', content: result.steelman },
    { key: 'weakPoint', content: result.weakPoint },
  ].filter((s) => s.content);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>STEELMAN ANALYSIS</Text>
          <Text style={styles.headerHeat}>
            {heat.emoji} {heat.label} intensity
          </Text>
        </View>

        <View style={styles.originalCard}>
          <Text style={styles.originalLabel}>YOUR ORIGINAL TAKE</Text>
          <Text style={styles.originalText}>"{opinion}"</Text>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>🛡️ The Other Side</Text>
          <View style={styles.dividerLine} />
        </View>

        {sections.map(({ key, content }) => (
          <ResultCard key={key} sectionKey={key} content={content} />
        ))}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.8}>
            <Text style={styles.shareIcon}>📤</Text>
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.newButton} onPress={handleNewTake} activeOpacity={0.8}>
            <Text style={styles.newIcon}>✍️</Text>
            <Text style={styles.newText}>New Take</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  headerHeat: {
    fontSize: 13,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  originalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
  },
  originalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  originalText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
    color: COLORS.textSecondary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginHorizontal: SPACING.md,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  shareIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  shareText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  newButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
  },
  newIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  newText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
});
