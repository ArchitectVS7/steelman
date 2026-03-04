# Testable Endpoints — Steelman App

This document maps each PRD feature specification to concrete, testable validation points.

---

## F-001: Opinion Input

| Test ID | PRD Ref | Endpoint Description | Validation Method |
|---------|---------|---------------------|-------------------|
| T-001.1 | F-001.1 | HomeScreen renders a multiline TextInput | Component render test |
| T-001.2 | F-001.2 | TextInput enforces maxLength={2000} | Props assertion |
| T-001.3 | F-001.3 | Character counter renders `{count}/2000` | Component render + text assertion |
| T-001.4 | F-001.4 | Submit button disabled when input empty/whitespace | Props/state assertion |
| T-001.5 | F-001.5 | Example chips rendered and populate input on press | Interaction test |
| T-001.6 | F-001.6 | At least 5 example takes available | Constant assertion |

## F-002: Heat Level Slider

| Test ID | PRD Ref | Endpoint Description | Validation Method |
|---------|---------|---------------------|-------------------|
| T-002.1 | F-002.1 | HeatSlider renders 5 level dots | Component render test |
| T-002.2 | F-002.2 | Default heat level is 3 | State initialization test |
| T-002.3 | F-002.3 | Each level has label, emoji, description | Constant data test |
| T-002.4-8 | F-002.4-8 | HEAT_LABELS has correct entries for levels 1-5 | Data assertion |
| T-002.9 | F-002.9 | Active dots styled differently from inactive | Style assertion |
| T-002.10 | F-002.10 | Pressing a dot calls onValueChange | Interaction test |

## F-003: Steelman Generation

| Test ID | PRD Ref | Endpoint Description | Validation Method |
|---------|---------|---------------------|-------------------|
| T-003.1 | F-003.1 | generateSteelman returns all 5 Rapoport sections | Unit test on return shape |
| T-003.2 | F-003.2 | buildSystemPrompt includes heat modifier text | Unit test |
| T-003.3 | F-003.3 | Demo mode returns response when no API key | Unit test |
| T-003.4 | F-003.4 | Demo mode detects social_media, remote_work, ai, education topics | Unit test |
| T-003.5 | F-003.5 | API mode calls fetch with system + user messages | Mock fetch test |
| T-003.6 | F-003.6 | API request includes Authorization Bearer header | Mock fetch assertion |
| T-003.7 | F-003.7 | SYSTEM_PROMPT_BASE contains Rapoport's Rules keywords | String assertion |
| T-003.8 | F-003.8 | HomeScreen shows ActivityIndicator during loading | Component state test |
| T-003.9 | F-003.9 | parseResponse extracts markdown sections correctly | Unit test |

## F-004: Results Display

| Test ID | PRD Ref | Endpoint Description | Validation Method |
|---------|---------|---------------------|-------------------|
| T-004.1 | F-004.1 | ResultsScreen displays original opinion text | Render test |
| T-004.2 | F-004.2 | ResultsScreen displays heat level info | Render test |
| T-004.3 | F-004.3 | ResultCard renders with correct icon per section | Props assertion |
| T-004.4 | F-004.4 | Steelman card expanded by default, others collapsed | State initialization test |
| T-004.5 | F-004.5 | Share button triggers Share.share | Interaction test |
| T-004.6 | F-004.6 | "New Take" button calls navigation.goBack | Interaction test |
| T-004.7 | F-004.7 | Empty sections filtered out | Logic test |

## F-005: ITT Mode

| Test ID | PRD Ref | Endpoint Description | Validation Method |
|---------|---------|---------------------|-------------------|
| T-005.1 | F-005.1 | ITT_TOPICS has at least 15 entries | Constant assertion |
| T-005.2 | F-005.2 | getRandomTopic excludes current topic | Unit test |
| T-005.3 | F-005.3 | ITT TextInput has maxLength={3000} | Props assertion |
| T-005.4 | F-005.4 | Submit disabled when word count < 10 | Logic test |
| T-005.5 | F-005.5 | Word count and character count displayed | Render test |
| T-005.6 | F-005.6 | gradeITT returns all 5 criteria scores | Unit test on return shape |
| T-005.7 | F-005.7 | Each criterion 1-10, total out of 50 | Range validation |
| T-005.8 | F-005.8 | Grade thresholds: A>=42, B>=35, C>=25, D>=15, F<15 | Unit test |
| T-005.9 | F-005.9 | Feedback string returned per grade tier | Unit test |
| T-005.10 | F-005.10 | Demo grading uses heuristics (word count, examples, emotion, dismissiveness) | Unit test |
| T-005.11 | F-005.11 | "Revise & Retry" returns to write phase | State test |
| T-005.12 | F-005.12 | "New Topic" resets state | State test |
| T-005.13 | F-005.13 | Phase toggles between 'write' and 'results' | State test |
| T-005.14 | F-005.14 | ScoreBar color: green >= 70%, yellow >= 50%, red < 50% | Logic test |

## F-006: Settings

| Test ID | PRD Ref | Endpoint Description | Validation Method |
|---------|---------|---------------------|-------------------|
| T-006.1 | F-006.1 | Default endpoint is OpenAI URL | State initialization test |
| T-006.2 | F-006.2 | API key input has secureTextEntry prop | Props assertion |
| T-006.3 | F-006.3 | Save calls AsyncStorage.setItem | Mock AsyncStorage test |
| T-006.4 | F-006.4 | Save shows "Saved!" confirmation | State test |
| T-006.5 | F-006.5 | Clear shows confirmation Alert | Mock Alert test |
| T-006.6 | F-006.6 | loadSettings called on mount | Effect test |
| T-006.7 | F-006.7 | No API key -> demo mode fallback | Integration test |
| T-006.8 | F-006.8 | About section text present | Render test |
| T-006.9 | F-006.9 | Supported models list rendered | Render test |
| T-006.10 | F-006.10 | Version number displayed | Render test |

## F-007: Navigation

| Test ID | PRD Ref | Endpoint Description | Validation Method |
|---------|---------|---------------------|-------------------|
| T-007.1 | F-007.1 | 3 bottom tabs rendered | Navigation structure test |
| T-007.2 | F-007.2 | Each tab has emoji icon | Render test |
| T-007.3 | F-007.3 | Stack navigation: Home -> Results | Navigation test |
| T-007.4 | F-007.4 | Dark theme header colors applied | Style assertion |

## F-008: Design System

| Test ID | PRD Ref | Endpoint Description | Validation Method |
|---------|---------|---------------------|-------------------|
| T-008.1 | F-008.1 | COLORS.background is #0D0D1A | Constant assertion |
| T-008.2 | F-008.2 | COLORS.primary is #6C63FF | Constant assertion |
| T-008.3 | F-008.3 | COLORS.secondary is #FF6584 | Constant assertion |
| T-008.4 | F-008.4 | COLORS.accent is #00D9FF | Constant assertion |
| T-008.5 | F-008.5 | SPACING has correct scale values | Constant assertion |
| T-008.6 | F-008.6 | Semantic colors defined (success, warning, error) | Constant assertion |

## Security

| Test ID | PRD Ref | Endpoint Description | Validation Method |
|---------|---------|---------------------|-------------------|
| T-S001 | S-001 | No API keys in source code | Static analysis |
| T-S002 | S-002 | API key input secureTextEntry=true | Props assertion |
| T-S003 | S-003 | No hardcoded credentials | Grep scan |
| T-S004 | S-004 | Input character limits enforced | Props assertion |
