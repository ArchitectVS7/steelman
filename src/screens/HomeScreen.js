import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import HeatSlider from '../components/HeatSlider';
import { generateSteelman } from '../services/steelmanEngine';

const EXAMPLE_TAKES = [
  'Social media is destroying society',
  'Remote work is just an excuse to be lazy',
  'AI will replace all creative jobs within 10 years',
  'College is a waste of money for most people',
  'Cancel culture has gone too far',
];

export default function HomeScreen({ navigation }) {
  const [opinion, setOpinion] = useState('');
  const [heatLevel, setHeatLevel] = useState(3);
  const [loading, setLoading] = useState(false);

  const handleSteelman = async () => {
    if (!opinion.trim()) return;

    setLoading(true);
    try {
      const result = await generateSteelman(opinion.trim(), heatLevel);
      navigation.navigate('Results', {
        opinion: opinion.trim(),
        heatLevel,
        result,
      });
    } catch (err) {
      // In production, show an error toast
      console.error('Steelman generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>🛡️</Text>
          <Text style={styles.title}>Steelman</Text>
          <Text style={styles.subtitle}>
            Find the strongest case for the other side
          </Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Your Opinion or Hot Take</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Paste any opinion, hot take, or argument..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            value={opinion}
            onChangeText={setOpinion}
            maxLength={2000}
          />
          <Text style={styles.charCount}>{opinion.length}/2000</Text>
        </View>

        <HeatSlider value={heatLevel} onValueChange={setHeatLevel} />

        <TouchableOpacity
          style={[styles.steelmanButton, !opinion.trim() && styles.buttonDisabled]}
          onPress={handleSteelman}
          disabled={!opinion.trim() || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.text} />
          ) : (
            <>
              <Text style={styles.buttonIcon}>🛡️</Text>
              <Text style={styles.buttonText}>Steelman It</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.examplesSection}>
          <Text style={styles.examplesTitle}>Try an example</Text>
          <View style={styles.exampleChips}>
            {EXAMPLE_TAKES.map((take, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.chip}
                onPress={() => setOpinion(take)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipText}>{take}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What is a Steelman?</Text>
          <Text style={styles.infoText}>
            The opposite of a strawman. Instead of weakening the other side's argument,
            a steelman builds the <Text style={styles.bold}>strongest possible version</Text> of
            it — using Rapoport's Rules for critical discourse.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
  },
  logo: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    paddingTop: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 130,
    lineHeight: 24,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  steelmanButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: COLORS.surfaceLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  examplesSection: {
    marginTop: SPACING.xl,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exampleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  infoCard: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent,
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
  bold: {
    fontWeight: '700',
    color: COLORS.text,
  },
});
