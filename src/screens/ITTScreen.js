import React, { useState, useCallback } from 'react';
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
import { COLORS, SPACING, ITT_TOPICS } from '../constants/theme';
import { gradeITT } from '../services/steelmanEngine';
import ScoreCard from '../components/ScoreCard';

function getRandomTopic(exclude = null) {
  const filtered = exclude ? ITT_TOPICS.filter((t) => t !== exclude) : ITT_TOPICS;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export default function ITTScreen() {
  const [topic, setTopic] = useState(getRandomTopic);
  const [userAttempt, setUserAttempt] = useState('');
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState('write'); // 'write' | 'results'

  const handleNewTopic = useCallback(() => {
    setTopic(getRandomTopic(topic));
    setUserAttempt('');
    setScores(null);
    setPhase('write');
  }, [topic]);

  const handleSubmit = async () => {
    if (!userAttempt.trim() || userAttempt.trim().split(/\s+/).length < 10) return;

    setLoading(true);
    try {
      const result = await gradeITT(topic, userAttempt.trim());
      setScores(result);
      setPhase('results');
    } catch (err) {
      console.error('ITT grading failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const wordCount = userAttempt.trim().split(/\s+/).filter(Boolean).length;

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
          <Text style={styles.headerIcon}>🧪</Text>
          <Text style={styles.title}>Ideological Turing Test</Text>
          <Text style={styles.subtitle}>
            Can you argue the opposing side so convincingly that a true believer
            would think you're one of them?
          </Text>
        </View>

        <View style={styles.topicCard}>
          <Text style={styles.topicLabel}>DEFEND THIS POSITION:</Text>
          <Text style={styles.topicText}>"{topic}"</Text>
          <TouchableOpacity style={styles.shuffleButton} onPress={handleNewTopic} activeOpacity={0.7}>
            <Text style={styles.shuffleIcon}>🔀</Text>
            <Text style={styles.shuffleText}>Different Topic</Text>
          </TouchableOpacity>
        </View>

        {phase === 'write' && (
          <>
            <View style={styles.instructions}>
              <Text style={styles.instructionTitle}>Your Challenge</Text>
              <Text style={styles.instructionText}>
                Write a passionate, convincing defense of the position above —
                as if you truly believe it. Use specific examples, emotional language,
                and genuine reasoning. The AI will grade how authentic you sound.
              </Text>
            </View>

            <View style={styles.inputSection}>
              <TextInput
                style={styles.textInput}
                placeholder="Write your defense here. Be specific, be passionate, be a true believer..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                value={userAttempt}
                onChangeText={setUserAttempt}
                maxLength={3000}
              />
              <View style={styles.inputFooter}>
                <Text style={[styles.wordCount, wordCount < 10 && styles.wordCountLow]}>
                  {wordCount} words {wordCount < 10 ? '(min 10)' : ''}
                </Text>
                <Text style={styles.charCount}>{userAttempt.length}/3000</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, (wordCount < 10 || loading) && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={wordCount < 10 || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.text} />
              ) : (
                <>
                  <Text style={styles.submitIcon}>🧪</Text>
                  <Text style={styles.submitText}>Grade My Steelman</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>Tips for a High Score</Text>
              <Text style={styles.tipItem}>🎭 Write in first person — "I believe..."</Text>
              <Text style={styles.tipItem}>💛 Use the most charitable framing possible</Text>
              <Text style={styles.tipItem}>🔬 Include specific examples and data</Text>
              <Text style={styles.tipItem}>🫂 Show why someone would deeply care about this</Text>
              <Text style={styles.tipItem}>🎯 Avoid words that signal you're faking it</Text>
            </View>
          </>
        )}

        {phase === 'results' && scores && (
          <>
            <ScoreCard scores={scores} />

            <View style={styles.resultActions}>
              <TouchableOpacity style={styles.tryAgainButton} onPress={() => setPhase('write')} activeOpacity={0.8}>
                <Text style={styles.tryAgainText}>✏️ Revise & Retry</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.newTopicButton} onPress={handleNewTopic} activeOpacity={0.8}>
                <Text style={styles.newTopicText}>🔀 New Topic</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
  headerIcon: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 20,
    paddingHorizontal: SPACING.md,
  },
  topicCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.accent,
    marginBottom: SPACING.lg,
  },
  topicLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent,
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  topicText: {
    fontSize: 18,
    fontWeight: '600',
    fontStyle: 'italic',
    color: COLORS.text,
    lineHeight: 26,
    marginBottom: SPACING.md,
  },
  shuffleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.cardBg,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  shuffleIcon: {
    fontSize: 14,
    marginRight: SPACING.xs,
  },
  shuffleText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  instructions: {
    marginBottom: SPACING.md,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary,
  },
  inputSection: {
    marginBottom: SPACING.md,
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
    minHeight: 180,
    lineHeight: 24,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  wordCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  wordCountLow: {
    color: COLORS.warning,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  submitButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  buttonDisabled: {
    backgroundColor: COLORS.surfaceLight,
  },
  submitIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  submitText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.background,
  },
  tipsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.warning,
    marginBottom: SPACING.md,
  },
  tipItem: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  resultActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  tryAgainButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tryAgainText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  newTopicButton: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  newTopicText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.background,
  },
});
