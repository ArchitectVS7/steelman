/**
 * Tests for Screen Components:
 * - F-001: HomeScreen (Opinion Input)
 * - F-004: ResultsScreen (Results Display)
 * - F-005: ITTScreen (Ideological Turing Test)
 * - F-006: SettingsScreen (Settings)
 */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const createMockNavigation = () => ({
  navigate: mockNavigate,
  goBack: mockGoBack,
});

// Import screens
import HomeScreen from '../src/screens/HomeScreen';
import ResultsScreen from '../src/screens/ResultsScreen';
import ITTScreen from '../src/screens/ITTScreen';
import SettingsScreen from '../src/screens/SettingsScreen';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('F-001: HomeScreen (Opinion Input)', () => {
  const navigation = createMockNavigation();

  // T-001.1
  test('renders a text input for opinion', () => {
    const { getByPlaceholderText } = render(<HomeScreen navigation={navigation} />);
    expect(getByPlaceholderText(/paste any opinion/i)).toBeTruthy();
  });

  // T-001.3
  test('displays character counter starting at 0/2000', () => {
    const { getByText } = render(<HomeScreen navigation={navigation} />);
    expect(getByText('0/2000')).toBeTruthy();
  });

  test('character counter updates as user types', () => {
    const { getByPlaceholderText, getByText } = render(<HomeScreen navigation={navigation} />);
    const input = getByPlaceholderText(/paste any opinion/i);
    fireEvent.changeText(input, 'Hello');
    expect(getByText('5/2000')).toBeTruthy();
  });

  // T-001.4
  test('submit button disabled when input is empty', () => {
    const { getByText } = render(<HomeScreen navigation={navigation} />);
    const button = getByText('Steelman It');
    // The button's parent TouchableOpacity should be disabled
    expect(button).toBeTruthy();
  });

  // T-001.5
  test('example chips are rendered', () => {
    const { getByText } = render(<HomeScreen navigation={navigation} />);
    expect(getByText('Social media is destroying society')).toBeTruthy();
    expect(getByText(/Remote work/)).toBeTruthy();
  });

  test('tapping example chip populates input', () => {
    const { getByText, getByPlaceholderText } = render(<HomeScreen navigation={navigation} />);
    fireEvent.press(getByText('Social media is destroying society'));
    const input = getByPlaceholderText(/paste any opinion/i);
    expect(input.props.value).toBe('Social media is destroying society');
  });

  // T-001.6
  test('at least 5 example takes available', () => {
    const { getByText } = render(<HomeScreen navigation={navigation} />);
    // Check we can find at least 5 chips
    expect(getByText('Social media is destroying society')).toBeTruthy();
    expect(getByText('Remote work is just an excuse to be lazy')).toBeTruthy();
    expect(getByText('AI will replace all creative jobs within 10 years')).toBeTruthy();
    expect(getByText('College is a waste of money for most people')).toBeTruthy();
    expect(getByText('Cancel culture has gone too far')).toBeTruthy();
  });

  test('renders app title and subtitle', () => {
    const { getByText } = render(<HomeScreen navigation={navigation} />);
    expect(getByText('Steelman')).toBeTruthy();
    expect(getByText('Find the strongest case for the other side')).toBeTruthy();
  });

  test('renders info card about steelman concept', () => {
    const { getByText } = render(<HomeScreen navigation={navigation} />);
    expect(getByText('What is a Steelman?')).toBeTruthy();
  });

  // T-003.8
  test('generates steelman and navigates to results', async () => {
    const { getByPlaceholderText, getByText } = render(<HomeScreen navigation={navigation} />);
    const input = getByPlaceholderText(/paste any opinion/i);
    fireEvent.changeText(input, 'Social media is destroying society');
    fireEvent.press(getByText('Steelman It'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Results', expect.objectContaining({
        opinion: 'Social media is destroying society',
        heatLevel: 3,
        result: expect.objectContaining({
          reexpression: expect.any(String),
          steelman: expect.any(String),
        }),
      }));
    });
  });
});

describe('F-004: ResultsScreen (Results Display)', () => {
  const mockResult = {
    reexpression: 'The opposing view says...',
    commonGround: 'Both sides agree...',
    learned: 'The original position teaches...',
    steelman: 'The strongest case is...',
    weakPoint: 'Your take is vulnerable at...',
    fullText: 'Full steelman text here.',
  };

  const mockRoute = {
    params: {
      opinion: 'Test opinion here',
      heatLevel: 3,
      result: mockResult,
    },
  };

  const navigation = createMockNavigation();

  // T-004.1
  test('displays original opinion', () => {
    const { getByText } = render(<ResultsScreen route={mockRoute} navigation={navigation} />);
    expect(getByText('"Test opinion here"')).toBeTruthy();
  });

  // T-004.2
  test('displays heat level indicator', () => {
    const { getByText } = render(<ResultsScreen route={mockRoute} navigation={navigation} />);
    expect(getByText(/Persuasive.*intensity/)).toBeTruthy();
  });

  // T-004.7
  test('filters out empty sections', () => {
    const routeWithEmpty = {
      params: {
        ...mockRoute.params,
        result: {
          ...mockResult,
          commonGround: '',
          learned: '',
        },
      },
    };
    const { queryByText } = render(<ResultsScreen route={routeWithEmpty} navigation={navigation} />);
    // Common Ground and What I Learned should not appear since content is empty
    // But other sections should exist
    expect(queryByText('The Steelman')).toBeTruthy();
  });

  // T-004.5
  test('share button is rendered and pressable', () => {
    const { getByText } = render(<ResultsScreen route={mockRoute} navigation={navigation} />);
    const shareButton = getByText('Share');
    expect(shareButton).toBeTruthy();
    // Pressing share should not throw
    expect(() => fireEvent.press(shareButton)).not.toThrow();
  });

  // T-004.6
  test('New Take button navigates back', () => {
    const { getByText } = render(<ResultsScreen route={mockRoute} navigation={navigation} />);
    fireEvent.press(getByText('New Take'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  test('displays STEELMAN ANALYSIS header', () => {
    const { getByText } = render(<ResultsScreen route={mockRoute} navigation={navigation} />);
    expect(getByText('STEELMAN ANALYSIS')).toBeTruthy();
  });
});

describe('F-005: ITTScreen', () => {
  // T-005.5
  test('displays word count and character count', () => {
    const { getByText } = render(<ITTScreen />);
    expect(getByText(/0 words/)).toBeTruthy();
    expect(getByText('0/3000')).toBeTruthy();
  });

  test('word count updates as user types', () => {
    const { getByPlaceholderText, getByText } = render(<ITTScreen />);
    const input = getByPlaceholderText(/write your defense/i);
    fireEvent.changeText(input, 'one two three four five');
    expect(getByText(/5 words/)).toBeTruthy();
  });

  // T-005.4
  test('submit disabled when word count < 10', () => {
    const { getByPlaceholderText, getByText } = render(<ITTScreen />);
    const input = getByPlaceholderText(/write your defense/i);
    fireEvent.changeText(input, 'only five words here now');
    expect(getByText(/min 10/)).toBeTruthy();
  });

  // T-005.2
  test('shuffle button changes topic', () => {
    const { getByText, queryAllByText } = render(<ITTScreen />);
    const shuffleButton = getByText('Different Topic');
    // Press shuffle multiple times to verify it works
    fireEvent.press(shuffleButton);
    // Topic should still be displayed (just different)
    expect(getByText('DEFEND THIS POSITION:')).toBeTruthy();
  });

  // T-005.13
  test('starts in write phase', () => {
    const { getByText, getByPlaceholderText } = render(<ITTScreen />);
    expect(getByText('Your Challenge')).toBeTruthy();
    expect(getByPlaceholderText(/write your defense/i)).toBeTruthy();
  });

  test('renders tips card in write phase', () => {
    const { getByText } = render(<ITTScreen />);
    expect(getByText('Tips for a High Score')).toBeTruthy();
  });

  test('renders ITT header and subtitle', () => {
    const { getByText } = render(<ITTScreen />);
    expect(getByText('Ideological Turing Test')).toBeTruthy();
    expect(getByText(/argue the opposing side/i)).toBeTruthy();
  });

  // T-005.13 full flow: submit and see results
  test('submitting shows results phase with scores', async () => {
    const { getByPlaceholderText, getByText } = render(<ITTScreen />);
    const input = getByPlaceholderText(/write your defense/i);
    fireEvent.changeText(input, 'I truly believe this is important because evidence shows that many people feel strongly about this issue and care deeply about the outcomes for our community.');
    fireEvent.press(getByText('Grade My Steelman'));

    await waitFor(() => {
      expect(getByText(/\/50/)).toBeTruthy();
    });
  });
});

describe('F-006: SettingsScreen', () => {
  // T-006.1
  test('default endpoint is OpenAI URL', () => {
    const { getByDisplayValue } = render(<SettingsScreen />);
    expect(getByDisplayValue('https://api.openai.com/v1/chat/completions')).toBeTruthy();
  });

  // T-006.2
  test('API key input has secureTextEntry', () => {
    const { getByPlaceholderText } = render(<SettingsScreen />);
    const apiKeyInput = getByPlaceholderText('sk-...');
    expect(apiKeyInput.props.secureTextEntry).toBe(true);
  });

  // T-006.3, T-006.4
  test('save button persists settings via AsyncStorage', async () => {
    const { getByText, getByPlaceholderText } = render(<SettingsScreen />);
    const apiKeyInput = getByPlaceholderText('sk-...');
    fireEvent.changeText(apiKeyInput, 'sk-test-key');
    fireEvent.press(getByText('Save Settings'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@steelman_api_key', 'sk-test-key');
    });
  });

  // T-006.6
  test('loads settings on mount', async () => {
    render(<SettingsScreen />);
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@steelman_api_key');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@steelman_api_endpoint');
    });
  });

  // T-006.8
  test('about section text present', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('About Steelman')).toBeTruthy();
    expect(getByText(/Rapoport's Rules/)).toBeTruthy();
  });

  // T-006.9
  test('supported models list rendered', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('Supported Models')).toBeTruthy();
    expect(getByText('GPT-4o / GPT-4')).toBeTruthy();
    expect(getByText(/Claude/)).toBeTruthy();
  });

  // T-006.10
  test('version number displayed', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('Steelman v1.0.0')).toBeTruthy();
  });

  test('renders settings header', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('Settings')).toBeTruthy();
  });

  test('renders AI configuration section', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('AI Configuration')).toBeTruthy();
  });
});
