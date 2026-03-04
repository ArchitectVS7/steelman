/**
 * Security Tests: S-001 through S-005
 * Validates no hardcoded credentials and proper security patterns
 */
import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(__dirname, '..', 'src');

function readAllSourceFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...readAllSourceFiles(fullPath));
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) {
      files.push({ path: fullPath, content: fs.readFileSync(fullPath, 'utf-8') });
    }
  }
  return files;
}

describe('Security: No Hardcoded Credentials', () => {
  let sourceFiles;

  beforeAll(() => {
    sourceFiles = readAllSourceFiles(SRC_DIR);
  });

  // T-S001, T-S003
  test('no API keys in source code', () => {
    const apiKeyPatterns = [
      /sk-[a-zA-Z0-9]{20,}/,
      /OPENAI_API_KEY\s*=\s*['"][^'"]+['"]/,
      /api[_-]?key\s*[:=]\s*['"][^'"]{10,}['"]/i,
    ];

    sourceFiles.forEach((file) => {
      apiKeyPatterns.forEach((pattern) => {
        expect(file.content).not.toMatch(pattern);
      });
    });
  });

  test('no hardcoded bearer tokens', () => {
    sourceFiles.forEach((file) => {
      // Should not have hardcoded Bearer tokens (only template strings using variables)
      const hardcodedBearer = /Bearer\s+[a-zA-Z0-9_-]{20,}/;
      expect(file.content).not.toMatch(hardcodedBearer);
    });
  });

  test('no hardcoded passwords', () => {
    sourceFiles.forEach((file) => {
      const passwordPatterns = [
        /password\s*[:=]\s*['"][^'"]+['"]/i,
        /secret\s*[:=]\s*['"][^'"]+['"]/i,
      ];
      passwordPatterns.forEach((pattern) => {
        expect(file.content).not.toMatch(pattern);
      });
    });
  });
});

describe('Security: Input Validation', () => {
  // T-S004
  test('HomeScreen enforces character limits via maxLength', () => {
    const homeScreen = fs.readFileSync(path.join(SRC_DIR, 'screens', 'HomeScreen.js'), 'utf-8');
    expect(homeScreen).toContain('maxLength={2000}');
  });

  test('ITTScreen enforces character limits via maxLength', () => {
    const ittScreen = fs.readFileSync(path.join(SRC_DIR, 'screens', 'ITTScreen.js'), 'utf-8');
    expect(ittScreen).toContain('maxLength={3000}');
  });
});

describe('Security: API Key Storage', () => {
  // T-S002
  test('API key input uses secureTextEntry', () => {
    const settingsScreen = fs.readFileSync(path.join(SRC_DIR, 'screens', 'SettingsScreen.js'), 'utf-8');
    expect(settingsScreen).toContain('secureTextEntry');
  });

  // T-S001
  test('API key stored via AsyncStorage (local storage), not sent to any server', () => {
    const settingsScreen = fs.readFileSync(path.join(SRC_DIR, 'screens', 'SettingsScreen.js'), 'utf-8');
    expect(settingsScreen).toContain('AsyncStorage.setItem');
    expect(settingsScreen).toContain('AsyncStorage.getItem');
    // Only the steelmanEngine should make API calls, not settings
    expect(settingsScreen).not.toContain('fetch(');
  });
});

describe('Security: No Injection Vectors', () => {
  test('steelmanEngine does not use eval or Function constructor', () => {
    const engine = fs.readFileSync(path.join(SRC_DIR, 'services', 'steelmanEngine.js'), 'utf-8');
    expect(engine).not.toContain('eval(');
    expect(engine).not.toMatch(/new\s+Function\s*\(/);
  });

  test('no dangerouslySetInnerHTML usage', () => {
    const sourceFiles = readAllSourceFiles(SRC_DIR);
    sourceFiles.forEach((file) => {
      expect(file.content).not.toContain('dangerouslySetInnerHTML');
    });
  });
});
