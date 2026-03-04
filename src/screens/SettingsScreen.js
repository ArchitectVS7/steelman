import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING } from '../constants/theme';

const API_KEY_STORAGE = '@steelman_api_key';
const API_ENDPOINT_STORAGE = '@steelman_api_endpoint';

export default function SettingsScreen() {
  const [apiKey, setApiKey] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('https://api.openai.com/v1/chat/completions');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const key = await AsyncStorage.getItem(API_KEY_STORAGE);
      const endpoint = await AsyncStorage.getItem(API_ENDPOINT_STORAGE);
      if (key) setApiKey(key);
      if (endpoint) setApiEndpoint(endpoint);
    } catch (err) {
      // Settings load failed silently
    }
  };

  const saveSettings = async () => {
    if (apiEndpoint && !apiEndpoint.startsWith('https://')) {
      Alert.alert('Security Warning', 'API endpoint must use HTTPS for secure communication.');
      return;
    }
    try {
      await AsyncStorage.setItem(API_KEY_STORAGE, apiKey);
      await AsyncStorage.setItem(API_ENDPOINT_STORAGE, apiEndpoint);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const clearSettings = async () => {
    Alert.alert(
      'Clear API Key',
      'Are you sure? The app will switch to demo mode.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem(API_KEY_STORAGE);
            setApiKey('');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>⚙️</Text>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Configuration</Text>
        <Text style={styles.sectionDescription}>
          Connect your own API key to get real AI-powered steelman arguments.
          Without a key, the app runs in demo mode with pre-built responses.
        </Text>

        <Text style={styles.fieldLabel}>API Endpoint</Text>
        <TextInput
          style={styles.input}
          value={apiEndpoint}
          onChangeText={setApiEndpoint}
          placeholder="https://api.openai.com/v1/chat/completions"
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.hint}>
          Works with any OpenAI-compatible API (OpenAI, Anthropic proxy, local LLMs, etc.)
        </Text>

        <Text style={styles.fieldLabel}>API Key</Text>
        <TextInput
          style={styles.input}
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="sk-..."
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.hint}>
          Your key is stored locally on your device and never shared.
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveSettings}
            activeOpacity={0.8}
          >
            <Text style={styles.saveText}>{saved ? '✓ Saved!' : 'Save Settings'}</Text>
          </TouchableOpacity>

          {apiKey ? (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearSettings}
              activeOpacity={0.8}
            >
              <Text style={styles.clearText}>Clear Key</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Steelman</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutText}>
            Steelman uses Rapoport's Rules — a framework from philosopher Daniel Dennett
            (borrowed from Anatol Rapoport) — to construct the strongest possible case for
            the opposing side of any argument.
          </Text>
          <Text style={[styles.aboutText, { marginTop: SPACING.sm }]}>
            This isn't about "both-sides-ing" — it's about intellectual empathy
            and finding the grain of truth in views you disagree with.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Supported Models</Text>
        <View style={styles.modelList}>
          {['GPT-4o / GPT-4', 'Claude 4.5 / Opus', 'Llama 3 (via Ollama)', 'Any OpenAI-compatible API'].map((model, idx) => (
            <View key={idx} style={styles.modelItem}>
              <Text style={styles.modelDot}>•</Text>
              <Text style={styles.modelText}>{model}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.version}>Steelman v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
  },
  headerIcon: {
    fontSize: 36,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  clearButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  clearText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.error,
  },
  aboutCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
  modelList: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  modelDot: {
    fontSize: 16,
    color: COLORS.primary,
    marginRight: SPACING.sm,
  },
  modelText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.lg,
  },
});
