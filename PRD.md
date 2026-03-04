# Steelman App — Product Requirements Document

**Version:** 1.0.0
**Date:** 2026-03-04
**Status:** Active

---

## 1. Product Overview

Steelman is a cross-platform mobile application that generates the strongest possible case for the opposing side of any opinion or hot take. Unlike generic "Devil's Advocate" tools, Steelman follows Rapoport's Rules (via Daniel Dennett / Anatol Rapoport) to produce structured, intellectually honest counter-arguments — not strawmen, but steelmen.

**Target Platforms:** iOS, Android, Web (via Expo)
**Tech Stack:** React Native 0.83.x, Expo 55, React Navigation, AsyncStorage

---

## 2. Core Framework: Rapoport's Rules

Every steelman response MUST follow this four-step structure (plus a diagnostic step):

| Step | Name | Description |
|------|------|-------------|
| 1 | Re-expression | Restate the opposing view so fairly that its advocate would approve |
| 2 | Common Ground | Identify 2-3 points both sides genuinely agree on |
| 3 | What I Learned | Acknowledge at least one valid insight from the original position |
| 4 | The Steelman | Construct the strongest opposing argument using best reasoning/evidence |
| 5 | Weak Point | Identify the most vulnerable part of the user's original take |

---

## 3. Feature Specifications

### F-001: Opinion Input

**Description:** Users enter an opinion or hot take for steelman analysis.

| Requirement | Specification |
|-------------|---------------|
| F-001.1 | Multi-line text input field accepting free-form text |
| F-001.2 | Maximum character limit of 2000 characters |
| F-001.3 | Live character counter displaying `{count}/2000` |
| F-001.4 | Empty/whitespace-only input disables submission |
| F-001.5 | Example "hot takes" displayed as tappable chips that populate the input |
| F-001.6 | Minimum 5 example takes provided |

### F-002: Heat Level Slider

**Description:** Users control the rhetorical intensity of the generated steelman.

| Requirement | Specification |
|-------------|---------------|
| F-002.1 | 5 discrete heat levels (1-5) |
| F-002.2 | Default heat level is 3 (Persuasive) |
| F-002.3 | Each level has a label, emoji, and description |
| F-002.4 | Level 1: Academic (calm, scholarly) |
| F-002.5 | Level 2: Thoughtful (balanced, considerate) |
| F-002.6 | Level 3: Persuasive (clear, convincing) |
| F-002.7 | Level 4: Passionate (energetic true-believer) |
| F-002.8 | Level 5: On Fire (maximum rhetorical intensity) |
| F-002.9 | Visual indicator showing current selection with filled track |
| F-002.10 | Tappable dots for level selection |

### F-003: Steelman Generation

**Description:** Core engine that produces structured steelman arguments.

| Requirement | Specification |
|-------------|---------------|
| F-003.1 | Returns all 5 Rapoport's Rules sections (re-expression, common ground, learned, steelman, weak point) |
| F-003.2 | Heat level modifies tone/style of generated content |
| F-003.3 | Demo mode returns contextual mock responses when no API key configured |
| F-003.4 | Demo mode recognizes at least 4 topic categories (social media, remote work, AI, education) with a general fallback |
| F-003.5 | API mode sends system + user prompts to OpenAI-compatible endpoint |
| F-003.6 | API request includes Authorization header with Bearer token |
| F-003.7 | System prompt enforces Rapoport's Rules and prohibits strawman tactics |
| F-003.8 | Loading state shown during generation |
| F-003.9 | Response parsed into structured sections from markdown |

### F-004: Results Display

**Description:** Structured display of the steelman analysis.

| Requirement | Specification |
|-------------|---------------|
| F-004.1 | Shows original opinion in a highlighted card |
| F-004.2 | Displays heat level intensity indicator |
| F-004.3 | Each Rapoport section in a collapsible card with icon |
| F-004.4 | "The Steelman" section expanded by default; others collapsed |
| F-004.5 | Share functionality via native share sheet |
| F-004.6 | "New Take" button navigates back to input |
| F-004.7 | Cards only rendered if section content is non-empty |

### F-005: Ideological Turing Test (ITT) Mode

**Description:** Game mode where users write a defense and are graded on authenticity.

| Requirement | Specification |
|-------------|---------------|
| F-005.1 | Random topic selection from a pool of at least 15 debate topics |
| F-005.2 | "Shuffle" button to get a new topic (excludes current topic) |
| F-005.3 | Text input with 3000-character limit |
| F-005.4 | Minimum 10-word requirement to submit |
| F-005.5 | Live word count and character count display |
| F-005.6 | Grading on 5 criteria: Authenticity, Charity, Specificity, Empathy, Bias Control |
| F-005.7 | Each criterion scored 1-10, total out of 50 |
| F-005.8 | Letter grade assignment (A: 42+, B: 35+, C: 25+, D: 15+, F: below 15) |
| F-005.9 | Written feedback based on grade tier |
| F-005.10 | Demo grading uses heuristic analysis (word count, examples, emotion, dismissiveness) |
| F-005.11 | "Revise & Retry" button returns to write phase with text preserved |
| F-005.12 | "New Topic" button resets everything |
| F-005.13 | Two-phase UI: write phase and results phase |
| F-005.14 | Score bars with color-coded fill (green >= 70%, yellow >= 50%, red < 50%) |

### F-006: Settings & Configuration

**Description:** API key management and app configuration.

| Requirement | Specification |
|-------------|---------------|
| F-006.1 | API endpoint input field with default value `https://api.openai.com/v1/chat/completions` |
| F-006.2 | API key input with secure text entry (masked) |
| F-006.3 | Settings persisted via AsyncStorage |
| F-006.4 | "Save Settings" button with visual confirmation ("Saved!") |
| F-006.5 | "Clear Key" button with destructive confirmation alert |
| F-006.6 | Settings loaded on screen mount |
| F-006.7 | App falls back to demo mode when no API key is configured |
| F-006.8 | About section explaining Rapoport's Rules |
| F-006.9 | Supported models list displayed |
| F-006.10 | Version number displayed |

### F-007: Navigation

**Description:** App navigation structure.

| Requirement | Specification |
|-------------|---------------|
| F-007.1 | Bottom tab navigation with 3 tabs: Steelman, ITT Game, Settings |
| F-007.2 | Each tab has an emoji icon |
| F-007.3 | Stack navigator within Steelman tab (Home -> Results) |
| F-007.4 | Dark theme header styling |
| F-007.5 | Results screen has back navigation to Home |

### F-008: Design System

**Description:** Consistent visual design tokens.

| Requirement | Specification |
|-------------|---------------|
| F-008.1 | Dark theme with navy background (#0D0D1A) |
| F-008.2 | Primary color: purple (#6C63FF) |
| F-008.3 | Secondary color: pink (#FF6584) |
| F-008.4 | Accent color: cyan (#00D9FF) |
| F-008.5 | Consistent spacing scale (4, 8, 16, 24, 32, 48) |
| F-008.6 | Semantic colors for success, warning, error states |
| F-008.7 | Card-based UI with 16px border radius |

---

## 4. Security Requirements

| ID | Requirement |
|----|-------------|
| S-001 | API keys stored locally via AsyncStorage, never transmitted except to configured endpoint |
| S-002 | API key input uses secureTextEntry |
| S-003 | No hardcoded credentials in source code |
| S-004 | User input sanitized (character limits enforced at input level) |
| S-005 | API calls use HTTPS (enforced by endpoint URL format) |

---

## 5. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NF-001 | App loads and is interactive within 3 seconds on target devices |
| NF-002 | Portrait orientation only |
| NF-003 | Keyboard-aware input handling (iOS padding behavior) |
| NF-004 | Cross-platform: iOS, Android, Web via Expo |
| NF-005 | Graceful error handling — console errors, not crashes |

---

## 6. Out of Scope

The following are explicitly NOT part of v1.0.0:

- Source Injection (real-time citation pulling via external search APIs)
- User accounts or cloud sync
- History/saved results persistence
- Analytics or usage tracking
- Offline caching of results
- CI/CD pipeline
- Push notifications
