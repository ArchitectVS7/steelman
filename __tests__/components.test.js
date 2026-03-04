/**
 * Tests for UI Components:
 * - F-002: HeatSlider
 * - F-004.3-4: ResultCard
 * - F-005.14: ScoreCard
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HeatSlider from '../src/components/HeatSlider';
import ResultCard from '../src/components/ResultCard';
import ScoreCard from '../src/components/ScoreCard';

describe('F-002: HeatSlider Component', () => {
  const mockOnValueChange = jest.fn();

  beforeEach(() => {
    mockOnValueChange.mockClear();
  });

  // T-002.1
  test('renders 5 level dots', () => {
    const { getAllByText } = render(
      <HeatSlider value={3} onValueChange={mockOnValueChange} />
    );
    // Dots display numbers 1-5
    for (let i = 1; i <= 5; i++) {
      expect(getAllByText(String(i)).length).toBeGreaterThanOrEqual(1);
    }
  });

  // T-002.10
  test('pressing a dot calls onValueChange', () => {
    const { getByText } = render(
      <HeatSlider value={3} onValueChange={mockOnValueChange} />
    );
    fireEvent.press(getByText('1'));
    expect(mockOnValueChange).toHaveBeenCalledWith(1);
    fireEvent.press(getByText('5'));
    expect(mockOnValueChange).toHaveBeenCalledWith(5);
  });

  test('displays current heat label and emoji', () => {
    const { getByText } = render(
      <HeatSlider value={3} onValueChange={mockOnValueChange} />
    );
    expect(getByText(/Persuasive/)).toBeTruthy();
  });

  test('displays heat description', () => {
    const { getByText } = render(
      <HeatSlider value={1} onValueChange={mockOnValueChange} />
    );
    expect(getByText('Calm, measured, scholarly tone')).toBeTruthy();
  });

  test('displays scale labels', () => {
    const { getByText } = render(
      <HeatSlider value={3} onValueChange={mockOnValueChange} />
    );
    expect(getByText(/Academic/)).toBeTruthy();
    expect(getByText(/On Fire/)).toBeTruthy();
  });
});

describe('F-004.3-4: ResultCard Component', () => {
  // T-004.3
  test('renders with correct title for each section', () => {
    const sectionKeys = ['reexpression', 'commonGround', 'learned', 'steelman', 'weakPoint'];
    const expectedTitles = ['Re-expression', 'Common Ground', 'What I Learned', 'The Steelman', 'Weak Point in Your Take'];

    sectionKeys.forEach((key, idx) => {
      const { getByText } = render(
        <ResultCard sectionKey={key} content="Test content" />
      );
      expect(getByText(expectedTitles[idx])).toBeTruthy();
    });
  });

  // T-004.4
  test('steelman section is expanded by default', () => {
    const { getByText } = render(
      <ResultCard sectionKey="steelman" content="The steelman argument text" />
    );
    expect(getByText('The steelman argument text')).toBeTruthy();
  });

  test('non-steelman sections are collapsed by default', () => {
    const { queryByText } = render(
      <ResultCard sectionKey="reexpression" content="Re-expression text" />
    );
    // Content should not be visible when collapsed
    expect(queryByText('Re-expression text')).toBeNull();
  });

  test('tapping a collapsed card expands it', () => {
    const { getByText, queryByText } = render(
      <ResultCard sectionKey="commonGround" content="Common ground text" />
    );
    // Initially collapsed
    expect(queryByText('Common ground text')).toBeNull();
    // Tap to expand
    fireEvent.press(getByText('Common Ground'));
    expect(getByText('Common ground text')).toBeTruthy();
  });

  test('tapping an expanded card collapses it', () => {
    const { getByText, queryByText } = render(
      <ResultCard sectionKey="steelman" content="Steelman text" />
    );
    // Initially expanded
    expect(getByText('Steelman text')).toBeTruthy();
    // Tap to collapse
    fireEvent.press(getByText('The Steelman'));
    expect(queryByText('Steelman text')).toBeNull();
  });
});

describe('F-005.14: ScoreCard Component', () => {
  const mockScores = {
    authenticity: 8,
    charity: 7,
    specificity: 5,
    empathy: 3,
    biasLeakage: 9,
    total: 32,
    grade: 'C',
    feedback: 'Decent start, keep going.',
  };

  test('renders grade badge', () => {
    const { getByText } = render(<ScoreCard scores={mockScores} />);
    expect(getByText('C')).toBeTruthy();
  });

  test('renders total score', () => {
    const { getByText } = render(<ScoreCard scores={mockScores} />);
    expect(getByText('32/50')).toBeTruthy();
  });

  test('renders all 5 criteria labels', () => {
    const { getByText } = render(<ScoreCard scores={mockScores} />);
    expect(getByText('Authenticity')).toBeTruthy();
    expect(getByText('Charity')).toBeTruthy();
    expect(getByText('Specificity')).toBeTruthy();
    expect(getByText('Empathy')).toBeTruthy();
    expect(getByText('Bias Control')).toBeTruthy();
  });

  test('renders individual scores', () => {
    const { getByText } = render(<ScoreCard scores={mockScores} />);
    expect(getByText('8/10')).toBeTruthy();
    expect(getByText('7/10')).toBeTruthy();
    expect(getByText('5/10')).toBeTruthy();
    expect(getByText('3/10')).toBeTruthy();
    expect(getByText('9/10')).toBeTruthy();
  });

  test('renders feedback text', () => {
    const { getByText } = render(<ScoreCard scores={mockScores} />);
    expect(getByText('Decent start, keep going.')).toBeTruthy();
  });

  test('renders for all grade levels', () => {
    const grades = ['A', 'B', 'C', 'D', 'F'];
    grades.forEach((grade) => {
      const scores = { ...mockScores, grade };
      const { getByText } = render(<ScoreCard scores={scores} />);
      expect(getByText(grade)).toBeTruthy();
    });
  });
});
